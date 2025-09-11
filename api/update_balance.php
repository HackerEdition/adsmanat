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
$tickets = isset($input['tickets']) ? (int)$input['tickets'] : null;
$adscoin = isset($input['adscoin']) ? (int)$input['adscoin'] : null;
$azn = isset($input['azn']) ? (float)$input['azn'] : null;
$ad_views = isset($input['ad_views']) ? (int)$input['ad_views'] : null;

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
    
    // Update balance if provided
    if ($tickets !== null || $adscoin !== null || $azn !== null) {
        // Calculate AZN from ADSCoin if not provided
        if ($azn === null && $adscoin !== null) {
            $azn = $adscoin * 0.001;
        }
        
        $updateFields = [];
        $updateValues = [];
        
        if ($tickets !== null) {
            $updateFields[] = "tickets = ?";
            $updateValues[] = $tickets;
        }
        
        if ($adscoin !== null) {
            $updateFields[] = "adscoin = ?";
            $updateValues[] = $adscoin;
        }
        
        if ($azn !== null) {
            $updateFields[] = "azn = ?";
            $updateValues[] = $azn;
        }
        
        if (!empty($updateFields)) {
            $updateValues[] = $user_id;
            $stmt = $pdo->prepare("
                UPDATE user_balance 
                SET " . implode(', ', $updateFields) . " 
                WHERE user_id = ?
            ");
            $stmt->execute($updateValues);
        }
    }
    
    // Update ad views if provided
    if ($ad_views !== null) {
        $today = date('Y-m-d');
        $stmt = $pdo->prepare("
            UPDATE ad_views 
            SET views_today = ?, last_view_date = ?, total_views = total_views + 1 
            WHERE user_id = ?
        ");
        $stmt->execute([$ad_views, $today, $user_id]);
    }
    
    // Commit transaction
    $pdo->commit();
    
    sendResponse(true, null, 'Balance updated successfully');
    
} catch (PDOException $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    error_log("Update balance error: " . $e->getMessage());
    sendResponse(false, null, 'Database error occurred');
}
?>