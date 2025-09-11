<?php
require_once 'config.php';

// Get request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Handle different actions
switch ($action) {
    case 'user_data':
        handleUserData($pdo, $method);
        break;
    case 'watch_ad':
        handleWatchAd($pdo, $method);
        break;
    case 'spin_wheel':
        handleSpinWheel($pdo, $method);
        break;
    case 'complete_task':
        handleCompleteTask($pdo, $method);
        break;
    case 'withdraw':
        handleWithdraw($pdo, $method);
        break;
    case 'join_event':
        handleJoinEvent($pdo, $method);
        break;
    case 'generate_code':
        handleGenerateCode($pdo, $method);
        break;
    case 'verify_code':
        handleVerifyCode($pdo, $method);
        break;
    default:
        sendResponse(['error' => 'Invalid action'], 400);
}

// Handle user data
function handleUserData($pdo, $method) {
    if ($method !== 'GET') {
        sendResponse(['error' => 'Method not allowed'], 405);
    }
    
    try {
        // Get user data from Telegram WebApp
        $telegramData = $_GET['telegram_data'] ?? '';
        $data = json_decode($telegramData, true);
        
        if (!$data || !isset($data['user'])) {
            sendResponse(['error' => 'Invalid Telegram data'], 400);
        }
        
        $user = $data['user'];
        $telegramId = $user['id'];
        
        // Check if user exists
        $stmt = $pdo->prepare("SELECT * FROM users WHERE telegram_id = ?");
        $stmt->execute([$telegramId]);
        $existingUser = $stmt->fetch();
        
        if ($existingUser) {
            // Update user data
            $stmt = $pdo->prepare("
                UPDATE users 
                SET username = ?, first_name = ?, last_name = ?, photo_url = ?, updated_at = NOW()
                WHERE telegram_id = ?
            ");
            $stmt->execute([
                $user['username'] ?? null,
                $user['first_name'] ?? '',
                $user['last_name'] ?? null,
                $user['photo_url'] ?? null,
                $telegramId
            ]);
            $userId = $existingUser['id'];
        } else {
            // Create new user
            $stmt = $pdo->prepare("
                INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, language)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $telegramId,
                $user['username'] ?? null,
                $user['first_name'] ?? '',
                $user['last_name'] ?? null,
                $user['photo_url'] ?? null,
                'az'
            ]);
            $userId = $pdo->lastInsertId();
            
            // Create user balance
            $stmt = $pdo->prepare("
                INSERT INTO user_balances (user_id, bilet_balance, adscoin_balance, azn_balance)
                VALUES (?, 0, 0, 0.000)
            ");
            $stmt->execute([$userId]);
        }
        
        // Get user balance
        $stmt = $pdo->prepare("SELECT * FROM user_balances WHERE user_id = ?");
        $stmt->execute([$userId]);
        $balance = $stmt->fetch();
        
        // Get today's ad count
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as ad_count 
            FROM ad_history 
            WHERE user_id = ? AND DATE(watched_at) = CURDATE()
        ");
        $stmt->execute([$userId]);
        $adCount = $stmt->fetch()['ad_count'];
        
        sendResponse([
            'success' => true,
            'user' => [
                'id' => $userId,
                'telegram_id' => $telegramId,
                'username' => $user['username'] ?? null,
                'first_name' => $user['first_name'] ?? '',
                'last_name' => $user['last_name'] ?? null,
                'photo_url' => $user['photo_url'] ?? null,
                'language' => $existingUser['language'] ?? 'az'
            ],
            'balance' => [
                'bilet_balance' => $balance['bilet_balance'],
                'adscoin_balance' => $balance['adscoin_balance'],
                'azn_balance' => $balance['azn_balance'],
                'ad_count' => $adCount
            ]
        ]);
        
    } catch (Exception $e) {
        error_log("User data error: " . $e->getMessage());
        sendResponse(['error' => 'Internal server error'], 500);
    }
}

