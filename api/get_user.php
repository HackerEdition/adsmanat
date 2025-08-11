<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/telegram.php';

$data = require_post_json();
$init = (string)($data['init_data'] ?? '');
if ($init === '') {
    json_response(['success' => false, 'error' => 'init_data is required'], 400);
}
$user = verify_telegram_init_data($init);
$snapshot = get_snapshot((int)$user['id']);
json_response(['success' => true] + $snapshot);