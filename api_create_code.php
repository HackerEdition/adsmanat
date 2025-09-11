<?php
declare(strict_types=1);
require_once __DIR__ . '/session.php';
require_once __DIR__ . '/db.php';

cors();
start_secure_session();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	respond_json(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$taskKey = preg_replace('/[^a-z0-9_\-]/i', '', (string)($input['task_key'] ?? ''));

if ($taskKey === '') {
	respond_json(['error' => 'Invalid task key'], 400);
}

$pdo = DatabaseConnection::pdo();

// Invalidate previous unused codes for the same session+task
$stmt = $pdo->prepare('UPDATE verification_codes SET used = 1 WHERE session_id = ? AND task_key = ? AND used = 0');
$stmt->execute([session_id(), $taskKey]);

$code = generate_secure_code(8);
$now = new DateTimeImmutable('now');
$expires = $now->modify('+15 minutes');

$stmt = $pdo->prepare('INSERT INTO verification_codes (session_id, task_key, code, ip, created_at, expires_at, used) VALUES (?,?,?,?,?,?,0)');
$stmt->execute([
	session_id(),
	$taskKey,
	$code,
	get_client_ip(),
	$now->format('Y-m-d H:i:s'),
	$expires->format('Y-m-d H:i:s'),
]);

respond_json([
	'success' => true,
	'code' => $code,
	'code_id' => (int)$pdo->lastInsertId(),
	'expires_at' => $expires->getTimestamp(),
]);

?>

