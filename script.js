const totalAds = 20;
const progressBar = document.getElementById('adsProgressBar');
const watchBtn = document.getElementById('adsWatchBtn');
const balanceCoins = document.getElementById('balanceCoins');

// LocalStorage-dan balans və tarixə görə reklam baxışlarını oxu
let currentCoins = parseInt(localStorage.getItem('adsCoins')) || 0;
let savedDate = localStorage.getItem('adsDate');
let today = new Date().toLocaleDateString(); // günlük

let watchedAds = 0;

if (savedDate === today) {
  watchedAds = parseInt(localStorage.getItem('watchedAds')) || 0;
} else {
  // Yeni gün başlayıbsa sıfırla
  localStorage.setItem('adsDate', today);
  localStorage.setItem('watchedAds', '0');
  watchedAds = 0;
}

// Balansı göstər
balanceCoins.textContent = currentCoins + ' ADS COIN';

// Proqress bar vəziyyətini yüklə
progressBar.style.width = (watchedAds / totalAds * 100) + '%';

if (watchedAds >= totalAds) {
  watchBtn.textContent = 'Limitə çatdınız';
  watchBtn.disabled = true;
}

// Telegram WebApp
window.Telegram.WebApp.ready();

// Telegram istifadəçi məlumatı
const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

if (user) {
  document.getElementById('telegramName').textContent = user.first_name || "İstifadəçi";
  document.getElementById('telegramUsername').textContent = user.username ? "@" + user.username : "";
} else {
  document.getElementById('telegramName').textContent = "İstifadəçi";
  document.getElementById('telegramUsername').textContent = "";
}

// Reklam SDK (OnClicka Spot ID: 6075969)
window.initCdTma?.({ id: 6075969 })
  .then(show => {
    window.showAd = show;
  })
  .catch(e => console.error("Reklam SDK xətası:", e));

// REKLAMI İZLƏ düyməsi
watchBtn.addEventListener('click', () => {
  if (!window.showAd) {
    alert("Reklam hazır deyil. Birazdan yenidən cəhd edin.");
    return;
  }

  if (watchedAds >= totalAds) {
    alert("Bu gün üçün reklam limitinə çatmısınız.");
    return;
  }

  window.showAd()
    .then(() => {
      watchedAds++;
      localStorage.setItem('watchedAds', watchedAds.toString());
      progressBar.style.width = (watchedAds / totalAds * 100) + '%';

      if (watchedAds >= totalAds) {
        // Günlük limitə çatdı
        currentCoins += 20;
        localStorage.setItem('adsCoins', currentCoins);
        balanceCoins.textContent = currentCoins + ' ADS COIN';

        watchBtn.textContent = 'Limitə çatdınız';
        watchBtn.disabled = true;

        alert("20 ADS COIN qazandınız!");
      } else {
        watchBtn.textContent = 'REKLAMI DAVAM ET';
      }
    })
    .catch(e => {
      console.error("Reklam göstərilə bilmədi:", e);
      alert("Reklam yüklənmədi. Birazdan yenidən cəhd edin.");
    });
});
