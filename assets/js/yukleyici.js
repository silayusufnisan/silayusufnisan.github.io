/*
 * Yükleme motoru
 * --------------
 * 1) Dosya hazırlanır (fotoğraflar küçültülür).
 * 2) Apps Script'ten bu dosya için tek kullanımlık bir Drive yükleme adresi alınır
 *    (aynı anda seçilen dosyaların adresleri tek istekte toplu alınır).
 * 3) Dosya, telefonun tarayıcısından DOĞRUDAN Google Drive'a parça parça gönderilir.
 *    Bağlantı koparsa kaldığı yerden devam eder.
 * 4) Tarayıcı doğrudan gönderemezse (CORS), parçalar Apps Script üzerinden aktarılır.
 * 5) Biten dosyalar toplu olarak kayıt tablosuna yazdırılır.
 */
(function () {
  'use strict';

  var PARCA_DOGRUDAN = 8 * 1024 * 1024;   // 256 KB'ın katı olmak zorunda
  var PARCA_AKTARMA = 4 * 1024 * 1024;   // yedek yol: Apps Script günlük kotasını korumak için büyük parçalar
  var EN_FAZLA_HATA = 7;
  var MOD_ANAHTAR = 'nisan.yuklemeModu';
  var BEKLEYEN_ANAHTAR = 'nisan.bekleyenKayitlar';

  function oku(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function yaz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* gizli sekme */ } }

  var durum = {
    mod: (function () { try { return sessionStorage.getItem(MOD_ANAHTAR) || 'dogrudan'; } catch (e) { return 'dogrudan'; } })(),
    dogrudanCalisti: false
  };
  function modAyarla(m) {
    durum.mod = m;
    try { sessionStorage.setItem(MOD_ANAHTAR, m); } catch (e) { /* yok say */ }
  }

  // ---------------------------------------------------------------
  //  Drive'a doğrudan parça gönderme
  // ---------------------------------------------------------------
  function put(url, govde, aralik, ilerleme) {
    return new Promise(function (coz) {
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Content-Range', aralik);
      xhr.timeout = 180000;
      if (ilerleme && xhr.upload) xhr.upload.onprogress = function (e) { ilerleme(e.loaded); };
      xhr.onload = function () {
        // Range başlığını yalnızca tarayıcı okumamıza izin veriyorsa oku (aksi halde konsola uyarı düşer)
        var r = null;
        if (/^range:/im.test(xhr.getAllResponseHeaders() || '')) r = xhr.getResponseHeader('Range');
        coz({ status: xhr.status, range: r, metin: xhr.responseText });
      };
      xhr.onerror = xhr.ontimeout = xhr.onabort = function () { coz({ status: 0 }); };
      xhr.send(govde);
    });
  }

  function aralikSonu(range) {
    // "bytes=0-8388607" → 8388608
    var m = /bytes=\d+-(\d+)/.exec(range || '');
    return m ? Number(m[1]) + 1 : null;
  }

  function base64(blob) {
    return new Promise(function (coz, reddet) {
      var r = new FileReader();
      r.onload = function () { var s = String(r.result); coz(s.slice(s.indexOf(',') + 1)); };
      r.onerror = function () { reddet(r.error); };
      r.readAsDataURL(blob);
    });
  }

  // ---------------------------------------------------------------
  //  Yükleyici
  // ---------------------------------------------------------------
  function Yukleyici(ayar) {
    this.misafir = ayar.misafir;           // () => {name, phone}
    this.olay = ayar.olay || function () {};
    this.ogeler = [];
    this._kuyruk = [];
    this._calisan = 0;
    this._oturumBekleyen = [];
    this._oturumZaman = null;
    this._kayitBekleyen = oku(BEKLEYEN_ANAHTAR) || [];
    this._kayitZaman = null;
    this._hazirlamaKilidi = Promise.resolve();
    this._bitti = null;
  }

  Yukleyici.prototype.ekle = function (liste) {
    var self = this;
    liste.forEach(function (o) {
      o.durum = 'bekliyor';
      o.yuklenen = 0;
      o.anlik = 0;
      o.hataSayisi = 0;
      o.yenidenBaslatma = 0;
      self.ogeler.push(o);
      self._kuyruk.push(o);
    });
    this._calistir();
  };

  Yukleyici.prototype.tekrarDene = function (oge) {
    if (oge.durum !== 'hata') return;
    oge.durum = 'bekliyor';
    oge.hata = null;
    oge.hataSayisi = 0;
    this._kuyruk.push(oge);
    this.olay('durum', oge);
    this._calistir();
  };

  Yukleyici.prototype.hepsiniTekrarDene = function () {
    var self = this;
    this.ogeler.filter(function (o) { return o.durum === 'hata'; }).forEach(function (o) { self.tekrarDene(o); });
  };

  /** Tüm öğeler bittiğinde (başarılı ya da hatalı) çözülür */
  Yukleyici.prototype.bekle = function () {
    var self = this;
    if (this._herseyBitti()) return this.kayitlariGonder();
    return new Promise(function (coz) { self._bitti = coz; }).then(function () { return self.kayitlariGonder(); });
  };

  Yukleyici.prototype._herseyBitti = function () {
    return this._calisan === 0 && this._kuyruk.length === 0;
  };

  Yukleyici.prototype.toplam = function () {
    var t = 0, y = 0;
    this.ogeler.forEach(function (o) {
      var b = o.boyut || (o.dosya && o.dosya.size) || 1;
      t += b;
      y += o.durum === 'bitti' ? b : Math.min(b, o.anlik || 0);
    });
    return { toplam: t, yuklenen: y };
  };

  Yukleyici.prototype._calistir = function () {
    var self = this;
    var limit = durum.mod === 'aktarma' ? 2 : 3;
    while (this._calisan < limit && this._kuyruk.length) {
      var oge = this._kuyruk.shift();
      this._calisan++;
      (function (o) {
        self._yukle(o).then(function () {
          o.durum = 'bitti';
          o.anlik = o.boyut;
          self.olay('durum', o);
          self._kayitEkle(o);
        }, function (e) {
          o.durum = 'hata';
          o.hata = e;
          self.olay('durum', o);
        }).then(function () {
          self._calisan--;
          if (self._herseyBitti()) {
            self.olay('bitti');
            if (self._bitti) { var b = self._bitti; self._bitti = null; b(); }
          } else {
            self._calistir();
          }
        });
      })(oge);
    }
  };

  /** Fotoğraf küçültme gibi bellek yoğun işleri tek tek yap */
  Yukleyici.prototype._hazirla = function (oge) {
    if (oge.blob) return Promise.resolve();
    var self = this;
    var is = this._hazirlamaKilidi.then(function () {
      oge.durum = 'hazirlaniyor';
      self.olay('durum', oge);
      return (oge.hazirla ? oge.hazirla() : Promise.resolve(oge.dosya)).then(function (blob) {
        oge.blob = blob;
        oge.boyut = blob.size;
      });
    });
    this._hazirlamaKilidi = is.catch(function () {});
    return is;
  };

  Yukleyici.prototype._yukle = function (oge) {
    var self = this;
    return this._hazirla(oge).then(function () {
      oge.durum = 'yukleniyor';
      self.olay('durum', oge);
      return self._parcalar(oge);
    });
  };

  Yukleyici.prototype._parcalar = async function (oge) {
    var self = this;
    var boyut = oge.boyut;

    for (;;) {
      if (oge.dosyaId) return;

      if (!oge.oturum) {
        oge.yuklenen = 0;
        oge.anlik = 0;
        oge.oturum = await this._oturumAl(oge);
      }

      var bas = oge.yuklenen;
      var parca = durum.mod === 'aktarma' ? PARCA_AKTARMA : PARCA_DOGRUDAN;
      var son = Math.min(bas + parca, boyut);
      var r;

      if (durum.mod === 'aktarma') {
        r = await this._aktar(oge, bas, son);
      } else {
        r = await put(oge.oturum, oge.blob.slice(bas, son), 'bytes ' + bas + '-' + (son - 1) + '/' + boyut, function (y) {
          oge.anlik = bas + y;
          self.olay('ilerleme', oge);
        });
        if (r.status) durum.dogrudanCalisti = true;
      }

      if (r.status === 200 || r.status === 201) {
        var dosya = r.dosya;
        if (!dosya) { try { dosya = JSON.parse(r.metin); } catch (e) { dosya = null; } }
        if (!dosya || !dosya.id) throw Api.ApiHatasi('gecersiz_yanit');
        oge.dosyaId = dosya.id;
        oge.yuklenen = oge.anlik = boyut;
        self.olay('ilerleme', oge);
        return;
      }

      if (r.status === 308) {
        oge.yuklenen = aralikSonu(r.range) || son;
        oge.anlik = oge.yuklenen;
        oge.hataSayisi = 0;
        self.olay('ilerleme', oge);
        continue;
      }

      // ---- Buradan sonrası: bir şeyler ters gitti ----
      if (r.status === 0 && durum.mod === 'dogrudan' && !durum.dogrudanCalisti && navigator.onLine !== false) {
        // Hiç doğrudan yükleme başarılı olmadıysa ve internet varsa: tarayıcı engelliyor olabilir.
        oge.corsSuphe = (oge.corsSuphe || 0) + 1;
        if (oge.corsSuphe >= 2) { modAyarla('aktarma'); continue; }
      }

      if (r.status === 404 || r.status === 410) {
        // Yükleme adresinin süresi dolmuş: baştan başla
        if (++oge.yenidenBaslatma > 2) throw Api.ApiHatasi('oturum_suresi_doldu');
        oge.oturum = null;
        continue;
      }

      if (r.status >= 400 && r.status < 500 && r.status !== 408 && r.status !== 429 && r.status !== 400) {
        throw Api.ApiHatasi('yukleme_reddedildi', 'HTTP ' + r.status);
      }
      if (r.status === 400 && (oge.hata400 = (oge.hata400 || 0) + 1) >= 2) {
        // Sunucu ile konum uyuşmuyor: yeni oturumla baştan
        if (++oge.yenidenBaslatma > 2) throw Api.ApiHatasi('yukleme_reddedildi');
        oge.hata400 = 0;
        oge.oturum = null;
        continue;
      }

      // Geçici hata: bekle, internet gelince sunucuya nerede kaldığımızı sor
      if (++oge.hataSayisi > EN_FAZLA_HATA) throw Api.ApiHatasi('baglanti');
      oge.anlik = oge.yuklenen;
      self.olay('ilerleme', oge);
      if (navigator.onLine === false) self.olay('cevrimdisi', true);
      await Api.cevrimiciOlunca();
      self.olay('cevrimdisi', false);
      await Api.bekle(Math.min(20000, 1000 * Math.pow(2, oge.hataSayisi - 1)) + Math.random() * 800);

      var s = await this._durumSor(oge);
      if (s.status === 200 || s.status === 201) {
        var f = s.dosya;
        if (!f) { try { f = JSON.parse(s.metin); } catch (e) { f = null; } }
        if (f && f.id) { oge.dosyaId = f.id; oge.yuklenen = oge.anlik = boyut; return; }
      } else if (s.status === 308) {
        var kalan = aralikSonu(s.range);
        if (kalan != null) oge.yuklenen = kalan;
        else if (s.range === null && s.okunabilir) oge.yuklenen = 0;
      } else if (s.status === 404 || s.status === 410) {
        oge.oturum = null;
      }
    }
  };

  Yukleyici.prototype._aktar = async function (oge, bas, son) {
    var self = this;
    var veri = await base64(oge.blob.slice(bas, son));
    try {
      // Bu yolda ilerleme parça parça ilerler (Apps Script yüzünden anlık ilerleme okunamaz)
      oge.anlik = bas + Math.round((son - bas) * 0.15);
      self.olay('ilerleme', oge);
      var y = await Api.gonderBir({ action: 'relay', url: oge.oturum, start: bas, total: oge.boyut, data: veri }, { zamanAsimi: 180000 });
      return { status: y.status, range: y.range, dosya: y.file };
    } catch (e) {
      if (e.kod === 'gecersiz_adres') return { status: 410 };
      return { status: 0 };
    }
  };

  Yukleyici.prototype._durumSor = async function (oge) {
    if (!oge.oturum) return { status: 0 };
    if (durum.mod === 'aktarma') {
      try {
        var y = await Api.gonderBir({ action: 'relay', url: oge.oturum, start: 0, total: oge.boyut, data: '' });
        return { status: y.status, range: y.range, dosya: y.file, okunabilir: true };
      } catch (e) { return { status: 0 }; }
    }
    var r = await put(oge.oturum, null, 'bytes */' + oge.boyut);
    return r;
  };

  // ---------------------------------------------------------------
  //  Yükleme adreslerini toplu alma
  // ---------------------------------------------------------------
  Yukleyici.prototype._oturumAl = function (oge) {
    var self = this;
    return new Promise(function (coz, reddet) {
      self._oturumBekleyen.push({ oge: oge, coz: coz, reddet: reddet });
      if (self._oturumBekleyen.length >= 15) self._oturumGonder();
      else if (!self._oturumZaman) self._oturumZaman = setTimeout(function () { self._oturumGonder(); }, 150);
    });
  };

  Yukleyici.prototype._oturumGonder = function () {
    var self = this;
    clearTimeout(this._oturumZaman);
    this._oturumZaman = null;
    var grup = this._oturumBekleyen.splice(0, 15);
    if (!grup.length) return;
    Api.gonder({
      action: 'init',
      guest: this.misafir(),
      origin: location.origin,
      files: grup.map(function (g) {
        return { name: g.oge.ad, type: g.oge.tip, size: g.oge.boyut, kind: g.oge.tur };
      })
    }).then(function (y) {
      if (!y.direct && durum.mod !== 'aktarma') modAyarla('aktarma');
      grup.forEach(function (g, i) { g.coz(y.sessions[i].url); });
    }, function (e) {
      grup.forEach(function (g) { g.reddet(e); });
    }).then(function () {
      if (self._oturumBekleyen.length) self._oturumGonder();
    });
  };

  // ---------------------------------------------------------------
  //  Kayıt tablosuna toplu yazdırma
  // ---------------------------------------------------------------
  Yukleyici.prototype._kayitEkle = function (oge) {
    var self = this;
    this._kayitBekleyen.push({ id: oge.dosyaId, kind: oge.tur, guest: this.misafir() });
    yaz(BEKLEYEN_ANAHTAR, this._kayitBekleyen);
    if (this._kayitBekleyen.length >= 20) this.kayitlariGonder();
    else {
      clearTimeout(this._kayitZaman);
      this._kayitZaman = setTimeout(function () { self.kayitlariGonder(); }, 2000);
    }
  };

  /** Bekleyen kayıtları gönderir. Sayfa kapansa bile bir sonraki açılışta tekrar dener. */
  Yukleyici.prototype.kayitlariGonder = function () {
    var self = this;
    clearTimeout(this._kayitZaman);
    if (this._kayitGonderiliyor) return this._kayitGonderiliyor.then(function () { return self._kayitBekleyen.length ? self.kayitlariGonder() : null; });
    if (!this._kayitBekleyen.length) return Promise.resolve();

    // Aynı misafir bilgisiyle gelenleri birlikte gönder
    var ilk = this._kayitBekleyen[0].guest;
    var anahtar = JSON.stringify(ilk);
    var grup = this._kayitBekleyen.filter(function (k) { return JSON.stringify(k.guest) === anahtar; }).slice(0, 50);

    var basarili = false;
    this._kayitGonderiliyor = Api.gonder({ action: 'complete', guest: ilk, items: grup.map(function (g) { return { id: g.id, kind: g.kind }; }) }, { deneme: 5 }).then(function () {
      basarili = true;
      var ids = grup.map(function (g) { return g.id; });
      self._kayitBekleyen = self._kayitBekleyen.filter(function (k) { return ids.indexOf(k.id) < 0; });
      yaz(BEKLEYEN_ANAHTAR, self._kayitBekleyen);
    }, function (e) {
      if (e && (e.kod === 'gecersiz_isim')) {
        // Kurtarılamaz: bu kayıtları bırak
        var ids2 = grup.map(function (g) { return g.id; });
        self._kayitBekleyen = self._kayitBekleyen.filter(function (k) { return ids2.indexOf(k.id) < 0; });
        yaz(BEKLEYEN_ANAHTAR, self._kayitBekleyen);
      }
    }).then(function () {
      self._kayitGonderiliyor = null;
      if (self._kayitBekleyen.length && basarili) return self.kayitlariGonder();
    });
    return this._kayitGonderiliyor;
  };

  Yukleyici.durum = durum;
  window.Yukleyici = Yukleyici;
})();
