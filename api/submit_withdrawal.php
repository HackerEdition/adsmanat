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

if (!isset($input['platform']) || $input['platform'] !== 'm10') {
    sendResponse(false, null, 'Invalid platform');
}

if (!isset($input['m10_number']) || empty($input['m10_number'])) {
    sendResponse(false, null, 'M10 number is required');
}

if (!isset($input['amount']) || $input['amount'] < 3000) {
    sendResponse(false, null, 'Minimum withdrawal is 3000 ADSCoin');
}

$telegram_id = $input['telegram_id'];
$platform = sanitizeInput($input['platform']);
$m10_number = sanitizeInput($input['m10_number']);
$amount = (int)$input['amount'];
$amount_azn = isset($input['amount_azn']) ? (float)$input['amount_azn'] : ($amount * 0.001);

try {
    $pdo = getDBConnection();
    if (!$pdo) {
        sendResponse(false, null, 'Database connection failed');
    }
    
    // Begin transaction
    $pdo->beginTransaction();
    
    // Get user and current balance
    $stmt = $pdo->prepare("
        SELECT u.id, ub.adscoin, ub.azn 
        FROM users u
        LEFT JOIN user_balance ub ON u.id = ub.user_id
        WHERE u.telegram_id = ?
    ");
    $stmt->execute([$telegram_id]);
    $user = $stmt->fetch();
    
    if (!$user) {
        $pdo->rollBack();
        sendResponse(false, null, 'User not found');
    }
    
    // Check if user has sufficient balance
    if ($user['adscoin'] < $amount) {
        $pdo->rollBack();
        sendResponse(false, null, 'Insufficient balance');
    }
    
    $user_id = $user['id'];
    
    // Create withdrawal request
    $stmt = $pdo->prepare("
        INSERT INTO withdrawals (user_id, amount, m10_number, status) 
        VALUES (?, ?, ?, 'pending')
    ");
    $stmt->execute([$user_id, $amount_azn, $m10_number]);
    
    // Update user balance (deduct the withdrawal amount)
    $new_adscoin = $user['adscoin'] - $amount;
    $new_azn = $new_adscoin * 0.001;
    
    $stmt = $pdo->prepare("
        UPDATE user_balance 
        SET adscoin = ?, azn = ? 
        WHERE user_id = ?
    ");
    $stmt->execute([$new_adscoin, $new_azn, $user_id]);
    
    // Commit transaction
    $pdo->commit();
    
    $responseData = [
        'withdrawal_id' => $pdo->lastInsertId(),
        'new_balance' => [
            'adscoin' => $new_adscoin,
            'azn' => $new_azn
        ]
    ];
    
    sendResponse(true, $responseData, 'Withdrawal request submitted successfully');
    
} catch (PDOException $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    error_log("Submit withdrawal error: " . $e->getMessage());
    sendResponse(false, null, 'Database error occurred');
}
?>