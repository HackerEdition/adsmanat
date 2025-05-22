const totalAds = 20;
let watchedAds = 0;

const progressBar = document.getElementById('adsProgressBar');
const watchBtn = document.getElementById('adsWatchBtn');
const balanceCoins = document.getElementById('balanceCoins');

watchBtn.addEventListener('click', () => {
  // Əgər qazanc alınmaq üçün düymədirsə:
  if (watchedAds >= totalAds) {
    alert('Qazancınız balansınıza əlavə edildi!');
    
    // Balansı artır (20 coins əlavə et)
    let currentCoins = parseInt(balanceCoins.textContent) || 0;
    currentCoins += 20;
    balanceCoins.textContent = currentCoins + ' ADS COIN';

    // Progress bar sıfırla, reklam sayını sıfırla
    watchedAds = 0;
    progressBar.style.width = '0%';

    // Düyməni yenidən reklam izləməyə hazırla
    watchBtn.textContent = 'REKLAMI İZLƏ';
    watchBtn.disabled = false;

    return;
  }

  // Reklam izləmə simulyasiyası (normalda reklam bitməyi gözləyəcəksən)
  watchedAds++;
  const progressPercent = (watchedAds / totalAds) * 100;
  progressBar.style.width = progressPercent + '%';

  // Müvəqqəti balans göstərmə (hələ əlavə olunmayıb)
  balanceCoins.textContent = (parseInt(balanceCoins.textContent) || 0) + 1 + ' ADS COIN';

  // Əgər 20 reklama çatılıbsa
  if (watchedAds >= totalAds) {
    watchBtn.textContent = 'QAZANCI AL';
  }
});
