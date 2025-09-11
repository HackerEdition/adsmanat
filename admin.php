<?php
require_once 'config.php';

// Simple authentication
session_start();
$adminPassword = 'admin123'; // Change this in production

if (isset($_POST['login'])) {
    if ($_POST['password'] === $adminPassword) {
        $_SESSION['admin_logged_in'] = true;
    } else {
        $error = 'Yanlış şifrə!';
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

if (!isset($_SESSION['admin_logged_in'])) {
    ?>
    <!DOCTYPE html>
    <html lang="az">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ADSMANAT Admin - Giriş</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                color: #ffffff;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .login-container {
                background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
                border: 2px solid #00ffff;
                border-radius: 15px;
                padding: 40px;
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
                text-align: center;
                max-width: 400px;
                width: 90%;
            }
            .logo {
                font-size: 32px;
                color: #00ffff;
                margin-bottom: 20px;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }
            h1 {
                color: #ffffff;
                margin-bottom: 30px;
            }
            input[type="password"] {
                width: 100%;
                padding: 12px;
                margin: 10px 0;
                border: 1px solid #00ffff;
                border-radius: 8px;
                background: rgba(0, 255, 255, 0.1);
                color: #ffffff;
                font-size: 16px;
            }
            input[type="password"]:focus {
                outline: none;
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
            }
            button {
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%);
                border: none;
                border-radius: 8px;
                color: #000000;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(0, 255, 255, 0.5);
            }
            .error {
                color: #ff6b6b;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="logo">💎 ADSMANAT</div>
            <h1>Admin Girişi</h1>
            <form method="POST">
                <input type="password" name="password" placeholder="Admin Şifrəsi" required>
                <button type="submit" name="login">Giriş Et</button>
                <?php if (isset($error)): ?>
                    <div class="error"><?php echo $error; ?></div>
                <?php endif; ?>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Get statistics
try {
    $pdo = getDatabaseConnection();
    
    // Get user count
    $stmt = $pdo->query("SELECT COUNT(*) as user_count FROM users");
    $userCount = $stmt->fetch()['user_count'];
    
    // Get total balance
    $stmt = $pdo->query("SELECT SUM(adscoin_balance) as total_adscoin, SUM(azn_balance) as total_azn FROM user_balances");
    $totalBalance = $stmt->fetch();
    
    // Get today's ad watches
    $stmt = $pdo->query("SELECT SUM(watch_count) as today_ads FROM ad_watches WHERE watch_date = CURDATE()");
    $todayAds = $stmt->fetch()['today_ads'] ?? 0;
    
    // Get total withdrawals
    $stmt = $pdo->query("SELECT COUNT(*) as withdrawal_count, SUM(amount) as total_withdrawn FROM withdrawals");
    $withdrawals = $stmt->fetch();
    
    // Get recent users
    $stmt = $pdo->query("
        SELECT u.*, ub.bilet_balance, ub.adscoin_balance, ub.azn_balance 
        FROM users u 
        LEFT JOIN user_balances ub ON u.id = ub.user_id 
        ORDER BY u.created_at DESC 
        LIMIT 10
    ");
    $recentUsers = $stmt->fetchAll();
    
    // Get recent withdrawals
    $stmt = $pdo->query("
        SELECT w.*, u.username, u.first_name 
        FROM withdrawals w 
        JOIN users u ON w.user_id = u.id 
        ORDER BY w.created_at DESC 
        LIMIT 10
    ");
    $recentWithdrawals = $stmt->fetchAll();
    
} catch (Exception $e) {
    $error = 'Veritabanı bağlantısı hatası: ' . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ADSMANAT Admin Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            color: #ffffff;
            min-height: 100vh;
        }
        
        .header {
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            border-bottom: 2px solid #00ffff;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }
        
        .logo {
            font-size: 24px;
            color: #00ffff;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        .logout-btn {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            color: #ffffff;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .logout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(255, 107, 107, 0.5);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            border: 1px solid #00ffff;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
        }
        
        .stat-card h3 {
            color: #00ffff;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .stat-card .value {
            font-size: 32px;
            font-weight: bold;
            color: #ffffff;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        .section {
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            border: 1px solid #00ffff;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
        }
        
        .section h2 {
            color: #00ffff;
            margin-bottom: 20px;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        .table th,
        .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #333;
        }
        
        .table th {
            background: rgba(0, 255, 255, 0.1);
            color: #00ffff;
            font-weight: bold;
        }
        
        .table tr:hover {
            background: rgba(0, 255, 255, 0.05);
        }
        
        .status-pending {
            color: #ffa500;
            font-weight: bold;
        }
        
        .status-approved {
            color: #00ff00;
            font-weight: bold;
        }
        
        .status-rejected {
            color: #ff6b6b;
            font-weight: bold;
        }
        
        .error {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .table {
                font-size: 14px;
            }
            
            .table th,
            .table td {
                padding: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">💎 ADSMANAT Admin</div>
        <a href="?logout=1" class="logout-btn">Çıxış</a>
    </div>
    
    <div class="container">
        <?php if (isset($error)): ?>
            <div class="error"><?php echo $error; ?></div>
        <?php else: ?>
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Ümumi İstifadəçilər</h3>
                    <div class="value"><?php echo number_format($userCount); ?></div>
                </div>
                
                <div class="stat-card">
                    <h3>Ümumi ADSCOİN</h3>
                    <div class="value"><?php echo number_format($totalBalance['total_adscoin'] ?? 0); ?></div>
                </div>
                
                <div class="stat-card">
                    <h3>Ümumi AZN</h3>
                    <div class="value"><?php echo number_format($totalBalance['total_azn'] ?? 0, 2); ?></div>
                </div>
                
                <div class="stat-card">
                    <h3>Bu Günkü Reklamlar</h3>
                    <div class="value"><?php echo number_format($todayAds); ?></div>
                </div>
                
                <div class="stat-card">
                    <h3>Çıxarış Sayı</h3>
                    <div class="value"><?php echo number_format($withdrawals['withdrawal_count'] ?? 0); ?></div>
                </div>
                
                <div class="stat-card">
                    <h3>Çıxarılan Məbləğ</h3>
                    <div class="value"><?php echo number_format($withdrawals['total_withdrawn'] ?? 0); ?></div>
                </div>
            </div>
            
            <div class="section">
                <h2>Son İstifadəçilər</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ad</th>
                            <th>Username</th>
                            <th>Bilet</th>
                            <th>ADSCOİN</th>
                            <th>AZN</th>
                            <th>Tarix</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recentUsers as $user): ?>
                            <tr>
                                <td><?php echo $user['telegram_id']; ?></td>
                                <td><?php echo htmlspecialchars($user['first_name'] ?? ''); ?></td>
                                <td>@<?php echo htmlspecialchars($user['username'] ?? ''); ?></td>
                                <td><?php echo number_format($user['bilet_balance'] ?? 0); ?></td>
                                <td><?php echo number_format($user['adscoin_balance'] ?? 0); ?></td>
                                <td><?php echo number_format($user['azn_balance'] ?? 0, 2); ?></td>
                                <td><?php echo date('d.m.Y H:i', strtotime($user['created_at'])); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            
            <div class="section">
                <h2>Son Çıxarışlar</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>İstifadəçi</th>
                            <th>Platform</th>
                            <th>Telefon</th>
                            <th>Məbləğ</th>
                            <th>Status</th>
                            <th>Tarix</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recentWithdrawals as $withdrawal): ?>
                            <tr>
                                <td><?php echo $withdrawal['id']; ?></td>
                                <td><?php echo htmlspecialchars($withdrawal['first_name'] ?? $withdrawal['username'] ?? ''); ?></td>
                                <td><?php echo htmlspecialchars($withdrawal['platform']); ?></td>
                                <td><?php echo htmlspecialchars($withdrawal['phone_number']); ?></td>
                                <td><?php echo number_format($withdrawal['amount']); ?> ADSCOİN</td>
                                <td class="status-<?php echo $withdrawal['status']; ?>">
                                    <?php echo strtoupper($withdrawal['status']); ?>
                                </td>
                                <td><?php echo date('d.m.Y H:i', strtotime($withdrawal['created_at'])); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>