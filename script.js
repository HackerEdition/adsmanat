window.addEventListener("load", () => {
  const tg = window.Telegram.WebApp;
  const user = tg.initDataUnsafe.user;

  // Spinner göstərilir
  setTimeout(() => {
    document.getElementById("loading-spinner").style.display = "none";
    document.getElementById("app").classList.remove("hidden");

    if (user) {
      document.getElementById("firstname").textContent = "Ad: " + user.first_name;
      document.getElementById("username").textContent = "İstifadəçi: @" + user.username;
    } else {
      document.getElementById("firstname").textContent = "Ad: Təyin olunmayıb";
      document.getElementById("username").textContent = "İstifadəçi: Təyin olunmayıb";
    }
  }, 1200); // Spinner 1.2 saniyə görünür
});
