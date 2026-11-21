/*
 * Misafir sayfası
 */
(function () {
  'use strict';

  var A = window.AYARLAR || {};
  var MAX_VIDEO_SN = (A.maxVideoDakika || 5) * 60;
  var MAX_SES_SN = (A.maxSesDakika || 2) * 60;
  var MAX_DOSYA_BAYT = 4 * 1024 * 1024 * 1024;
  var TEK_SEFERDE = 100;
  var FOTO_UZUN_KENAR = 3200;
  var FOTO_KALITE = 0.9;

  // =============================================================
  //  DİL
  // =============================================================
  var METIN = {
    tr: {
      paylasDugme: 'Anılarını paylaş',
      gizlilik: 'Paylaştıklarınız ve adınız yalnızca {isimler} ile paylaşılır.',
      tekrarHosgeldin: 'Tekrar hoş geldin, {ad}',
      yuklediklerimSayi: 'Yüklediklerim ({n})',
      degilMisiniz: '{ad} değil misiniz?',
      merhaba: 'Merhaba {ad}',
      paylasAciklama: 'Bu gecenin anılarını onlarla paylaşın. Fotoğraf ve en fazla {dk} dakikalık videolar gönderebilirsiniz.',
      galeridenSec: 'Galeriden seç',
      galeriNot: 'Birden fazla seçebilirsiniz',
      simdiCek: 'Şimdi çek',
      kameraNot: 'Kameranız açılır',
      secilenSayisi: '{n} anı seçildi',
      temizle: 'Hepsini kaldır',
      aniDefteri: 'Anı defteri',
      defterAciklama: 'İsterseniz {isimler} için bir not ya da sesli mesaj bırakın.',
      notYer: 'Bir dilek, bir anı, birkaç güzel söz…',
      notEtiket: 'Notunuz',
      sesKaydet: 'Sesli mesaj kaydet',
      sesliMesajiniz: 'Sesli mesajınız',
      gonder: 'Gönder',
      ozetBos: 'Fotoğraf, video ya da not ekleyin',
      ozetHazirlaniyor: 'Videolar kontrol ediliyor…',
      foto: '{n} fotoğraf', video: '{n} video', notK: 'not', sesK: 'sesli mesaj',
      ve: 've',
      yukleniyorBaslik: 'Anılarınız gönderiliyor',
      yukleniyorAlt: 'Lütfen bu sayfayı kapatmayın, bitince haber vereceğiz.',
      hataBaslik: 'Birkaç şey gönderilemedi',
      hataAlt: 'İnternet bağlantınızı kontrol edip tekrar deneyebilirsiniz. Gönderilenler güvende.',
      genelSayi: '{a} / {b} gönderildi',
      dBekliyor: 'Sırada', dHazirlaniyor: 'Hazırlanıyor', dYukleniyor: 'Gönderiliyor', dBitti: 'Gönderildi', dHata: 'Gönderilemedi',
      tekrarDene: 'Tekrar dene',
      hepsiniTekrar: 'Hepsini tekrar dene',
      bunlarsizBitir: 'Bunlar olmadan bitir',
      cevrimdisi: 'İnternet bağlantınız koptu. Bağlantı gelince gönderim kaldığı yerden devam edecek.',
      tFoto: 'Fotoğraf {n}', tVideo: 'Video {n}', tSes: 'Sesli mesaj', tNot: 'Anı defteri notu',
      tesekkurBaslik: 'Teşekkürler, {ad}',
      tesekkurYazi: '{isimler}, paylaştığınız {seyler} için çok teşekkür ediyor.',
      sAni: '{n} anı', sNot: 'not', sSes: 'sesli mesaj',
      dahaFazla: 'Daha fazla paylaş',
      yuklediklerimiGor: 'Yüklediklerimi gör',
      yuklediklerim: 'Yüklediklerim',
      benimAciklama: 'Bu telefondan {n} anı paylaştınız.',
      benimAciklamaNot: 'Bu telefondan paylaştıklarınız.',
      bosYazi: 'Bu telefondan henüz bir şey paylaşılmadı.',
      ilkAni: 'İlk anını paylaş',
      siziTaniyalim: 'Sizi tanıyalım',
      isimAciklama: '{isimler} anıları kimin paylaştığını görebilsin.',
      adSoyad: 'Adınız ve soyadınız',
      telefon: 'Telefon numaranız',
      istegeBagli: '(isteğe bağlı)',
      devam: 'Devam et',
      isimNot: 'Adınız bu telefonda hatırlanır, bir dahaki sefere sorulmaz.',
      adHataBos: 'Lütfen adınızı ve soyadınızı yazın.',
      adHataTek: 'Soyadınızı da ekleyin.',
      sesliMesaj: 'Sesli mesaj',
      sesAciklama: 'Kırmızı düğmeye dokunun ve konuşun. En fazla {dk} dakika.',
      sesKayitta: 'Kaydediliyor. Bitirmek için kareye dokunun.',
      sesBitti: 'Dinleyebilir, yeniden kaydedebilir ya da mesajınızı ekleyebilirsiniz.',
      dinle: 'Dinle', durdur: 'Durdur',
      yenidenKaydet: 'Yeniden kaydet',
      mesajiEkle: 'Mesajı ekle',
      vazgec: 'Vazgeç',
      kaydiBaslat: 'Kaydı başlat', kaydiBitir: 'Kaydı bitir',
      geri: 'Geri', sil: 'Sil', kaldir: 'Kaldır',
      mikrofonIzin: 'Mikrofon izni verilmedi. Telefonunuzun ayarlarından tarayıcıya mikrofon izni verip tekrar deneyin.',
      mikrofonYok: 'Bu tarayıcı ses kaydını desteklemiyor. Bunun yerine yazılı not bırakabilirsiniz.',
      sesKisa: 'Kayıt çok kısa oldu, bir kez daha deneyin.',
      redVideoUzun: '<strong>{ad}</strong> {sure} uzunluğunda. En fazla {dk} dakikalık videolar gönderilebiliyor; videoyu galeride kısaltıp yeniden seçebilirsiniz.',
      redVideoBilinmiyor: '<strong>{ad}</strong> açılamadı ya da çok büyük. Daha kısa bir video seçebilirsiniz.',
      redTur: '<strong>{ad}</strong> fotoğraf ya da video olmadığı için eklenmedi.',
      redBuyuk: '<strong>{ad}</strong> çok büyük ({boyut}).',
      cokFazla: 'Tek seferde en fazla {n} anı gönderebilirsiniz. İlk {n} tanesi eklendi; kalanları sonra gönderebilirsiniz.',
      kapali: 'Anı paylaşımı şu an kapalı. Gösterdiğiniz ilgi için teşekkür ederiz.',
      kurulumYok: 'Kurulum tamamlanmadı: ayarlar.js dosyasındaki apiUrl alanı boş.',
      eDepolama: 'Depolama alanı doldu. Lütfen çifte haber verin.',
      eKapali: 'Anı paylaşımı şu an kapalı.',
      eBaglanti: 'İnternet bağlantısı kurulamadı.',
      eGenel: 'Bir sorun oluştu, lütfen tekrar deneyin.',
      cikisUyari: 'Gönderim sürüyor. Sayfadan çıkarsanız yarım kalanlar gönderilmez.',
      gonderimSuruyor: 'Gönderim sürüyor, lütfen bitmesini bekleyin.',
      gunKaldi: '{n} gün kaldı', yarin: 'Yarın akşam görüşmek üzere', buAksam: 'Bu akşam birlikteyiz',
      aniPaylasildi: '{n} anı paylaşıldı',
      saat: 'Saat {s}',
      dilDugme: 'EN', dilAria: 'Switch to English'
    },
    en: {
      paylasDugme: 'Share your memories',
      gizlilik: 'What you share and your name are only visible to {isimler}.',
      tekrarHosgeldin: 'Welcome back, {ad}',
      yuklediklerimSayi: 'My uploads ({n})',
      degilMisiniz: 'Not {ad}?',
      merhaba: 'Hi {ad}',
      paylasAciklama: 'Share tonight’s moments with them. You can send photos and videos up to {dk} minutes long.',
      galeridenSec: 'Choose from gallery',
      galeriNot: 'Pick as many as you like',
      simdiCek: 'Take one now',
      kameraNot: 'Opens your camera',
      secilenSayisi: '{n} selected',
      temizle: 'Remove all',
      aniDefteri: 'Guestbook',
      defterAciklama: 'Leave a note or a voice message for {isimler} if you like.',
      notYer: 'A wish, a memory, a few kind words…',
      notEtiket: 'Your note',
      sesKaydet: 'Record a voice message',
      sesliMesajiniz: 'Your voice message',
      gonder: 'Send',
      ozetBos: 'Add photos, videos or a note',
      ozetHazirlaniyor: 'Checking videos…',
      foto: '{n} photo|{n} photos', video: '{n} video|{n} videos', notK: 'a note', sesK: 'a voice message',
      ve: 'and',
      yukleniyorBaslik: 'Sending your memories',
      yukleniyorAlt: 'Please keep this page open. We’ll let you know when it’s done.',
      hataBaslik: 'A few things didn’t send',
      hataAlt: 'Check your connection and try again. Everything else is safely sent.',
      genelSayi: '{a} of {b} sent',
      dBekliyor: 'Waiting', dHazirlaniyor: 'Preparing', dYukleniyor: 'Sending', dBitti: 'Sent', dHata: 'Not sent',
      tekrarDene: 'Try again',
      hepsiniTekrar: 'Retry all',
      bunlarsizBitir: 'Finish without these',
      cevrimdisi: 'You’re offline. Sending will pick up where it left off once you’re connected.',
      tFoto: 'Photo {n}', tVideo: 'Video {n}', tSes: 'Voice message', tNot: 'Guestbook note',
      tesekkurBaslik: 'Thank you, {ad}',
      tesekkurYazi: '{isimler} are grateful for the {seyler} you shared.',
      sAni: '{n} memory|{n} memories', sNot: 'note', sSes: 'voice message',
      dahaFazla: 'Share more',
      yuklediklerimiGor: 'See my uploads',
      yuklediklerim: 'My uploads',
      benimAciklama: 'You’ve shared {n} from this phone.',
      benimAciklamaNot: 'What you’ve shared from this phone.',
      bosYazi: 'Nothing shared from this phone yet.',
      ilkAni: 'Share your first memory',
      siziTaniyalim: 'Who’s sharing?',
      isimAciklama: 'So {isimler} know who shared each memory.',
      adSoyad: 'Your full name',
      telefon: 'Phone number',
      istegeBagli: '(optional)',
      devam: 'Continue',
      isimNot: 'We’ll remember your name on this phone.',
      adHataBos: 'Please enter your first and last name.',
      adHataTek: 'Please add your last name too.',
      sesliMesaj: 'Voice message',
      sesAciklama: 'Tap the red button and speak. Up to {dk} minutes.',
      sesKayitta: 'Recording. Tap the square to finish.',
      sesBitti: 'Listen back, record again, or add your message.',
      dinle: 'Listen', durdur: 'Stop',
      yenidenKaydet: 'Record again',
      mesajiEkle: 'Add message',
      vazgec: 'Cancel',
      kaydiBaslat: 'Start recording', kaydiBitir: 'Stop recording',
      geri: 'Back', sil: 'Delete', kaldir: 'Remove',
      mikrofonIzin: 'Microphone access was blocked. Allow it for your browser in your phone’s settings and try again.',
      mikrofonYok: 'This browser can’t record audio. You can leave a written note instead.',
      sesKisa: 'That was too short. Please try once more.',
      redVideoUzun: '<strong>{ad}</strong> is {sure} long. Videos can be up to {dk} minutes; trim it in your gallery and choose it again.',
      redVideoBilinmiyor: '<strong>{ad}</strong> couldn’t be opened or is too large. Try a shorter video.',
      redTur: '<strong>{ad}</strong> isn’t a photo or video, so it wasn’t added.',
      redBuyuk: '<strong>{ad}</strong> is too large ({boyut}).',
      cokFazla: 'You can send up to {n} at a time. The first {n} were added; send the rest afterwards.',
      kapali: 'Sharing is closed for now. Thank you for being part of the night.',
      kurulumYok: 'Setup isn’t finished: apiUrl in ayarlar.js is empty.',
      eDepolama: 'Storage is full. Please let the couple know.',
      eKapali: 'Sharing is closed for now.',
      eBaglanti: 'Couldn’t connect to the internet.',
      eGenel: 'Something went wrong. Please try again.',
      cikisUyari: 'Still sending. If you leave, unfinished items won’t be sent.',
      gonderimSuruyor: 'Still sending, please wait for it to finish.',
      gunKaldi: '{n} days to go', yarin: 'See you tomorrow evening', buAksam: 'Tonight’s the night',
      aniPaylasildi: '{n} memories shared',
      saat: '{s}',
      dilDugme: 'TR', dilAria: 'Türkçeye geç'
    }
  };

  var dil = (function () {
    var k = depoOku('nisan.dil');
    if (k === 'tr' || k === 'en') return k;
    return /^tr\b/i.test(navigator.language || 'tr') ? 'tr' : 'en';
  })();

  function t(anahtar, p) {
    var s = (METIN[dil] && METIN[dil][anahtar]) || METIN.tr[anahtar] || anahtar;
    p = p || {};
    if (s.indexOf('|') >= 0) s = s.split('|')[p.n === 1 ? 0 : 1];
    return s.replace(/\{(\w+)\}/g, function (_, k) { return p[k] != null ? p[k] : ''; });
  }
  function isimler() { return A.isim1 + (dil === 'tr' ? ' ve ' : ' and ') + A.isim2; }
  function sayi(n) { return Number(n).toLocaleString(dil === 'tr' ? 'tr-TR' : 'en-GB'); }
  function boyutYaz(b) {
    var mb = b / 1048576;
    if (mb >= 1024) return (mb / 1024).toLocaleString(dil === 'tr' ? 'tr-TR' : 'en-GB', { maximumFractionDigits: 1 }) + ' GB';
    if (mb < 1) return Math.max(1, Math.round(b / 1024)) + ' KB';
    return mb.toLocaleString(dil === 'tr' ? 'tr-TR' : 'en-GB', { maximumFractionDigits: mb < 10 ? 1 : 0 }) + ' MB';
  }
  function sureYaz(sn) {
    sn = Math.max(0, Math.round(sn));
    return Math.floor(sn / 60) + ':' + String(sn % 60).padStart(2, '0');
  }
  function sureUzunYaz(sn) {
    sn = Math.round(sn);
    var dk = Math.floor(sn / 60), s = sn % 60;
    if (dil === 'tr') return (dk ? dk + ' dakika ' : '') + (s ? s + ' saniye' : '');
    return (dk ? dk + ' min ' : '') + (s ? s + ' sec' : '');
  }
  function listeBirlestir(parcalar) {
    if (parcalar.length <= 1) return parcalar.join('');
    return parcalar.slice(0, -1).join(', ') + ' ' + t('ve') + ' ' + parcalar[parcalar.length - 1];
  }
  function kacis(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  // =============================================================
  //  YARDIMCILAR
  // =============================================================
  function $(id) { return document.getElementById(id); }
  function depoOku(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function depoYaz(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* gizli sekme */ } }
  var sayac = 0;
  function uid() { return Date.now().toString(36) + '-' + (sayac++).toString(36) + Math.random().toString(36).slice(2, 7); }

  function bildirim(mesaj, hata) {
    var el = document.createElement('div');
    el.className = 'bildirim' + (hata ? ' bildirim--hata' : '');
    el.textContent = mesaj;
    $('bildirimler').appendChild(el);
    setTimeout(function () {
      el.style.transition = 'opacity .3s'; el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 320);
    }, 4800);
  }

  function hataMesaji(e) {
    var kod = e && e.kod;
    if (kod === 'depolama_dolu') return t('eDepolama');
    if (kod === 'yuklemeler_kapali') return t('eKapali');
    if (kod === 'baglanti' || kod === 'zaman_asimi') return t('eBaglanti');
    if (kod === 'kurulum_yapilmamis') return t('kurulumYok');
    return t('eGenel');
  }

  // =============================================================
  //  MİSAFİR (telefonda hatırlanır)
  // =============================================================
  var misafir = (function () { try { return JSON.parse(depoOku('nisan.misafir')); } catch (e) { return null; } })();
  function misafirKaydet(m) { misafir = m; depoYaz('nisan.misafir', JSON.stringify(m)); }
  function ilkAd() { return misafir ? misafir.name.split(' ')[0] : ''; }
  function misafirApi() { return { name: misafir.name, phone: misafir.phone || '' }; }

  // =============================================================
  //  YEREL ARŞİV (Yüklediklerim) — IndexedDB
  // =============================================================
  var Arsiv = (function () {
    var dbSoz = null;
    function ac() {
      if (dbSoz) return dbSoz;
      dbSoz = new Promise(function (coz, reddet) {
        if (!window.indexedDB) return reddet(new Error('idb yok'));
        var r = indexedDB.open('nisan-anilari', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('kayitlar', { keyPath: 'id', autoIncrement: true }); };
        r.onsuccess = function () { coz(r.result); };
        r.onerror = function () { reddet(r.error); };
      });
      return dbSoz;
    }
    function islem(mod, fn) {
      return ac().then(function (db) {
        return new Promise(function (coz, reddet) {
          var tx = db.transaction('kayitlar', mod);
          var sonuc = fn(tx.objectStore('kayitlar'));
          tx.oncomplete = function () { coz(sonuc && sonuc.result); };
          tx.onerror = function () { reddet(tx.error); };
        });
      });
    }
    return {
      ekle: function (kayitlar) {
        return islem('readwrite', function (s) { kayitlar.forEach(function (k) { s.add(k); }); }).catch(function () {});
      },
      hepsi: function () {
        return islem('readonly', function (s) { return s.getAll(); }).then(function (l) { return l || []; }).catch(function () { return []; });
      }
    };
  })();
  var arsivSayisi = 0;
  function arsivSayisiGuncelle() {
    return Arsiv.hepsi().then(function (l) {
      arsivSayisi = l.filter(function (k) { return k.tur !== 'not'; }).length;
      kapakGuncelle();
    });
  }

  // =============================================================
  //  EKRANLAR VE GEÇMİŞ (telefonun geri tuşu çalışsın)
  // =============================================================
  var aktifEkran = 'kapak';
  var yuklemeSuruyor = false;

  function goster(ad, gecmiseEkle) {
    if (ad === aktifEkran) return;
    document.querySelectorAll('.ekran').forEach(function (e) {
      var bu = e.dataset.ekran === ad;
      e.hidden = !bu;
      if (bu) { e.removeAttribute('data-giris'); void e.offsetWidth; e.setAttribute('data-giris', ''); }
    });
    aktifEkran = ad;
    window.scrollTo(0, 0);
    if (gecmiseEkle !== false) history.pushState({ ekran: ad }, '');
    if (ad === 'kapak') $('ekran-kapak').classList.add('tekrar-gelis');
    if (ad === 'benimkiler') benimkileriCiz();
    if (ad === 'tesekkur') konfeti();
    document.body.style.background = (ad === 'kapak' || ad === 'tesekkur') ? '' : 'var(--kagit)';
  }

  window.addEventListener('popstate', function (e) {
    perdeleriKapat();
    if (yuklemeSuruyor) {
      history.pushState({ ekran: aktifEkran }, '');
      bildirim(t('gonderimSuruyor'));
      return;
    }
    var hedef = (e.state && e.state.ekran) || 'kapak';
    if (hedef === 'yukleme') hedef = 'paylas';
    goster(hedef, false);
  });

  document.addEventListener('click', function (e) {
    var git = e.target.closest('[data-git]');
    if (git) { goster(git.dataset.git); return; }
    if (e.target.closest('[data-geri]')) { history.back(); return; }
    if (e.target.closest('[data-dil-degistir]')) { dilDegistir(); return; }
    if (e.target.closest('[data-perde-kapat]')) { perdeKapat(e.target.closest('.perde')); }
  });

  // =============================================================
  //  PERDELER
  // =============================================================
  var perdeSonrasi = null;
  function perdeAc(id) {
    var p = $(id);
    p.classList.remove('kapaniyor');
    p.hidden = false;
    document.documentElement.style.overflow = 'hidden';
  }
  function perdeKapat(p, sessiz) {
    if (!p || p.hidden) return;
    if (p.id === 'sesPerde') sesPerdesiKapaniyor();
    if (sessiz) { p.hidden = true; document.documentElement.style.overflow = ''; return; }
    p.classList.add('kapaniyor');
    setTimeout(function () { p.hidden = true; p.classList.remove('kapaniyor'); }, 230);
    document.documentElement.style.overflow = '';
  }
  function perdeleriKapat() { document.querySelectorAll('.perde').forEach(function (p) { perdeKapat(p, true); }); }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.perde:not([hidden])').forEach(function (p) { perdeKapat(p); });
  });

  // =============================================================
  //  KARŞILAMA
  // =============================================================
  var etkinlik = (function () {
    var s = String(A.tarih || '');
    if (!/[zZ]|[+-]\d\d:?\d\d$/.test(s)) s += (s.length <= 16 ? ':00' : '') + '+03:00';
    var d = new Date(s);
    return isNaN(d) ? null : d;
  })();
  var bilgi = { open: true, count: 0, alindi: false };

  function istanbulGunu(d) {
    var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
    return Date.parse(p + 'T00:00:00Z') / 86400000;
  }

  function kapakGuncelle() {
    $('isim1').textContent = A.isim1;
    $('isim2').textContent = A.isim2;
    document.querySelectorAll('[data-cift]').forEach(function (e) { e.textContent = A.isim1 + ' & ' + A.isim2; });
    $('ekran-kapak').querySelector('.kapak__ust').textContent = (A.etkinlik && A.etkinlik[dil]) || '';

    if (etkinlik) {
      var yerel = dil === 'tr' ? 'tr-TR' : 'en-GB';
      var gunAy = new Intl.DateTimeFormat(yerel, { timeZone: 'Europe/Istanbul', day: 'numeric', month: 'long', year: 'numeric' }).format(etkinlik);
      var haftaGunu = new Intl.DateTimeFormat(yerel, { timeZone: 'Europe/Istanbul', weekday: 'long' }).format(etkinlik);
      $('tarihYazi').textContent = dil === 'tr' ? gunAy + ', ' + haftaGunu : haftaGunu + ', ' + gunAy;
      var saat = new Intl.DateTimeFormat(yerel, { timeZone: 'Europe/Istanbul', hour: 'numeric', minute: '2-digit', hour12: dil !== 'tr' }).format(etkinlik);
      $('saatYazi').textContent = t('saat', { s: dil === 'tr' ? saat.replace(':', '.') : saat });

      var fark = istanbulGunu(etkinlik) - istanbulGunu(new Date());
      var durum = '';
      if (fark > 1) durum = t('gunKaldi', { n: sayi(fark) });
      else if (fark === 1) durum = t('yarin');
      else if (bilgi.count >= 20) durum = t('aniPaylasildi', { n: sayi(bilgi.count) });
      else if (fark === 0) durum = t('buAksam');
      $('durumYazi').textContent = durum;
      $('durumYazi').hidden = !durum;
    }

    var selam = $('selam');
    if (misafir) {
      selam.textContent = t('tekrarHosgeldin', { ad: ilkAd() });
      selam.hidden = false;
      $('degistirIsim').textContent = t('degilMisiniz', { ad: ilkAd() });
      $('degistirIsim').hidden = false;
    } else {
      selam.hidden = true;
      $('degistirIsim').hidden = true;
    }
    var bk = $('kapakBenimkiler');
    bk.textContent = t('yuklediklerimSayi', { n: sayi(arsivSayisi) });
    bk.hidden = !arsivSayisi;

    var uyari = $('kapakUyari');
    var basla = $('basla');
    if (!A.apiUrl) { uyari.textContent = t('kurulumYok'); uyari.hidden = false; basla.disabled = true; }
    else if (!bilgi.open) { uyari.textContent = t('kapali'); uyari.hidden = false; basla.disabled = true; }
    else { uyari.hidden = true; basla.disabled = false; }
  }

  function kapakFotografi() {
    var img = $('kapakFoto');
    if (A.kapakFotografi) {
      img.style.objectPosition = A.kapakOdak || '50% 30%';
      img.onload = function () { img.classList.add('yuklendi'); };
      img.onerror = function () { img.hidden = true; monogramGoster(); };
      img.src = A.kapakFotografi;
      if (img.complete && img.naturalWidth) img.classList.add('yuklendi');
      img.alt = A.isim1 + ' & ' + A.isim2;
    } else {
      img.hidden = true;
      monogramGoster();
    }
  }
  function monogramGoster() {
    var m = $('monogram');
    m.textContent = (A.isim1 || ' ').charAt(0) + '&' + (A.isim2 || ' ').charAt(0);
    m.hidden = false;
  }

  function bilgiAl() {
    if (!A.apiUrl) return;
    Api.gonder({ action: 'info' }, { deneme: 2 }).then(function (y) {
      bilgi.open = y.open; bilgi.count = y.count; bilgi.alindi = true;
      kapakGuncelle();
    }).catch(function () { /* sessiz geç */ });
  }

  $('basla').addEventListener('click', function () {
    if (!misafir) { perdeSonrasi = function () { goster('paylas'); }; isimPerdesiAc(); }
    else goster('paylas');
  });
  $('degistirIsim').addEventListener('click', function () {
    perdeSonrasi = function () { kapakGuncelle(); paylasGuncelle(); };
    isimPerdesiAc(true);
  });

  // =============================================================
  //  İSİM PERDESİ
  // =============================================================
  function isimPerdesiAc(yeni) {
    $('adGirdi').value = yeni ? '' : (misafir ? misafir.name : '');
    $('telGirdi').value = yeni ? '' : (misafir ? misafir.phone || '' : '');
    adHataGoster('');
    perdeAc('isimPerde');
    setTimeout(function () { try { $('adGirdi').focus({ preventScroll: true }); } catch (e) { $('adGirdi').focus(); } }, 380);
  }
  function adHataGoster(m) {
    $('adHata').textContent = m;
    $('adHata').hidden = !m;
    $('adGirdi').setAttribute('aria-invalid', m ? 'true' : 'false');
  }
  function adDuzenle(s) {
    return s.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().split(' ').map(function (k) {
      return k.charAt(0).toLocaleUpperCase('tr-TR') + k.slice(1);
    }).join(' ');
  }
  $('adGirdi').addEventListener('input', function () { if ($('adGirdi').getAttribute('aria-invalid') === 'true') adHataGoster(''); });
  $('isimFormu').addEventListener('submit', function (e) {
    e.preventDefault();
    var ad = adDuzenle($('adGirdi').value);
    var parcalar = ad.split(' ').filter(Boolean);
    if (ad.length < 2) { adHataGoster(t('adHataBos')); $('adGirdi').focus(); return; }
    if (parcalar.length < 2 || parcalar[1].length < 1) { adHataGoster(t('adHataTek')); $('adGirdi').focus(); return; }
    var tel = $('telGirdi').value.replace(/[^\d+()\s-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20);
    misafirKaydet({ name: ad.slice(0, 80), phone: tel });
    $('adGirdi').blur(); $('telGirdi').blur();
    perdeKapat($('isimPerde'));
    kapakGuncelle();
    paylasGuncelle();
    var sonra = perdeSonrasi; perdeSonrasi = null;
    if (sonra) setTimeout(sonra, 120);
  });

  // =============================================================
  //  PAYLAŞ EKRANI — dosya seçimi
  // =============================================================
  var secilenler = [];       // { id, dosya, tur, tip, ad, kucuk (blob), kucukUrl, sure, durum: 'inceleniyor'|'hazir' }
  var ses = null;            // { blob, sure, url, tip }

  function paylasGuncelle() {
    $('paylasBaslik').textContent = misafir ? t('merhaba', { ad: ilkAd() }) : t('paylasDugme');
    $('paylasAciklama').textContent = t('paylasAciklama', { dk: A.maxVideoDakika || 5 });
    $('defterAciklama').textContent = t('defterAciklama', { isimler: isimler() });
    $('notGirdi').placeholder = t('notYer');
    ozetGuncelle();
  }

  function turBul(f) {
    var tip = (f.type || '').toLowerCase();
    if (tip.indexOf('image/') === 0) return 'photo';
    if (tip.indexOf('video/') === 0) return 'video';
    var uz = (/\.([a-z0-9]+)$/i.exec(f.name || '') || [])[1];
    uz = (uz || '').toLowerCase();
    if (/^(jpe?g|png|heic|heif|webp|gif|avif|dng)$/.test(uz)) return 'photo';
    if (/^(mov|mp4|m4v|3gp|3g2|webm|mkv|avi|hevc)$/.test(uz)) return 'video';
    return null;
  }
  function tipBul(f, tur) {
    if (f.type) return f.type;
    var uz = ((/\.([a-z0-9]+)$/i.exec(f.name || '') || [])[1] || '').toLowerCase();
    var harita = { heic: 'image/heic', heif: 'image/heif', png: 'image/png', webp: 'image/webp', gif: 'image/gif', mov: 'video/quicktime', mp4: 'video/mp4', m4v: 'video/x-m4v', '3gp': 'video/3gpp', webm: 'video/webm' };
    return harita[uz] || (tur === 'video' ? 'video/mp4' : 'image/jpeg');
  }

  function redEkle(html, simge) {
    var el = document.createElement('div');
    el.className = 'red';
    el.innerHTML = '<svg><use href="#' + (simge || 'i-bilgi') + '"/></svg><div>' + html + '</div>' +
      '<button class="red__kapat" type="button" aria-label="' + kacis(t('kaldir')) + '"><svg><use href="#i-carpi"/></svg></button>';
    el.querySelector('.red__kapat').onclick = function () { el.remove(); };
    $('reddedilenler').appendChild(el);
  }

  var incelemeKuyrugu = Promise.resolve();

  function dosyalarSecildi(liste) {
    var dosyalar = Array.prototype.slice.call(liste || []);
    if (!dosyalar.length) return;
    var yer = TEK_SEFERDE - secilenler.length;
    if (dosyalar.length > yer) {
      bildirim(t('cokFazla', { n: TEK_SEFERDE }));
      dosyalar = dosyalar.slice(0, Math.max(0, yer));
    }
    dosyalar.forEach(function (f) {
      var anahtar = f.name + '|' + f.size + '|' + f.lastModified;
      if (secilenler.some(function (s) { return s.anahtar === anahtar; })) return;
      var tur = turBul(f);
      if (!tur) { redEkle(t('redTur', { ad: kacis(f.name || '?') })); return; }
      if (f.size > MAX_DOSYA_BAYT) { redEkle(t('redBuyuk', { ad: kacis(f.name), boyut: boyutYaz(f.size) })); return; }
      var oge = { id: uid(), anahtar: anahtar, dosya: f, tur: tur, tip: tipBul(f, tur), ad: f.name || (tur === 'video' ? 'video.mp4' : 'foto.jpg'), durum: 'inceleniyor' };
      secilenler.push(oge);
      izgaraOgesiEkle(oge);
      incelemeKuyrugu = incelemeKuyrugu.then(function () { return incele(oge); }).catch(function () {});
    });
    ozetGuncelle();
  }

  function incele(oge) {
    if (secilenler.indexOf(oge) < 0) return Promise.resolve();
    if (oge.tur === 'photo') {
      return kucukResimFoto(oge.dosya).then(function (k) {
        oge.kucuk = k;
        oge.durum = 'hazir';
        izgaraOgesiGuncelle(oge);
        ozetGuncelle();
      });
    }
    return videoBilgi(oge.dosya).then(function (b) {
      oge.sure = b.sure;
      oge.kucuk = b.kucuk;
      var uzun = b.sure != null && b.sure > MAX_VIDEO_SN + 0.5;
      var bilinmiyorBuyuk = b.sure == null && oge.dosya.size > 2.5 * 1024 * 1024 * 1024;
      if (uzun || bilinmiyorBuyuk) {
        ogeKaldir(oge);
        redEkle(uzun
          ? t('redVideoUzun', { ad: kacis(oge.ad), sure: sureUzunYaz(b.sure), dk: A.maxVideoDakika || 5 })
          : t('redVideoBilinmiyor', { ad: kacis(oge.ad) }), 'i-video');
        return;
      }
      oge.durum = 'hazir';
      izgaraOgesiGuncelle(oge);
      ozetGuncelle();
    });
  }

  function izgaraOgesiEkle(oge) {
    var li = document.createElement('li');
    li.className = 'izgara__oge izgara__hazirlaniyor';
    li.dataset.id = oge.id;
    li.innerHTML = '<button class="izgara__kaldir" type="button" aria-label="' + kacis(t('kaldir')) + '"><svg><use href="#i-carpi"/></svg></button>';
    li.querySelector('.izgara__kaldir').onclick = function () { ogeKaldir(oge); };
    $('secilenIzgara').appendChild(li);
    $('secilenler').hidden = false;
  }

  function izgaraOgesiGuncelle(oge) {
    var li = $('secilenIzgara').querySelector('[data-id="' + oge.id + '"]');
    if (!li) return;
    li.classList.remove('izgara__hazirlaniyor');
    if (oge.kucuk) {
      oge.kucukUrl = URL.createObjectURL(oge.kucuk);
      var img = new Image();
      img.alt = '';
      img.src = oge.kucukUrl;
      li.insertBefore(img, li.firstChild);
    } else {
      li.classList.add('izgara__oge--bos');
      li.insertAdjacentHTML('afterbegin', '<svg><use href="#' + (oge.tur === 'video' ? 'i-video' : 'i-galeri') + '"/></svg>');
    }
    if (oge.tur === 'video') {
      li.insertAdjacentHTML('beforeend', '<span class="izgara__rozet"><svg><use href="#i-oynat"/></svg>' + (oge.sure != null ? sureYaz(oge.sure) : '') + '</span>');
    }
  }

  function ogeKaldir(oge) {
    var i = secilenler.indexOf(oge);
    if (i >= 0) secilenler.splice(i, 1);
    var li = $('secilenIzgara').querySelector('[data-id="' + oge.id + '"]');
    if (li) li.remove();
    if (oge.kucukUrl) URL.revokeObjectURL(oge.kucukUrl);
    $('secilenler').hidden = !secilenler.length;
    ozetGuncelle();
  }

  $('hepsiniKaldir').addEventListener('click', function () { secilenler.slice().forEach(ogeKaldir); });

  ['galeriGirdi', 'kameraGirdi'].forEach(function (id) {
    $(id).addEventListener('change', function (e) {
      dosyalarSecildi(e.target.files);
      e.target.value = '';
    });
  });

  function ozetGuncelle() {
    var foto = 0, video = 0, inceleniyor = 0;
    secilenler.forEach(function (s) {
      if (s.durum === 'inceleniyor') inceleniyor++;
      if (s.tur === 'photo') foto++; else video++;
    });
    var not = $('notGirdi').value.trim();
    var parca = [];
    if (foto) parca.push(t('foto', { n: foto }));
    if (video) parca.push(t('video', { n: video }));
    if (not) parca.push(t('notK'));
    if (ses) parca.push(t('sesK'));
    $('secilenSayisi').textContent = t('secilenSayisi', { n: sayi(secilenler.length) });
    $('gonderOzet').textContent = inceleniyor ? t('ozetHazirlaniyor') : (parca.length ? listeBirlestir(parca) : t('ozetBos'));
    $('gonder').disabled = !!inceleniyor || !parca.length;
  }

  $('notGirdi').addEventListener('input', function () {
    var el = $('notGirdi');
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight + 2, 320) + 'px';
    $('notSayac').textContent = el.value.length + ' / 1000';
    ozetGuncelle();
  });

  // =============================================================
  //  GÖRSEL İŞLEME
  // =============================================================
  /** Resmi açar (telefonun döndürme bilgisine uyarak). Açılamazsa null döner (ör. HEIC). */
  function resimAc(blob) {
    if (window.createImageBitmap) {
      return createImageBitmap(blob, { imageOrientation: 'from-image' }).then(function (bmp) {
        return { kaynak: bmp, g: bmp.width, y: bmp.height, kapat: function () { if (bmp.close) bmp.close(); } };
      }).catch(function () { return resimAcEski(blob); });
    }
    return resimAcEski(blob);
  }
  function resimAcEski(blob) {
    return new Promise(function (coz) {
      var url = URL.createObjectURL(blob);
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () { coz({ kaynak: img, g: img.naturalWidth, y: img.naturalHeight, kapat: function () { URL.revokeObjectURL(url); } }); };
      img.onerror = function () { URL.revokeObjectURL(url); coz(null); };
      img.src = url;
    });
  }
  function tuvaldenBlob(tuval, tip, kalite) {
    return new Promise(function (coz) {
      if (tuval.toBlob) tuval.toBlob(function (b) { coz(b); }, tip, kalite);
      else coz(null);
    });
  }
  function kareKes(kaynak, g, y, kenar) {
    var c = document.createElement('canvas');
    c.width = c.height = kenar;
    var ctx = c.getContext('2d');
    var o = Math.min(g, y);
    ctx.drawImage(kaynak, (g - o) / 2, (y - o) / 2, o, o, 0, 0, kenar, kenar);
    return c;
  }

  function kucukResimFoto(dosya) {
    return resimAc(dosya).then(function (r) {
      if (!r) return null;
      var c = kareKes(r.kaynak, r.g, r.y, 320);
      r.kapat();
      return tuvaldenBlob(c, 'image/jpeg', 0.8).then(function (b) { c.width = c.height = 0; return b; });
    }).catch(function () { return null; });
  }

  /** Fotoğrafı göze görünür kalite kaybı olmadan küçültür; küçülmüyorsa orijinali gönderir */
  function fotoHazirla(oge) {
    var dosya = oge.dosya;
    return resimAc(dosya).then(function (r) {
      if (!r) return dosya;
      var uzun = Math.max(r.g, r.y);
      if (dosya.size < 1.5 * 1048576 && uzun <= FOTO_UZUN_KENAR) { r.kapat(); return dosya; }
      if (/gif$/i.test(dosya.type)) { r.kapat(); return dosya; }
      var oran = Math.min(1, FOTO_UZUN_KENAR / uzun);
      var c = document.createElement('canvas');
      c.width = Math.round(r.g * oran);
      c.height = Math.round(r.y * oran);
      var ctx = c.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(r.kaynak, 0, 0, c.width, c.height);
      r.kapat();
      return tuvaldenBlob(c, 'image/jpeg', FOTO_KALITE).then(function (b) {
        c.width = c.height = 0;
        if (!b || b.size >= dosya.size * 0.92) return dosya;
        oge.tip = 'image/jpeg';
        oge.ad = oge.ad.replace(/\.[a-z0-9]+$/i, '') + '.jpg';
        return b;
      });
    }).catch(function () { return dosya; });
  }

  /** Video süresini ve küçük resmini okur */
  function videoBilgi(dosya) {
    return new Promise(function (coz) {
      var url = URL.createObjectURL(dosya);
      var v = document.createElement('video');
      var bitti = false;
      var sonuc = { sure: null, kucuk: null };
      function bitir() {
        if (bitti) return;
        bitti = true;
        clearTimeout(zaman);
        v.removeAttribute('src'); try { v.load(); } catch (e) { /* yok */ }
        URL.revokeObjectURL(url);
        coz(sonuc);
      }
      var zaman = setTimeout(bitir, 12000);
      v.muted = true; v.playsInline = true; v.preload = 'metadata';
      v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
      v.onloadedmetadata = function () {
        if (isFinite(v.duration) && v.duration > 0) sonuc.sure = v.duration;
        if (sonuc.sure != null && sonuc.sure > MAX_VIDEO_SN + 0.5) return bitir();
        try { v.currentTime = Math.min(1, (sonuc.sure || 2) / 3); } catch (e) { bitir(); }
      };
      v.onseeked = function () {
        try {
          if (v.videoWidth) {
            var c = kareKes(v, v.videoWidth, v.videoHeight, 320);
            tuvaldenBlob(c, 'image/jpeg', 0.78).then(function (b) { sonuc.kucuk = b; bitir(); });
            return;
          }
        } catch (e) { /* çizilemedi */ }
        bitir();
      };
      v.onerror = bitir;
      v.src = url;
    });
  }

  // =============================================================
  //  SESLİ MESAJ
  // =============================================================
  var kayit = null; // { akis, kaydedici, parcalar, baslangic, zaman, analiz, ses, seviyeler }
  var taslakSes = null;
  var dinleyici = null;

  function sesTipiSec() {
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return '';
    var adaylar = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/aac', 'audio/ogg;codecs=opus'];
    for (var i = 0; i < adaylar.length; i++) if (MediaRecorder.isTypeSupported(adaylar[i])) return adaylar[i];
    return '';
  }

  function sesDurumu(d) {
    $('sesDurumHazir').hidden = d !== 'hazir';
    $('sesDurumKayit').hidden = d !== 'kayit';
    $('sesDurumBitti').hidden = d !== 'bitti';
    $('sesAciklama').textContent = d === 'kayit' ? t('sesKayitta') : d === 'bitti' ? t('sesBitti') : t('sesAciklama', { dk: A.maxSesDakika || 2 });
    if (d === 'hazir') { $('sesSure').innerHTML = '0:00 <small>/ ' + sureYaz(MAX_SES_SN) + '</small>'; dalgaCiz([]); }
  }

  $('sesAc').addEventListener('click', function () {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      bildirim(t('mikrofonYok'), true);
      return;
    }
    taslakSes = null;
    sesDurumu('hazir');
    perdeAc('sesPerde');
    dalgaHazirla();
  });

  function dalgaHazirla() {
    var c = $('sesDalga');
    var oran = window.devicePixelRatio || 1;
    c.width = c.clientWidth * oran;
    c.height = c.clientHeight * oran;
    dalgaCiz([]);
  }

  function dalgaCiz(seviyeler) {
    var c = $('sesDalga');
    var ctx = c.getContext('2d');
    var g = c.width, y = c.height;
    if (!g) return;
    ctx.clearRect(0, 0, g, y);
    var oran = window.devicePixelRatio || 1;
    var cubuk = 3 * oran, bosluk = 3 * oran;
    var adet = Math.floor(g / (cubuk + bosluk));
    var son = seviyeler.slice(-adet);
    for (var i = 0; i < adet; i++) {
      var s = son[i - (adet - son.length)];
      var h = s == null ? 2 * oran : Math.max(3 * oran, s * y * 0.92);
      ctx.fillStyle = s == null ? '#DCD3E0' : (kayit ? '#B4535C' : '#A58898');
      var x = i * (cubuk + bosluk);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, (y - h) / 2, cubuk, h, cubuk / 2); else ctx.rect(x, (y - h) / 2, cubuk, h);
      ctx.fill();
    }
  }

  $('sesBaslat').addEventListener('click', function () {
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }).then(function (akis) {
      var tip = sesTipiSec();
      var kaydedici;
      try { kaydedici = tip ? new MediaRecorder(akis, { mimeType: tip }) : new MediaRecorder(akis); }
      catch (e) { kaydedici = new MediaRecorder(akis); }
      kayit = { akis: akis, kaydedici: kaydedici, parcalar: [], baslangic: Date.now(), seviyeler: [] };
      kaydedici.ondataavailable = function (e) { if (e.data && e.data.size) kayit.parcalar.push(e.data); };
      kaydedici.onstop = sesKaydiBitti;
      kaydedici.start(250);

      try {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        kayit.ses = new Ctx();
        var kaynak = kayit.ses.createMediaStreamSource(akis);
        kayit.analiz = kayit.ses.createAnalyser();
        kayit.analiz.fftSize = 512;
        kaynak.connect(kayit.analiz);
      } catch (e) { kayit.analiz = null; }

      var veri = kayit.analiz ? new Uint8Array(kayit.analiz.fftSize) : null;
      kayit.zaman = setInterval(function () {
        var sn = (Date.now() - kayit.baslangic) / 1000;
        $('sesSure').innerHTML = sureYaz(sn) + ' <small>/ ' + sureYaz(MAX_SES_SN) + '</small>';
        var seviye = 0.08 + Math.random() * 0.05;
        if (veri) {
          kayit.analiz.getByteTimeDomainData(veri);
          var top = 0;
          for (var i = 0; i < veri.length; i++) { var d = (veri[i] - 128) / 128; top += d * d; }
          seviye = Math.min(1, Math.sqrt(top / veri.length) * 3.2);
        }
        kayit.seviyeler.push(seviye);
        dalgaCiz(kayit.seviyeler);
        if (sn >= MAX_SES_SN) sesKaydiDurdur();
      }, 90);
      sesDurumu('kayit');
    }).catch(function (e) {
      bildirim(e && (e.name === 'NotAllowedError' || e.name === 'SecurityError') ? t('mikrofonIzin') : t('mikrofonYok'), true);
    });
  });

  function sesKaydiDurdur() {
    if (!kayit) return;
    clearInterval(kayit.zaman);
    if (kayit.kaydedici.state !== 'inactive') kayit.kaydedici.stop();
    else sesKaydiBitti();
  }
  $('sesBitir').addEventListener('click', sesKaydiDurdur);

  function sesKaydiBitti() {
    if (!kayit) return;
    var k = kayit;
    kayit = null;
    k.akis.getTracks().forEach(function (tr) { tr.stop(); });
    if (k.ses && k.ses.close) k.ses.close().catch(function () {});
    var sure = (Date.now() - k.baslangic) / 1000;
    var tip = (k.kaydedici.mimeType || sesTipiSec() || 'audio/mp4').split(';')[0];
    var blob = new Blob(k.parcalar, { type: tip });
    if (sure < 1 || !blob.size) {
      bildirim(t('sesKisa'));
      sesDurumu('hazir');
      return;
    }
    taslakSes = { blob: blob, sure: Math.min(sure, MAX_SES_SN), tip: tip, seviyeler: k.seviyeler };
    $('sesSure').textContent = sureYaz(taslakSes.sure);
    dalgaCiz(k.seviyeler);
    sesDurumu('bitti');
  }

  function sesUzanti(tip) {
    if (/webm/.test(tip)) return '.webm';
    if (/ogg/.test(tip)) return '.ogg';
    if (/aac/.test(tip)) return '.aac';
    return '.m4a';
  }

  function oynat(blob, dugme, bitince) {
    if (dinleyici) { dinleyici.durdur(); if (dinleyici.dugme === dugme) { dinleyici = null; return; } }
    var url = URL.createObjectURL(blob);
    var a = new Audio(url);
    var eski = dugme.innerHTML;
    dinleyici = {
      dugme: dugme,
      durdur: function () { a.pause(); URL.revokeObjectURL(url); dugme.innerHTML = eski; if (bitince) bitince(); }
    };
    a.onended = function () { if (dinleyici) { dinleyici.durdur(); dinleyici = null; } };
    a.play().catch(function () { if (dinleyici) { dinleyici.durdur(); dinleyici = null; } });
    dugme.innerHTML = dugme.classList.contains('dugme')
      ? '<svg><use href="#i-durdur"/></svg><span>' + t('durdur') + '</span>'
      : '<svg><use href="#i-durdur"/></svg>';
  }

  $('sesDinle').addEventListener('click', function () { if (taslakSes) oynat(taslakSes.blob, $('sesDinle')); });
  $('sesYeniden').addEventListener('click', function () {
    if (dinleyici) { dinleyici.durdur(); dinleyici = null; }
    taslakSes = null; sesDurumu('hazir');
  });
  $('sesEkle').addEventListener('click', function () {
    if (dinleyici) { dinleyici.durdur(); dinleyici = null; }
    ses = taslakSes;
    taslakSes = null;
    perdeKapat($('sesPerde'));
    sesEkGuncelle();
  });
  function sesPerdesiKapaniyor() {
    if (kayit) {
      var k = kayit; kayit = null;
      clearInterval(k.zaman);
      k.kaydedici.onstop = null;
      try { k.kaydedici.stop(); } catch (e) { /* yok */ }
      k.akis.getTracks().forEach(function (tr) { tr.stop(); });
      if (k.ses && k.ses.close) k.ses.close().catch(function () {});
    }
    if (dinleyici) { dinleyici.durdur(); dinleyici = null; }
  }
  function sesEkGuncelle() {
    $('sesEk').hidden = !ses;
    $('sesAc').hidden = !!ses;
    if (ses) $('sesEkSure').textContent = sureYaz(ses.sure);
    ozetGuncelle();
  }
  $('sesEkOynat').addEventListener('click', function () { if (ses) oynat(ses.blob, $('sesEkOynat')); });
  $('sesEkSil').addEventListener('click', function () {
    if (dinleyici) { dinleyici.durdur(); dinleyici = null; }
    ses = null; sesEkGuncelle();
  });

  // =============================================================
  //  GÖNDERİM
  // =============================================================
  var ekranKilidi = null;
  function ekraniAcikTut(ac) {
    if (!('wakeLock' in navigator)) return;
    if (ac && !ekranKilidi) {
      navigator.wakeLock.request('screen').then(function (k) {
        ekranKilidi = k;
        k.addEventListener('release', function () { ekranKilidi = null; });
      }).catch(function () {});
    } else if (!ac && ekranKilidi) {
      ekranKilidi.release().catch(function () {}); ekranKilidi = null;
    }
  }
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && yuklemeSuruyor) ekraniAcikTut(true);
  });
  window.addEventListener('beforeunload', function (e) {
    if (!yuklemeSuruyor) return;
    e.preventDefault();
    e.returnValue = t('cikisUyari');
    return t('cikisUyari');
  });

  var yukleyici = null;
  var satirlar = {};

  $('gonder').addEventListener('click', function () {
    if (!misafir) { perdeSonrasi = gonderimBaslat; isimPerdesiAc(); return; }
    gonderimBaslat();
  });

  function gonderimBaslat() {
    var hazir = secilenler.filter(function (s) { return s.durum === 'hazir'; });
    var notMetni = $('notGirdi').value.trim();
    if (!hazir.length && !notMetni && !ses) return;

    // Önce fotoğraflar (hızlı biter), sonra videolar, en son sesli mesaj
    hazir.sort(function (a, b) { return (a.tur === 'video') - (b.tur === 'video'); });
    var foto = 0, vid = 0;
    var ogeler = hazir.map(function (s) {
      var o = {
        id: s.id, tur: s.tur, tip: s.tip, ad: s.ad, dosya: s.dosya, kucuk: s.kucuk,
        baslik: s.tur === 'photo' ? t('tFoto', { n: ++foto }) : t('tVideo', { n: ++vid })
      };
      if (s.tur === 'photo') o.hazirla = function () { return fotoHazirla(o); };
      return o;
    });
    var sesOge = null;
    if (ses) {
      sesOge = { id: uid(), tur: 'audio', tip: ses.tip, ad: 'sesli-mesaj' + sesUzanti(ses.tip), blob: ses.blob, boyut: ses.blob.size, sesKayit: ses, baslik: t('tSes') };
      ogeler.push(sesOge);
    }
    var notOge = (notMetni || sesOge) ? { id: uid(), tur: 'not', metin: notMetni, baslik: t('tNot'), durum: 'bekliyor', nonce: uid() } : null;

    var gonderim = { ogeler: ogeler, sesOge: sesOge, notOge: notOge, notMetni: notMetni };
    aktifGonderim = gonderim;

    satirlar = {};
    $('yuklemeListesi').innerHTML = '';
    ogeler.forEach(satirEkle);
    if (notOge && notMetni) satirEkle(notOge);
    $('yuklemeEylem').hidden = true;
    $('cevrimdisi').hidden = true;
    $('yuklemeBaslik').textContent = t('yukleniyorBaslik');
    $('yuklemeAlt').textContent = t('yukleniyorAlt');

    yuklemeSuruyor = true;
    ekraniAcikTut(true);
    goster('yukleme');

    yukleyici = new Yukleyici({
      misafir: misafirApi,
      olay: function (tur, oge) {
        if (tur === 'cevrimdisi') { $('cevrimdisi').hidden = !oge; return; }
        if (tur === 'durum' || tur === 'ilerleme') satirGuncelle(oge);
        genelGuncelle();
      }
    });
    if (ogeler.length) yukleyici.ekle(ogeler);
    turTamamla(gonderim);
  }

  function turTamamla(gonderim) {
    var bekleme = gonderim.ogeler.length ? yukleyici.bekle() : Promise.resolve();
    bekleme.then(function () { return notGonder(gonderim); }).then(function () {
      var hatali = gonderim.ogeler.filter(function (o) { return o.durum === 'hata'; });
      var notHatali = gonderim.notOge && gonderim.notOge.durum === 'hata';
      if (!hatali.length && !notHatali) return gonderimBitti(gonderim);

      yuklemeSuruyor = false;
      ekraniAcikTut(false);
      $('yuklemeBaslik').textContent = t('hataBaslik');
      $('yuklemeAlt').textContent = t('hataAlt');
      $('yuklemeEylem').hidden = false;
      $('cevrimdisi').hidden = true;
      tumSatirlariGuncelle(gonderim); // "Tekrar dene" düğmeleri görünsün
      var ilkHata = document.querySelector('.satir--hata');
      if (ilkHata) setTimeout(function () { ilkHata.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 150);
      var hatalar = hatali.map(function (o) { return o.hata && o.hata.kod; });
      if (hatalar.indexOf('depolama_dolu') >= 0) bildirim(t('eDepolama'), true);
      else if (hatalar.indexOf('yuklemeler_kapali') >= 0) bildirim(t('eKapali'), true);
    });
  }

  function tumSatirlariGuncelle(g) {
    g.ogeler.forEach(satirGuncelle);
    if (g.notOge) satirGuncelle(g.notOge);
  }

  /** Hatalı öğeleri (hepsini ya da tek birini) yeniden gönderir */
  function tekrarBaslat(g, tekOge) {
    $('yuklemeEylem').hidden = true;
    $('yuklemeBaslik').textContent = t('yukleniyorBaslik');
    $('yuklemeAlt').textContent = t('yukleniyorAlt');
    yuklemeSuruyor = true;
    ekraniAcikTut(true);
    var notTekrar = g.notOge && g.notOge.durum === 'hata' && (!tekOge || tekOge === g.notOge);
    if (notTekrar) g.notOge.durum = 'bekliyor';
    if (!tekOge) yukleyici.hepsiniTekrarDene();
    else if (tekOge.tur !== 'not') yukleyici.tekrarDene(tekOge);
    tumSatirlariGuncelle(g);
    turTamamla(g);
  }

  $('hepsiniTekrar').addEventListener('click', function () { if (aktifGonderim) tekrarBaslat(aktifGonderim); });
  $('bunlarsizBitir').addEventListener('click', function () { if (aktifGonderim) gonderimBitti(aktifGonderim); });

  function notGonder(g) {
    var n = g.notOge;
    if (!n || n.durum === 'bitti') return Promise.resolve();
    var sesId = g.sesOge && g.sesOge.durum === 'bitti' ? g.sesOge.dosyaId : '';
    if (!n.metin && !sesId) { n.durum = g.sesOge && g.sesOge.durum === 'hata' ? 'atlandi' : 'bitti'; return Promise.resolve(); }
    // Sesli mesaj henüz gönderilemediyse ve yazılı not varsa: notu ses gelene kadar bekletme, sonra ekle
    if (g.sesOge && g.sesOge.durum === 'hata' && n.metin) { /* yazılı notu yine de gönder */ }
    n.durum = 'yukleniyor';
    satirGuncelle(n);
    return Api.gonder({ action: 'note', guest: misafirApi(), text: n.metin, voiceId: sesId, nonce: n.nonce + (sesId ? '-s' : '') }, { deneme: 4 })
      .then(function () {
        n.durum = 'bitti';
        n.sesId = sesId;
        satirGuncelle(n);
      }, function (e) {
        n.durum = 'hata';
        n.hata = e;
        satirGuncelle(n);
      });
  }

  function gonderimBitti(g) {
    yuklemeSuruyor = false;
    ekraniAcikTut(false);
    var simdi = Date.now();
    var basarili = g.ogeler.filter(function (o) { return o.durum === 'bitti'; });
    var kayitlar = basarili.map(function (o) {
      var k = { tur: o.tur, at: simdi, boyut: o.boyut || 0, kucuk: o.kucuk || null };
      if (o.tur === 'audio') { k.ses = o.blob; k.sure = o.sesKayit.sure; }
      return k;
    });
    if (g.notOge && g.notOge.durum === 'bitti' && g.notMetni) kayitlar.push({ tur: 'not', at: simdi, metin: g.notMetni });
    Arsiv.ekle(kayitlar).then(arsivSayisiGuncelle);

    // Gönderilenleri seçimden çıkar; gönderilemeyenler seçili kalsın
    var bitenIdler = basarili.map(function (o) { return o.id; });
    secilenler.slice().forEach(function (s) { if (bitenIdler.indexOf(s.id) >= 0) ogeKaldir(s); });
    if (g.notOge && g.notOge.durum === 'bitti') { $('notGirdi').value = ''; $('notGirdi').style.height = ''; $('notSayac').textContent = '0 / 1000'; }
    if (g.sesOge && g.sesOge.durum === 'bitti') { ses = null; sesEkGuncelle(); }
    $('reddedilenler').innerHTML = '';
    ozetGuncelle();

    var dosyaSayisi = basarili.filter(function (o) { return o.tur !== 'audio'; }).length;
    var seyler = [];
    if (dosyaSayisi) seyler.push(t('sAni', { n: dosyaSayisi }));
    if (g.notOge && g.notOge.durum === 'bitti' && g.notMetni) seyler.push(t('sNot'));
    if (g.sesOge && g.sesOge.durum === 'bitti') seyler.push(t('sSes'));

    $('tesekkurBaslik').textContent = t('tesekkurBaslik', { ad: ilkAd() });
    $('tesekkurYazi').textContent = seyler.length ? t('tesekkurYazi', { isimler: isimler(), seyler: listeBirlestir(seyler) }) : '';
    // Yükleme ekranını geçmişten çıkar: geri tuşu paylaş ekranına dönsün
    history.replaceState({ ekran: 'paylas' }, '');
    aktifEkran = 'paylas';
    goster('tesekkur');
  }

  function satirEkle(o) {
    var li = document.createElement('li');
    li.className = 'satir';
    var resim = '';
    if (o.kucuk) {
      o._kucukUrl = URL.createObjectURL(o.kucuk);
      resim = '<img alt="" src="' + o._kucukUrl + '">';
    } else {
      resim = '<svg><use href="#' + ({ video: 'i-video', audio: 'i-mikrofon', not: 'i-dal' }[o.tur] || 'i-galeri') + '"/></svg>';
    }
    li.innerHTML =
      '<div class="satir__resim">' + resim + '</div>' +
      '<div class="satir__govde">' +
        '<div class="satir__ust"><span class="satir__ad"></span><span class="satir__yuzde"></span></div>' +
        '<div class="satir__ray"><span class="satir__dolu"></span></div>' +
        '<div class="satir__alt"><span class="satir__durum"></span></div>' +
      '</div>';
    li.querySelector('.satir__ad').textContent = o.baslik;
    $('yuklemeListesi').appendChild(li);
    satirlar[o.id] = li;
    satirGuncelle(o);
  }

  function satirGuncelle(o) {
    var li = satirlar[o.id];
    if (!li) return;
    var d = o.durum || 'bekliyor';
    var yuzde = d === 'bitti' ? 100 : (o.boyut ? Math.floor(100 * Math.min(1, (o.anlik || 0) / o.boyut)) : 0);
    if (o.tur === 'not') yuzde = d === 'bitti' ? 100 : d === 'yukleniyor' ? 50 : 0;
    li.classList.toggle('satir--bitti', d === 'bitti');
    li.classList.toggle('satir--hata', d === 'hata');
    li.querySelector('.satir__dolu').style.width = yuzde + '%';
    li.querySelector('.satir__yuzde').textContent = d === 'yukleniyor' && o.tur !== 'not' ? '%' + yuzde : (o.boyut && d !== 'hata' ? boyutYaz(o.boyut) : '');
    var durumMetni = { bekliyor: t('dBekliyor'), hazirlaniyor: t('dHazirlaniyor'), yukleniyor: t('dYukleniyor'), bitti: t('dBitti'), hata: t('dHata') }[d] || '';
    if (d === 'hata' && o.hata) {
      var k = o.hata.kod;
      if (k === 'depolama_dolu') durumMetni = t('eDepolama');
      else if (k === 'yuklemeler_kapali') durumMetni = t('eKapali');
    }
    var alt = li.querySelector('.satir__alt');
    alt.querySelector('.satir__durum').textContent = durumMetni;
    var dugme = alt.querySelector('.satir__tekrar');
    if (d === 'hata' && !yuklemeSuruyor) {
      if (!dugme) {
        dugme = document.createElement('button');
        dugme.type = 'button';
        dugme.className = 'satir__tekrar';
        dugme.innerHTML = '<svg><use href="#i-tekrar"/></svg><span></span>';
        dugme.onclick = function () { tekTekrar(o); };
        alt.appendChild(dugme);
      }
      dugme.querySelector('span').textContent = t('tekrarDene');
    } else if (dugme) dugme.remove();

    var resim = li.querySelector('.satir__resim');
    var isaret = resim.querySelector('.satir__isaret');
    if (d === 'bitti' && !isaret) resim.insertAdjacentHTML('beforeend', '<span class="satir__isaret"><svg><use href="#i-tamam"/></svg></span>');
  }

  var aktifGonderim = null;
  function tekTekrar(o) { if (aktifGonderim) tekrarBaslat(aktifGonderim, o); }

  function genelGuncelle() {
    if (!yukleyici) return;
    var t0 = yukleyici.toplam();
    var yuzde = t0.toplam ? Math.floor(100 * t0.yuklenen / t0.toplam) : 0;
    var biten = yukleyici.ogeler.filter(function (o) { return o.durum === 'bitti'; }).length;
    $('genelDolu').style.width = yuzde + '%';
    $('genelYuzde').textContent = '%' + yuzde;
    $('genelCubuk').setAttribute('aria-valuenow', String(yuzde));
    $('genelSayi').textContent = t('genelSayi', { a: sayi(biten), b: sayi(yukleyici.ogeler.length) });
  }

  $('dahaFazla').addEventListener('click', function () { goster('paylas'); });
  $('bosPaylas').addEventListener('click', function () { $('basla').click(); });

  // =============================================================
  //  YÜKLEDİKLERİM
  // =============================================================
  var benimUrller = [];
  function benimkileriCiz() {
    benimUrller.forEach(URL.revokeObjectURL);
    benimUrller = [];
    Arsiv.hepsi().then(function (liste) {
      liste.sort(function (a, b) { return b.at - a.at || b.id - a.id; });
      var gorsel = liste.filter(function (k) { return k.tur === 'photo' || k.tur === 'video'; });
      var yazili = liste.filter(function (k) { return k.tur === 'not' || k.tur === 'audio'; });
      var izgara = $('benimIzgara');
      izgara.innerHTML = '';
      gorsel.forEach(function (k) {
        var li = document.createElement('li');
        li.className = 'izgara__oge' + (k.kucuk ? '' : ' izgara__oge--bos');
        if (k.kucuk) {
          var u = URL.createObjectURL(k.kucuk); benimUrller.push(u);
          li.innerHTML = '<img alt="" loading="lazy" src="' + u + '">';
        } else li.innerHTML = '<svg><use href="#' + (k.tur === 'video' ? 'i-video' : 'i-galeri') + '"/></svg>';
        if (k.tur === 'video') li.insertAdjacentHTML('beforeend', '<span class="izgara__rozet"><svg><use href="#i-oynat"/></svg></span>');
        izgara.appendChild(li);
      });
      var notlar = $('benimNotlar');
      notlar.innerHTML = '';
      var bicim = new Intl.DateTimeFormat(dil === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
      yazili.forEach(function (k) {
        var d = document.createElement('div');
        d.className = 'not-kart';
        if (k.tur === 'not') {
          d.innerHTML = '<p class="not-kart__metin"></p><p class="not-kart__zaman"></p>';
          d.querySelector('.not-kart__metin').textContent = k.metin;
        } else {
          var u = URL.createObjectURL(k.ses); benimUrller.push(u);
          d.innerHTML = '<p class="not-kart__metin"></p><audio controls preload="none"></audio><p class="not-kart__zaman"></p>';
          d.querySelector('.not-kart__metin').textContent = t('sesliMesajiniz') + ' · ' + sureYaz(k.sure || 0);
          d.querySelector('audio').src = u;
        }
        d.querySelector('.not-kart__zaman').textContent = bicim.format(new Date(k.at));
        notlar.appendChild(d);
      });
      $('benimBos').hidden = liste.length > 0;
      $('benimAciklama').textContent = gorsel.length ? t('benimAciklama', { n: sayi(gorsel.length) }) : (liste.length ? t('benimAciklamaNot') : '');
    });
  }

  // =============================================================
  //  KONFETİ — leylak, pudra, altın ve gül kurusu yapraklar
  // =============================================================
  function konfeti() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var c = $('konfeti');
    var ctx = c.getContext('2d');
    var oran = Math.min(2, window.devicePixelRatio || 1);
    var g = c.clientWidth, y = c.clientHeight;
    c.width = g * oran; c.height = y * oran;
    ctx.scale(oran, oran);
    var renkler = ['#B9A4CB', '#CFE0EF', '#C9A257', '#E6DDEE', '#A58898', '#FFFFFF'];
    var parca = [];
    var adet = Math.min(170, Math.round(g * 0.42));
    for (var i = 0; i < adet; i++) {
      var aci = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
      var hiz = 7 + Math.random() * 9;
      parca.push({
        x: g / 2 + (Math.random() - 0.5) * 40, y: y * 0.42,
        vx: Math.cos(aci) * hiz * (0.6 + Math.random() * 0.6), vy: Math.sin(aci) * hiz,
        r: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.3,
        s: 5 + Math.random() * 7, tur: Math.random() < 0.55 ? 0 : 1,
        renk: renkler[(Math.random() * renkler.length) | 0], sal: Math.random() * 10
      });
    }
    var bas = performance.now();
    function kare(simdi) {
      var gecen = simdi - bas;
      ctx.clearRect(0, 0, g, y);
      var sonmeli = gecen > 2600 ? Math.max(0, 1 - (gecen - 2600) / 1400) : 1;
      parca.forEach(function (p) {
        p.vy += 0.2; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx + Math.sin((gecen / 300) + p.sal) * 0.6; p.y += p.vy; p.r += p.vr;
        ctx.save();
        ctx.globalAlpha = sonmeli;
        ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.renk;
        if (p.tur === 0) { // yaprak
          ctx.beginPath(); ctx.ellipse(0, 0, p.s * 0.45, p.s, 0, 0, Math.PI * 2); ctx.fill();
        } else { // şerit
          ctx.scale(1, Math.cos(gecen / 120 + p.sal));
          ctx.fillRect(-p.s / 2, -p.s * 0.22, p.s, p.s * 0.44);
        }
        ctx.restore();
      });
      if (gecen < 4000 && aktifEkran === 'tesekkur') requestAnimationFrame(kare);
      else ctx.clearRect(0, 0, g, y);
    }
    requestAnimationFrame(kare);
  }

  // =============================================================
  //  DİL UYGULA
  // =============================================================
  function dilUygula() {
    document.documentElement.lang = dil;
    document.querySelectorAll('[data-i18n]').forEach(function (e) { e.textContent = t(e.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (e) { e.setAttribute('aria-label', t(e.dataset.i18nAria)); });
    document.querySelectorAll('[data-dil-degistir]').forEach(function (e) { e.textContent = t('dilDugme'); e.setAttribute('aria-label', t('dilAria')); });
    $('ekran-kapak').querySelector('.kapak__dipnot').textContent = t('gizlilik', { isimler: isimler() });
    $('isimAciklama').textContent = t('isimAciklama', { isimler: isimler() });
    kapakGuncelle();
    paylasGuncelle();
    if (aktifEkran === 'benimkiler') benimkileriCiz();
    if (!$('sesPerde').hidden) sesDurumu(kayit ? 'kayit' : taslakSes ? 'bitti' : 'hazir');
  }
  function dilDegistir() {
    dil = dil === 'tr' ? 'en' : 'tr';
    depoYaz('nisan.dil', dil);
    dilUygula();
  }

  // =============================================================
  //  BAŞLAT
  // =============================================================
  history.replaceState({ ekran: 'kapak' }, '');
  kapakFotografi();
  dilUygula();
  arsivSayisiGuncelle();
  bilgiAl();
  // Önceki ziyaretten kalan, tabloya yazılamamış kayıtlar varsa gönder
  if (A.apiUrl) setTimeout(function () { new Yukleyici({ misafir: misafirApi }).kayitlariGonder(); }, 1500);

  window.__nisan = { t: t, durum: function () { return { aktifEkran: aktifEkran, secilenler: secilenler.length, misafir: misafir }; } };
})();
