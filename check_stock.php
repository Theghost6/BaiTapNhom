<?php
// Cấu hình CORS
header('Access-Control-Allow-Origin: *'); // Cho phép tất cả các origin
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Bật error reporting để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cấu hình kết nối database
$host = 'localhost';
$db_name = 'form';
$username = 'root';
$password = '';

// ... existing code ... 