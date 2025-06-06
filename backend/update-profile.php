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
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

    // Xử lý dữ liệu đầu vào (JSON hoặc form data)
    if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
        $rawData = file_get_contents("php://input");
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Request (JSON): $rawData\n", FILE_APPEND);
        $data = json_decode($rawData, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON data: " . json_last_error_msg());
        }
    } else {
        $data = $_POST;
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Request (Form): " . print_r($data, true) . "\n", FILE_APPEND);
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Files: " . print_r($_FILES, true) . "\n", FILE_APPEND);
    }

    // Kiểm tra dữ liệu đầu vào
    if (!isset($data['username'])) {
        throw new Exception("Thiếu tên người dùng");
    }

    $username = $data['username'];
    $phone = $data['phone'] ?? null;
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;
    $currentIdentifier = $data['currentIdentifier'] ?? null;
    $currentType = $data['currentType'] ?? null;
    $removeAvatar = isset($data['removeAvatar']) && $data['removeAvatar'] === 'true';

    // Kiểm tra loại identifier
    if ($currentType !== "phone" && $currentType !== "email") {
        throw new Exception("Loại identifier không hợp lệ: $currentType");
    }

    if ($currentIdentifier === null) {
        throw new Exception("Thiếu identifier hiện tại");
    }

    // Kiểm tra tài khoản tồn tại
    $identifierColumn = $currentType === "phone" ? "phone" : "email";
    $stmtCheck = $conn->prepare("SELECT * FROM dang_ky WHERE $identifierColumn = ?");
    $stmtCheck->bind_param("s", $currentIdentifier);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();
    
    if ($resultCheck->num_rows === 0) {
        throw new Exception("Không tìm thấy tài khoản với $identifierColumn = $currentIdentifier");
    }
    
    $existingData = $resultCheck->fetch_assoc();
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Existing data: " . print_r($existingData, true) . "\n", FILE_APPEND);

    // Xử lý avatar
    $avatarUrl = null;
    $avatarDir = __DIR__ . '/uploads/avatars/';
    
    if ($removeAvatar) {
        // Xóa avatar hiện tại
        $avatarPattern = $avatarDir . 'avatar_' . $currentIdentifier . '.*';
        $existingAvatars = glob($avatarPattern);
        foreach ($existingAvatars as $oldFile) {
            if (file_exists($oldFile)) {
                unlink($oldFile);
                file_put_contents($logFile, date('Y-m-d H:i:s') . " - Deleted avatar: $oldFile\n", FILE_APPEND);
            }
        }
    } elseif (!empty($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        // Kiểm tra thư mục uploads
        if (!file_exists($avatarDir)) {
            if (!mkdir($avatarDir, 0755, true)) {
                throw new Exception("Không thể tạo thư mục uploads/avatars: " . error_get_last()['message']);
            }
            if (!is_writable($avatarDir)) {
                throw new Exception("Thư mục uploads/avatars không có quyền ghi.");
            }
        } elseif (!is_writable($avatarDir)) {
            throw new Exception("Thư mục uploads/avatars không có quyền ghi.");
        }

        // Xóa avatar cũ
        $avatarPattern = $avatarDir . 'avatar_' . $currentIdentifier . '.*';
        $oldFiles = glob($avatarPattern);
        foreach ($oldFiles as $oldFile) {
            if (file_exists($oldFile)) {
                unlink($oldFile);
                file_put_contents($logFile, date('Y-m-d H:i:s') . " - Deleted old avatar: $oldFile\n", FILE_APPEND);
            }
        }
        
        // Kiểm tra file
        $fileExtension = strtolower(pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION));
        $fileName = 'avatar_' . $currentIdentifier . '.' . $fileExtension;
        $uploadFile = $avatarDir . $fileName;
        
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        $fileType = $_FILES['avatar']['type'];
        if (!in_array($fileType, $allowedTypes)) {
            throw new Exception("Loại file không được hỗ trợ. Chỉ chấp nhận JPG, PNG và GIF.");
        }
        
        if ($_FILES['avatar']['size'] > 5 * 1024 * 1024) {
            throw new Exception("Kích thước file quá lớn (tối đa 5MB).");
        }
        
        // Thử di chuyển file
        if (!move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadFile)) {
            $error = error_get_last();
            throw new Exception("Không thể tải lên ảnh đại diện: " . ($error['message'] ?? 'Lỗi không xác định'));
        }
        
        // Kiểm tra file đã được lưu chưa
        if (!file_exists($uploadFile)) {
            throw new Exception("File không được lưu vào $uploadFile");
        }
        
        $avatarUrl = 'http://localhost/BaiTapNhom/backend/uploads/avatars/' . $fileName;
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Uploaded avatar: $avatarUrl\n", FILE_APPEND);
    } elseif (!empty($_FILES['avatar']) && $_FILES['avatar']['error'] !== UPLOAD_ERR_NO_FILE) {
        // Xử lý lỗi upload khác
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE => 'File vượt quá kích thước upload_max_filesize trong php.ini',
            UPLOAD_ERR_FORM_SIZE => 'File vượt quá kích thước MAX_FILE_SIZE trong form',
            UPLOAD_ERR_PARTIAL => 'File chỉ được tải lên một phần',
            UPLOAD_ERR_NO_TMP_DIR => 'Thiếu thư mục tạm thời',
            UPLOAD_ERR_CANT_WRITE => 'Không thể ghi file lên đĩa',
            UPLOAD_ERR_EXTENSION => 'Phần mở rộng file bị chặn',
        ];
        $errorCode = $_FILES['avatar']['error'];
        throw new Exception("Lỗi tải file: " . ($uploadErrors[$errorCode] ?? "Mã lỗi $errorCode"));
    }

    // Cập nhật thông tin trong cơ sở dữ liệu
    $updateQuery = "UPDATE dang_ky SET user = ?, phone = ?, email = ?";
    $paramTypes = "sss";
    $params = [$username, $phone, $email];

    if (!empty($password)) {
        $updateQuery .= ", pass = ?";
        $paramTypes .= "s";
        $params[] = md5($password);
    }

    $updateQuery .= " WHERE $identifierColumn = ?";
    $paramTypes .= "s";
    $params[] = $currentIdentifier;

    $stmt = $conn->prepare($updateQuery);
    $stmt->bind_param($paramTypes, ...$params);

    if (!$stmt->execute()) {
        throw new Exception("Lỗi khi cập nhật: " . $stmt->error);
    }

    $response = ['success' => true, 'message' => 'Cập nhật thông tin thành công'];
    
    // Trả về avatar URL
    if ($avatarUrl) {
        $response['avatarUrl'] = $avatarUrl;
    } elseif (!$removeAvatar) {
        $avatarPattern = $avatarDir . 'avatar_' . $currentIdentifier . '.*';
        $existingAvatars = glob($avatarPattern);
        if (!empty($existingAvatars)) {
            $existingAvatar = basename($existingAvatars[0]);
            $response['avatarUrl'] = 'http://localhost/BaiTapNhom/backend/uploads/avatars/' . $existingAvatar;
        }
    }
    
    echo json_encode($response);

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
