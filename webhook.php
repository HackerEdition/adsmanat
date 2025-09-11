<?php
require_once 'config.php';

// Get the raw POST data
$input = file_get_contents('php://input');
$update = json_decode($input, true);

// Log the webhook data
writeLog('INFO', 'Webhook received', ['update' => $update]);

// Verify the request is from Telegram
if (!isTelegramRequest()) {
    writeLog('WARNING', 'Request not from Telegram', ['ip' => $_SERVER['REMOTE_ADDR']]);
    http_response_code(403);
    exit('Forbidden');
}

// Handle the update
if (isset($update['message'])) {
    handleMessage($update['message']);
} elseif (isset($update['callback_query'])) {
    handleCallbackQuery($update['callback_query']);
} elseif (isset($update['web_app_data'])) {
    handleWebAppData($update['web_app_data']);
}

// Handle regular messages
function handleMessage($message) {
    $chatId = $message['chat']['id'];
    $text = $message['text'] ?? '';
    $user = $message['from'] ?? [];
    
    writeLog('INFO', 'Message received', [
        'chat_id' => $chatId,
        'text' => $text,
        'user' => $user
    ]);
    
    // Handle different commands
    switch ($text) {
        case '/start':
            sendWelcomeMessage($chatId, $user);
            break;
        case '/help':
            sendHelpMessage($chatId);
            break;
        case '/balance':
            sendBalanceMessage($chatId, $user);
            break;
        case '/stats':
            sendStatsMessage($chatId, $user);
            break;
        default:
            sendDefaultMessage($chatId);
            break;
    }
}

// Handle callback queries
function handleCallbackQuery($callbackQuery) {
    $chatId = $callbackQuery['message']['chat']['id'];
    $data = $callbackQuery['data'] ?? '';
    $user = $callbackQuery['from'] ?? [];
    
    writeLog('INFO', 'Callback query received', [
        'chat_id' => $chatId,
        'data' => $data,
        'user' => $user
    ]);
    
    // Answer the callback query
    answerCallbackQuery($callbackQuery['id']);
    
    // Handle different callback data
    switch ($data) {
        case 'open_app':
            openMiniApp($chatId);
            break;
        case 'get_balance':
            sendBalanceMessage($chatId, $user);
            break;
        case 'get_help':
            sendHelpMessage($chatId);
            break;
    }
}

// Handle web app data
function handleWebAppData($webAppData) {
    $data = $webAppData['data'] ?? '';
    $user = $webAppData['user'] ?? [];
    
    writeLog('INFO', 'Web app data received', [
        'data' => $data,
        'user' => $user
    ]);
    
    // Process web app data
    $decodedData = json_decode($data, true);
    
    if ($decodedData) {
        processWebAppData($decodedData, $user);
    }
}

// Send welcome message
function sendWelcomeMessage($chatId, $user) {
    $firstName = $user['first_name'] ?? 'İstifadəçi';
    $username = $user['username'] ?? '';
    
    $message = "🎉 Salam $firstName!\n\n";
    $message .= "ADSMANAT-a xoş gəlmisiniz! 💎\n\n";
    $message .= "Bu bot ilə:\n";
    $message .= "• Reklam izləyərək pul qazana bilərsiniz 📺\n";
    $message .= "• Görevlər tamamlayaraq bonus qazana bilərsiniz 🎯\n";
    $message .= "• Hadisələrdə iştirak edərək hədiyyə qazana bilərsiniz 🎁\n";
    $message .= "• Qazandığınız pulu M10-a çıxara bilərsiniz 💰\n\n";
    $message .= "Başlamaq üçün aşağıdakı düyməni basın:";
    
    $keyboard = [
        'inline_keyboard' => [
            [
                [
                    'text' => '🚀 ADSMANAT-ı Aç',
                    'web_app' => ['url' => APP_URL]
                ]
            ],
            [
                [
                    'text' => '💰 Balansım',
                    'callback_data' => 'get_balance'
                ],
                [
                    'text' => '❓ Kömək',
                    'callback_data' => 'get_help'
                ]
            ]
        ]
    ];
    
    sendMessage($chatId, $message, $keyboard);
}

