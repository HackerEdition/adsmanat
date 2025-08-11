<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

function verify_telegram_init_data(string $initData): array {
    if (TELEGRAM_BOT_TOKEN === '') {
        json_response(['success' => false, 'error' => 'Server not configured: bot token missing'], 500);
    }
    parse_str($initData, $data);
    if (!isset($data['hash'])) {
        json_response(['success' => false, 'error' => 'Missing hash'], 400);
    }

    $hash = $data['hash'];
    unset($data['hash']);

    ksort($data);
    $data_check_string = [];
    foreach ($data as $k => $v) {
        $data_check_string[] = $k . '=' . $v;
    }
    $data_check_string = implode("\n", $data_check_string);

    $secret_key = hash_hmac('sha256', TELEGRAM_BOT_TOKEN, 'WebAppData', true);
    $calculated_hash = bin2hex(hash_hmac('sha256', $data_check_string, $secret_key, true));

    if (!hash_equals($calculated_hash, $hash)) {
        json_response(['success' => false, 'error' => 'Auth failed'], 401);
    }

    $user_json = $data['user'] ?? '';
    $user = $user_json ? json_decode($user_json, true) : null;
    if (!is_array($user) || !isset($user['id'])) {
        json_response(['success' => false, 'error' => 'Invalid user data'], 400);
    }
    return $user;
}

function upsert_user(array $user): void {
    $pdo = pdo();
    $stmt = $pdo->prepare('INSERT INTO users (telegram_user_id, username, first_name, last_name, photo_url, created_at, updated_at)
        VALUES (:id, :username, :first, :last, :photo, NOW(), NOW())
        ON DUPLICATE KEY UPDATE username = VALUES(username), first_name = VALUES(first_name), last_name = VALUES(last_name), photo_url = VALUES(photo_url), updated_at = NOW()');
    $stmt->execute([
        ':id' => $user['id'],
        ':username' => $user['username'] ?? null,
        ':first' => $user['first_name'] ?? null,
        ':last' => $user['last_name'] ?? null,
        ':photo' => $user['photo_url'] ?? null,
    ]);

    $stmt = $pdo->prepare('INSERT IGNORE INTO balances (telegram_user_id, tickets, adscoin, azn, updated_at) VALUES (:id, 0, 0, 0.00, NOW())');
    $stmt->execute([':id' => $user['id']]);

    $stmt = $pdo->prepare('INSERT IGNORE INTO ad_counters (telegram_user_id, viewed_today, last_view_date) VALUES (:id, 0, CURDATE())');
    $stmt->execute([':id' => $user['id']]);
}

function get_snapshot(int $userId): array {
    $pdo = pdo();
    $pdo->beginTransaction();
    try {
        // reset daily counter if needed
        $reset = $pdo->prepare('UPDATE ad_counters SET viewed_today = 0, last_view_date = CURDATE() WHERE telegram_user_id = :id AND last_view_date <> CURDATE()');
        $reset->execute([':id' => $userId]);

        $u = $pdo->prepare('SELECT telegram_user_id, username, first_name, last_name, photo_url FROM users WHERE telegram_user_id = :id');
        $u->execute([':id' => $userId]);
        $user = $u->fetch();

        $b = $pdo->prepare('SELECT tickets, adscoin, azn FROM balances WHERE telegram_user_id = :id');
        $b->execute([':id' => $userId]);
        $balance = $b->fetch();

        $a = $pdo->prepare('SELECT viewed_today, last_view_date FROM ad_counters WHERE telegram_user_id = :id');
        $a->execute([':id' => $userId]);
        $ad = $a->fetch();

        $pdo->commit();
        return ['user' => $user, 'balance' => $balance, 'ad' => $ad];
    } catch (Throwable $e) {
        $pdo->rollBack();
        json_response(['success' => false, 'error' => 'DB error'], 500);
    }
}

function award_ticket_for_ad(int $userId): array {
    $pdo = pdo();
    $pdo->beginTransaction();
    try {
        // daily reset check
        $pdo->prepare('UPDATE ad_counters SET viewed_today = 0, last_view_date = CURDATE() WHERE telegram_user_id = :id AND last_view_date <> CURDATE()')
            ->execute([':id' => $userId]);

        // check current count
        $sel = $pdo->prepare('SELECT viewed_today FROM ad_counters WHERE telegram_user_id = :id FOR UPDATE');
        $sel->execute([':id' => $userId]);
        $cur = $sel->fetchColumn();
        if ($cur === false) {
            $pdo->prepare('INSERT INTO ad_counters (telegram_user_id, viewed_today, last_view_date) VALUES (:id, 0, CURDATE())')
                ->execute([':id' => $userId]);
            $cur = 0;
        }
        if ((int)$cur >= DAILY_AD_LIMIT) {
            $pdo->commit();
            return get_snapshot($userId);
        }
        // increment counter and tickets atomically
        $pdo->prepare('UPDATE ad_counters SET viewed_today = viewed_today + 1 WHERE telegram_user_id = :id')
            ->execute([':id' => $userId]);
        $pdo->prepare('UPDATE balances SET tickets = tickets + 1, updated_at = NOW() WHERE telegram_user_id = :id')
            ->execute([':id' => $userId]);

        $pdo->commit();
        return get_snapshot($userId);
    } catch (Throwable $e) {
        $pdo->rollBack();
        json_response(['success' => false, 'error' => 'DB error'], 500);
    }
}