<?php
// Disable HTML error output to prevent JSON corruption
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('log_errors', 1);
ini_set('html_errors', 0);
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Catch any fatal errors and return JSON
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");
        http_response_code(500);
        echo json_encode([
            "status" => "error", 
            "message" => "Lỗi hệ thống: " . $error['message']
        ]);
        exit;
    }
});

// IMPORTANT: Send CORS headers immediately, before any other output
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Helper: always send CORS headers (redundant but safe)
function sendCorsHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Content-Type: application/json; charset=UTF-8");
}

// Helper: send error with CORS headers
function sendError($code, $msg) {
    sendCorsHeaders();
    http_response_code($code);
    echo json_encode(["status" => "error", "message" => $msg]);
    exit;
}

// Helper: send redirect with CORS headers
function sendRedirect($url) {
    sendCorsHeaders();
    header("Location: $url");
    exit;
}

// Log errors to a file
$logFile = __DIR__ . '/payment_debug.log';
function logMessage($message) {
    global $logFile;
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - $message\n", FILE_APPEND);
}

// Log all incoming requests
logMessage("Nhận yêu cầu: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);

// Đọc biến môi trường từ backend/.env
$envPath = __DIR__ . '/.env';
$env = file_exists($envPath) ? parse_ini_file($envPath, false, INI_SCANNER_RAW) : [];

// Handle VNPay callback (return URL) đã được tách sang vnpay_callback.php
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['vnp_TxnRef'])) {
    header('Location: /backend/vnpay_callback.php?' . http_build_query($_GET));
    exit();
}

// Database connection for main logic
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

$conn->set_charset("utf8mb4");
logMessage("Kết nối cơ sở dữ liệu thành công");

// Parse JSON input
$rawInput = file_get_contents("php://input");
logMessage("Dữ liệu thô: $rawInput");
$data = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendError(400, "JSON không hợp lệ: " . json_last_error_msg());
}

// Handle order logic
if (!$data || !isset($data['customerInfo']) || !isset($data['cartItems']) || !isset($data['paymentMethod']) || !isset($data['shippingMethod'])) {
    sendError(400, "Thiếu các trường bắt buộc: customerInfo, cartItems, paymentMethod, hoặc shippingMethod");
}

$thong_tin_khach_hang = $data['customerInfo'];
$muc_gio_hang = $data['cartItems'];
$phuong_thuc_thanh_toan = $data['paymentMethod'];
$phuong_thuc_van_chuyen = $data['shippingMethod'];
$tong_so_tien = $data['totalAmount'] ?? 0;
$ngay_dat_hang = $data['orderDate'] ?? date('Y-m-d H:i:s');
$userId = isset($data['userId']) && is_numeric($data['userId']) ? $conn->real_escape_string($data['userId']) : null;

// Convert ISO date to MySQL DATETIME format
try {
    $date = new DateTime($ngay_dat_hang);
    $ngay_dat_hang_dinh_dang = $date->format('Y-m-d H:i:s');
    logMessage("Chuyển đổi ngay_dat_hang: $ngay_dat_hang thành $ngay_dat_hang_dinh_dang");
} catch (Exception $e) {
    sendError(400, "Định dạng ngày đặt hàng không hợp lệ: " . $e->getMessage());
}

// Input validation
$requiredCustomerFields = ['fullName', 'email', 'phone'];
if ($phuong_thuc_van_chuyen === 'ship') {
    $requiredCustomerFields = array_merge($requiredCustomerFields, ['address', 'city', 'district']);
}
foreach ($requiredCustomerFields as $field) {
    if (!isset($thong_tin_khach_hang[$field]) || ($phuong_thuc_van_chuyen === 'ship' && empty(trim($thong_tin_khach_hang[$field])))) {
        sendError(400, "Thiếu hoặc trường khách hàng rỗng: $field");
    }
}

// Validate email
if (!filter_var($thong_tin_khach_hang['email'], FILTER_VALIDATE_EMAIL)) {
    sendError(400, "Định dạng email không hợp lệ: " . $thong_tin_khach_hang['email']);
}

// Validate phone
if (!preg_match('/^[0-9]{10,11}$/', preg_replace('/[^0-9]/', '', $thong_tin_khach_hang['phone']))) {
    sendError(400, "Định dạng số điện thoại không hợp lệ: " . $thong_tin_khach_hang['phone']);
}

