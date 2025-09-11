<?php
declare(strict_types=1);

function start_secure_session(): void
{
	if (session_status() === PHP_SESSION_ACTIVE) {
		return;
	}
	$secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
	$cookieParams = session_get_cookie_params();
	session_set_cookie_params([
		'lifetime' => 60 * 60 * 24 * 30,
		'path' => $cookieParams['path'] ?? '/',
		'domain' => $cookieParams['domain'] ?? '',
		'httponly' => true,
		'secure' => $secure,
		'samesite' => 'Lax',
	]);
	session_start();

	if (empty($_SESSION['csrf_token'])) {
		$_SESSION['csrf_token'] = bin2hex(random_bytes(16));
	}
}

?>

