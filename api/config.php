<?php
declare(strict_types=1);

// Database credentials (InfinityFree)
const DB_HOST = 'sql211.infinityfree.com';
const DB_NAME = 'if0_39059246_adcmanat';
const DB_USER = 'if0_39059246';
const DB_PASS = 'n4TEZuJcP2rq5';

// Telegram bot token (REQUIRED). Keep it private and DO NOT expose to client code.
// Fill this with your bot token, e.g. '123456:ABC-DEF...'
const TELEGRAM_BOT_TOKEN = '';

// General settings
const DAILY_AD_LIMIT = 20;

// JSON response helper
function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: no-referrer');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function require_post_json(): array {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'error' => 'Method Not Allowed'], 405);
    }
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '[]', true);
    if (!is_array($data)) {
        json_response(['success' => false, 'error' => 'Invalid JSON'], 400);
    }
    return $data;
}