// Validate cart items
if (empty($muc_gio_hang)) {
    sendError(400, "Giỏ hàng rỗng");
}
foreach ($muc_gio_hang as $index => $item) {
    if (!isset($item['ten']) || !isset($item['gia']) || 
        !isset($item['so_luong']) || !is_numeric($item['gia']) || $item['gia'] <= 0) {
        sendError(400, "Mục giỏ hàng không hợp lệ tại chỉ số $index: thiếu trường bắt buộc hoặc giá không hợp lệ");
    }
}

// Validate shipping method
if (!in_array($phuong_thuc_van_chuyen, ['ship', 'pickup'])) {
    sendError(400, "Phương thức vận chuyển không hợp lệ: $phuong_thuc_van_chuyen");
}

// Validate total amount
if (!is_numeric($tong_so_tien) || $tong_so_tien <= 0) {
    sendError(400, "Tổng số tiền không hợp lệ: $tong_so_tien");
}

// Validate userId
if (is_null($userId)) {
    sendError(400, "Thiếu mã người dùng. Vui lòng đăng nhập lại.");
}

// Verify userId exists in dang_ky table
$userQuery = "SELECT id FROM dang_ky WHERE id = '$userId' LIMIT 1";
$userResult = $conn->query($userQuery);
if (!$userResult || $userResult->num_rows == 0) {
    sendError(400, "Mã người dùng không hợp lệ: $userId");
}

logMessage("Xác thực đầu vào thành công");

