<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Log errors to a file
$logFile = __DIR__ . '/payment_debug.log';
function logMessage($message) {
    global $logFile;
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - $message\n", FILE_APPEND);
}

// Log all incoming requests
logMessage("Nhận yêu cầu: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    logMessage("Yêu cầu OPTIONS được nhận");
    exit();
}

// Handle VNPay callback (return URL)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['vnp_TxnRef'])) {
    $vnp_HashSecret = "FC3731AMJQ13YF261SEG5E3F6X2YKRFJ"; // Your VNPay secret
    
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
        logMessage("Chữ ký VNPay không hợp lệ. Expected: $vnp_SecureHash, Got: $secureHash");
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Chữ ký không hợp lệ']);
        exit;
    }

    $conn = new mysqli("localhost", "root", "", "form");
    if ($conn->connect_error) {
        logMessage("Kết nối cơ sở dữ liệu thất bại: " . $conn->connect_error);
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Lỗi cơ sở dữ liệu']);
        exit;
    }

    $orderId = $conn->real_escape_string($_GET['vnp_TxnRef']);
    $status = $_GET['vnp_ResponseCode'] == '00' ? 'Đã thanh toán' : 'Thất bại';
    $transId = $conn->real_escape_string($_GET['vnp_TransactionNo']);
    
    $sqlPayment = "UPDATE thanh_toan SET 
                   trang_thai_thanh_toan = '$status', 
                   ma_giao_dich = '$transId',
                   thoi_gian_thanh_toan = NOW(),
                   thoi_gian_cap_nhat = NOW()
                   WHERE ma_don_hang = '$orderId'";
                   
    $conn->query($sqlPayment);
    
    logMessage("Trạng thái thanh toán được cập nhật cho đơn hàng $orderId: $status");
    
    if ($_GET['vnp_ResponseCode'] == '00') {
        // Update order status to indicate payment completed
        $sqlUpdateOrder = "UPDATE don_hang SET trang_thai = 'Đã thanh toán' WHERE id = '$orderId'";
        $conn->query($sqlUpdateOrder);
        logMessage("Cập nhật trạng thái đơn hàng $orderId thành 'Đã thanh toán'");
        
        header("Location: http://localhost:5173/thankyou?orderId=$orderId&success=true");
    } else {
        header("Location: http://localhost:3000/payment-failed?orderId=$orderId");
    }
    $conn->close();
    exit;
}

