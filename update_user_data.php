<?php
$data = json_decode(file_get_contents("php://input"), true);

$conn = new mysqli("sql8.freesqldatabase.com", "sql8780594", "s3Alaib8pR", "sql8780594");
if ($conn->connect_error) die("Bağlantı xətası");

$id = intval($data['id']);
$views = intval($data['ad_views']);
$coins = intval($data['coin_balance']);

// Mövcud deyilsə, əlavə et
$conn->query("INSERT IGNORE INTO users (id, ad_views, coin_balance) VALUES ($id, 0, 0)");

$sql = "UPDATE users SET ad_views = $views, coin_balance = $coins WHERE id = $id";
$conn->query($sql);
?>