// Start transaction
$conn->begin_transaction();
try {
    // Handle address creation for both shipping methods
    $addressId = null;
    $dia_chi = null;
    
    if ($phuong_thuc_van_chuyen === 'ship') {
        // For shipping orders
        $fullName = $conn->real_escape_string($thong_tin_khach_hang['fullName']);
        $address = $conn->real_escape_string($thong_tin_khach_hang['address']);
        $city = $conn->real_escape_string($thong_tin_khach_hang['city']);
        $district = $conn->real_escape_string($thong_tin_khach_hang['district']);
        $ward = $conn->real_escape_string($thong_tin_khach_hang['ward'] ?? '');
        $phone = $conn->real_escape_string($thong_tin_khach_hang['phone']);
        
        $dia_chi = "$address, $ward, $district, $city";
        $addressQuery = "INSERT INTO dia_chi_giao_hang (ma_tk, nguoi_nhan, sdt_nhan, dia_chi, tinh_thanh, quan_huyen, phuong_xa) 
                         VALUES ('$userId', '$fullName', '$phone', '$address', '$city', '$district', '$ward')";
        
        if ($conn->query($addressQuery)) {
            $addressId = $conn->insert_id;
            logMessage("Tạo địa chỉ giao hàng mới với ID: $addressId");
        } else {
            throw new Exception("Lỗi khi chèn vào dia_chi_giao_hang: " . $conn->error);
        }
    } else {
        // For pickup orders
        $fullName = $conn->real_escape_string($thong_tin_khach_hang['fullName']);
        $phone = $conn->real_escape_string($thong_tin_khach_hang['phone']);
        $defaultAddress = 'Lấy tại cửa hàng';
        $dia_chi = $defaultAddress;
        
        $addressQuery = "INSERT INTO dia_chi_giao_hang (ma_tk, nguoi_nhan, sdt_nhan, dia_chi, tinh_thanh, quan_huyen, phuong_xa)
                         VALUES ('$userId', '$fullName', '$phone', '$defaultAddress', '', '', '')";
        
        if ($conn->query($addressQuery)) {
            $addressId = $conn->insert_id;
            logMessage("Tạo địa chỉ giao hàng mới với ID: $addressId cho pickup");
        } else {
            throw new Exception("Lỗi khi chèn vào dia_chi_giao_hang cho pickup: " . $conn->error);
        }
    }
    
    // Calculate order total
    $note = $conn->real_escape_string($thong_tin_khach_hang['note'] ?? '');
    $phuong_thuc_thanh_toan = $conn->real_escape_string($phuong_thuc_thanh_toan);
    $status = 'Chờ xử lý';
    $tong_so_tien = floatval($tong_so_tien);
    
    // Lấy phí vận chuyển từ frontend, nếu không có thì mặc định 0
    $shippingCost = isset($data['shippingCost']) && is_numeric($data['shippingCost']) ? floatval($data['shippingCost']) : 0;
    $orderTotal = $tong_so_tien + $shippingCost;

    // Insert order into don_hang table
    $orderSql = "INSERT INTO don_hang (ma_nguoi_dung, ma_dia_chi, tong_tien, phi_van_chuyen, trang_thai, created_at, ghi_chu)
                 VALUES ('$userId', " . ($addressId ? "'$addressId'" : "NULL") . ", '$orderTotal', '$shippingCost', '$status', '$ngay_dat_hang_dinh_dang', '$note')";
    
    logMessage("Thực thi truy vấn chèn đơn hàng: $orderSql");
    if (!$conn->query($orderSql)) {
        throw new Exception("Lỗi khi chèn vào don_hang: " . $conn->error);
    }
    
    $orderId = $conn->insert_id;
    logMessage("Chèn đơn hàng với ID: $orderId");

    // Insert each cart item into chi_tiet_don_hang
    foreach ($muc_gio_hang as $index => $item) {
        if (!isset($item['ma_sp']) || trim($item['ma_sp']) === '') {
            throw new Exception('Mục giỏ hàng tại chỉ số ' . $index . ' thiếu hoặc sai mã sản phẩm (ma_sp): ' . json_encode($item));
        }
        $ma_sp = $conn->real_escape_string($item['ma_sp']);
        $so_luong = intval($item['so_luong']);
        $don_gia = floatval($item['gia']);
        $giam_gia = 0; // Nếu có trường giảm giá thì lấy, không thì để 0
        $sqlChiTiet = "INSERT INTO chi_tiet_don_hang (ma_don_hang, ma_sp, so_luong, don_gia, giam_gia) VALUES ('$orderId', '$ma_sp', '$so_luong', '$don_gia', '$giam_gia')";
        logMessage("Thực thi truy vấn chèn chi_tiet_don_hang: $sqlChiTiet");
        if (!$conn->query($sqlChiTiet)) {
            throw new Exception('Lỗi khi chèn vào chi_tiet_don_hang: ' . $conn->error . ' | ma_sp: ' . $ma_sp . ' | item: ' . json_encode($item));
        }
    }

    // Aggregate product names for hoa_don
    $productNames = array_map(function($item) {
        return $item['ten'] . ' (x' . $item['so_luong'] . ')';
    }, $muc_gio_hang);
    $ten_san_pham = implode(', ', $productNames);
    $ten_nguoi = $thong_tin_khach_hang['fullName'];
    $noi_dung_hoa_don = "Khách: $ten_nguoi; Sản phẩm: $ten_san_pham; Địa chỉ: $dia_chi; Ghi chú: $note; Phương thức: $phuong_thuc_thanh_toan";
    // Insert into hoa_don table (dùng trường noi_dung thay vì ten_nguoi, ten_san_pham, dia_chi...)
    $invoiceSql = "INSERT INTO hoa_don (ma_don_hang, noi_dung, tong_tien) VALUES ('$orderId', '" . $conn->real_escape_string($noi_dung_hoa_don) . "', '$orderTotal')";
    
    logMessage("Thực thi truy vấn chèn hóa đơn: $invoiceSql");
    if (!$conn->query($invoiceSql)) {
        throw new Exception("Lỗi khi chèn vào hoa_don: " . $conn->error);
    }
    
    // Create payment record
    $paymentStatus = 'Chưa thanh toán';
    $paymentSql = "INSERT INTO thanh_toan (ma_don_hang, phuong_thuc, tong_tien, trang_thai) VALUES ('$orderId', '$phuong_thuc_thanh_toan', '$orderTotal', '$paymentStatus')";
    
    logMessage("Thực thi truy vấn chèn thanh toán: $paymentSql");
    if (!$conn->query($paymentSql)) {
        throw new Exception("Lỗi khi chèn vào thanh_toan: " . $conn->error);
    }

    // Nếu là VNPay, chỉ trả về orderId, frontend sẽ gọi sang vnpay_create.php để lấy payUrl
    if ($phuong_thuc_thanh_toan === 'vnpay') {
        $conn->commit();
        logMessage("Đơn hàng VNPay đã tạo, trả về orderId để frontend tự gọi sang vnpay_create.php");
        sendCorsHeaders();
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Đơn hàng VNPay đã tạo, vui lòng chuyển hướng sang vnpay_create.php để lấy payUrl",
            "orderId" => $orderId
        ]);
        exit;
    }

    // For COD, commit transaction and return success
    $conn->commit();
    logMessage("Giao dịch COD được xác nhận thành công");
    sendCorsHeaders();
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Xử lý đơn hàng thành công",
        "orderId" => $orderId
    ]);
} catch (Exception $e) {
    $conn->rollback();
    $errorMsg = "Lỗi khi xử lý đơn hàng: " . $e->getMessage();
    logMessage($errorMsg);
    sendError(500, $errorMsg);
} finally {
    $conn->close();
    logMessage("Đóng kết nối cơ sở dữ liệu");
}

// Helper function to generate transaction ID
function generateTransactionId() {
    return 'TXN' . time() . rand(1000, 9999);
}
?>