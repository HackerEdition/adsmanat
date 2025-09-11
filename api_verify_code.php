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
$code = (string)($input['code'] ?? '');

if ($taskKey === '' || $code === '') {
	respond_json(['error' => 'Invalid parameters'], 400);
}

$pdo = DatabaseConnection::pdo();

// Check already completed
$stmt = $pdo->prepare('SELECT 1 FROM task_completions WHERE session_id = ? AND task_key = ?');
$stmt->execute([session_id(), $taskKey]);
if ($stmt->fetch()) {
	respond_json(['success' => true, 'already_completed' => true]);
}

$stmt = $pdo->prepare('SELECT id, code, expires_at, used FROM verification_codes WHERE session_id = ? AND task_key = ? AND used = 0 ORDER BY id DESC LIMIT 1');
$stmt->execute([session_id(), $taskKey]);
$row = $stmt->fetch();

if (!$row) {
	respond_json(['error' => 'Code not found. Regenerate.'], 404);
}

if (strcasecmp($row['code'], $code) !== 0) {
	respond_json(['error' => 'Incorrect code'], 400);
}

if (strtotime($row['expires_at']) < time()) {
	respond_json(['error' => 'Code expired'], 400);
}

// Mark code used
$pdo->prepare('UPDATE verification_codes SET used = 1 WHERE id = ?')->execute([$row['id']]);

// Mark task completed
$pdo->prepare('INSERT IGNORE INTO task_completions (session_id, task_key, completed_at) VALUES (?,?,NOW())')
	->execute([session_id(), $taskKey]);

respond_json(['success' => true]);

?>

