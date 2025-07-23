<?php
// Set timezone to Vietnam (UTC+7)
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Đọc file .env vào biến $env
$env = [];
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (!strpos($line, '=')) continue;
        list($key, $value) = explode('=', $line, 2);
        $env[trim($key)] = trim($value);
    }
}

$host = $env['DB_HOST'];
$user = $env['DB_USERNAME'];
$pass = $env['DB_PASSWORD'];
$dbname = $env['DB_DATABASE'];

// Kết nối MySQL
$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die('Kết nối thất bại: ' . $conn->connect_error);
}

// Set MySQL timezone to Vietnam
$conn->query("SET time_zone = '+07:00'");
?>