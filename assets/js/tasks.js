(() => {
	const TASK_KEY = 'daily_shortlink_1';
	const PANEL_KEY = 'adsmanat_panel_open_task';
	const shortlinkBase = 'https://example.com/your-short-link'; // TODO: replace with real short link base

	const shortlink = document.getElementById('shortlink-go');
	const panel = document.getElementById('code-panel');
	const input = document.getElementById('code-input');
	const btnCancel = document.getElementById('btn-cancel');
	const btnConfirm = document.getElementById('btn-confirm');

	function openPanel() {
		panel.classList.add('visible');
		localStorage.setItem(PANEL_KEY, TASK_KEY);
		setTimeout(() => input.focus(), 50);
	}
	function closePanel() {
		panel.classList.remove('visible');
		localStorage.removeItem(PANEL_KEY);
		input.value = '';
	}

	function buildShortUrl() {
		const params = new URLSearchParams();
		params.set('task_key', TASK_KEY);
		const ident = getIdentityPayload();
		if (ident.tg_id) params.set('tg', String(ident.tg_id));
		if (ident.client_id) params.set('cid', ident.client_id);
		return shortlinkBase + (shortlinkBase.includes('?') ? '&' : '?') + params.toString() + `#verify`;
	}

	shortlink.addEventListener('click', () => {
		// Keep panel open while user goes through short link
		openPanel();
		// Update href w/ identity so verification.html can generate a code for this user
		shortlink.href = buildShortUrl();
	});

	btnCancel.addEventListener('click', () => {
		closePanel();
		showBanner('Ləğv edildi', 'error');
	});

	btnConfirm.addEventListener('click', async () => {
		const raw = (input.value || '').toUpperCase().replace(/\s+/g, '');
		if (!/^[A-Z0-9]{6,12}$/.test(raw)) {
			showBanner('Yanlış kod formatı', 'error');
			return;
		}
		btnConfirm.disabled = true;
		try {
			const payload = Object.assign({ task_key: TASK_KEY, code: raw }, getIdentityPayload());
			const res = await apiFetch('/api/verify_code.php', payload);
			if (res.ok) {
				showBanner('Təsdiqləndi ✅', 'success');
				closePanel();
			} else {
				showBanner('Xəta: ' + (res.error || 'naməlum'), 'error');
			}
		} catch (e) {
			showBanner('Xəta: ' + (e.message || 'istək uğursuz oldu'), 'error');
		} finally {
			btnConfirm.disabled = false;
		}
	});

	// Persist panel state across reload/back from external browser
	if (localStorage.getItem(PANEL_KEY) === TASK_KEY) {
		openPanel();
	}

	// Initialize link href on load
	shortlink.href = buildShortUrl();
})();

