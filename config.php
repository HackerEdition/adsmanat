<?php
// ADSMANAT Configuration File

// Database Configuration
define('DB_HOST', 'sql211.infinityfree.com');
define('DB_NAME', 'if0_39059246_adcmanat');
define('DB_USER', 'if0_39059246');
define('DB_PASS', 'n4TEZuJcP2rq5');
define('DB_CHARSET', 'utf8mb4');

// App Configuration
define('APP_NAME', 'ADSMANAT');
define('APP_VERSION', '1.0.0');
define('APP_URL', 'https://adsmanat.infinityfreeapp.com');

// Telegram Configuration
define('TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN_HERE');
define('TELEGRAM_WEBHOOK_URL', APP_URL . '/webhook.php');

// System Settings
define('DAILY_AD_LIMIT', 20);
define('MIN_WITHDRAWAL_AMOUNT', 3000);
define('ADSCOIN_TO_AZN_RATE', 0.001);
define('VERIFICATION_CODE_EXPIRE_MINUTES', 10);

// Security Settings
define('ENCRYPTION_KEY', 'your_encryption_key_here');
define('JWT_SECRET', 'your_jwt_secret_here');

// API Settings
define('API_RATE_LIMIT', 100); // requests per hour
define('API_RATE_WINDOW', 3600); // 1 hour in seconds

// File Upload Settings
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_FILE_TYPES', ['jpg', 'jpeg', 'png', 'gif']);

// Logging Settings
define('LOG_LEVEL', 'INFO'); // DEBUG, INFO, WARNING, ERROR
define('LOG_FILE', 'logs/app.log');

// Cache Settings
define('CACHE_ENABLED', true);
define('CACHE_TTL', 3600); // 1 hour

// Error Reporting
if (defined('ENVIRONMENT') && ENVIRONMENT === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('Asia/Baku');

// Session Configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 1);

// CORS Headers
function setCorsHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
}

// Database Connection
function getDatabaseConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
            ]);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }
    
    return $pdo;
}

// Logging Function
function writeLog($level, $message, $context = []) {
    if (!defined('LOG_LEVEL')) return;
    
    $levels = ['DEBUG' => 0, 'INFO' => 1, 'WARNING' => 2, 'ERROR' => 3];
    $currentLevel = $levels[LOG_LEVEL] ?? 1;
    $messageLevel = $levels[$level] ?? 1;
    
    if ($messageLevel >= $currentLevel) {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[$timestamp] [$level] $message";
        
        if (!empty($context)) {
            $logMessage .= " " . json_encode($context);
        }
        
        $logMessage .= PHP_EOL;
        
        if (defined('LOG_FILE')) {
            file_put_contents(LOG_FILE, $logMessage, FILE_APPEND | LOCK_EX);
        } else {
            error_log($logMessage);
        }
    }
}

// Rate Limiting
function checkRateLimit($identifier, $limit = API_RATE_LIMIT, $window = API_RATE_WINDOW) {
    $cacheKey = "rate_limit_" . md5($identifier);
    $currentTime = time();
    
    // Get current requests
    $requests = apcu_fetch($cacheKey) ?: [];
    
    // Remove old requests outside the window
    $requests = array_filter($requests, function($timestamp) use ($currentTime, $window) {
        return ($currentTime - $timestamp) < $window;
    });
    
    // Check if limit exceeded
    if (count($requests) >= $limit) {
        return false;
    }
    
    // Add current request
    $requests[] = $currentTime;
    apcu_store($cacheKey, $requests, $window);
    
    return true;
}

// Input Validation
function validateInput($data, $rules) {
    $errors = [];
    
    foreach ($rules as $field => $rule) {
        $value = $data[$field] ?? null;
        
        // Required check
        if (isset($rule['required']) && $rule['required'] && empty($value)) {
            $errors[$field] = "Field $field is required";
            continue;
        }
        
        // Skip other validations if field is empty and not required
        if (empty($value)) continue;
        
        // Type check
        if (isset($rule['type'])) {
            switch ($rule['type']) {
                case 'email':
                    if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        $errors[$field] = "Field $field must be a valid email";
                    }
                    break;
                case 'int':
                    if (!is_numeric($value) || (int)$value != $value) {
                        $errors[$field] = "Field $field must be an integer";
                    }
                    break;
                case 'float':
                    if (!is_numeric($value)) {
                        $errors[$field] = "Field $field must be a number";
                    }
                    break;
                case 'string':
                    if (!is_string($value)) {
                        $errors[$field] = "Field $field must be a string";
                    }
                    break;
            }
        }
        
        // Length check
        if (isset($rule['min_length']) && strlen($value) < $rule['min_length']) {
            $errors[$field] = "Field $field must be at least {$rule['min_length']} characters";
        }
        
        if (isset($rule['max_length']) && strlen($value) > $rule['max_length']) {
            $errors[$field] = "Field $field must be no more than {$rule['max_length']} characters";
        }
        
        // Range check
        if (isset($rule['min']) && $value < $rule['min']) {
            $errors[$field] = "Field $field must be at least {$rule['min']}";
        }
        
        if (isset($rule['max']) && $value > $rule['max']) {
            $errors[$field] = "Field $field must be no more than {$rule['max']}";
        }
    }
    
    return $errors;
}

// Response Helper
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

// Error Response Helper
function sendError($message, $statusCode = 400, $code = null) {
    $response = ['error' => $message];
    if ($code) {
        $response['code'] = $code;
    }
    sendResponse($response, $statusCode);
}

// Success Response Helper
function sendSuccess($data = null, $message = 'Success') {
    $response = ['success' => true, 'message' => $message];
    if ($data !== null) {
        $response['data'] = $data;
    }
    sendResponse($response);
}

// Sanitize Input
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Generate Random String
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    
    return $randomString;
}

// Encrypt Data
function encryptData($data, $key = ENCRYPTION_KEY) {
    $iv = random_bytes(16);
    $encrypted = openssl_encrypt($data, 'AES-256-CBC', $key, 0, $iv);
    return base64_encode($iv . $encrypted);
}

// Decrypt Data
function decryptData($data, $key = ENCRYPTION_KEY) {
    $data = base64_decode($data);
    $iv = substr($data, 0, 16);
    $encrypted = substr($data, 16);
    return openssl_decrypt($encrypted, 'AES-256-CBC', $key, 0, $iv);
}

// Check if request is from Telegram
function isTelegramRequest() {
    $telegramIPs = [
        '149.154.160.0/20',
        '91.108.4.0/22'
    ];
    
    $clientIP = $_SERVER['REMOTE_ADDR'] ?? '';
    
    foreach ($telegramIPs as $ipRange) {
        if (ipInRange($clientIP, $ipRange)) {
            return true;
        }
    }
    
    return false;
}

// Check if IP is in range
function ipInRange($ip, $range) {
    if (strpos($range, '/') === false) {
        return $ip === $range;
    }
    
    list($subnet, $bits) = explode('/', $range);
    $ip = ip2long($ip);
    $subnet = ip2long($subnet);
    $mask = -1 << (32 - $bits);
    $subnet &= $mask;
    
    return ($ip & $mask) === $subnet;
}

// Set CORS headers on every request
setCorsHeaders();
?>