/*
 * Google Apps Script ile konuşan küçük katman.
 * İstekler "text/plain" gönderilir; böylece tarayıcı ön kontrol (CORS preflight)
 * yapmaz ve Apps Script yanıtı sorunsuz okunur.
 */
(function () {
  'use strict';

  function ApiHatasi(kod, mesaj, tekrarDenenebilir) {
    var e = new Error(mesaj || kod);
    e.kod = kod;
    e.tekrar = !!tekrarDenenebilir;
    return e;
  }

  // window.__testBeklemeCarpani yalnızca otomatik testlerde bekleme sürelerini kısaltmak içindir
  function bekle(ms) { return new Promise(function (r) { setTimeout(r, ms * (window.__testBeklemeCarpani || 1)); }); }

  /** Tek bir POST isteği (XHR — yükleme ilerlemesi okunabilsin diye) */
  function gonderBir(veri, secenek) {
    secenek = secenek || {};
    return new Promise(function (coz, reddet) {
      var url = (window.AYARLAR || {}).apiUrl;
      if (!url) return reddet(ApiHatasi('kurulum_yapilmamis', 'apiUrl boş', false));
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
      xhr.timeout = secenek.zamanAsimi || 60000;
      // DİKKAT: xhr.upload üzerine dinleyici eklemeyin. Eklenirse tarayıcı ön kontrol (OPTIONS)
      // isteği yapar; Apps Script bunu desteklemediği için istek engellenir.
      xhr.onload = function () {
        var yanit = null;
        try { yanit = JSON.parse(xhr.responseText); } catch (e) { /* Google'ın yoğunluk sayfası vb. */ }
        if (!yanit) return reddet(ApiHatasi('gecersiz_yanit', 'HTTP ' + xhr.status, true));
        if (!yanit.ok) {
          var tekrar = yanit.error === 'sunucu_hatasi';
          return reddet(ApiHatasi(yanit.error || 'sunucu_hatasi', yanit.message, tekrar));
        }
        coz(yanit);
      };
      xhr.onerror = function () { reddet(ApiHatasi('baglanti', 'Ağ hatası', true)); };
      xhr.ontimeout = function () { reddet(ApiHatasi('zaman_asimi', 'Zaman aşımı', true)); };
      xhr.send(JSON.stringify(veri));
    });
  }

  /** Geçici hatalarda (yoğunluk, bağlantı) artan aralıklarla yeniden dener */
  function gonder(veri, secenek) {
    secenek = secenek || {};
    var deneme = 0;
    var enFazla = secenek.deneme == null ? 4 : secenek.deneme;
    function dene() {
      return gonderBir(veri, secenek).catch(function (e) {
        if (!e.tekrar || deneme >= enFazla) throw e;
        deneme++;
        var sure = Math.min(15000, 900 * Math.pow(2, deneme - 1)) + Math.random() * 600;
        var cevrimici = navigator.onLine === false ? cevrimiciOlunca() : Promise.resolve();
        return cevrimici.then(function () { return bekle(sure); }).then(dene);
      });
    }
    return dene();
  }

  function cevrimiciOlunca() {
    if (navigator.onLine !== false) return Promise.resolve();
    return new Promise(function (coz) {
      window.addEventListener('online', function f() { window.removeEventListener('online', f); coz(); });
    });
  }

  window.Api = {
    gonder: gonder,
    gonderBir: gonderBir,
    bekle: bekle,
    cevrimiciOlunca: cevrimiciOlunca,
    ApiHatasi: ApiHatasi
  };
})();
