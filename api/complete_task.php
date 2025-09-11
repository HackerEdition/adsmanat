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

if (!isset($input['task_id']) || empty($input['task_id'])) {
    sendResponse(false, null, 'Task ID is required');
}

if (!isset($input['reward']) || $input['reward'] < 0) {
    sendResponse(false, null, 'Invalid reward amount');
}

$telegram_id = $input['telegram_id'];
$task_id = sanitizeInput($input['task_id']);
$reward = (int)$input['reward'];

try {
    $pdo = getDBConnection();
    if (!$pdo) {
        sendResponse(false, null, 'Database connection failed');
    }
    
    // Begin transaction
    $pdo->beginTransaction();
    
    // Get user ID
    $stmt = $pdo->prepare("SELECT id FROM users WHERE telegram_id = ?");
    $stmt->execute([$telegram_id]);
    $user = $stmt->fetch();
    
    if (!$user) {
        $pdo->rollBack();
        sendResponse(false, null, 'User not found');
    }
    
    $user_id = $user['id'];
    
    // Check if task already completed
    $stmt = $pdo->prepare("
        SELECT id FROM tasks_completed 
        WHERE user_id = ? AND task_id = ?
    ");
    $stmt->execute([$user_id, $task_id]);
    
    if ($stmt->fetch()) {
        $pdo->rollBack();
        sendResponse(false, null, 'Task already completed');
    }
    
    // Mark task as completed
    $stmt = $pdo->prepare("
        INSERT INTO tasks_completed (user_id, task_type, task_id) 
        VALUES (?, 'general', ?)
    ");
    $stmt->execute([$user_id, $task_id]);
    
    // Update user balance with reward
    if ($reward > 0) {
        $stmt = $pdo->prepare("
            UPDATE user_balance 
            SET adscoin = adscoin + ?, azn = (adscoin + ?) * 0.001 
            WHERE user_id = ?
        ");
        $stmt->execute([$reward, $reward, $user_id]);
    }
    
    // Get updated balance
    $stmt = $pdo->prepare("
        SELECT adscoin, azn FROM user_balance WHERE user_id = ?
    ");
    $stmt->execute([$user_id]);
    $balance = $stmt->fetch();
    
    // Commit transaction
    $pdo->commit();
    
    $responseData = [
        'task_id' => $task_id,
        'reward' => $reward,
        'new_balance' => [
            'adscoin' => (int)$balance['adscoin'],
            'azn' => (float)$balance['azn']
        ]
    ];
    
    sendResponse(true, $responseData, 'Task completed successfully');
    
} catch (PDOException $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    error_log("Complete task error: " . $e->getMessage());
    sendResponse(false, null, 'Database error occurred');
}
?>