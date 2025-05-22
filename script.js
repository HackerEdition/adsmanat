<script>
  // Reklam izləmə üçün dəyişənlər
  const totalAds = 20;
  let watchedAds = 0;

  const progressBar = document.getElementById('adsProgressBar');
  const watchBtn = document.getElementById('adsWatchBtn');
  const balanceCoins = document.getElementById('balanceCoins');

  watchBtn.addEventListener('click', () => {
    if (watchedAds >= totalAds) {
      alert('Qazancınız balansınıza əlavə edildi!');

      // Balansı artır (20 coins əlavə et)
      let currentCoins = parseInt(balanceCoins.textContent) || 0;
      currentCoins += 20;
      balanceCoins.textContent = currentCoins + ' ADS COIN';

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
    // Əgər istifadəçi məlumatı varsa, ad və username göstər
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
</script>
