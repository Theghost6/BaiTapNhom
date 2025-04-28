<?php
// Hiển thị lỗi để dễ debug (chỉ trong môi trường phát triển)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Bắt đầu output buffering để kiểm soát output
ob_start();

// Lấy origin từ request
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'http://localhost:5173';
$allowedOrigins = ['http://localhost:5173'];

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

$logFile = __DIR__ . '/debug.log';
$rawData = file_get_contents("php://input");
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Update Profile Request: " . $rawData . PHP_EOL, FILE_APPEND);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối cơ sở dữ liệu
try {
    $conn = new mysqli("localhost", "root", "", "form");

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Parse JSON input
    $data = json_decode($rawData, true);

    // Log dữ liệu đầu vào
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Parsed data: " . print_r($data, true) . PHP_EOL, FILE_APPEND);

    // Kiểm tra dữ liệu đầu vào
    if (!isset($data['user'])) {
        echo json_encode(['success' => false, 'message' => 'Thiếu tên người dùng']);
        exit();
    }

    $username = $data['user'];
    $phone = $data['phone'] ?? null;
    $email = $data['email'] ?? null;
    $currentIdentifier = $data['currentIdentifier'] ?? null;
    $currentType = $data['currentType'] ?? null;

    // Kiểm tra loại identifier hiện tại
    if ($currentType !== "phone" && $currentType !== "email") {
        echo json_encode(['success' => false, 'message' => 'Loại identifier hiện tại không hợp lệ']);
        exit();
    }

    if ($currentIdentifier === null) {
        echo json_encode(['success' => false, 'message' => 'Thiếu identifier hiện tại']);
        exit();
    }

    // Kiểm tra xem identifier hiện tại có tồn tại không
    $identifierColumn = $currentType === "phone" ? "phone" : "email";

    $stmtCheck = $conn->prepare("SELECT * FROM dang_ky WHERE $identifierColumn = ?");
    $stmtCheck->bind_param("s", $currentIdentifier);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();
    
    if ($resultCheck->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => "Không tìm thấy tài khoản với $identifierColumn = $currentIdentifier"]);
        exit();
    }
    
    $existingData = $resultCheck->fetch_assoc();
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Existing data in DB: " . print_r($existingData, true) . PHP_EOL, FILE_APPEND);

    // Cập nhật thông tin trong cơ sở dữ liệu
    $stmt = $conn->prepare("UPDATE dang_ky SET user = ?, phone = ?, email = ? WHERE " . ($currentType === "phone" ? "phone" : "email") . " = ?");
    $stmt->bind_param("ssss", $username, $phone, $email, $currentIdentifier);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Cập nhật thông tin thành công']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Không có thay đổi nào được thực hiện']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi khi cập nhật: ' . $stmt->error]);
    }

    $conn->close();

} catch (Exception $e) {
    $errorMessage = 'Lỗi server: ' . $e->getMessage();
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: " . $errorMessage . PHP_EOL, FILE_APPEND);
    echo json_encode(['success' => false, 'message' => $errorMessage]);
} finally {
    ob_end_flush();
}
?>