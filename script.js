const totalAds = 20;
let watchedAds = 0;

const progressBar = document.getElementById('adsProgressBar');
const watchBtn = document.getElementById('adsWatchBtn');
const balanceCoins = document.getElementById('balanceCoins');

watchBtn.addEventListener('click', () => {
  // Simulyasiya üçün reklam izləmə funksiyası:
  // Normalda burada reklamın bitməsi və təsdiqlənməsi olacaq

  watchedAds++;

  // Progress barı yenilə
  const progressPercent = (watchedAds / totalAds) * 100;
  progressBar.style.width = progressPercent + '%';

  // Balansı yenilə (hər reklam üçün 1 coin nəzərdə tutulur)
  balanceCoins.textContent = watchedAds + ' ADS COIN';

  // 20 reklam izlənibsə
  if (watchedAds >= totalAds) {
    watchBtn.textContent = 'QAZANCI AL';
  }
});

watchBtn.addEventListener('click', () => {
  if (watchedAds >= totalAds) {
    alert('Qazancınız balansınıza əlavə edildi!');
    // Burada qazancı serverə göndərmək, bazaya yazmaq və s. kod gəlir.
    
    // Məsələn, balans sıfırlansın və progress yenilənsin
    watchedAds = 0;
    progressBar.style.width = '0%';
    balanceCoins.textContent = '0 ADS COIN';
    watchBtn.textContent = 'REKLAMI İZLƏ';
  }
});
