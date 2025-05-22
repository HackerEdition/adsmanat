const totalAds = 20;
let watchedAds = 0;
let currentCoins = parseInt(localStorage.getItem('ads_coins')) || 0;

const progressBar = document.getElementById('adsProgressBar');
const watchBtn = document.getElementById('adsWatchBtn');
const balanceCoins = document.getElementById('balanceCoins');

// Başlanğıc balansı göstər
balanceCoins.textContent = currentCoins + ' ADS COIN';

// Telegram məlumatı
window.Telegram.WebApp.ready();
const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

if (user) {
  document.getElementById('telegramName').textContent = user.first_name || "İstifadəçi";
  document.getElementById('telegramUsername').textContent = user.username ? "@" + user.username : "";
} else {
  document.getElementById('telegramName').textContent = "İstifadəçi";
  document.getElementById('telegramUsername').textContent = "";
}

// Reklam düyməsinə klik olanda
watchBtn.addEventListener('click', () => {
  if (watchedAds >= totalAds) {
    alert('Qazancınız balansınıza əlavə edildi!');

    currentCoins += 20;
    balanceCoins.textContent = currentCoins + ' ADS COIN';
    localStorage.setItem('ads_coins', currentCoins);

    watchedAds = 0;
    progressBar.style.width = '0%';
    watchBtn.textContent = 'REKLAMI İZLƏ';
    watchBtn.disabled = false;
    return;
  }

  // Reklamı göstər
  window.onclick_6075969(); // Spot ID reklamı göstərir

  // Reklamdan sonra 5 saniyə gözləyib irəlilə
  setTimeout(() => {
    watchedAds++;
    const progressPercent = (watchedAds / totalAds) * 100;
    progressBar.style.width = progressPercent + '%';

    if (watchedAds >= totalAds) {
      watchBtn.textContent = 'QAZANCI AL';
    }
  }, 5000); // Reklam bitmə vaxtına uyğun dəyişə bilər
});
