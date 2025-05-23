<?php
header('Content-Type: application/json');

$host = 'sql8.freesqldatabase.com';
$db = 'sql8780594';
$user = 'sql8780594';
$pass = 's3Alaib8pR';

$conn = new mysqli($host, $user, $pass, $db, 3306);

if ($conn->connect_error) {
    echo json_encode(['error' => 'MySQL bağlantı xətası: ' . $conn->connect_error]);
    exit();
}

$id = intval($_GET['id']);
$username = $conn->real_escape_string($_GET['username'] ?? '');

$result = $conn->query("SELECT ad_views, coin_balance FROM users WHERE id = $id");

if ($result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
} else {
    // Yeni istifadəçini əlavə et
    $conn->query("INSERT INTO users (id, username, ad_views, coin_balance, created_at) VALUES ($id, '$username', 0, 0, NOW())");
    echo json_encode(['ad_views' => 0, 'coin_balance' => 0]);
}

$conn->close();
?>
