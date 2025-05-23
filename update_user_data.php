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

$data = json_decode(file_get_contents('php://input'), true);

$id = intval($data['id']);
$ad_views = intval($data['ad_views']);
$coin_balance = intval($data['coin_balance']);

$sql = "UPDATE users SET ad_views = $ad_views, coin_balance = $coin_balance WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Yenilənmə xətası']);
}

$conn->close();
?>
