<?php
// Khởi tạo thanh toán VNPay - tách riêng khỏi payments.php
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
// Xử lý preflight CORS (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendCorsHeaders();
    http_response_code(200);
    exit;
}
function sendError($code, $msg) {
    sendCorsHeaders();
    http_response_code($code);
    echo json_encode(["status" => "error", "message" => $msg]);
    exit;
}
$logFile = __DIR__ . '/payment_debug.log';
function logMessage($message) {
    global $logFile;
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - $message\n", FILE_APPEND);
}
$envPath = __DIR__ . '/.env';
$env = file_exists($envPath) ? parse_ini_file($envPath, false, INI_SCANNER_RAW) : [];
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError(405, 'Chỉ hỗ trợ POST');
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
if (!isset($data['orderId']) || !is_numeric($data['orderId'])) {
    sendError(400, 'Thiếu orderId');
}
$orderId = intval($data['orderId']);
$connectPath = __DIR__ . '/connect.php';
if (!file_exists($connectPath)) {
    sendError(500, 'Tệp cấu hình cơ sở dữ liệu không tồn tại');
}
require_once $connectPath;
if (!isset($conn) || $conn->connect_error) {
    sendError(500, 'Không thể kết nối cơ sở dữ liệu');
}
$sql = "SELECT dh.tong_tien, dk.role FROM don_hang dh 
        JOIN tai_khoan dk ON dh.ma_nguoi_dung = dk.id 
        WHERE dh.id = '$orderId' LIMIT 1";
$res = $conn->query($sql);
if (!$res || $res->num_rows == 0) {
    sendError(404, 'Không tìm thấy đơn hàng');
}
$row = $res->fetch_assoc();
$orderTotal = floatval($row['tong_tien']);

// Kiểm tra role admin
if ($row['role'] === 'admin') {
    sendError(403, 'Tài khoản admin không được phép thực hiện thanh toán!');
}
$vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
$backendHost = $env['BACKEND_HOST'] ?? 'http://localhost:8080';
$vnp_Returnurl = rtrim($backendHost, '/') . '/vnpay_callback.php';
$vnp_TmnCode = "LYE5QSH7";
$vnp_HashSecret = "FC3731AMJQ13YF261SEG5E3F6X2YKRFJ";
$vnp_TxnRef = $orderId;
$vnp_OrderInfo = "Thanh toan don hang " . $orderId;
$vnp_OrderType = "billpayment";
$vnp_Amount = $orderTotal * 100;
$vnp_Locale = "vn";
$vnp_BankCode = "";
$vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
date_default_timezone_set('Asia/Ho_Chi_Minh');
$vnp_ExpireDate = date('YmdHis', strtotime('+30 minutes'));
$inputData = array(
    "vnp_Version" => "2.1.0",
    "vnp_TmnCode" => $vnp_TmnCode,
    "vnp_Amount" => $vnp_Amount,
    "vnp_Command" => "pay",
    "vnp_CreateDate" => date('YmdHis'),
    "vnp_CurrCode" => "VND",
    "vnp_IpAddr" => $vnp_IpAddr,
    "vnp_Locale" => $vnp_Locale,
    "vnp_OrderInfo" => $vnp_OrderInfo,
    "vnp_OrderType" => $vnp_OrderType,
    "vnp_ReturnUrl" => $vnp_Returnurl,
    "vnp_TxnRef" => $vnp_TxnRef,
    "vnp_ExpireDate" => $vnp_ExpireDate
);
ksort($inputData);
$query = "";
$i = 0;
$hashdata = "";
foreach ($inputData as $key => $value) {
    if ($i == 1) {
        $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
    } else {
        $hashdata = urlencode($key) . "=" . urlencode($value);
        $i = 1;
    }
    $query .= urlencode($key) . "=" . urlencode($value) . '&';
}
$vnp_Url = $vnp_Url . "?" . $query;
$vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
$vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
logMessage("Khởi tạo thanh toán VNPay cho đơn hàng $orderId: $vnp_Url");
sendCorsHeaders();
http_response_code(200);
echo json_encode([
    "status" => "success",
    "message" => "Khởi tạo thanh toán VNPay thành công",
    "orderId" => $orderId,
    "payUrl" => $vnp_Url
]);