// Database connection
$conn = new mysqli("localhost", "root", "", "form");
if ($conn->connect_error) {
    http_response_code(500);
    $errorMsg = "Kết nối cơ sở dữ liệu thất bại: " . $conn->connect_error;
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

$conn->set_charset("utf8mb4");
logMessage("Kết nối cơ sở dữ liệu thành công");

// Parse JSON input
$rawInput = file_get_contents("php://input");
logMessage("Dữ liệu thô: $rawInput");
$data = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    $errorMsg = "JSON không hợp lệ: " . json_last_error_msg();
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

// Handle order logic
if (!$data || !isset($data['customerInfo']) || !isset($data['cartItems']) || !isset($data['paymentMethod']) || !isset($data['shippingMethod'])) {
    http_response_code(400);
    $errorMsg = "Thiếu các trường bắt buộc: customerInfo, cartItems, paymentMethod, hoặc shippingMethod";
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
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
    http_response_code(400);
    $errorMsg = "Định dạng ngày đặt hàng không hợp lệ: " . $e->getMessage();
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

// Input validation
$requiredCustomerFields = ['fullName', 'email', 'phone'];
if ($phuong_thuc_van_chuyen === 'ship') {
    $requiredCustomerFields = array_merge($requiredCustomerFields, ['address', 'city', 'district']);
}
foreach ($requiredCustomerFields as $field) {
    if (!isset($thong_tin_khach_hang[$field]) || ($phuong_thuc_van_chuyen === 'ship' && empty(trim($thong_tin_khach_hang[$field])))) {
        http_response_code(400);
        $errorMsg = "Thiếu hoặc trường khách hàng rỗng: $field";
        logMessage($errorMsg);
        echo json_encode(["status" => "error", "message" => $errorMsg]);
        exit;
    }
}

// Validate email
if (!filter_var($thong_tin_khach_hang['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    $errorMsg = "Định dạng email không hợp lệ: " . $thong_tin_khach_hang['email'];
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

// Validate phone
if (!preg_match('/^[0-9]{10,11}$/', preg_replace('/[^0-9]/', '', $thong_tin_khach_hang['phone']))) {
    http_response_code(400);
    $errorMsg = "Định dạng số điện thoại không hợp lệ: " . $thong_tin_khach_hang['phone'];
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

// Validate cart items
if (empty($muc_gio_hang)) {
    http_response_code(400);
    $errorMsg = "Giỏ hàng rỗng";
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}
foreach ($muc_gio_hang as $index => $item) {
    if (!isset($item['id_product']) || !isset($item['ten']) || !isset($item['gia']) || 
        !isset($item['so_luong']) || !isset($item['danh_muc']) || !is_numeric($item['gia']) || $item['gia'] <= 0) {
        http_response_code(400);
        $errorMsg = "Mục giỏ hàng không hợp lệ tại chỉ số $index: thiếu trường bắt buộc hoặc giá không hợp lệ";
        logMessage($errorMsg);
        echo json_encode(["status" => "error", "message" => $errorMsg]);
        exit;
    }
}

// Validate shipping method
if (!in_array($phuong_thuc_van_chuyen, ['ship', 'pickup'])) {
    http_response_code(400);
    $errorMsg = "Phương thức vận chuyển không hợp lệ: $phuong_thuc_van_chuyen";
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

// Validate total amount
if (!is_numeric($tong_so_tien) || $tong_so_tien <= 0) {
    http_response_code(400);
    $errorMsg = "Tổng số tiền không hợp lệ: $tong_so_tien";
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

// Validate userId
if (is_null($userId)) {
    http_response_code(400);
    $errorMsg = "Thiếu mã người dùng. Vui lòng đăng nhập lại.";
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

// Verify userId exists in dang_ky table
$userQuery = "SELECT id FROM dang_ky WHERE id = '$userId' LIMIT 1";
$userResult = $conn->query($userQuery);
if (!$userResult || $userResult->num_rows == 0) {
    http_response_code(400);
    $errorMsg = "Mã người dùng không hợp lệ: $userId";
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

logMessage("Xác thực đầu vào thành công");

// Start transaction
$conn->begin_transaction();
try {
    // Check if we need to add shipping address (only for 'ship' method)
    $addressId = null;
    if ($phuong_thuc_van_chuyen === 'ship') {
        $fullName = $conn->real_escape_string($thong_tin_khach_hang['fullName']);
        $address = $conn->real_escape_string($thong_tin_khach_hang['address']);
        $city = $conn->real_escape_string($thong_tin_khach_hang['city']);
        $district = $conn->real_escape_string($thong_tin_khach_hang['district']);
        $ward = $conn->real_escape_string($thong_tin_khach_hang['ward'] ?? '');
        $phone = $conn->real_escape_string($thong_tin_khach_hang['phone']);
        
        $addressQuery = "INSERT INTO dia_chi_giao_hang (ma_tk, nguoi_nhan, sdt_nhan, dia_chi, tinh_thanh, quan_huyen, phuong_xa) 
                         VALUES ('$userId', '$fullName', '$phone', '$address', '$city', '$district', '$ward')";
        
        if ($conn->query($addressQuery)) {
            $addressId = $conn->insert_id;
            logMessage("Tạo địa chỉ giao hàng mới với ID: $addressId");
        } else {
            throw new Exception("Lỗi khi chèn vào dia_chi_giao_hang: " . $conn->error);
        }
    }
    if ($phuong_thuc_van_chuyen === 'pickup') {
        $fullName = $conn->real_escape_string($thong_tin_khach_hang['fullName']);
        $phone = $conn->real_escape_string($thong_tin_khach_hang['phone']);
        $defaultAddress = $conn->real_escape_string('Lấy tại cửa hàng');
        $defaultCity = $conn->real_escape_string('');
        $defaultDistrict = $conn->real_escape_string('');
        $defaultWard = $conn->real_escape_string('');
        
        $addressQuery = "INSERT INTO dia_chi_giao_hang (ma_tk, nguoi_nhan, sdt_nhan, dia_chi, tinh_thanh, quan_huyen, phuong_xa)
                         VALUES ('$userId', '$fullName', '$phone', '$defaultAddress', '$defaultCity', '$defaultDistrict', '$defaultWard')";
        
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
    $shippingCost = ($tong_so_tien > 1000000 && $phuong_thuc_van_chuyen === 'ship') ? 0 : 30000;
    $orderTotal = $tong_so_tien + $shippingCost;

    // Insert order into don_hang table
    $orderSql = "INSERT INTO don_hang (ma_nguoi_dung, ma_dia_chi, tong_tien, trang_thai, ngay_dat, ghi_chu)
                 VALUES ('$userId', " . ($addressId ? "'$addressId'" : "NULL") . ", '$orderTotal', '$status', '$ngay_dat_hang_dinh_dang', '$note')";
    
    logMessage("Thực thi truy vấn chèn đơn hàng: $orderSql");
    if (!$conn->query($orderSql)) {
        throw new Exception("Lỗi khi chèn vào don_hang: " . $conn->error);
    }
    
    $orderId = $conn->insert_id;
    logMessage("Chèn đơn hàng với ID: $orderId");

    // Insert order items into chi_tiet_don_hang
    foreach ($muc_gio_hang as $item) {
        $productId = $conn->real_escape_string($item['id_product']);
        $productName = $conn->real_escape_string($item['ten']);
        $category = $conn->real_escape_string($item['danh_muc'] ?? 'Không xác định');
        $quantity = intval($item['so_luong']);
        $price = floatval($item['gia']);
    
        $itemSql = "INSERT INTO chi_tiet_don_hang (ma_don_hang, id_product, ten_san_pham, danh_muc, so_luong, gia, phuong_thuc_van_chuyen)
                    VALUES ('$orderId', '$productId', '$productName', '$category', '$quantity', '$price', '$phuong_thuc_van_chuyen')";
        
        logMessage("Thực thi truy vấn chèn chi tiết đơn hàng: $itemSql");
        if (!$conn->query($itemSql)) {
            throw new Exception("Lỗi khi chèn vào chi_tiet_don_hang: " . $conn->error);
        }
    }
    
    // Create payment record
    $paymentStatus = 'Chưa thanh toán';
    $paymentSql = "INSERT INTO thanh_toan (ma_don_hang, phuong_thuc_thanh_toan, tong_so_tien, trang_thai_thanh_toan)
                   VALUES ('$orderId', '$phuong_thuc_thanh_toan', '$orderTotal', '$paymentStatus')";
                  
    logMessage("Thực thi truy vấn chèn thanh toán: $paymentSql");
    if (!$conn->query($paymentSql)) {
        throw new Exception("Lỗi khi chèn vào thanh_toan: " . $conn->error);
    }

    // Handle VNPay payment initiation
    if ($phuong_thuc_thanh_toan === 'vnpay') {
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost/backend/payments.php";
        $vnp_TmnCode = "LYE5QSH7";
        $vnp_HashSecret = "FC3731AMJQ13YF261SEG5E3F6X2YKRFJ";

        $vnp_TxnRef = $orderId;
        $vnp_OrderInfo = "Thanh toan don hang " . $orderId;
        $vnp_OrderType = "billpayment";
        $vnp_Amount = $orderTotal * 100;
        $vnp_Locale = "vn";
        $vnp_BankCode = "";
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
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

        logMessage("Chuỗi truy vấn VNPay: " . $query);
        logMessage("Dữ liệu băm VNPay: " . $hashdata);

        $vnp_Url = $vnp_Url . "?" . $query;
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        logMessage("Hash VNPay được tạo: " . $vnpSecureHash);
        
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;

        $conn->commit();
        logMessage("Khởi tạo thanh toán VNPay cho đơn hàng $orderId: $vnp_Url");
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Khởi tạo thanh toán VNPay thành công",
            "orderId" => $orderId,
            "payUrl" => $vnp_Url
        ]);
        exit;
    }

    // For COD, commit transaction and return success
    $conn->commit();
    logMessage("Giao dịch COD được xác nhận thành công");
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
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
} finally {
    $conn->close();
    logMessage("Đóng kết nối cơ sở dữ liệu");
}

// Helper function to generate transaction ID
function generateTransactionId() {
    return 'TXN' . time() . rand(1000, 9999);
}
?>