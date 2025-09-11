/* Common helpers for ADSMANAT webapp */

function getTelegramUser() {
	try {
		if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
			return window.Telegram.WebApp.initDataUnsafe.user;
		}
	} catch (e) {}
	return null;
}

function getClientId() {
	const key = 'adsmanat_client_id';
	let cid = localStorage.getItem(key);
	if (!cid) {
		cid = 'cid_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
		localStorage.setItem(key, cid);
	}
	return cid;
}

async function apiFetch(path, body) {
	const res = await fetch(path, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body || {})
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		throw new Error((data && data.error) || 'request_failed');
	}
	return data;
}

function getIdentityPayload() {
	const tg = getTelegramUser();
	if (tg && tg.id) {
		return { tg_id: tg.id };
	}
	return { client_id: getClientId() };
}

function showBanner(message, type) {
	const banner = document.createElement('div');
	banner.className = `banner banner-${type || 'info'}`;
	banner.textContent = message;
	document.body.appendChild(banner);
	setTimeout(() => { banner.classList.add('visible'); }, 10);
	setTimeout(() => { banner.classList.remove('visible'); banner.remove(); }, 4000);
}

