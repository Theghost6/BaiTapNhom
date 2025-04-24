<?php
// Hiển thị lỗi để dễ debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Log request để debug
$logFile = __DIR__ . '/debug.log';
$rawData = file_get_contents("php://input");
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Request: " . $rawData . PHP_EOL, FILE_APPEND);

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

    // Log parsed data
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Parsed data: " . print_r($data, true) . PHP_EOL, FILE_APPEND);

    // Kiểm tra có phải đăng ký không (đăng ký phải có cả username, email và phone)
    $isRegistration = isset($data['email']) && isset($data['phone']) && isset($data['password']);

    if ($isRegistration) {
        // ĐĂNG KÝ
        $username = $data['username'];
        $password = $data['password'];
        $email = $data['email'];
        $phone = $data['phone'];

        // Kiểm tra email đã tồn tại chưa
        $stmt = $conn->prepare("SELECT email FROM dang_ky WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Email đã tồn tại']);
            exit();
        }

        // Kiểm tra số điện thoại đã tồn tại chưa
        $stmt = $conn->prepare("SELECT phone FROM dang_ky WHERE phone = ?");
        $stmt->bind_param("s", $phone);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Số điện thoại đã tồn tại']);
            exit();
        }

        // Thêm người dùng mới
        $stmt = $conn->prepare("INSERT INTO dang_ky (user, phone, email, pass) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $username, $phone, $email, $password);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Đăng ký thành công']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Lỗi khi đăng ký: ' . $stmt->error]);
        }
    } else {
        // ĐĂNG NHẬP
        if (!isset($data['password'])) {
            echo json_encode(['success' => false, 'message' => 'Thiếu mật khẩu']);
            exit();
        }

        $password = $data['password'];
        $email = isset($data['email']) ? $data['email'] : null;
        $phone = isset($data['phone']) ? $data['phone'] : null;

        // Kiểm tra xem email hoặc phone có được cung cấp không
        if ($email === null && $phone === null) {
            echo json_encode(['success' => false, 'message' => 'Vui lòng cung cấp email hoặc số điện thoại']);
            exit();
        }

        // Tạo câu truy vấn dựa trên thông tin đăng nhập được cung cấp
        if ($email !== null) {
            // Đăng nhập bằng email
            $stmt = $conn->prepare("SELECT user, pass,role FROM dang_ky WHERE email = ?");
            $stmt->bind_param("s", $email);
        } else {
            // Đăng nhập bằng số điện thoại
            $stmt = $conn->prepare("SELECT user, pass,role FROM dang_ky WHERE phone = ?");
            $stmt->bind_param("s", $phone);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Tài khoản không tồn tại']);
        } else {
            // Tìm tài khoản và kiểm tra mật khẩu
            $user = $result->fetch_assoc();
            if ($user['pass'] === $password) {
                // Mật khẩu đúng, đăng nhập thành công
                echo json_encode([
                    'success' => true,
                    'message' => 'Đăng nhập thành công',
                    'user' => [
                        'username' => $user['user'],
                        'identifier' => $email ?? $phone, // Email hoặc phone dùng để đăng nhập
                        'type' => $email ? 'email' : 'phone', // Loại identifier
                        'role' => $user['role'] ?? 'user' // Đảm bảo role được trả về

                        ]
                ]);
            } else {
                // Mật khẩu không đúng
                echo json_encode(['success' => false, 'message' => 'Mật khẩu không đúng']);
            }
        }
    }

    $conn->close();

} catch (Exception $e) {
    // Log error
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);

    // Return error response
    echo json_encode(['success' => false, 'message' => 'Lỗi server: ' . $e->getMessage()]);
}
?>