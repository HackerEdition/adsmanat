(() => {
  const { Storage, Toast, generateVerificationCode, $, $all } = window.ADS;

  const KEY_VERIFY_CODE = 'ads.verify.code';
  const KEY_VERIFY_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

  const codeDisplay = $('#code-display');
  const btnCopy = $('#btn-copy');
  const btnRegenerate = $('#btn-regenerate');
  const ttlInfo = $('#ttl-info');

  function setCode(code) {
    const expiresAt = Date.now() + KEY_VERIFY_CODE_TTL_MS;
    Storage.setWithTTL(KEY_VERIFY_CODE, { code, expiresAt }, KEY_VERIFY_CODE_TTL_MS);
    codeDisplay.value = code;
    updateTTL();
  }

  function ensureCode() {
    const record = Storage.getWithTTL(KEY_VERIFY_CODE);
    if (record && record.code) {
      codeDisplay.value = record.code;
      updateTTL();
      return;
    }
    setCode(generateVerificationCode(10));
  }

  function updateTTL() {
    const record = Storage.getWithTTL(KEY_VERIFY_CODE);
    if (!record) {
      ttlInfo.textContent = 'Kodun vaxtı bitdi. Yenidən yaradın.';
      return;
    }
    const ms = record.expiresAt - Date.now();
    const minutes = Math.max(0, Math.floor(ms / 60000));
    const seconds = Math.max(0, Math.floor((ms % 60000) / 1000));
    ttlInfo.textContent = `Müddət: ${minutes} dəq ${seconds} san`;
  }

  function copy() {
    if (!codeDisplay.value) return;
    navigator.clipboard.writeText(codeDisplay.value).then(() => {
      Toast.show('Kopyalandı', 'success');
    }).catch(() => {
      Toast.show('Kopyalama alınmadı', 'danger');
    });
  }

  function regenerate() {
    setCode(generateVerificationCode(10));
    Toast.show('Kod yeniləndi', 'info');
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureCode();
    btnCopy.addEventListener('click', copy);
    btnRegenerate.addEventListener('click', regenerate);
    setInterval(updateTTL, 1000);
  });
})();

