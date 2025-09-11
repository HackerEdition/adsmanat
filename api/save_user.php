<?php
require_once 'config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, null, 'Only POST method allowed');
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendResponse(false, null, 'Invalid JSON input');
}

// Validate required fields
if (!isset($input['telegram_id']) || !validateTelegramUser($input['telegram_id'])) {
    sendResponse(false, null, 'Invalid telegram_id');
}

$telegram_id = $input['telegram_id'];
$username = isset($input['username']) ? sanitizeInput($input['username']) : null;
$first_name = isset($input['first_name']) ? sanitizeInput($input['first_name']) : null;
$profile_photo_url = isset($input['profile_photo_url']) ? sanitizeInput($input['profile_photo_url']) : null;

try {
    $pdo = getDBConnection();
    if (!$pdo) {
        sendResponse(false, null, 'Database connection failed');
    }
    
    // Begin transaction
    $pdo->beginTransaction();
    
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE telegram_id = ?");
    $stmt->execute([$telegram_id]);
    $user = $stmt->fetch();
    
    if ($user) {
        // Update existing user
        $stmt = $pdo->prepare("
            UPDATE users 
            SET username = ?, first_name = ?, profile_photo_url = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE telegram_id = ?
        ");
        $stmt->execute([$username, $first_name, $profile_photo_url, $telegram_id]);
        $user_id = $user['id'];
    } else {
        // Create new user
        $stmt = $pdo->prepare("
            INSERT INTO users (telegram_id, username, first_name, profile_photo_url) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$telegram_id, $username, $first_name, $profile_photo_url]);
        $user_id = $pdo->lastInsertId();
        
        // Create initial balance record
        $stmt = $pdo->prepare("
            INSERT INTO user_balance (user_id, tickets, adscoin, azn) 
            VALUES (?, 0, 0, 0.000)
        ");
        $stmt->execute([$user_id]);
        
        // Create initial ad views record
        $stmt = $pdo->prepare("
            INSERT INTO ad_views (user_id, views_today, last_view_date, total_views) 
            VALUES (?, 0, CURDATE(), 0)
        ");
        $stmt->execute([$user_id]);
    }
    
    // Commit transaction
    $pdo->commit();
    
    sendResponse(true, ['user_id' => $user_id], 'User saved successfully');
    
} catch (PDOException $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    error_log("Save user error: " . $e->getMessage());
    sendResponse(false, null, 'Database error occurred');
}
?>