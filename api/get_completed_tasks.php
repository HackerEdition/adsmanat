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
    
    // Get completed tasks for the user
    $stmt = $pdo->prepare("
        SELECT tc.task_id, tc.task_type, tc.completed_at
        FROM tasks_completed tc
        JOIN users u ON tc.user_id = u.id
        WHERE u.telegram_id = ?
        ORDER BY tc.completed_at DESC
    ");
    
    $stmt->execute([$telegram_id]);
    $completedTasks = $stmt->fetchAll();
    
    // Extract just the task IDs for easier frontend handling
    $taskIds = array_column($completedTasks, 'task_id');
    
    $responseData = [
        'tasks' => $taskIds,
        'detailed_tasks' => $completedTasks
    ];
    
    sendResponse(true, $responseData, 'Completed tasks retrieved successfully');
    
} catch (PDOException $e) {
    error_log("Get completed tasks error: " . $e->getMessage());
    sendResponse(false, null, 'Database error occurred');
}
?>