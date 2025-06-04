<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

// Define log file
$logFile = __DIR__ . '/debug.log';

// Log raw request
$rawData = file_get_contents("php://input");
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Raw Request: " . $rawData . PHP_EOL, FILE_APPEND);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
try {
    $conn = new mysqli("localhost", "root", "", "form");
    $conn->set_charset("utf8mb4");

    if ($conn->connect_error) {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - DB connection error: " . $conn->connect_error . PHP_EOL, FILE_APPEND);
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Parse JSON input
    if (empty($rawData)) {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: Empty request body" . PHP_EOL, FILE_APPEND);
        echo json_encode(['success' => false, 'message' => 'Không nhận được dữ liệu']);
        exit();
    }

    $data = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - JSON Parse Error: " . json_last_error_msg() . PHP_EOL, FILE_APPEND);
        echo json_encode(['success' => false, 'message' => 'Lỗi định dạng JSON: ' . json_last_error_msg()]);
        exit();
    }

    // Log parsed data
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Parsed data: " . print_r($data, true) . PHP_EOL, FILE_APPEND);

    // Check if it's a registration request
    $isRegistration = isset($data['email']) && isset($data['phone']) && isset($data['password']);

    if ($isRegistration) {
        // REGISTRATION
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $email = $data['email'] ?? '';
        $phone = $data['phone'] ?? '';

        if (empty($username) || empty($password) || empty($email) || empty($phone)) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: Missing registration fields\n", FILE_APPEND);
            echo json_encode(['success' => false, 'message' => 'Thiếu thông tin đăng ký']);
            exit();
        }

        // Validate lengths (same as before)
        if (strlen($phone) > 15) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: Phone number too long: $phone\n", FILE_APPEND);
            echo json_encode(['success' => false, 'message' => 'Số điện thoại quá dài']);
            exit();
        }
        if (strlen($email) > 100) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: Email too long: $email\n", FILE_APPEND);
            echo json_encode(['success' => false, 'message' => 'Email quá dài']);
            exit();
        }
        if (strlen($username) > 50) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: Username too long: $username\n", FILE_APPEND);
            echo json_encode(['success' => false, 'message' => 'Tên đăng nhập quá dài']);
            exit();
        }

        // Check if email already exists (vulnerable to SQLi here)
        $sqlCheckEmail = "SELECT email FROM dang_ky WHERE email = '$email'";
        $result = $conn->query($sqlCheckEmail);
        if ($result && $result->num_rows > 0) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: Email already exists: $email\n", FILE_APPEND);
            echo json_encode(['success' => false, 'message' => 'Email đã tồn tại']);
            exit();
        }

        // Check if phone already exists (vulnerable to SQLi)
        $sqlCheckPhone = "SELECT phone FROM dang_ky WHERE phone = '$phone'";
        $result = $conn->query($sqlCheckPhone);
        if ($result && $result->num_rows > 0) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: Phone already exists: $phone\n", FILE_APPEND);
            echo json_encode(['success' => false, 'message' => 'Số điện thoại đã tồn tại']);
            exit();
        }

        // Hash the password using MD5
        $hashedPassword = md5($password);

        // Insert new user (vulnerable to SQLi)
        $sqlInsert = "INSERT INTO dang_ky (user, phone, email, pass, role, is_active) VALUES ('$username', '$phone', '$email', '$hashedPassword', 'user', 1)";
        if ($conn->query($sqlInsert) === TRUE) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Success: Registered user: $username\n", FILE_APPEND);
            echo json_encode(['success' => true, 'message' => 'Đăng ký thành công']);
        } else {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: Registration failed: " . $conn->error . "\n", FILE_APPEND);
            echo json_encode(['success' => false, 'message' => 'Lỗi khi đăng ký: ' . $conn->error]);
        }

    } else {
        // LOGIN
        if (!isset($data['password']) || empty($data['password'])) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: Missing or empty password\n", FILE_APPEND);
            echo json_encode(['success' => false, 'message' => 'Thiếu hoặc không hợp lệ mật khẩu']);
            exit();
        }

        $password = $data['password'];
        $email = isset($data['email']) ? $data['email'] : null;
        $phone = isset($data['phone']) ? $data['phone'] : null;

        if ($email === null && $phone === null) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: No email or phone provided\n", FILE_APPEND);
            echo json_encode(['success' => false, 'message' => 'Vui lòng cung cấp email hoặc số điện thoại']);
            exit();
        }

        // Build SQL query vulnerable to SQL Injection
        if ($email !== null) {
            $sqlLogin = "SELECT id, user, email, phone, pass, role, is_active FROM dang_ky WHERE email = '$email' AND is_active = 1";
        } else {
            $sqlLogin = "SELECT id, user, email, phone, pass, role, is_active FROM dang_ky WHERE phone = '$phone' AND is_active = 1";
        }

        $result = $conn->query($sqlLogin);

        if (!$result || $result->num_rows === 0) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: Account not found or disabled\n", FILE_APPEND);
            echo json_encode(['success' => false, 'message' => 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa']);
            echo json_encode(['success' => false, 'message' => $email ?? $phone]); // Phản ánh payload

        } else {
            $user = $result->fetch_assoc();
            if (md5($password) === $user['pass']) {
                file_put_contents($logFile, date('Y-m-d H:i:s') . " - Success: Logged in user: " . $user['user'] . "\n", FILE_APPEND);
                echo json_encode([
                    'success' => true,
                    'message' => 'Đăng nhập thành công',
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['user'],
                        'email' => $user['email'],
                        'role' => $user['role'],
                        'is_active' => $user['is_active']
                    ]
                ]);
            } else {
                file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: Incorrect password\n", FILE_APPEND);
                echo json_encode(['success' => false, 'message' => 'Mật khẩu không đúng']);
            }
        }
    }

    $conn->close();

} catch (Exception $e) {
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Lỗi server: ' . $e->getMessage()]);
}
?>
