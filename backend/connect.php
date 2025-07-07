<?php
$host = $env['DB_HOST'] ?? 'db';
$user = $env['DB_USERNAME'] ?? 'root';
$pass = $env['DB_PASSWORD'] ?? '';
$dbname = $env['DB_DATABASE'] ?? 'form';

// Kết nối MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die('Kết nối thất bại: ' . $conn->connect_error);
}
?>