<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "form";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// Get payment ID from request
$paymentId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$paymentId) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing payment ID"]);
    exit;
}

// Check payment status in database
$sql = "SELECT trang_thai_thanh_toan, ma_giao_dich FROM thanh_toan WHERE dat_phong_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $paymentId);
$stmt->execute();
$result = $stmt->get_result();
$payment = $result->fetch_assoc();

// Nếu trạng thái vẫn là "Chưa thanh toán" hoặc "Đang xử lý",
// có thể kiểm tra trực tiếp với cổng thanh toán
if ($payment['trang_thai_thanh_toan'] == 'Chưa thanh toán' || 
    $payment['trang_thai_thanh_toan'] == 'Đang xử lý') {
    
    // Gọi API kiểm tra trạng thái với VNPay (ví dụ)
    $vnpParams = array(
        "vnp_Version" => "2.1.0",
        "vnp_Command" => "querydr",
        "vnp_TmnCode" => YOUR_MERCHANT_CODE,
        "vnp_TxnRef" => $payment['ma_giao_dich'],
        "vnp_OrderInfo" => "Kiểm tra thanh toán",
        "vnp_TransDate" => date('YmdHis'),
    );
echo json_encode([
    "status" => $status,
    "message" => "Payment status retrieved successfully"
]);
    }

$conn->close();
?>