// Handle watch ad
function handleWatchAd($pdo, $method) {
    if ($method !== 'POST') {
        sendResponse(['error' => 'Method not allowed'], 405);
    }
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['user_id'] ?? null;
        
        if (!$userId) {
            sendResponse(['error' => 'User ID required'], 400);
        }
        
        // Check rate limit
        if (!checkRateLimit($pdo, $userId, 'watch_ad', 20, 86400)) { // 20 ads per day
            sendResponse(['error' => 'Daily ad limit reached'], 429);
        }
        
        // Check if user can watch ads today
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as ad_count 
            FROM ad_history 
            WHERE user_id = ? AND DATE(watched_at) = CURDATE()
        ");
        $stmt->execute([$userId]);
        $adCount = $stmt->fetch()['ad_count'];
        
        if ($adCount >= 20) {
            sendResponse(['error' => 'Daily ad limit reached'], 429);
        }
        
        // Add ad to history
        $stmt = $pdo->prepare("
            INSERT INTO ad_history (user_id, ad_type, reward, ip_address)
            VALUES (?, 'standard', 1, ?)
        ");
        $stmt->execute([$userId, $_SERVER['REMOTE_ADDR'] ?? null]);
        
        // Update user balance
        $stmt = $pdo->prepare("
            UPDATE user_balances 
            SET bilet_balance = bilet_balance + 1, 
                ad_count = ad_count + 1,
                last_ad_date = CURDATE(),
                updated_at = NOW()
            WHERE user_id = ?
        ");
        $stmt->execute([$userId]);
        
        // Log activity
        logActivity($pdo, $userId, 'watch_ad', 'Watched ad and earned 1 bilet');
        
        sendResponse([
            'success' => true,
            'message' => 'Ad watched successfully',
            'reward' => 1
        ]);
        
    } catch (Exception $e) {
        error_log("Watch ad error: " . $e->getMessage());
        sendResponse(['error' => 'Internal server error'], 500);
    }
}

// Handle spin wheel
function handleSpinWheel($pdo, $method) {
    if ($method !== 'POST') {
        sendResponse(['error' => 'Method not allowed'], 405);
    }
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['user_id'] ?? null;
        
        if (!$userId) {
            sendResponse(['error' => 'User ID required'], 400);
        }
        
        // Check user balance
        $stmt = $pdo->prepare("SELECT bilet_balance FROM user_balances WHERE user_id = ?");
        $stmt->execute([$userId]);
        $balance = $stmt->fetch();
        
        if (!$balance || $balance['bilet_balance'] < 1) {
            sendResponse(['error' => 'Insufficient bilet balance'], 400);
        }
        
        // Generate random result (weighted)
        $random = mt_rand(1, 100);
        if ($random <= 40) $result = 1;      // 40% chance
        elseif ($random <= 65) $result = 2;  // 25% chance
        elseif ($random <= 80) $result = 3;  // 15% chance
        elseif ($random <= 90) $result = 4;  // 10% chance
        elseif ($random <= 95) $result = 5;  // 5% chance
        else $result = 0;                    // 5% chance
        
        // Calculate AZN equivalent
        $aznWon = $result * 0.001;
        
        // Update user balance
        $stmt = $pdo->prepare("
            UPDATE user_balances 
            SET bilet_balance = bilet_balance - 1,
                adscoin_balance = adscoin_balance + ?,
                azn_balance = azn_balance + ?,
                updated_at = NOW()
            WHERE user_id = ?
        ");
        $stmt->execute([$result, $aznWon, $userId]);
        
        // Log wheel spin
        $stmt = $pdo->prepare("
            INSERT INTO wheel_spins (user_id, bilet_cost, adscoin_won, azn_won)
            VALUES (?, 1, ?, ?)
        ");
        $stmt->execute([$userId, $result, $aznWon]);
        
        // Log activity
        logActivity($pdo, $userId, 'spin_wheel', "Spun wheel and won {$result} ADSCOIN");
        
        sendResponse([
            'success' => true,
            'result' => $result,
            'azn_won' => $aznWon,
            'message' => $result > 0 ? "You won {$result} ADSCOIN!" : "Better luck next time!"
        ]);
        
    } catch (Exception $e) {
        error_log("Spin wheel error: " . $e->getMessage());
        sendResponse(['error' => 'Internal server error'], 500);
    }
}

// Handle complete task
function handleCompleteTask($pdo, $method) {
    if ($method !== 'POST') {
        sendResponse(['error' => 'Method not allowed'], 405);
    }
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['user_id'] ?? null;
        $taskType = $input['task_type'] ?? null;
        $verificationCode = $input['verification_code'] ?? null;
        
        if (!$userId || !$taskType) {
            sendResponse(['error' => 'User ID and task type required'], 400);
        }
        
        // Define task rewards
        $taskRewards = [
            'youtube' => 5,
            'telegram' => 5,
            'tiktok' => 5,
            'shortlink' => 3
        ];
        
        $reward = $taskRewards[$taskType] ?? 0;
        
        if ($reward === 0) {
            sendResponse(['error' => 'Invalid task type'], 400);
        }
        
        // For shortlink tasks, verify code
        if ($taskType === 'shortlink' && $verificationCode) {
            $stmt = $pdo->prepare("
                SELECT * FROM verification_codes 
                WHERE user_id = ? AND code = ? AND is_used = 0 AND expires_at > NOW()
            ");
            $stmt->execute([$userId, $verificationCode]);
            $code = $stmt->fetch();
            
            if (!$code) {
                sendResponse(['error' => 'Invalid or expired verification code'], 400);
            }
            
            // Mark code as used
            $stmt = $pdo->prepare("UPDATE verification_codes SET is_used = 1 WHERE id = ?");
            $stmt->execute([$code['id']]);
        }
        
        // Check if task already completed today
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as count 
            FROM task_completions 
            WHERE user_id = ? AND task_type = ? AND DATE(completed_at) = CURDATE()
        ");
        $stmt->execute([$userId, $taskType]);
        $alreadyCompleted = $stmt->fetch()['count'] > 0;
        
        if ($alreadyCompleted) {
            sendResponse(['error' => 'Task already completed today'], 400);
        }
        
        // Calculate AZN equivalent
        $aznReward = $reward * 0.001;
        
        // Update user balance
        $stmt = $pdo->prepare("
            UPDATE user_balances 
            SET adscoin_balance = adscoin_balance + ?,
                azn_balance = azn_balance + ?,
                updated_at = NOW()
            WHERE user_id = ?
        ");
        $stmt->execute([$reward, $aznReward, $userId]);
        
        // Log task completion
        $stmt = $pdo->prepare("
            INSERT INTO task_completions (user_id, task_type, reward, verification_code)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $taskType, $reward, $verificationCode]);
        
        // Log activity
        logActivity($pdo, $userId, 'complete_task', "Completed {$taskType} task and earned {$reward} ADSCOIN");
        
        sendResponse([
            'success' => true,
            'message' => 'Task completed successfully',
            'reward' => $reward,
            'azn_reward' => $aznReward
        ]);
        
    } catch (Exception $e) {
        error_log("Complete task error: " . $e->getMessage());
        sendResponse(['error' => 'Internal server error'], 500);
    }
}

// Handle withdraw
function handleWithdraw($pdo, $method) {
    if ($method !== 'POST') {
        sendResponse(['error' => 'Method not allowed'], 405);
    }
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['user_id'] ?? null;
        $platform = $input['platform'] ?? null;
        $accountNumber = $input['account_number'] ?? null;
        $amount = $input['amount'] ?? null;
        
        if (!$userId || !$platform || !$accountNumber || !$amount) {
            sendResponse(['error' => 'All fields required'], 400);
        }
        
        // Validate amount
        if ($amount < 3000) {
            sendResponse(['error' => 'Minimum withdrawal is 3000 ADSCOIN (3 AZN)'], 400);
        }
        
        // Check user balance
        $stmt = $pdo->prepare("SELECT adscoin_balance, azn_balance FROM user_balances WHERE user_id = ?");
        $stmt->execute([$userId]);
        $balance = $stmt->fetch();
        
        if (!$balance || $balance['adscoin_balance'] < $amount) {
            sendResponse(['error' => 'Insufficient balance'], 400);
        }
        
        // Calculate AZN amount
        $aznAmount = $amount * 0.001;
        
        // Create withdrawal request
        $stmt = $pdo->prepare("
            INSERT INTO withdrawal_requests (user_id, platform, account_number, amount_adscoin, amount_azn)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $platform, $accountNumber, $amount, $aznAmount]);
        
        // Update user balance
        $stmt = $pdo->prepare("
            UPDATE user_balances 
            SET adscoin_balance = adscoin_balance - ?,
                azn_balance = azn_balance - ?,
                updated_at = NOW()
            WHERE user_id = ?
        ");
        $stmt->execute([$amount, $aznAmount, $userId]);
        
        // Log activity
        logActivity($pdo, $userId, 'withdraw', "Requested withdrawal of {$amount} ADSCOIN ({$aznAmount} AZN)");
        
        sendResponse([
            'success' => true,
            'message' => 'Withdrawal request submitted successfully',
            'withdrawal_id' => $pdo->lastInsertId()
        ]);
        
    } catch (Exception $e) {
        error_log("Withdraw error: " . $e->getMessage());
        sendResponse(['error' => 'Internal server error'], 500);
    }
}

// Handle join event
function handleJoinEvent($pdo, $method) {
    if ($method !== 'POST') {
        sendResponse(['error' => 'Method not allowed'], 405);
    }
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['user_id'] ?? null;
        $eventId = $input['event_id'] ?? 'bot_first_week';
        $eventName = $input['event_name'] ?? 'BOTUN İLK HƏFTƏSİ';
        
        if (!$userId) {
            sendResponse(['error' => 'User ID required'], 400);
        }
        
        // Check if already joined
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as count 
            FROM event_participations 
            WHERE user_id = ? AND event_id = ?
        ");
        $stmt->execute([$userId, $eventId]);
        $alreadyJoined = $stmt->fetch()['count'] > 0;
        
        if ($alreadyJoined) {
            sendResponse(['error' => 'Already joined this event'], 400);
        }
        
        // Add event participation
        $stmt = $pdo->prepare("
            INSERT INTO event_participations (user_id, event_id, event_name, reward)
            VALUES (?, ?, ?, 50)
        ");
        $stmt->execute([$userId, $eventId, $eventName]);
        
        // Log activity
        logActivity($pdo, $userId, 'join_event', "Joined event: {$eventName}");
        
        sendResponse([
            'success' => true,
            'message' => 'Successfully joined event'
        ]);
        
    } catch (Exception $e) {
        error_log("Join event error: " . $e->getMessage());
        sendResponse(['error' => 'Internal server error'], 500);
    }
}

// Handle generate code
function handleGenerateCode($pdo, $method) {
    if ($method !== 'POST') {
        sendResponse(['error' => 'Method not allowed'], 405);
    }
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['user_id'] ?? null;
        $taskType = $input['task_type'] ?? 'shortlink';
        
        if (!$userId) {
            sendResponse(['error' => 'User ID required'], 400);
        }
        
        // Generate random code
        $code = strtoupper(substr(md5(uniqid()), 0, 6));
        
        // Save code to database
        $stmt = $pdo->prepare("
            INSERT INTO verification_codes (user_id, code, task_type, expires_at)
            VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))
        ");
        $stmt->execute([$userId, $code, $taskType]);
        
        // Log activity
        logActivity($pdo, $userId, 'generate_code', "Generated verification code for {$taskType}");
        
        sendResponse([
            'success' => true,
            'code' => $code,
            'expires_in' => 300 // 5 minutes
        ]);
        
    } catch (Exception $e) {
        error_log("Generate code error: " . $e->getMessage());
        sendResponse(['error' => 'Internal server error'], 500);
    }
}

// Handle verify code
function handleVerifyCode($pdo, $method) {
    if ($method !== 'POST') {
        sendResponse(['error' => 'Method not allowed'], 405);
    }
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['user_id'] ?? null;
        $code = $input['code'] ?? null;
        
        if (!$userId || !$code) {
            sendResponse(['error' => 'User ID and code required'], 400);
        }
        
        // Check code
        $stmt = $pdo->prepare("
            SELECT * FROM verification_codes 
            WHERE user_id = ? AND code = ? AND is_used = 0 AND expires_at > NOW()
        ");
        $stmt->execute([$userId, $code]);
        $verificationCode = $stmt->fetch();
        
        if (!$verificationCode) {
            sendResponse(['error' => 'Invalid or expired code'], 400);
        }
        
        sendResponse([
            'success' => true,
            'valid' => true,
            'message' => 'Code verified successfully'
        ]);
        
    } catch (Exception $e) {
        error_log("Verify code error: " . $e->getMessage());
        sendResponse(['error' => 'Internal server error'], 500);
    }
}
?>