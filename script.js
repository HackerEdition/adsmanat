// Reklam izləmə üçün dəyişənlər
const totalAds = 20;
let watchedAds = 0;

const progressBar = document.getElementById('adsProgressBar');
const watchBtn = document.getElementById('adsWatchBtn');
const balanceCoins = document.getElementById('balanceCoins');

// LocalStorage-dan balansı oxu
let currentCoins = parseInt(localStorage.getItem('adsCoins')) || 0;
balanceCoins.textContent = currentCoins + ' ADS COIN';

// Telegram WebApp hazır olduqda işə düşür
window.Telegram.WebApp.ready();

// Telegram istifadəçi məlumatlarını əldə edirik
const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

if (user) {
  document.getElementById('telegramName').textContent = user.first_name || "İstifadəçi";
  document.getElementById('telegramUsername').textContent = user.username ? "@" + user.username : "";
} else {
  document.getElementById('telegramName').textContent = "İstifadəçi";
  document.getElementById('telegramUsername').textContent = "";
}

// Reklam SDK-nı başladın (Spot ID: 6075969)
window.initCdTma?.({ id: 6075969 })
  .then(show => {
    window.showAd = show;
  })
  .catch(e => console.error("Reklam SDK xətası:", e));

// Reklam düyməsinə klik hadisəsi
watchBtn.addEventListener('click', () => {
  if (!window.showAd) {
    alert("Reklam hazır deyil. Birazdan yenidən cəhd edin.");
    return;
  }

  window.showAd()
    .then(() => {
      watchedAds++;

      const progressPercent = (watchedAds / totalAds) * 100;
      progressBar.style.width = progressPercent + '%';

      if (watchedAds >= totalAds) {
        currentCoins += 20; // 20 coin əlavə et
        balanceCoins.textContent = currentCoins + ' ADS COIN';
        localStorage.setItem('adsCoins', currentCoins); // yadda saxla

        alert("20 ADS COIN qazandınız!");

        watchedAds = 0;
        progressBar.style.width = '0%';
        watchBtn.textContent = 'REKLAMI İZLƏ';
      } else {
        watchBtn.textContent = 'REKLAMI DAVAM ET';
      }
    })
    .catch((e) => {
      console.error("Reklam göstərilə bilmədi:", e);
      alert("Reklam yüklənmədi. Birazdan yenidən cəhd edin.");
    });
});
