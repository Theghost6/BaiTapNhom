<?php
// Hiển thị lỗi để dễ debug (chỉ trong môi trường phát triển)
ini_set('display_errors', 0); // Disable display to prevent JSON corruption
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// Bắt đầu output buffering để kiểm soát output
ob_start();

// Thiết lập CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Use GET instead of POST
header("Content-Type: application/json; charset=UTF-8");

$logFile = __DIR__ . '/debug.log';

// Ghi log origin để debug
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'none';
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Origin: $origin\n", FILE_APPEND);

// Xử lý preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit();
}

try {
    // Kết nối cơ sở dữ liệu
    $conn = new mysqli("localhost", "root", "", "form");
    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Lấy tham số từ query string
    $identifier = $_GET['identifier'] ?? null;
    $identifierType = $_GET['identifierType'] ?? null;

    // Kiểm tra đầu vào
    if (!$identifier || !in_array($identifierType, ['phone', 'email'])) {
        throw new Exception("Thiếu hoặc không hợp lệ identifier");
    }

    // Ghi log tham số đầu vào
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Identifier: $identifier, Type: $identifierType\n", FILE_APPEND);

    // Truy vấn cơ sở dữ liệu
    $identifierColumn = $identifierType === "phone" ? "phone" : "email";
    $stmt = $conn->prepare("SELECT user, phone, email FROM dang_ky WHERE $identifierColumn = ?");
    $stmt->bind_param("s", $identifier);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Không tìm thấy tài khoản với $identifierColumn = $identifier");
    }

    $userData = $result->fetch_assoc();
    $userData['avatarUrl'] = getUserAvatar($identifier);

    // Ghi log dữ liệu trả về
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - User data: " . print_r($userData, true) . "\n", FILE_APPEND);

    echo json_encode(['success' => true, 'data' => $userData]);

    $conn->close();
} catch (Exception $e) {
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Lỗi server: ' . $e->getMessage()]);
} finally {
    ob_end_flush();
}

function getUserAvatar($identifier) {
    $avatarDir = __DIR__ . '/uploads/avatars/';
    $avatarPattern = $avatarDir . 'avatar_' . $identifier . '.*';
    $existingAvatars = glob($avatarPattern);
    
    if (!empty($existingAvatars)) {
        $existingAvatar = basename($existingAvatars[0]);
        return 'http://localhost/BaiTapNhom/backend/uploads/avatars/' . $existingAvatar;
    }
    
    return null;
}
?>
