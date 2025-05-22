window.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram.WebApp;
  const user = tg.initDataUnsafe.user;

  if (user) {
    document.getElementById("tg-name").textContent = user.first_name + (user.last_name ? " " + user.last_name : "");
    document.getElementById("tg-username").textContent = user.username ? "@" + user.username : "@username yoxdur";
    document.getElementById("profile-image").src = `https://t.me/i/userpic/320/${user.id}.jpg`;

    // Spinneri gizlət, profili göstər
    document.getElementById("loader").style.display = "none";
    document.getElementById("profile-box").style.display = "flex";
  } else {
    alert("Telegram istifadəçi məlumatı tapılmadı.");
  }
});
