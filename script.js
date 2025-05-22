const totalAds = 20;
const progressBar = document.getElementById('adsProgressBar');
const watchBtn = document.getElementById('adsWatchBtn');
const balanceCoins = document.getElementById('balanceCoins');

let watchedAds = 0;
let currentCoins = 0;
let userId = null;

// Telegram WebApp istifadəçisini al
window.Telegram.WebApp.ready();
const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

if (user) {
  userId = user.id;
  document.getElementById('telegramName').textContent = user.first_name || "İstifadəçi";
  document.getElementById('telegramUsername').textContent = user.username ? "@" + user.username : "";

  // PHP ilə serverdən istifadəçi məlumatlarını yüklə
  fetch('get_user_data.php?id=' + userId)
    .then(res => res.json())
    .then(data => {
      watchedAds = data.ad_views || 0;
      currentCoins = data.coin_balance || 0;

      balanceCoins.textContent = currentCoins + ' ADS COIN';
      document.querySelector('.balance-azn').textContent = (currentCoins / 10000).toFixed(2) + ' AZN';

      progressBar.style.width = (watchedAds / totalAds * 100) + '%';

      if (watchedAds >= totalAds) {
        watchBtn.textContent = 'Limitə çatdınız';
        watchBtn.disabled = true;
      }
    });
}

// Reklam SDK (OnClicka ilə işləyir)
window.initCdTma?.({ id: 6075969 })
  .then(show => {
    window.showAd = show;
  })
  .catch(e => console.error("Reklam SDK xətası:", e));

// REKLAMI İZLƏ düyməsi işləsin
watchBtn.addEventListener('click', () => {
  if (!window.showAd) return alert("Reklam hazır deyil.");
  if (watchedAds >= totalAds) return alert("Limitə çatmısınız.");

  window.showAd()
    .then(() => {
      watchedAds++;
      let earned = 0;

      if (watchedAds >= totalAds) {
        earned = 20;
        currentCoins += earned;

        watchBtn.textContent = 'Limitə çatdınız';
        watchBtn.disabled = true;
      }

      progressBar.style.width = (watchedAds / totalAds * 100) + '%';
      balanceCoins.textContent = currentCoins + ' ADS COIN';
      document.querySelector('.balance-azn').textContent = (currentCoins / 10000).toFixed(2) + ' AZN';

      // PHP-ə məlumat göndər
      fetch('update_user_data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          ad_views: watchedAds,
          coin_balance: currentCoins
        })
      });

      if (earned > 0) {
        alert("20 ADS COIN qazandınız!");
      } else {
        watchBtn.textContent = 'REKLAMI DAVAM ET';
      }
    });
});
