<?php
// VNPay callback handler - tách riêng khỏi payments.php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('log_errors', 1);
ini_set('html_errors', 0);
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
date_default_timezone_set('Asia/Ho_Chi_Minh');

function sendCorsHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Content-Type: application/json; charset=UTF-8");
}
function sendError($code, $msg) {
    sendCorsHeaders();
    http_response_code($code);
    echo json_encode(["status" => "error", "message" => $msg]);
    exit;
}
function sendRedirect($url) {
    sendCorsHeaders();
    header("Location: $url");
    exit;
}
$logFile = __DIR__ . '/payment_debug.log';
function logMessage($message) {
    global $logFile;
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - $message\n", FILE_APPEND);
}

// Đọc biến môi trường từ backend/.env
$envPath = __DIR__ . '/.env';
$env = file_exists($envPath) ? parse_ini_file($envPath, false, INI_SCANNER_RAW) : [];

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['vnp_TxnRef'])) {
    $vnp_HashSecret = "FC3731AMJQ13YF261SEG5E3F6X2YKRFJ";
    logMessage("--------- Gỡ lỗi Callback VNPay ---------");
    logMessage("Tất cả tham số GET: " . json_encode($_GET));
    $vnp_SecureHash = $_GET['vnp_SecureHash'];
    logMessage("vnp_SecureHash nhận được: " . $vnp_SecureHash);
    $inputData = array();
    foreach ($_GET as $key => $value) {
        if (substr($key, 0, 4) == "vnp_") {
            $inputData[$key] = $value;
        }
    }
    unset($inputData['vnp_SecureHash']);
    ksort($inputData);
    logMessage("inputData sau khi sắp xếp: " . json_encode($inputData));
    $hashData = "";
    $i = 0;
    foreach ($inputData as $key => $value) {
        if ($i == 1) {
            $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
        } else {
            $hashData .= urlencode($key) . "=" . urlencode($value);
            $i = 1;
        }
    }
    logMessage("Chuỗi hashData: " . $hashData);
    $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
    logMessage("secureHash được tạo: " . $secureHash);
    logMessage("Khớp hash: " . ($secureHash === $vnp_SecureHash ? "Có" : "Không"));
    if ($secureHash !== $vnp_SecureHash) {
        logMessage("Chữ ký VNPay không hợp lệ. Expected: $secureHash, Got: $vnp_SecureHash");
        sendError(400, 'Chữ ký không hợp lệ');
    }
    $connectPath = __DIR__ . '/connect.php';
    if (!file_exists($connectPath)) {
        logMessage("Tệp connect.php không tồn tại tại: $connectPath");
        sendError(500, 'Tệp cấu hình cơ sở dữ liệu không tồn tại');
    }
    require_once $connectPath;
    if (!isset($conn) || $conn->connect_error) {
        logMessage("Kết nối cơ sở dữ liệu thất bại: " . ($conn->connect_error ?? 'Biến $conn không được định nghĩa'));
        sendError(500, 'Không thể kết nối cơ sở dữ liệu');
    }
    $orderId = $conn->real_escape_string($_GET['vnp_TxnRef']);
    $status = $_GET['vnp_ResponseCode'] == '00' ? 'Đã thanh toán' : 'Thất bại';
    $transId = $conn->real_escape_string($_GET['vnp_TransactionNo']);
    $sqlPayment = "UPDATE thanh_toan SET 
                   trang_thai = '$status', 
                   ma_giao_dich = '$transId',
                   thoi_gian_thanh_toan = NOW(),
                   thoi_gian_cap_nhat = NOW()
                   WHERE ma_don_hang = '$orderId'";
    $conn->query($sqlPayment);
    logMessage("Trạng thái thanh toán được cập nhật cho đơn hàng $orderId: $status");
    $frontendHost = $env['FRONTEND_HOST'] ?? 'http://localhost:3000';
    if ($_GET['vnp_ResponseCode'] == '00') {
        $sqlUpdateOrder = "UPDATE don_hang SET trang_thai = 'Đã thanh toán' WHERE id = '$orderId'";
        $conn->query($sqlUpdateOrder);
        logMessage("Cập nhật trạng thái đơn hàng $orderId thành 'Đã thanh toán'");
        sendRedirect(rtrim($frontendHost, '/') . "/thankyou");
    } else {
        sendRedirect(rtrim($frontendHost, '/') . "/payment-failed?orderId=$orderId");
    }
    $conn->close();
    exit;
}
// Nếu không phải callback thì trả về lỗi
sendError(400, 'Yêu cầu không hợp lệ');
