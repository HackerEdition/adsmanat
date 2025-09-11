<?php
require_once 'config.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(false, null, 'Only GET method allowed');
}

// Validate telegram_id parameter
if (!isset($_GET['telegram_id']) || !validateTelegramUser($_GET['telegram_id'])) {
    sendResponse(false, null, 'Invalid telegram_id parameter');
}

$telegram_id = $_GET['telegram_id'];

try {
    $pdo = getDBConnection();
    if (!$pdo) {
        sendResponse(false, null, 'Database connection failed');
    }
    
    // Get user data with balance and ad views
    $stmt = $pdo->prepare("
        SELECT 
            u.id,
            u.telegram_id,
            u.username,
            u.first_name,
            u.profile_photo_url,
            ub.tickets,
            ub.adscoin,
            ub.azn,
            av.views_today,
            av.total_views,
            av.last_view_date
        FROM users u
        LEFT JOIN user_balance ub ON u.id = ub.user_id
        LEFT JOIN ad_views av ON u.id = av.user_id
        WHERE u.telegram_id = ?
    ");
    
    $stmt->execute([$telegram_id]);
    $userData = $stmt->fetch();
    
    if (!$userData) {
        sendResponse(false, null, 'User not found');
    }
    
    // Check if it's a new day and reset ad views if needed
    $today = date('Y-m-d');
    if ($userData['last_view_date'] !== $today) {
        $stmt = $pdo->prepare("
            UPDATE ad_views 
            SET views_today = 0, last_view_date = ? 
            WHERE user_id = ?
        ");
        $stmt->execute([$today, $userData['id']]);
        $userData['views_today'] = 0;
    }
    
    // Format response data
    $responseData = [
        'user' => [
            'id' => $userData['id'],
            'telegram_id' => $userData['telegram_id'],
            'username' => $userData['username'],
            'first_name' => $userData['first_name'],
            'profile_photo_url' => $userData['profile_photo_url']
        ],
        'balance' => [
            'tickets' => (int)$userData['tickets'],
            'adscoin' => (int)$userData['adscoin'],
            'azn' => (float)$userData['azn']
        ],
        'ad_views' => (int)$userData['views_today'],
        'total_views' => (int)$userData['total_views']
    ];
    
    sendResponse(true, $responseData, 'User data retrieved successfully');
    
} catch (PDOException $e) {
    error_log("Get user data error: " . $e->getMessage());
    sendResponse(false, null, 'Database error occurred');
}
?>