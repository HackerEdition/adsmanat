<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$host = 'sql211.infinityfree.com';
$dbname = 'if0_39059246_adcmanat';
$username = 'if0_39059246';
$password = 'n4TEZuJcP2rq5';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Get request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Route requests
switch ($action) {
    case 'get_user':
        handleGetUser($pdo);
        break;
    case 'update_user':
        handleUpdateUser($pdo);
        break;
    case 'get_balance':
        handleGetBalance($pdo);
        break;
    case 'update_balance':
        handleUpdateBalance($pdo);
        break;
    case 'watch_ad':
        handleWatchAd($pdo);
        break;
    case 'complete_task':
        handleCompleteTask($pdo);
        break;
    case 'create_withdrawal':
        handleCreateWithdrawal($pdo);
        break;
    case 'get_withdrawals':
        handleGetWithdrawals($pdo);
        break;
    case 'generate_verification_code':
        handleGenerateVerificationCode($pdo);
        break;
    case 'verify_code':
        handleVerifyCode($pdo);
        break;
    case 'join_event':
        handleJoinEvent($pdo);
        break;
    case 'get_events':
        handleGetEvents($pdo);
        break;
    case 'get_system_settings':
        handleGetSystemSettings($pdo);
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Action not found']);
        break;
}

// Get user data
function handleGetUser($pdo) {
    $telegramId = $_GET['telegram_id'] ?? null;
    
    if (!$telegramId) {
        http_response_code(400);
        echo json_encode(['error' => 'Telegram ID is required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT u.*, ub.bilet_balance, ub.adscoin_balance, ub.azn_balance 
            FROM users u 
            LEFT JOIN user_balances ub ON u.id = ub.user_id 
            WHERE u.telegram_id = ?
        ");
        $stmt->execute([$telegramId]);
        $user = $stmt->fetch();
        
        if (!$user) {
            // Create new user
            $user = createNewUser($pdo, $telegramId);
        }
        
        echo json_encode(['success' => true, 'user' => $user]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to get user data']);
    }
}

// Update user data
function handleUpdateUser($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $telegramId = $input['telegram_id'] ?? null;
    
    if (!$telegramId) {
        http_response_code(400);
        echo json_encode(['error' => 'Telegram ID is required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            UPDATE users 
            SET username = ?, first_name = ?, last_name = ?, photo_url = ?, language = ?
            WHERE telegram_id = ?
        ");
        $stmt->execute([
            $input['username'] ?? null,
            $input['first_name'] ?? null,
            $input['last_name'] ?? null,
            $input['photo_url'] ?? null,
            $input['language'] ?? 'az',
            $telegramId
        ]);
        
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update user data']);
    }
}

// Get user balance
function handleGetBalance($pdo) {
    $telegramId = $_GET['telegram_id'] ?? null;
    
    if (!$telegramId) {
        http_response_code(400);
        echo json_encode(['error' => 'Telegram ID is required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT ub.bilet_balance, ub.adscoin_balance, ub.azn_balance 
            FROM users u 
            LEFT JOIN user_balances ub ON u.id = ub.user_id 
            WHERE u.telegram_id = ?
        ");
        $stmt->execute([$telegramId]);
        $balance = $stmt->fetch();
        
        if (!$balance) {
            $balance = ['bilet_balance' => 0, 'adscoin_balance' => 0, 'azn_balance' => 0.000];
        }
        
        echo json_encode(['success' => true, 'balance' => $balance]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to get balance']);
    }
}

// Update user balance
function handleUpdateBalance($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $telegramId = $input['telegram_id'] ?? null;
    
    if (!$telegramId) {
        http_response_code(400);
        echo json_encode(['error' => 'Telegram ID is required']);
        return;
    }
    
    try {
        // Get user ID
        $stmt = $pdo->prepare("SELECT id FROM users WHERE telegram_id = ?");
        $stmt->execute([$telegramId]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        $userId = $user['id'];
        
        // Update or insert balance
        $stmt = $pdo->prepare("
            INSERT INTO user_balances (user_id, bilet_balance, adscoin_balance, azn_balance) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            bilet_balance = VALUES(bilet_balance),
            adscoin_balance = VALUES(adscoin_balance),
            azn_balance = VALUES(azn_balance)
        ");
        $stmt->execute([
            $userId,
            $input['bilet_balance'] ?? 0,
            $input['adscoin_balance'] ?? 0,
            $input['azn_balance'] ?? 0.000
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Balance updated successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update balance']);
    }
}

// Handle ad watching
function handleWatchAd($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $telegramId = $input['telegram_id'] ?? null;
    
    if (!$telegramId) {
        http_response_code(400);
        echo json_encode(['error' => 'Telegram ID is required']);
        return;
    }
    
    try {
        // Get user ID
        $stmt = $pdo->prepare("SELECT id FROM users WHERE telegram_id = ?");
        $stmt->execute([$telegramId]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        $userId = $user['id'];
        $today = date('Y-m-d');
        
        // Check daily limit
        $stmt = $pdo->prepare("
            SELECT watch_count FROM ad_watches 
            WHERE user_id = ? AND watch_date = ?
        ");
        $stmt->execute([$userId, $today]);
        $adWatch = $stmt->fetch();
        
        $currentCount = $adWatch['watch_count'] ?? 0;
        $dailyLimit = 20; // Get from system settings
        
        if ($currentCount >= $dailyLimit) {
            http_response_code(400);
            echo json_encode(['error' => 'Daily ad limit reached']);
            return;
        }
        
        // Update ad watch count
        $stmt = $pdo->prepare("
            INSERT INTO ad_watches (user_id, watch_date, watch_count) 
            VALUES (?, ?, 1) 
            ON DUPLICATE KEY UPDATE watch_count = watch_count + 1
        ");
        $stmt->execute([$userId, $today]);
        
        // Add 1 bilet to balance
        $stmt = $pdo->prepare("
            INSERT INTO user_balances (user_id, bilet_balance, adscoin_balance, azn_balance) 
            VALUES (?, 1, 0, 0.000) 
            ON DUPLICATE KEY UPDATE bilet_balance = bilet_balance + 1
        ");
        $stmt->execute([$userId]);
        
        echo json_encode(['success' => true, 'message' => 'Ad watched successfully', 'new_count' => $currentCount + 1]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to process ad watch']);
    }
}

// Complete task
function handleCompleteTask($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $telegramId = $input['telegram_id'] ?? null;
    $taskType = $input['task_type'] ?? null;
    $verificationCode = $input['verification_code'] ?? null;
    
    if (!$telegramId || !$taskType) {
        http_response_code(400);
        echo json_encode(['error' => 'Telegram ID and task type are required']);
        return;
    }
    
    try {
        // Get user ID
        $stmt = $pdo->prepare("SELECT id FROM users WHERE telegram_id = ?");
        $stmt->execute([$telegramId]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        $userId = $user['id'];
        
        // Verify code if provided
        if ($verificationCode) {
            $stmt = $pdo->prepare("
                SELECT id FROM verification_codes 
                WHERE user_id = ? AND code = ? AND used = FALSE AND expires_at > NOW()
            ");
            $stmt->execute([$userId, $verificationCode]);
            $code = $stmt->fetch();
            
            if (!$code) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid or expired verification code']);
                return;
            }
            
            // Mark code as used
            $stmt = $pdo->prepare("UPDATE verification_codes SET used = TRUE WHERE id = ?");
            $stmt->execute([$code['id']]);
        }
        
        // Check if task already completed today
        $today = date('Y-m-d');
        $stmt = $pdo->prepare("
            SELECT id FROM task_completions 
            WHERE user_id = ? AND task_type = ? AND DATE(completed_at) = ?
        ");
        $stmt->execute([$userId, $taskType, $today]);
        $existingTask = $stmt->fetch();
        
        if ($existingTask) {
            http_response_code(400);
            echo json_encode(['error' => 'Task already completed today']);
            return;
        }
        
        // Get task reward
        $rewards = [
            'youtube' => 5,
            'telegram' => 5,
            'tiktok' => 5,
            'shortlink' => 3
        ];
        
        $reward = $rewards[$taskType] ?? 0;
        
        // Record task completion
        $stmt = $pdo->prepare("
            INSERT INTO task_completions (user_id, task_type, reward_amount) 
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$userId, $taskType, $reward]);
        
        // Add reward to balance
        if ($reward > 0) {
            $stmt = $pdo->prepare("
                INSERT INTO user_balances (user_id, bilet_balance, adscoin_balance, azn_balance) 
                VALUES (?, 0, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                adscoin_balance = adscoin_balance + VALUES(adscoin_balance),
                azn_balance = azn_balance + VALUES(azn_balance)
            ");
            $aznAmount = $reward * 0.001;
            $stmt->execute([$userId, $reward, $aznAmount]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Task completed successfully', 'reward' => $reward]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to complete task']);
    }
}

// Create withdrawal
function handleCreateWithdrawal($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $telegramId = $input['telegram_id'] ?? null;
    $platform = $input['platform'] ?? null;
    $phoneNumber = $input['phone_number'] ?? null;
    $amount = $input['amount'] ?? null;
    
    if (!$telegramId || !$platform || !$phoneNumber || !$amount) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required']);
        return;
    }
    
    try {
        // Get user ID and balance
        $stmt = $pdo->prepare("
            SELECT u.id, ub.adscoin_balance 
            FROM users u 
            LEFT JOIN user_balances ub ON u.id = ub.user_id 
            WHERE u.telegram_id = ?
        ");
        $stmt->execute([$telegramId]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        $userId = $user['id'];
        $currentBalance = $user['adscoin_balance'] ?? 0;
        
        // Check minimum withdrawal amount
        $minAmount = 3000;
        if ($amount < $minAmount) {
            http_response_code(400);
            echo json_encode(['error' => "Minimum withdrawal amount is $minAmount ADSCOİN"]);
            return;
        }
        
        // Check sufficient balance
        if ($amount > $currentBalance) {
            http_response_code(400);
            echo json_encode(['error' => 'Insufficient balance']);
            return;
        }
        
        // Create withdrawal
        $aznAmount = $amount * 0.001;
        $stmt = $pdo->prepare("
            INSERT INTO withdrawals (user_id, platform, phone_number, amount, azn_amount) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $platform, $phoneNumber, $amount, $aznAmount]);
        
        // Deduct from balance
        $stmt = $pdo->prepare("
            UPDATE user_balances 
            SET adscoin_balance = adscoin_balance - ?, azn_balance = azn_balance - ? 
            WHERE user_id = ?
        ");
        $stmt->execute([$amount, $aznAmount, $userId]);
        
        echo json_encode(['success' => true, 'message' => 'Withdrawal created successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create withdrawal']);
    }
}

// Get withdrawals
function handleGetWithdrawals($pdo) {
    $telegramId = $_GET['telegram_id'] ?? null;
    
    if (!$telegramId) {
        http_response_code(400);
        echo json_encode(['error' => 'Telegram ID is required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT w.*, u.telegram_id 
            FROM withdrawals w 
            JOIN users u ON w.user_id = u.id 
            WHERE u.telegram_id = ? 
            ORDER BY w.created_at DESC 
            LIMIT 10
        ");
        $stmt->execute([$telegramId]);
        $withdrawals = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'withdrawals' => $withdrawals]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to get withdrawals']);
    }
}

// Generate verification code
function handleGenerateVerificationCode($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $telegramId = $input['telegram_id'] ?? null;
    $taskType = $input['task_type'] ?? null;
    
    if (!$telegramId || !$taskType) {
        http_response_code(400);
        echo json_encode(['error' => 'Telegram ID and task type are required']);
        return;
    }
    
    try {
        // Get user ID
        $stmt = $pdo->prepare("SELECT id FROM users WHERE telegram_id = ?");
        $stmt->execute([$telegramId]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        $userId = $user['id'];
        
        // Generate random code
        $code = strtoupper(substr(md5(uniqid()), 0, 6));
        
        // Insert verification code
        $stmt = $pdo->prepare("
            INSERT INTO verification_codes (user_id, code, task_type, expires_at) 
            VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
        ");
        $stmt->execute([$userId, $code, $taskType]);
        
        echo json_encode(['success' => true, 'code' => $code]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to generate verification code']);
    }
}

// Verify code
function handleVerifyCode($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $telegramId = $input['telegram_id'] ?? null;
    $code = $input['code'] ?? null;
    
    if (!$telegramId || !$code) {
        http_response_code(400);
        echo json_encode(['error' => 'Telegram ID and code are required']);
        return;
    }
    
    try {
        // Get user ID
        $stmt = $pdo->prepare("SELECT id FROM users WHERE telegram_id = ?");
        $stmt->execute([$telegramId]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        $userId = $user['id'];
        
        // Check verification code
        $stmt = $pdo->prepare("
            SELECT id, task_type FROM verification_codes 
            WHERE user_id = ? AND code = ? AND used = FALSE AND expires_at > NOW()
        ");
        $stmt->execute([$userId, $code]);
        $verificationCode = $stmt->fetch();
        
        if (!$verificationCode) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid or expired verification code']);
            return;
        }
        
        echo json_encode(['success' => true, 'valid' => true, 'task_type' => $verificationCode['task_type']]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to verify code']);
    }
}

// Join event
function handleJoinEvent($pdo) {
    $input = json_decode(file_get_contents('php://input'), true);
    $telegramId = $input['telegram_id'] ?? null;
    $eventId = $input['event_id'] ?? 1; // Default to first event
    
    if (!$telegramId) {
        http_response_code(400);
        echo json_encode(['error' => 'Telegram ID is required']);
        return;
    }
    
    try {
        // Get user ID
        $stmt = $pdo->prepare("SELECT id FROM users WHERE telegram_id = ?");
        $stmt->execute([$telegramId]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        
        $userId = $user['id'];
        
        // Check if already joined
        $stmt = $pdo->prepare("
            SELECT id FROM event_participants 
            WHERE event_id = ? AND user_id = ?
        ");
        $stmt->execute([$eventId, $userId]);
        $existingParticipation = $stmt->fetch();
        
        if ($existingParticipation) {
            http_response_code(400);
            echo json_encode(['error' => 'Already joined this event']);
            return;
        }
        
        // Join event
        $stmt = $pdo->prepare("
            INSERT INTO event_participants (event_id, user_id) 
            VALUES (?, ?)
        ");
        $stmt->execute([$eventId, $userId]);
        
        // Add event reward
        $stmt = $pdo->prepare("
            SELECT reward_amount FROM events WHERE id = ? AND is_active = TRUE
        ");
        $stmt->execute([$eventId]);
        $event = $stmt->fetch();
        
        if ($event && $event['reward_amount'] > 0) {
            $stmt = $pdo->prepare("
                INSERT INTO user_balances (user_id, bilet_balance, adscoin_balance, azn_balance) 
                VALUES (?, 0, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                adscoin_balance = adscoin_balance + VALUES(adscoin_balance),
                azn_balance = azn_balance + VALUES(azn_balance)
            ");
            $aznAmount = $event['reward_amount'] * 0.001;
            $stmt->execute([$userId, $event['reward_amount'], $aznAmount]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Successfully joined event']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to join event']);
    }
}

// Get events
function handleGetEvents($pdo) {
    try {
        $stmt = $pdo->prepare("
            SELECT * FROM events 
            WHERE is_active = TRUE AND end_date > NOW() 
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        $events = $stmt->fetchAll();
        
        echo json_encode(['success' => true, 'events' => $events]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to get events']);
    }
}

// Get system settings
function handleGetSystemSettings($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT setting_key, setting_value FROM system_settings");
        $stmt->execute();
        $settings = $stmt->fetchAll();
        
        $settingsArray = [];
        foreach ($settings as $setting) {
            $settingsArray[$setting['setting_key']] = $setting['setting_value'];
        }
        
        echo json_encode(['success' => true, 'settings' => $settingsArray]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to get system settings']);
    }
}

// Create new user
function createNewUser($pdo, $telegramId) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO users (telegram_id, language) 
            VALUES (?, 'az')
        ");
        $stmt->execute([$telegramId]);
        
        $userId = $pdo->lastInsertId();
        
        // Create initial balance
        $stmt = $pdo->prepare("
            INSERT INTO user_balances (user_id, bilet_balance, adscoin_balance, azn_balance) 
            VALUES (?, 0, 0, 0.000)
        ");
        $stmt->execute([$userId]);
        
        // Return user data
        $stmt = $pdo->prepare("
            SELECT u.*, ub.bilet_balance, ub.adscoin_balance, ub.azn_balance 
            FROM users u 
            LEFT JOIN user_balances ub ON u.id = ub.user_id 
            WHERE u.id = ?
        ");
        $stmt->execute([$userId]);
        return $stmt->fetch();
    } catch (PDOException $e) {
        return null;
    }
}
?>