// Send help message
function sendHelpMessage($chatId) {
    $message = "📚 ADSMANAT Kömək\n\n";
    $message .= "🔹 Reklam İzlə: Gündə 20 reklam izləyərək bilet qazanın\n";
    $message .= "🔹 Bilet-ADSCOİN: Qazandığınız biletləri ADSCOİN-ə çevirin\n";
    $message .= "🔹 Görevlər: Günlük və özəl görevləri tamamlayın\n";
    $message .= "🔹 Hadisələr: Xüsusi tədbirlərdə iştirak edin\n";
    $message .= "🔹 Çıxarış: M10-a pul çıxarın\n\n";
    $message .= "Daha çox məlumat üçün ADSMANAT tətbiqini açın!";
    
    $keyboard = [
        'inline_keyboard' => [
            [
                [
                    'text' => '🚀 ADSMANAT-ı Aç',
                    'web_app' => ['url' => APP_URL]
                ]
            ]
        ]
    ];
    
    sendMessage($chatId, $message, $keyboard);
}

// Send balance message
function sendBalanceMessage($chatId, $user) {
    $telegramId = $user['id'] ?? null;
    
    if (!$telegramId) {
        sendMessage($chatId, "❌ İstifadəçi məlumatları tapılmadı.");
        return;
    }
    
    try {
        $pdo = getDatabaseConnection();
        
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
        
        $message = "💰 Balansınız\n\n";
        $message .= "🎟 Bilet: " . number_format($balance['bilet_balance']) . "\n";
        $message .= "💎 ADSCOİN: " . number_format($balance['adscoin_balance']) . "\n";
        $message .= "💵 AZN: " . number_format($balance['azn_balance'], 2) . "\n\n";
        $message .= "Daha çox qazanmaq üçün ADSMANAT-ı açın!";
        
        $keyboard = [
            'inline_keyboard' => [
                [
                    [
                        'text' => '🚀 ADSMANAT-ı Aç',
                        'web_app' => ['url' => APP_URL]
                    ]
                ]
            ]
        ];
        
        sendMessage($chatId, $message, $keyboard);
        
    } catch (Exception $e) {
        writeLog('ERROR', 'Failed to get balance', ['error' => $e->getMessage()]);
        sendMessage($chatId, "❌ Balans məlumatları alına bilmədi.");
    }
}

