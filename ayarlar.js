/*
 * ============================================================
 *  AYARLAR — Siteyle ilgili değiştirmek isteyeceğiniz her şey burada.
 *  Değiştirdikten sonra GitHub'da "Commit changes" deyin; 1-2 dakika
 *  içinde site güncellenir.
 * ============================================================
 */
window.AYARLAR = {
  // Google Apps Script "Web uygulaması URL'si" (kurulum rehberi 3. adım)
  // Örnek: 'https://script.google.com/macros/s/AKfycb.../exec'
  apiUrl: 'https://script.google.com/macros/s/AKfycbwLdycW1OyABQtVY1Y4ofhy1V9e0IYr-wj5510MmxFw3wPDcNHUoWBGHxdrUTijhkv1dQ/exec',

  // Çiftin isimleri
  isim1: 'Sude Sıla',
  isim2: 'Recep Yusuf',

  // Etkinlik tarihi ve saati (Türkiye saati). Biçim: YYYY-AA-GGTSS:DD
  tarih: '2027-01-30T19:00',

  // Karşılama ekranındaki üst yazı
  etkinlik: { tr: 'Nişanımıza hoş geldiniz', en: 'Welcome to our engagement' },

  // Kapak fotoğrafı (assets/img klasöründe). Fotoğraf istemezseniz '' yazın.
  kapakFotografi: 'assets/img/kapak.jpg',

  // Fotoğrafta yüzlerin kadrajda kalması için dikey konum (0% = üst, 100% = alt)
  kapakOdak: '50% 30%',

  // Sınırlar
  maxVideoDakika: 5,     // Bu süreden uzun videolar kabul edilmez
  maxSesDakika: 2        // Sesli mesajın en uzun süresi
};
