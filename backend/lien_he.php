<?php
// Start output buffering at the very beginning
ob_start();

// Set timezone to Vietnam
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Set headers
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_clean();
    exit;
}

// Sử dụng file connect.php
require_once __DIR__ . '/connect.php';

// Kiểm tra kết nối MySQLi
if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    ob_end_clean();
    echo json_encode(["message" => "Lỗi kết nối database: " . ($conn->connect_error ?? "Connection not available")]);
    exit;
}

try {
    // Handle POST request
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get raw POST data
        $json = file_get_contents('php://input');
        
        // Check if data was received
        if (empty($json)) {
            http_response_code(400);
            ob_end_clean();
            echo json_encode(["message" => "Không có dữ liệu được gửi"]);
            exit;
        }
        
        $input = json_decode($json, true);

        // Check if JSON decoding failed
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            ob_end_clean();
            echo json_encode(["message" => "Dữ liệu JSON không hợp lệ: " . json_last_error_msg()]);
            exit;
        }

        // Validate required fields
        if (empty($input['firstName']) || empty($input['email']) || empty($input['message'])) {
            http_response_code(400);
            ob_end_clean();
            echo json_encode(["message" => "Vui lòng điền đầy đủ các trường bắt buộc"]);
            exit;
        }

        // Sanitize inputs với MySQLi
        $firstName = $conn->real_escape_string(trim($input['firstName']));
        $email = $conn->real_escape_string(trim($input['email']));
        $phone = !empty($input['phone']) ? $conn->real_escape_string(trim($input['phone'])) : null;
        $message = $conn->real_escape_string(trim($input['message']));

        // Execute SQL query với MySQLi
        $phone_value = $phone ? "'$phone'" : "NULL";
        $sql = "INSERT INTO lien_he (ten, email, sdt, noi_dung) VALUES ('$firstName', '$email', $phone_value, '$message')";
        
        if (!$conn->query($sql)) {
            throw new Exception($conn->error);
        }

        http_response_code(200);
        ob_end_clean();
        echo json_encode(["message" => "Gửi biểu mẫu thành công"]);
        exit;
    } else {
        http_response_code(405);
        ob_end_clean();
        echo json_encode(["message" => "Phương thức không được phép"]);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    ob_end_clean();
    echo json_encode(["message" => "Lỗi server: " . $e->getMessage()]);
    exit;
}

// Đóng kết nối
if (isset($conn)) {
    $conn->close();
}

// Clear any remaining buffer
ob_end_clean();
?>