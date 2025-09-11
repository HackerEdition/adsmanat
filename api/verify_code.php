<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$data = read_json_or_form();
$taskKey = sanitize_task_key($data['task_key'] ?? null);
$inputCode = isset($data['code']) ? strtoupper(trim((string)$data['code'])) : null;
$tgId = isset($data['tg_id']) && $data['tg_id'] !== '' ? (int)$data['tg_id'] : null;
$clientId = isset($data['client_id']) && $data['client_id'] !== '' ? substr((string)$data['client_id'], 0, 64) : null;

if ($taskKey === null || $inputCode === null || $inputCode === '') {
	respond_json(['ok' => false, 'error' => 'invalid_input'], 400);
}
if ($tgId === null && $clientId === null) {
	respond_json(['ok' => false, 'error' => 'missing_identity'], 400);
}

$mysqli = db_get_connection();

// Fetch latest pending code for this identity and task
if ($tgId !== null) {
	$stmt = $mysqli->prepare('SELECT id, code, expires_at FROM verification_codes WHERE task_key = ? AND status = \"pending\" AND tg_id = ? ORDER BY created_at DESC LIMIT 1');
	$stmt->bind_param('si', $taskKey, $tgId);
} else {
	$stmt = $mysqli->prepare('SELECT id, code, expires_at FROM verification_codes WHERE task_key = ? AND status = \"pending\" AND client_id = ? ORDER BY created_at DESC LIMIT 1');
	$stmt->bind_param('ss', $taskKey, $clientId);
}

$stmt->execute();
$stmt->bind_result($id, $dbCode, $expiresAt);
if (!$stmt->fetch()) {
	$stmt->close();
	respond_json(['ok' => false, 'error' => 'code_not_found']);
}
$stmt->close();

// Expired?
if ($expiresAt !== null && $expiresAt !== '' && strtotime($expiresAt) < time()) {
	$upd = $mysqli->prepare('UPDATE verification_codes SET status = \"expired\" WHERE id = ?');
	$upd->bind_param('i', $id);
	$upd->execute();
	$upd->close();
	respond_json(['ok' => false, 'error' => 'code_expired']);
}

if (strtoupper($dbCode) !== $inputCode) {
	respond_json(['ok' => false, 'error' => 'code_mismatch']);
}

// Mark used
$upd = $mysqli->prepare('UPDATE verification_codes SET status = \"used\" WHERE id = ?');
$upd->bind_param('i', $id);
$upd->execute();
$upd->close();

respond_json(['ok' => true]);

