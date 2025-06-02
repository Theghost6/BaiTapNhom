<?php
// Start output buffering
ob_start();

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

// Database configuration
$host = "localhost";
$dbname = "form";
$username = "root";
$password = "";

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Handle POST request
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get raw POST data
        $input = json_decode(file_get_contents('php://input'), true);

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

        // Sanitize inputs
        $firstName = filter_var($input['firstName'], FILTER_SANITIZE_STRING);
        $email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
        $phone = !empty($input['phone']) ? filter_var($input['phone'], FILTER_SANITIZE_STRING) : null;
        $message = filter_var($input['message'], FILTER_SANITIZE_STRING);

        // Prepare and execute SQL query
        $stmt = $pdo->prepare("INSERT INTO lien_he (ten, email, sdt, noi_dung) VALUES (?, ?, ?, ?)");
        $stmt->execute([$firstName, $email, $phone, $message]);

        http_response_code(200);
        ob_end_clean();
        echo json_encode(["message" => "Gửi biểu mẫu thành công"]);
    } else {
        http_response_code(405);
        ob_end_clean();
        echo json_encode(["message" => "Phương thức không được phép"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    ob_end_clean();
    echo json_encode(["message" => "Lỗi cơ sở dữ liệu: " . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    ob_end_clean();
    echo json_encode(["message" => "Lỗi server: " . $e->getMessage()]);
}

// Clear any remaining buffer
ob_end_flush();
?>
