<?php
// Hiển thị lỗi để dễ debug (chỉ trong môi trường phát triển)
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// Bắt đầu output buffering để kiểm soát output
ob_start();

// Thiết lập CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

$logFile = __DIR__ . '/debug.log';
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'none';

// Xử lý preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit();
}

// =======================
// Load biến từ .env
// =======================
$envPath = realpath(__DIR__ . '/.env'); // Đọc file .env riêng cho backend
$env = file_exists($envPath) ? parse_ini_file($envPath, false, INI_SCANNER_RAW) : [];

// Lấy host cho ảnh từ biến môi trường BACKEND_HOST (quản lý link ảnh)
$backendHost = $env['BACKEND_HOST'] ?? 'http://localhost:8080';

try {
    // Kết nối cơ sở dữ liệu
    require_once __DIR__ . '/connect.php';

    // Lấy tham số từ query string
    $identifier = $_GET['identifier'] ?? null;
    $identifierType = $_GET['identifierType'] ?? null;

    // Kiểm tra đầu vào
    if (!$identifier || !in_array($identifierType, ['phone', 'email'])) {
        throw new Exception("Thiếu hoặc không hợp lệ identifier");
    }


    // Truy vấn cơ sở dữ liệu
    $identifierColumn = $identifierType === "phone" ? "phone" : "email";
    $stmt = $conn->prepare("SELECT user, phone, email FROM tai_khoan WHERE $identifierColumn = ?");
    $stmt->bind_param("s", $identifier);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("Không tìm thấy tài khoản với $identifierColumn = $identifier");
    }

    $userData = $result->fetch_assoc();
    $userData['avatarUrl'] = getUserAvatar($identifier);

    // Ghi log dữ liệu trả về

    echo json_encode(['success' => true, 'data' => $userData]);

    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Lỗi server: ' . $e->getMessage()]);
} finally {
    ob_end_flush();
}

// =======================
// Hàm lấy avatar URL
// =======================
function getUserAvatar($identifier) {
    global $backendHost;
    $avatarDir = __DIR__ . '/uploads/avatars/';
    $avatarPattern = $avatarDir . 'avatar_' . $identifier . '.*';
    $existingAvatars = glob($avatarPattern);

    if (!empty($existingAvatars)) {
        $existingAvatar = basename($existingAvatars[0]);
        return rtrim($backendHost, '/') . '/uploads/avatars/' . $existingAvatar;
    }
    return null;
}
?>
