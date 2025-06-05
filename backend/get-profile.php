<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ob_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

$logFile = __DIR__ . '/debug.log';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit();
}

try {
    $conn = new mysqli("localhost", "root", "", "form");

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    $identifier = $_GET['identifier'] ?? null;
    $identifierType = $_GET['identifierType'] ?? null;

    if (!$identifier || !in_array($identifierType, ['phone', 'email'])) {
        echo json_encode(['success' => false, 'message' => 'Thiếu hoặc không hợp lệ identifier']);
        ob_end_flush();
        exit();
    }

    $identifierColumn = $identifierType === "phone" ? "phone" : "email";
    $stmt = $conn->prepare("SELECT user, phone, email FROM dang_ky WHERE $identifierColumn = ?");
    $stmt->bind_param("s", $identifier);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => "Không tìm thấy tài khoản với $identifierColumn = $identifier"]);
        ob_end_flush();
        exit();
    }

    $userData = $result->fetch_assoc();
    $userData['avatarUrl'] = getUserAvatar($identifier);

    echo json_encode(['success' => true, 'data' => $userData]);

    $conn->close();
} catch (Exception $e) {
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
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
