(function(){
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  function createBubble(){
    const el = document.createElement('div');
    el.className = 'bubble';
    const size = Math.floor(40 + Math.random()*160);
    el.style.width = size+'px';
    el.style.height = size+'px';
    el.style.left = Math.floor(Math.random()*100)+'%';
    el.style.bottom = '-'+(20+Math.random()*60)+'px';
    const dur = 12 + Math.random()*22;
    el.style.animationDuration = dur+'s';
    return el;
  }
  (function spawnBubbles(){
    const container = document.getElementById('bubbles');
    if(!container) return;
    for(let i=0;i<10;i++) container.appendChild(createBubble());
    setInterval(()=>{
      const el = createBubble();
      container.appendChild(el);
      setTimeout(()=> el.remove(), 35000);
    }, 3000);
  })();

  const overlay = document.getElementById('overlay');
  const sideMenu = document.getElementById('sideMenu');
  const menuButton = document.getElementById('menuButton');
  const closeMenu = document.getElementById('closeMenu');
  const toast = document.getElementById('toast');

  function openMenu(){
    sideMenu.classList.add('open');
    overlay.classList.add('show');
    sideMenu.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeMenuFn(){
    sideMenu.classList.remove('open');
    overlay.classList.remove('show');
    sideMenu.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  menuButton.addEventListener('click', openMenu);
  closeMenu.addEventListener('click', closeMenuFn);
  overlay.addEventListener('click', closeMenuFn);

  function showToast(message){
    if(!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(()=> toast.classList.remove('show'), 1600);
  }

  function getInitData(){
    if(tg && tg.initData) return tg.initData;
    const urlParams = new URLSearchParams(window.location.search);
    const init = urlParams.get('tgWebAppData') || '';
    return init;
  }

  async function api(path, payload){
    const resp = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if(!resp.ok) throw new Error('Şəbəkə xətası');
    const data = await resp.json();
    if(!data.success) throw new Error(data.error || 'Xəta');
    return data;
  }

  function setUserUI(user){
    const avatar = document.getElementById('userAvatar');
    const nameEl = document.getElementById('userName');
    const usernameEl = document.getElementById('userUsername');
    if(user.photo_url){
      avatar.style.backgroundImage = `url(${user.photo_url})`;
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';
    }
    nameEl.textContent = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'İstifadəçi';
    usernameEl.textContent = user.username ? '@'+user.username : '';
  }

  function setBalancesUI(bal){
    document.getElementById('ticketsValue').textContent = String(bal.tickets ?? 0);
    document.getElementById('adscoinValue').textContent = String(bal.adscoin ?? 0);
    document.getElementById('aznValue').textContent = (Number(bal.azn ?? 0).toFixed(2));
  }

  function setAdCountUI(count){
    document.getElementById('adCount').textContent = String(count);
  }

  function disableAdBtn(disabled){
    const btn = document.getElementById('watchAdBtn');
    btn.disabled = !!disabled;
  }

  async function bootstrap(){
    try{
      if(tg){
        tg.expand();
        tg.enableClosingConfirmation();
        tg.setHeaderColor('#0b0d15');
        tg.setBackgroundColor('#0b0d15');
      }
      const initData = getInitData();
      const initRes = await api('/api/init.php', { init_data: initData });
      setUserUI(initRes.user);
      setBalancesUI(initRes.balance);
      setAdCountUI(initRes.ad.viewed_today);
      disableAdBtn(initRes.ad.viewed_today >= 20);
    }catch(e){
      console.error(e);
      showToast('Xəta baş verdi');
    }
  }

  const watchBtn = document.getElementById('watchAdBtn');
  const progressBar = document.getElementById('progressBar');

  function resetProgress(){
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        progressBar.style.transition = 'width 8s linear';
      });
    });
  }

  async function handleWatch(){
    try{
      disableAdBtn(true);
      resetProgress();
      requestAnimationFrame(()=>{
        progressBar.style.width = '100%';
      });
      const waitMs = 8000; // 8s within 7-10s range
      await new Promise(r=> setTimeout(r, waitMs));
      const initData = getInitData();
      const res = await api('/api/watch_ad.php', { init_data: initData });
      setBalancesUI(res.balance);
      setAdCountUI(res.ad.viewed_today);
      showToast('✅ Təsdiqləndi');
      if(res.ad.viewed_today < 20){
        disableAdBtn(false);
      }
    }catch(e){
      console.error(e);
      showToast('❌ Xəta');
      disableAdBtn(false);
    }finally{
      setTimeout(()=>{
        progressBar.style.transition = 'width .25s ease';
        progressBar.style.width = '0%';
      }, 800);
    }
  }

  watchBtn.addEventListener('click', handleWatch);

  bootstrap();
})();