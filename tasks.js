(() => {
  const { Storage, Toast, lockDuringVerification, $, $all } = window.ADS;

  // Keys
  const KEY_VERIFY_CODE = 'ads.verify.code';
  const KEY_VERIFY_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
  const KEY_DAILY_DONE = 'ads.tasks.daily.done';
  const KEY_IN_FLOW = 'ads.tasks.daily.inflow';

  // Elements
  const btnOpenLink = $('#btn-open-link');
  const btnOpenVerifyDirect = $('#btn-open-verify-direct');
  const codePanel = $('#code-panel');
  const inputCode = $('#input-code');
  const btnCancel = $('#btn-cancel');
  const btnConfirm = $('#btn-confirm');
  const dailyStatus = $('#daily-status');
  const badgeDone = $('#daily-complete-badge');
  const codeHint = $('#code-hint');

  function setDailyCompleted(done) {
    try { localStorage.setItem(KEY_DAILY_DONE, done ? '1' : '0'); } catch (_) {}
    dailyStatus.textContent = done ? 'Tamamlandı' : 'Gözləyir';
    badgeDone.classList.toggle('hidden', !done);
    btnOpenLink.disabled = !!done;
    btnOpenVerifyDirect.classList.toggle('disabled', !!done);
  }

  function beginFlowIfNeeded() {
    const inFlow = localStorage.getItem(KEY_IN_FLOW) === '1';
    const hasCode = !!Storage.getWithTTL(KEY_VERIFY_CODE);
    if (inFlow || hasCode) showCodePanel();
  }

  function showCodePanel() {
    codePanel.classList.remove('hidden');
    lockDuringVerification(true);
    const codeObj = Storage.getWithTTL(KEY_VERIFY_CODE);
    if (codeObj && codeObj.code) {
      codeHint.textContent = `Keçid açıldı. Kodun müddəti: ${Math.max(1, Math.ceil((codeObj.expiresAt - Date.now()) / 60000))} dəq.`;
    } else {
      codeHint.textContent = 'Keçiddən sonra gələn kodu daxil edin.';
    }
  }

  function hideCodePanel() {
    codePanel.classList.add('hidden');
    inputCode.value = '';
    lockDuringVerification(false);
    try { localStorage.removeItem(KEY_IN_FLOW); } catch (_) {}
  }

  function openShortLink() {
    // Mark that the user started the flow to keep the panel open on low-end devices.
    try { localStorage.setItem(KEY_IN_FLOW, '1'); } catch (_) {}
    showCodePanel();
    Toast.show('Keçid açılır...', 'info');
    // Your shortener should redirect to verification.html when done.
    // For development, we can also open verification directly if needed.
    const verifyUrl = '/workspace/verification.html';
    window.open(verifyUrl, '_blank', 'noopener');
  }

  function cancelFlow() {
    hideCodePanel();
    Toast.show('Ləğv edildi', 'danger');
  }

  function confirmCode() {
    const typed = (inputCode.value || '').trim();
    const record = Storage.getWithTTL(KEY_VERIFY_CODE);
    if (!record) {
      Toast.show('Kod tapılmadı və ya vaxtı bitib', 'danger');
      return;
    }
    if (typed.length === 0) {
      Toast.show('Zəhmət olmasa kodu daxil edin', 'danger');
      return;
    }
    if (typed !== record.code) {
      Toast.show('Kod yanlışdır', 'danger');
      return;
    }
    // success
    setDailyCompleted(true);
    Storage.remove(KEY_VERIFY_CODE);
    hideCodePanel();
    Toast.show('Təsdiqləndi! 5 ADSCOİN əlavə olundu', 'success');
    // TODO: Integrate with backend here (award coins). For now local only.
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    const done = localStorage.getItem(KEY_DAILY_DONE) === '1';
    setDailyCompleted(done);
    beginFlowIfNeeded();

    btnOpenLink.addEventListener('click', openShortLink);
    btnCancel.addEventListener('click', cancelFlow);
    btnConfirm.addEventListener('click', confirmCode);
    inputCode.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') confirmCode();
    });
  });
})();

