<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

$data = read_json_or_form();
$taskKey = sanitize_task_key($data['task_key'] ?? null);
$tgId = isset($data['tg_id']) && $data['tg_id'] !== '' ? (int)$data['tg_id'] : null;
$clientId = isset($data['client_id']) && $data['client_id'] !== '' ? substr((string)$data['client_id'], 0, 64) : null;

if ($taskKey === null) {
	respond_json(['ok' => false, 'error' => 'invalid_task_key'], 400);
}
if ($tgId === null && $clientId === null) {
	respond_json(['ok' => false, 'error' => 'missing_identity'], 400);
}

$ttl = isset($data['ttl_seconds']) ? (int)$data['ttl_seconds'] : 600;
if ($ttl < 60) $ttl = 60;
if ($ttl > 3600) $ttl = 3600;
$expiresAt = (new DateTimeImmutable('now', new DateTimeZone('UTC')))->modify("+{$ttl} seconds")->format('Y-m-d H:i:s');

$mysqli = db_get_connection();

// Invalidate previous pending codes for this task + identity
if ($tgId !== null) {
	$stmt = $mysqli->prepare('UPDATE verification_codes SET status = \"expired\" WHERE task_key = ? AND status = \"pending\" AND tg_id = ?');
	$stmt->bind_param('si', $taskKey, $tgId);
	$stmt->execute();
	$stmt->close();
}
if ($clientId !== null) {
	$stmt = $mysqli->prepare('UPDATE verification_codes SET status = \"expired\" WHERE task_key = ? AND status = \"pending\" AND client_id = ?');
	$stmt->bind_param('ss', $taskKey, $clientId);
	$stmt->execute();
	$stmt->close();
}

$code = generate_verification_code(8);

// Insert new code
if ($tgId !== null) {
	$stmt = $mysqli->prepare('INSERT INTO verification_codes (task_key, tg_id, client_id, code, status, expires_at) VALUES (?, ?, NULL, ?, \"pending\", ?)');
	$stmt->bind_param('siss', $taskKey, $tgId, $code, $expiresAt);
} else {
	$stmt = $mysqli->prepare('INSERT INTO verification_codes (task_key, tg_id, client_id, code, status, expires_at) VALUES (?, NULL, ?, ?, \"pending\", ?)');
	$stmt->bind_param('ssss', $taskKey, $clientId, $code, $expiresAt);
}

if (!$stmt->execute()) {
	respond_json(['ok' => false, 'error' => 'db_write_failed'], 500);
}
$stmt->close();

respond_json([
	'ok' => true,
	'code' => $code,
	'expires_at' => $expiresAt,
	'ttl_seconds' => $ttl
]);

