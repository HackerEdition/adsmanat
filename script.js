// Spinner yüklənmə işarəsi üçün
window.addEventListener('load', () => {
  // İnternet sürətinə bağlı olaraq 2 saniyə sonra spinner yox olur, əsas məzmun göstərilir
  setTimeout(() => {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('app').style.display = 'block';
  }, 2000);
});
