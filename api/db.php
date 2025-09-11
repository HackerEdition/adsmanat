<?php
declare(strict_types=1);

/**
 * Database connection for ADSMANAT (InfinityFree MySQL)
 * Note: Do not echo sensitive errors; return generic messages.
 */

function db_get_connection(): mysqli {
	$host = 'sql211.infinityfree.com';
	$user = 'if0_39059246';
	$pass = 'n4TEZuJcP2rq5';
	$name = 'if0_39059246_adcmanat';

	$mysqli = @new mysqli($host, $user, $pass, $name);
	if ($mysqli->connect_errno) {
		http_response_code(500);
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode(['ok' => false, 'error' => 'db_connect_failed']);
		exit;
	}
	$mysqli->set_charset('utf8mb4');
	return $mysqli;
}

function read_json_or_form(): array {
	$raw = file_get_contents('php://input');
	if ($raw !== false && $raw !== '') {
		$decoded = json_decode($raw, true);
		if (is_array($decoded)) {
			return $decoded;
		}
	}
	return $_POST;
}

function sanitize_task_key(?string $taskKey): ?string {
	if ($taskKey === null) return null;
	if (preg_match('/^[A-Za-z0-9_\-]{3,64}$/', $taskKey)) {
		return $taskKey;
	}
	return null;
}

function generate_verification_code(int $length = 8): string {
	$alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // avoid easily confused chars
	$max = strlen($alphabet) - 1;
	$code = '';
	for ($i = 0; $i < $length; $i++) {
		$code .= $alphabet[random_int(0, $max)];
	}
	return $code;
}

function respond_json(array $payload, int $status = 200): void {
	header('Content-Type: application/json; charset=utf-8');
	http_response_code($status);
	echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
	exit;
}

