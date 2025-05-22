<?php
// update_user.php

header('Content-Type: application/json');

$host = "sql8.freesqldatabase.com";
$dbname = "sql8780594";
$user = "sql8780594";
$pass = "s3Alaib8pR";
$port = 3306;

$conn = new mysqli($host, $user, $pass, $dbname, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Gözlənilən POST parametrlər
$id = intval($_POST['id'] ?? 0);
$username = $_POST['username'] ?? '';
$ad_views = intval($_POST['ad_views'] ?? 0);
$coin_balance = intval($_POST['coin_balance'] ?? 0);

if (!$id || !$username) {
    http_response_code(400);
    echo json_encode(["error" => "Missing parameters"]);
    exit;
}

// Update query
$stmt = $conn->prepare("UPDATE users SET ad_views = ?, coin_balance = ? WHERE id = ? AND username = ?");
$stmt->bind_param("iiss", $ad_views, $coin_balance, $id, $username);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Update failed"]);
}

$stmt->close();
$conn->close();
?>
