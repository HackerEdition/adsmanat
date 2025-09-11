(async () => {
	function getParam(key) {
		const url = new URL(location.href);
		return url.searchParams.get(key);
	}

	const taskKey = getParam('task_key') || 'daily_shortlink_1';
	const tg = getParam('tg');
	const cid = getParam('cid');

	const codeBox = document.getElementById('codeBox');
	const copyBtn = document.getElementById('copyBtn');

	function pretty(code) {
		return (code || '').replace(/(.{4})/g, '$1 ').trim();
	}

	try {
		const base = { task_key: taskKey, ttl_seconds: 600 };
		if (tg) base.tg_id = parseInt(tg, 10);
		if (cid) base.client_id = cid;
		if (!base.tg_id && !base.client_id) {
			Object.assign(base, getIdentityPayload());
		}

		const res = await apiFetch('/api/create_code.php', base);
		const code = res.code;
		codeBox.textContent = pretty(code);

		copyBtn.addEventListener('click', async () => {
			try {
				await navigator.clipboard.writeText(code);
				showBanner('Kopyalandı ✅', 'success');
			} catch (e) {
				showBanner('Kopyalama alınmadı', 'error');
			}
		});
	} catch (e) {
		codeBox.textContent = 'Xəta';
		showBanner('Kod yaradıla bilmədi', 'error');
	}
})();

