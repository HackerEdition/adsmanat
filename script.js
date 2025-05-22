// Reklam izləmə üçün dəyişənlər
const totalAds = 20;
let watchedAds = 0;

const progressBar = document.getElementById('adsProgressBar');
const watchBtn = document.getElementById('adsWatchBtn');
const balanceCoins = document.getElementById('balanceCoins');

// LocalStorage-dan balansı yüklə
let currentCoins = parseInt(localStorage.getItem('ads_coins')) || 0;
balanceCoins.textContent = currentCoins + ' ADS COIN';

watchBtn.addEventListener('click', () => {
  if (watchedAds >= totalAds) {
    alert('Qazancınız balansınıza əlavə edildi!');

    // Balansı artır (20 coins əlavə et)
    currentCoins += 20;
    balanceCoins.textContent = currentCoins + ' ADS COIN';

    // Balansı localStorage-da yadda saxla
    localStorage.setItem('ads_coins', currentCoins);

    watchedAds = 0;
    progressBar.style.width = '0%';

    watchBtn.textContent = 'REKLAMI İZLƏ';
    watchBtn.disabled = false;

    return;
  }

  // Reklam izləmə simulyasiyası
  watchedAds++;
  const progressPercent = (watchedAds / totalAds) * 100;
  progressBar.style.width = progressPercent + '%';

  if (watchedAds >= totalAds) {
    watchBtn.textContent = 'QAZANCI AL';
  }
});

// Telegram WebApp hazır olduqda işə düşür
window.Telegram.WebApp.ready();

// Telegram istifadəçi məlumatlarını əldə edirik
const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

if (user) {
  // İstifadəçi məlumatı varsa, ad və username göstər
  document.getElementById('telegramName').textContent = user.first_name || "İstifadəçi";
  if (user.username) {
    document.getElementById('telegramUsername').textContent = "@" + user.username;
  } else {
    document.getElementById('telegramUsername').textContent = "";
  }
} else {
  // İstifadəçi məlumatı yoxdursa default göstər
  document.getElementById('telegramName').textContent = "İstifadəçi";
  document.getElementById('telegramUsername').textContent = "";
}
