/*
 * Yönetim paneli
 */
(function () {
  'use strict';

  var SIFRE_ANAHTAR = 'nisan.yonetici';
  var veri = null;
  var kucukler = {};
  var yenileZaman = null;

  function $(id) { return document.getElementById(id); }
  function sifreOku() { try { return sessionStorage.getItem(SIFRE_ANAHTAR) || ''; } catch (e) { return ''; } }
  function sifreYaz(s) { try { if (s) sessionStorage.setItem(SIFRE_ANAHTAR, s); else sessionStorage.removeItem(SIFRE_ANAHTAR); } catch (e) { /* yok */ } }

  function sayi(n) { return Number(n || 0).toLocaleString('tr-TR'); }
  function boyut(b) {
    var gb = b / 1073741824;
    if (gb >= 1) return gb.toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + ' GB';
    return (b / 1048576).toLocaleString('tr-TR', { maximumFractionDigits: b < 10485760 ? 1 : 0 }) + ' MB';
  }
  var saatBicim = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' });
  var tarihBicim = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  function zaman(ms) { return ms ? tarihBicim.format(new Date(ms)) : '–'; }

  function bildirim(m, hata) {
    var el = document.createElement('div');
    el.className = 'bildirim' + (hata ? ' bildirim--hata' : '');
    el.textContent = m;
    $('bildirimler').appendChild(el);
    setTimeout(function () { el.remove(); }, 4500);
  }

  function hataMetni(e) {
    var k = e && e.kod;
    if (k === 'hatali_sifre') return 'Şifre hatalı.';
    if (k === 'cok_fazla_deneme') return 'Çok fazla hatalı deneme yapıldı. 10 dakika sonra tekrar deneyin.';
    if (k === 'kurulum_yapilmamis') return 'Kurulum tamamlanmamış. Apps Script içinde "kurulum" fonksiyonunu çalıştırın ve ayarlar.js içindeki apiUrl alanını doldurun.';
    if (k === 'baglanti' || k === 'zaman_asimi') return 'Bağlantı kurulamadı. İnternetinizi kontrol edin.';
    return 'Bir sorun oluştu: ' + (e && (e.message || e.kod) || 'bilinmiyor');
  }

  // ---------------- Giriş ----------------
  function girisGoster(mesaj) {
    $('panel').hidden = true;
    $('giris').hidden = false;
    $('girisHata').textContent = mesaj || '';
    $('girisHata').hidden = !mesaj;
    clearInterval(yenileZaman);
  }

  $('girisFormu').addEventListener('submit', function (e) {
    e.preventDefault();
    var s = $('sifre').value;
    if (!s) { $('girisHata').textContent = 'Şifrenizi yazın.'; $('girisHata').hidden = false; return; }
    var d = $('girisDugme');
    d.disabled = true; d.textContent = 'Kontrol ediliyor…';
    Api.gonder({ action: 'admin_login', password: s }, { deneme: 1 }).then(function () {
      sifreYaz(s);
      $('sifre').value = '';
      panelAc();
    }, function (err) {
      girisGoster(hataMetni(err));
      $('sifre').select();
    }).then(function () { d.disabled = false; d.textContent = 'Giriş yap'; });
  });

  $('cikis').addEventListener('click', function () { sifreYaz(''); girisGoster(); });

  // ---------------- Panel ----------------
  function panelAc() {
    $('giris').hidden = true;
    $('panel').hidden = false;
    yenile();
    clearInterval(yenileZaman);
    yenileZaman = setInterval(function () { if (document.visibilityState === 'visible') yenile(true); }, 60000);
  }

  function yenile(sessiz) {
    var d = $('yenile');
    d.classList.add('donuyor');
    return Api.gonder({ action: 'admin_stats', password: sifreOku() }, { deneme: 2 }).then(function (y) {
      veri = y;
      ciz();
      $('sonGuncelleme').textContent = 'Son güncelleme ' + saatBicim.format(new Date());
    }, function (e) {
      if (e.kod === 'hatali_sifre' || e.kod === 'cok_fazla_deneme') { sifreYaz(''); girisGoster(hataMetni(e)); return; }
      if (!sessiz) bildirim(hataMetni(e), true);
    }).then(function () { d.classList.remove('donuyor'); });
  }
  $('yenile').addEventListener('click', function () { yenile(); });

  function ciz() {
    var t = veri.totals;
    $('toplamAni').textContent = sayi(t.photo + t.video);
    $('sPhoto').textContent = sayi(t.photo);
    $('sVideo').textContent = sayi(t.video);
    $('sAudio').textContent = sayi(t.audio);
    $('sNotes').textContent = sayi(t.notes);
    $('sGuests').textContent = sayi(t.guests);
    $('sBytes').textContent = boyut(t.bytes);

    // Depolama
    var s = veri.storage;
    var kutu = document.querySelector('.depo');
    if (s.limit > 0) {
      var oran = Math.min(1, s.used / s.limit);
      var yuzde = Math.round(oran * 100);
      $('depoBos').textContent = boyut(Math.max(0, s.limit - s.used)) + ' boş';
      $('depoDolu').style.width = Math.max(oran * 100, 1) + '%';
      $('depoMeter').setAttribute('aria-valuenow', String(yuzde));
      $('depoYazi').textContent = boyut(s.used) + ' / ' + boyut(s.limit) + ' kullanılıyor (%' + yuzde + ')';
      var durum = $('depoDurum');
      kutu.classList.toggle('depo--kritik', oran >= 0.95);
      if (oran >= 0.85) {
        durum.hidden = false;
        durum.querySelector('span').textContent = oran >= 0.95 ? 'Neredeyse dolu' : 'Dolmak üzere';
      } else durum.hidden = true;
    } else {
      $('depoBos').textContent = 'Sınırsız';
      $('depoYazi').textContent = boyut(s.used) + ' kullanılıyor';
    }

    // Açık / kapalı
    acikGoster(veri.open);
    $('lnkKlasor').href = veri.links.folder;
    $('lnkTablo').href = veri.links.sheet;

    sonCiz();
    kisileriCiz();
    notlariCiz();
  }

  function acikGoster(acik) {
    $('acikAnahtar').setAttribute('aria-checked', acik ? 'true' : 'false');
    $('acikAciklama').textContent = acik ? 'Açık: misafirler anı paylaşabiliyor.' : 'Kapalı: misafirler şu an yükleme yapamıyor.';
  }

  $('acikAnahtar').addEventListener('click', function () {
    var yeni = $('acikAnahtar').getAttribute('aria-checked') !== 'true';
    if (!yeni && !confirm('Misafir yüklemelerini kapatmak istiyor musunuz? Kapalıyken kimse yeni anı paylaşamaz.')) return;
    var d = $('acikAnahtar');
    d.disabled = true;
    Api.gonder({ action: 'admin_toggle', password: sifreOku(), open: yeni }, { deneme: 1 }).then(function (y) {
      acikGoster(y.open);
      bildirim(y.open ? 'Yüklemeler açıldı.' : 'Yüklemeler kapatıldı.');
    }, function (e) { bildirim(hataMetni(e), true); }).then(function () { d.disabled = false; });
  });

  // ---------------- Son yüklenenler ----------------
  function sonCiz() {
    var liste = veri.recent || [];
    var ul = $('sonListe');
    ul.innerHTML = '';
    $('sonBos').hidden = liste.length > 0;
    var istenecek = [];
    liste.slice(0, 24).forEach(function (o) {
      var li = document.createElement('li');
      li.className = 'son__oge';
      var ikon = o.kind === 'video' ? 'i-video' : o.kind === 'audio' ? 'i-mikrofon' : 'i-galeri';
      li.innerHTML = '<a target="_blank" rel="noopener"><div class="son__resim"><svg><use href="#' + ikon + '"/></svg></div><p class="son__kim"></p><p class="son__ne"></p></a>';
      li.querySelector('a').href = o.link;
      li.querySelector('.son__kim').textContent = o.guest;
      li.querySelector('.son__ne').textContent = zaman(o.time);
      li.dataset.id = o.id;
      if (o.kind === 'video') li.querySelector('.son__resim').insertAdjacentHTML('beforeend', '<span class="son__rozet"><svg><use href="#i-oynat"/></svg></span>');
      ul.appendChild(li);
      if (o.kind !== 'audio') {
        if (kucukler[o.id]) resimKoy(li, kucukler[o.id]); else istenecek.push(o.id);
      }
    });
    if (istenecek.length) {
      Api.gonder({ action: 'admin_thumbs', password: sifreOku(), ids: istenecek }, { deneme: 1 }).then(function (y) {
        Object.keys(y.thumbs || {}).forEach(function (id) {
          kucukler[id] = y.thumbs[id];
          var li = ul.querySelector('[data-id="' + id + '"]');
          if (li) resimKoy(li, y.thumbs[id]);
        });
      }).catch(function () { /* küçük resim olmadan da çalışır */ });
    }
  }
  function resimKoy(li, src) {
    var kutu = li.querySelector('.son__resim');
    if (kutu.querySelector('img')) return;
    var img = new Image();
    img.alt = '';
    img.src = src;
    kutu.insertBefore(img, kutu.firstChild);
  }

  // ---------------- Kişiler ----------------
  function kisileriCiz() {
    var aranan = $('kisiAra').value.toLocaleLowerCase('tr-TR').trim();
    var sira = $('kisiSirala').value;
    var liste = (veri.people || []).filter(function (k) {
      return !aranan || (k.name + ' ' + k.phone).toLocaleLowerCase('tr-TR').indexOf(aranan) >= 0;
    });
    liste.sort(function (a, b) {
      if (sira === 'son') return b.last - a.last;
      if (sira === 'ad') return a.name.localeCompare(b.name, 'tr');
      return (b.photo + b.video + b.audio + b.notes) - (a.photo + a.video + a.audio + a.notes) || b.last - a.last;
    });
    var tb = $('kisiListe');
    tb.innerHTML = '';
    function hucre(n) { return '<td class="say' + (n ? '' : ' sifir') + '">' + sayi(n) + '</td>'; }
    liste.forEach(function (k) {
      var tr = document.createElement('tr');
      var ozet = [];
      if (k.photo) ozet.push(sayi(k.photo) + ' fotoğraf');
      if (k.video) ozet.push(sayi(k.video) + ' video');
      if (k.audio) ozet.push(sayi(k.audio) + ' sesli mesaj');
      if (k.notes) ozet.push(sayi(k.notes) + ' not');
      if (k.bytes) ozet.push(boyut(k.bytes));
      tr.innerHTML = '<td><span class="kisiler__ad"></span></td>' +
        hucre(k.photo) + hucre(k.video) + hucre(k.audio) + hucre(k.notes) +
        '<td class="say">' + (k.bytes ? boyut(k.bytes) : '<span class="sifir">–</span>') + '</td>' +
        '<td class="kisiler__son"></td>' +
        '<td class="kisiler__ozet-hucre"></td>';
      tr.querySelector('.kisiler__ad').textContent = k.name;
      if (k.phone) {
        var a = document.createElement('a');
        a.className = 'kisiler__tel';
        a.href = 'tel:' + k.phone.replace(/[^\d+]/g, '');
        a.textContent = k.phone;
        tr.firstChild.appendChild(a);
      }
      tr.querySelector('.kisiler__son').textContent = zaman(k.last);
      tr.querySelector('.kisiler__ozet-hucre').textContent = ozet.join(', ');
      tb.appendChild(tr);
    });
    $('kisiBos').hidden = liste.length > 0 || !(veri.people || []).length;
    if (!(veri.people || []).length) { $('kisiBos').textContent = 'Henüz kimse paylaşım yapmadı.'; $('kisiBos').hidden = false; }
    else $('kisiBos').textContent = 'Eşleşen kişi yok.';
  }
  $('kisiAra').addEventListener('input', function () { if (veri) kisileriCiz(); });
  $('kisiSirala').addEventListener('change', function () { if (veri) kisileriCiz(); });

  // ---------------- Anı defteri ----------------
  var calan = null;
  function notlariCiz() {
    var liste = veri.notes || [];
    var kap = $('notListe');
    kap.innerHTML = '';
    $('notBos').hidden = liste.length > 0;
    $('notSayi').textContent = liste.length ? sayi(liste.length) : '';
    liste.forEach(function (n) {
      var d = document.createElement('article');
      d.className = 'not';
      if (n.voiceId) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'not__ses';
        b.innerHTML = '<span class="ikon"><svg><use href="#i-oynat"/></svg></span><span>Sesli mesajı dinle</span>';
        b.onclick = function () { sesCal(n.voiceId, b); };
        d.appendChild(b);
      }
      if (n.text) {
        var p = document.createElement('p');
        p.className = 'not__metin';
        p.textContent = n.text;
        d.appendChild(p);
      }
      var alt = document.createElement('div');
      alt.className = 'not__alt';
      alt.innerHTML = '<span class="not__kim"></span><span class="not__zaman"></span>';
      alt.querySelector('.not__kim').textContent = n.name;
      alt.querySelector('.not__zaman').textContent = zaman(n.time);
      d.appendChild(alt);
      kap.appendChild(d);
    });
  }

  var sesOnbellek = {};
  function sesCal(id, dugme) {
    if (calan) {
      var eski = calan; calan = null;
      eski.ses.pause();
      eski.dugme.querySelector('use').setAttribute('href', '#i-oynat');
      eski.dugme.lastChild.textContent = 'Sesli mesajı dinle';
      if (eski.dugme === dugme) return;
    }
    var yaz = dugme.lastChild;
    function baslat(url) {
      var a = new Audio(url);
      calan = { ses: a, dugme: dugme };
      dugme.querySelector('use').setAttribute('href', '#i-durdur');
      yaz.textContent = 'Durdur';
      a.onended = function () { if (calan && calan.ses === a) { calan = null; dugme.querySelector('use').setAttribute('href', '#i-oynat'); yaz.textContent = 'Sesli mesajı dinle'; } };
      a.play().catch(function () { bildirim('Ses bu tarayıcıda çalınamadı. Drive klasöründen açabilirsiniz.', true); });
    }
    if (sesOnbellek[id]) return baslat(sesOnbellek[id]);
    dugme.disabled = true;
    yaz.textContent = 'Yükleniyor…';
    Api.gonder({ action: 'admin_audio', password: sifreOku(), id: id }, { deneme: 1 }).then(function (y) {
      var ikili = atob(y.data);
      var dizi = new Uint8Array(ikili.length);
      for (var i = 0; i < ikili.length; i++) dizi[i] = ikili.charCodeAt(i);
      sesOnbellek[id] = URL.createObjectURL(new Blob([dizi], { type: y.mime || 'audio/mp4' }));
      dugme.disabled = false;
      baslat(sesOnbellek[id]);
    }, function (e) {
      dugme.disabled = false;
      yaz.textContent = 'Sesli mesajı dinle';
      bildirim(hataMetni(e), true);
    });
  }

  // ---------------- Başlat ----------------
  if (!(window.AYARLAR || {}).apiUrl) girisGoster('Kurulum tamamlanmamış: ayarlar.js içindeki apiUrl alanı boş.');
  else if (sifreOku()) panelAc();
  else girisGoster();
})();
