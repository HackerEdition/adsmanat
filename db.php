<?php
// Database connection using PDO
// Keep credentials centralized and never echo them back.

declare(strict_types=1);

class DatabaseConnection
{
	private const DB_HOST = 'sql211.infinityfree.com';
	private const DB_NAME = 'if0_39059246_adcmanat';
	private const DB_USER = 'if0_39059246';
	private const DB_PASS = 'n4TEZuJcP2rq5';

	public static function pdo(): PDO
	{
		static $pdo = null;
		if ($pdo instanceof PDO) {
			return $pdo;
		}

		$dsn = 'mysql:host=' . self::DB_HOST . ';dbname=' . self::DB_NAME . ';charset=utf8mb4';
		$options = [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			PDO::ATTR_EMULATE_PREPARES => false,
		];
		$pdo = new PDO($dsn, self::DB_USER, self::DB_PASS, $options);
		return $pdo;
	}
}

function respond_json(array $payload, int $statusCode = 200): void
{
	header('Content-Type: application/json; charset=utf-8');
	http_response_code($statusCode);
	echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
	exit;
}

function get_client_ip(): string
{
	$headers = [
		'HTTP_CF_CONNECTING_IP',
		'HTTP_X_FORWARDED_FOR',
		'HTTP_X_REAL_IP',
		'REMOTE_ADDR',
	];
	foreach ($headers as $key) {
		if (!empty($_SERVER[$key])) {
			$ip = $_SERVER[$key];
			if (strpos($ip, ',') !== false) {
				$parts = explode(',', $ip);
				return trim($parts[0]);
			}
			return $ip;
		}
	}
	return '0.0.0.0';
}

function generate_secure_code(int $length = 8): string
{
	$alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnopqrstuvwxyz';
	$maxIndex = strlen($alphabet) - 1;
	$code = '';
	for ($i = 0; $i < $length; $i++) {
		$code .= $alphabet[random_int(0, $maxIndex)];
	}
	return $code;
}

function cors(): void
{
	$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
	header('Vary: Origin');
	header('Access-Control-Allow-Origin: ' . $origin);
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
	header('Access-Control-Allow-Headers: Content-Type, Authorization');
	if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
		http_response_code(204);
		exit;
	}
}

?>

