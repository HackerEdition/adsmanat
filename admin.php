<?php
require_once 'config.php';

// Simple admin authentication
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    if ($_POST['admin_password'] === 'admin123') { // Change this password
        $_SESSION['admin_logged_in'] = true;
    } else {
        if ($_POST['admin_password']) {
            $error = 'Invalid password';
        }
    }
}

if (!isset($_SESSION['admin_logged_in'])) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>ADSMANAT Admin</title>
        <style>
            body { font-family: Arial, sans-serif; background: #1a1a1a; color: white; }
            .login-form { max-width: 300px; margin: 100px auto; padding: 20px; background: #2a2a2a; border-radius: 10px; }
            input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #00ffff; background: #1a1a1a; color: white; }
            button { width: 100%; padding: 10px; background: #00ffff; color: black; border: none; border-radius: 5px; }
            .error { color: #ff0000; }
        </style>
    </head>
    <body>
        <div class="login-form">
            <h2>ADSMANAT Admin Login</h2>
            <?php if (isset($error)) echo "<p class='error'>$error</p>"; ?>
            <form method="post">
                <input type="password" name="admin_password" placeholder="Admin Password" required>
                <button type="submit">Login</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Get statistics
try {
    // User count
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $userCount = $stmt->fetch()['count'];
    
    // Total bilet
    $stmt = $pdo->query("SELECT SUM(bilet_balance) as total FROM user_balances");
    $totalBilet = $stmt->fetch()['total'] ?? 0;
    
    // Total ADSCOIN
    $stmt = $pdo->query("SELECT SUM(adscoin_balance) as total FROM user_balances");
    $totalAdscoin = $stmt->fetch()['total'] ?? 0;
    
    // Total AZN
    $stmt = $pdo->query("SELECT SUM(azn_balance) as total FROM user_balances");
    $totalAzn = $stmt->fetch()['total'] ?? 0;
    
    // Today's ads
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM ad_history WHERE DATE(watched_at) = CURDATE()");
    $todayAds = $stmt->fetch()['count'];
    
    // Pending withdrawals
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM withdrawal_requests WHERE status = 'pending'");
    $pendingWithdrawals = $stmt->fetch()['count'];
    
    // Recent activity
    $stmt = $pdo->query("
        SELECT al.*, u.first_name, u.username 
        FROM activity_logs al 
        LEFT JOIN users u ON al.user_id = u.id 
        ORDER BY al.created_at DESC 
        LIMIT 10
    ");
    $recentActivity = $stmt->fetchAll();
    
} catch (Exception $e) {
    $error = "Database error: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>ADSMANAT Admin Panel</title>
    <style>
        body { font-family: Arial, sans-serif; background: #1a1a1a; color: white; margin: 0; }
        .header { background: #2a2a2a; padding: 20px; border-bottom: 2px solid #00ffff; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #2a2a2a; padding: 20px; border-radius: 10px; border: 1px solid #00ffff; text-align: center; }
        .stat-number { font-size: 2em; color: #00ffff; font-weight: bold; }
        .stat-label { color: #ccc; margin-top: 10px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table th, .table td { padding: 10px; border: 1px solid #333; text-align: left; }
        .table th { background: #333; color: #00ffff; }
        .table tr:nth-child(even) { background: #2a2a2a; }
        .logout { float: right; background: #ff0000; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ADSMANAT Admin Panel</h1>
        <a href="?logout=1" class="logout">Logout</a>
    </div>
    
    <div class="container">
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number"><?php echo number_format($userCount); ?></div>
                <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo number_format($totalBilet); ?></div>
                <div class="stat-label">Total Bilet</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo number_format($totalAdscoin); ?></div>
                <div class="stat-label">Total ADSCOIN</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo number_format($totalAzn, 2); ?></div>
                <div class="stat-label">Total AZN</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo number_format($todayAds); ?></div>
                <div class="stat-label">Today's Ads</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo number_format($pendingWithdrawals); ?></div>
                <div class="stat-label">Pending Withdrawals</div>
            </div>
        </div>
        
        <h2>Recent Activity</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Details</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($recentActivity as $activity): ?>
                <tr>
                    <td><?php echo htmlspecialchars($activity['first_name'] . ' (@' . $activity['username'] . ')'); ?></td>
                    <td><?php echo htmlspecialchars($activity['action']); ?></td>
                    <td><?php echo htmlspecialchars($activity['details'] ?? ''); ?></td>
                    <td><?php echo date('Y-m-d H:i:s', strtotime($activity['created_at'])); ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>

<?php
// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}
?>