// Send stats message
function sendStatsMessage($chatId, $user) {
    $telegramId = $user['id'] ?? null;
    
    if (!$telegramId) {
        sendMessage($chatId, "❌ İstifadəçi məlumatları tapılmadı.");
        return;
    }
    
    try {
        $pdo = getDatabaseConnection();
        
        // Get user stats
        $stmt = $pdo->prepare("
            SELECT 
                (SELECT SUM(watch_count) FROM ad_watches WHERE user_id = u.id) as total_ads,
                (SELECT COUNT(*) FROM task_completions WHERE user_id = u.id) as tasks_completed,
                (SELECT COUNT(*) FROM withdrawals WHERE user_id = u.id) as withdrawals_count
            FROM users u 
            WHERE u.telegram_id = ?
        ");
        $stmt->execute([$telegramId]);
        $stats = $stmt->fetch();
        
        $message = "📊 Statistikanız\n\n";
        $message .= "📺 Ümumi Reklam: " . ($stats['total_ads'] ?? 0) . "\n";
        $message .= "✅ Tamamlanan Görev: " . ($stats['tasks_completed'] ?? 0) . "\n";
        $message .= "💸 Çıxarış Sayı: " . ($stats['withdrawals_count'] ?? 0) . "\n\n";
        $message .= "Daha çox qazanmaq üçün ADSMANAT-ı açın!";
        
        $keyboard = [
            'inline_keyboard' => [
                [
                    [
                        'text' => '🚀 ADSMANAT-ı Aç',
                        'web_app' => ['url' => APP_URL]
                    ]
                ]
            ]
        ];
        
        sendMessage($chatId, $message, $keyboard);
        
    } catch (Exception $e) {
        writeLog('ERROR', 'Failed to get stats', ['error' => $e->getMessage()]);
        sendMessage($chatId, "❌ Statistika məlumatları alına bilmədi.");
    }
}

// Send default message
function sendDefaultMessage($chatId) {
    $message = "🤖 ADSMANAT Bot\n\n";
    $message .= "Mənə kömək etmək üçün /help əmrini istifadə edin.\n";
    $message .= "ADSMANAT tətbiqini açmaq üçün /start əmrini istifadə edin.";
    
    $keyboard = [
        'inline_keyboard' => [
            [
                [
                    'text' => '🚀 ADSMANAT-ı Aç',
                    'web_app' => ['url' => APP_URL]
                ]
            ]
        ]
    ];
    
    sendMessage($chatId, $message, $keyboard);
}

// Open mini app
function openMiniApp($chatId) {
    $message = "🚀 ADSMANAT Tətbiqi\n\n";
    $message .= "Aşağıdakı düyməni basaraq ADSMANAT tətbiqini açın:";
    
    $keyboard = [
        'inline_keyboard' => [
            [
                [
                    'text' => '🚀 ADSMANAT-ı Aç',
                    'web_app' => ['url' => APP_URL]
                ]
            ]
        ]
    ];
    
    sendMessage($chatId, $message, $keyboard);
}

// Process web app data
function processWebAppData($data, $user) {
    $telegramId = $user['id'] ?? null;
    
    if (!$telegramId) {
        writeLog('ERROR', 'No telegram ID in web app data');
        return;
    }
    
    // Update user data if provided
    if (isset($data['user_data'])) {
        updateUserFromWebApp($telegramId, $data['user_data']);
    }
    
    // Process any other web app data
    writeLog('INFO', 'Web app data processed', ['data' => $data]);
}

// Update user from web app
function updateUserFromWebApp($telegramId, $userData) {
    try {
        $pdo = getDatabaseConnection();
        
        $stmt = $pdo->prepare("
            INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, language) 
            VALUES (?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            username = VALUES(username),
            first_name = VALUES(first_name),
            last_name = VALUES(last_name),
            photo_url = VALUES(photo_url),
            language = VALUES(language)
        ");
        
        $stmt->execute([
            $telegramId,
            $userData['username'] ?? null,
            $userData['first_name'] ?? null,
            $userData['last_name'] ?? null,
            $userData['photo_url'] ?? null,
            $userData['language'] ?? 'az'
        ]);
        
        writeLog('INFO', 'User updated from web app', ['telegram_id' => $telegramId]);
        
    } catch (Exception $e) {
        writeLog('ERROR', 'Failed to update user from web app', ['error' => $e->getMessage()]);
    }
}

// Send message to Telegram
function sendMessage($chatId, $text, $keyboard = null) {
    $url = "https://api.telegram.org/bot" . TELEGRAM_BOT_TOKEN . "/sendMessage";
    
    $data = [
        'chat_id' => $chatId,
        'text' => $text,
        'parse_mode' => 'HTML'
    ];
    
    if ($keyboard) {
        $data['reply_markup'] = json_encode($keyboard);
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        writeLog('ERROR', 'Failed to send message', [
            'chat_id' => $chatId,
            'http_code' => $httpCode,
            'result' => $result
        ]);
    }
    
    return $result;
}

// Answer callback query
function answerCallbackQuery($callbackQueryId, $text = null, $showAlert = false) {
    $url = "https://api.telegram.org/bot" . TELEGRAM_BOT_TOKEN . "/answerCallbackQuery";
    
    $data = [
        'callback_query_id' => $callbackQueryId
    ];
    
    if ($text) {
        $data['text'] = $text;
    }
    
    if ($showAlert) {
        $data['show_alert'] = true;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $result = curl_exec($ch);
    curl_close($ch);
    
    return $result;
}

// Set webhook
function setWebhook() {
    $url = "https://api.telegram.org/bot" . TELEGRAM_BOT_TOKEN . "/setWebhook";
    $webhookUrl = TELEGRAM_WEBHOOK_URL;
    
    $data = [
        'url' => $webhookUrl
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $result = curl_exec($ch);
    curl_close($ch);
    
    return $result;
}

// Handle webhook setup request
if (isset($_GET['setup']) && $_GET['setup'] === 'webhook') {
    $result = setWebhook();
    echo "Webhook setup result: " . $result;
    exit;
}

// Log webhook processing completion
writeLog('INFO', 'Webhook processed successfully');
?>