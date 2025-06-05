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

    // Xử lý cho cả dữ liệu JSON và form data
    if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
        $rawData = file_get_contents("php://input");
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Update Profile Request (JSON): " . $rawData . PHP_EOL, FILE_APPEND);
        $data = json_decode($rawData, true);
    } else {
        // Xử lý form data
        $data = $_POST;
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Update Profile Request (Form): " . print_r($data, true) . PHP_EOL, FILE_APPEND);
    }

    // Log dữ liệu đầu vào
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Parsed data: " . print_r($data, true) . PHP_EOL, FILE_APPEND);

    // Kiểm tra dữ liệu đầu vào
    if (!isset($data['username'])) {
        echo json_encode(['success' => false, 'message' => 'Thiếu tên người dùng']);
        exit();
    }

    $username = $data['username'];
    $phone = $data['phone'] ?? null;
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;
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

    // Xử lý upload ảnh đại diện
    $avatarUrl = null;
    
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/avatars/';
        
        // Tạo thư mục uploads/avatars nếu chưa tồn tại
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        // Xóa avatar cũ của user này (nếu có)
        $oldAvatarPattern = $uploadDir . 'avatar_' . $currentIdentifier . '.*';
        $oldFiles = glob($oldAvatarPattern);
        foreach ($oldFiles as $oldFile) {
            if (file_exists($oldFile)) {
                unlink($oldFile);
                file_put_contents($logFile, date('Y-m-d H:i:s') . " - Deleted old avatar: " . $oldFile . PHP_EOL, FILE_APPEND);
            }
        }
        
        // Lấy extension của file
        $fileExtension = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
        
        // Tạo tên file theo identifier của user
        $fileName = 'avatar_' . $currentIdentifier . '.' . $fileExtension;
        $uploadFile = $uploadDir . $fileName;
        
        // Kiểm tra loại file
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        $fileType = $_FILES['avatar']['type'];
        
        if (!in_array($fileType, $allowedTypes)) {
            throw new Exception("Loại file không được hỗ trợ. Chỉ chấp nhận JPG, PNG và GIF.");
        }
        
        // Giới hạn kích thước file (5MB)
        if ($_FILES['avatar']['size'] > 5 * 1024 * 1024) {
            throw new Exception("Kích thước file quá lớn (tối đa 5MB).");
        }
        
        if (move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadFile)) {
            // Tạo URL để truy cập ảnh
            $avatarUrl = 'http://localhost/BaiTapNhom/backend/uploads/avatars/' . $fileName;
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Uploaded avatar: " . $avatarUrl . PHP_EOL, FILE_APPEND);
        } else {
            throw new Exception("Không thể tải lên ảnh đại diện.");
        }
    }

    // Cập nhật thông tin trong cơ sở dữ liệu (KHÔNG bao gồm avatar)
    $updateQuery = "UPDATE dang_ky SET user = ?, phone = ?, email = ?";
    $paramTypes = "sss";
    $params = [$username, $phone, $email];

    // Chỉ thêm password vào query nếu có
    if (!empty($password)) {
        $updateQuery .= ", pass = ?";
        $paramTypes .= "s";
        $params[] = md5($password); // Hash password using MD5
    }

    $updateQuery .= " WHERE " . ($currentType === "phone" ? "phone" : "email") . " = ?";
    $paramTypes .= "s";
    $params[] = $currentIdentifier;

    $stmt = $conn->prepare($updateQuery);
    $stmt->bind_param($paramTypes, ...$params);

    if ($stmt->execute()) {
        $response = ['success' => true, 'message' => 'Cập nhật thông tin thành công'];
        
        // Trả về URL avatar nếu có upload mới
        if ($avatarUrl) {
            $response['avatarUrl'] = $avatarUrl;
        } else {
            // Kiểm tra xem có avatar cũ không
            $avatarDir = __DIR__ . '/uploads/avatars/';
            $avatarPattern = $avatarDir . 'avatar_' . $currentIdentifier . '.*';
            $existingAvatars = glob($avatarPattern);
            
            if (!empty($existingAvatars)) {
                $existingAvatar = basename($existingAvatars[0]);
                $response['avatarUrl'] = 'http://localhost/BaiTapNhom/backend/uploads/avatars/' . $existingAvatar;
            }
        }
        
        echo json_encode($response);
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

// Function để lấy avatar của user
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
// Trong phần xử lý dữ liệu đầu vào
$removeAvatar = isset($data['removeAvatar']) && $data['removeAvatar'] === 'true';

// Xử lý upload ảnh đại diện
$avatarUrl = null;

if ($removeAvatar) {
    // Xóa avatar cũ
    $avatarDir = __DIR__ . '/uploads/avatars/';
    $avatarPattern = $avatarDir . 'avatar_' . $currentIdentifier . '.*';
    $existingAvatars = glob($avatarPattern);
    foreach ($existingAvatars as $oldFile) {
        if (file_exists($oldFile)) {
            unlink($oldFile);
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Deleted avatar: " . $oldFile . PHP_EOL, FILE_APPEND);
        }
    }
} elseif (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
    // Xử lý upload ảnh mới (giữ nguyên code hiện tại)
    $uploadDir = __DIR__ . '/uploads/avatars/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    $oldAvatarPattern = $uploadDir . 'avatar_' . $currentIdentifier . '.*';
    $oldFiles = glob($oldAvatarPattern);
    foreach ($oldFiles as $oldFile) {
        if (file_exists($oldFile)) {
            unlink($oldFile);
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Deleted old avatar: " . $oldFile . PHP_EOL, FILE_APPEND);
        }
    }
    $fileExtension = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
    $fileName = 'avatar_' . $currentIdentifier . '.' . $fileExtension;
    $uploadFile = $uploadDir . $fileName;
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    $fileType = $_FILES['avatar']['type'];
    if (!in_array($fileType, $allowedTypes)) {
        throw new Exception("Loại file không được hỗ trợ. Chỉ chấp nhận JPG, PNG và GIF.");
    }
    if ($_FILES['avatar']['size'] > 5 * 1024 * 1024) {
        throw new Exception("Kích thước file quá lớn (tối đa 5MB).");
    }
    if (move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadFile)) {
        $avatarUrl = 'http://localhost/BaiTapNhom/backend/uploads/avatars/' . $fileName;
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Uploaded avatar: " . $avatarUrl . PHP_EOL, FILE_APPEND);
    } else {
        throw new Exception("Không thể tải lên ảnh đại diện.");
    }
}
?>
