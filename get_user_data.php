<?php
$conn = new mysqli("sql8.freesqldatabase.com", "sql8780594", "s3Alaib8pR", "sql8780594");
if ($conn->connect_error) die("Bağlantı xətası");

$id = intval($_GET['id'] ?? 0);

// İstifadəçi mövcud deyilsə, əlavə et
$conn->query("INSERT IGNORE INTO users (id, ad_views, coin_balance) VALUES ($id, 0, 0)");

$result = $conn->query("SELECT ad_views, coin_balance FROM users WHERE id = $id");

if ($result && $row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["ad_views" => 0, "coin_balance" => 0]);
}
?>
