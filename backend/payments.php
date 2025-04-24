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

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    logMessage("OPTIONS request received");
    exit();
}

// Handle VNPay callback (return URL)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['vnp_TxnRef'])) {
    $vnp_HashSecret = "FC3731AMJQ13YF261SEG5E3F6X2YKRFJ"; // Your VNPay secret
    
    // Enhanced debugging
    logMessage("--------- VNPay Callback Debug ---------");
    logMessage("All GET parameters: " . json_encode($_GET));
    
    $vnp_SecureHash = $_GET['vnp_SecureHash'];
    logMessage("vnp_SecureHash received: " . $vnp_SecureHash);
    
    $inputData = array();
    foreach ($_GET as $key => $value) {
        if (substr($key, 0, 4) == "vnp_") {
            $inputData[$key] = $value;
        }
    }
    
    unset($inputData['vnp_SecureHash']);
    ksort($inputData);
    logMessage("InputData after sorting: " . json_encode($inputData));
    
    $i = 0;
    $hashData = "";
    foreach ($inputData as $key => $value) {
        if ($i == 1) {
            $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
        } else {
            $hashData = urlencode($key) . "=" . urlencode($value);
            $i = 1;
        }
    }
    
    logMessage("HashData string: " . $hashData);
    $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
    logMessage("Generated secureHash: " . $secureHash);
    logMessage("Hash match: " . ($secureHash === $vnp_SecureHash ? "Yes" : "No"));

    if ($secureHash !== $vnp_SecureHash) {
        logMessage("Invalid VNPay callback signature");
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid signature']);
        exit;
    }

    $conn = new mysqli("localhost", "root", "", "form");
    if ($conn->connect_error) {
        logMessage("Database connection failed: " . $conn->connect_error);
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error']);
        exit;
    }

    $orderId = $conn->real_escape_string($_GET['vnp_TxnRef']);
    $status = $_GET['vnp_ResponseCode'] == '00' ? 'Đã thanh toán' : 'Thất bại';
    $transId = $conn->real_escape_string($_GET['vnp_TransactionNo']);
    $sql = "UPDATE thanh_toan SET trang_thai_thanh_toan = '$status', ma_giao_dich = '$transId' WHERE dat_phong_id = '$orderId'";
    if ($conn->query($sql)) {
        logMessage("Payment status updated for order $orderId: $status");
        
        // Redirect user based on payment result
        if ($_GET['vnp_ResponseCode'] == '00') {
            // Payment success - redirect to success page
            header("Location: http://localhost/success.html?orderId=$orderId");
        } else {
            // Payment failed - redirect to failure page
            header("Location: http://localhost/failure.html?orderId=$orderId");
        }
        exit;
    } else {
        logMessage("Error updating payment status: " . $conn->error);
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error']);
    }
    $conn->close();
    exit;
}

// Database connection
$conn = new mysqli("localhost", "root", "", "form");
if ($conn->connect_error) {
    http_response_code(500);
    $errorMsg = "Database connection failed: " . $conn->connect_error;
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

$conn->set_charset("utf8mb4");
logMessage("Database connected successfully");

// Parse JSON input
$rawInput = file_get_contents("php://input");
logMessage("Raw input: $rawInput");
$data = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    $errorMsg = "Invalid JSON: " . json_last_error_msg();
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

// Handle booking logic
if (!$data || !isset($data['bookingInfo']) || !isset($data['cartItems']) || !isset($data['paymentMethod'])) {
    http_response_code(400);
    $errorMsg = "Missing required fields: bookingInfo, cartItems, or paymentMethod";
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

$booking = $data['bookingInfo'];
$cartItems = $data['cartItems'];
$paymentMethod = $data['paymentMethod'];
$totalAmount = $data['totalAmount'] ?? 0;
$totalQuantity = $data['totalQuantity'] ?? 0;
$sourceInfo = $data['sourceInfo'] ?? [];
$hotelInfo = $data['hotelInfo'] ?? null;
$roomInfo = $data['roomInfo'] ?? null;
$destinationInfo = $data['destinationInfo'] ?? null;

// Input validation
$requiredBookingFields = ['checkInDate', 'checkOutDate', 'email', 'fullName', 'numberOfPeople', 'phone'];
foreach ($requiredBookingFields as $field) {
    if (!isset($booking[$field]) || empty(trim($booking[$field]))) {
        http_response_code(400);
        $errorMsg = "Missing or empty booking field: $field";
        logMessage($errorMsg);
        echo json_encode(["status" => "error", "message" => $errorMsg]);
        exit;
    }
}

// Validate email
if (!filter_var($booking['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    $errorMsg = "Invalid email format: " . $booking['email'];
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

// Validate phone
if (!preg_match('/^[0-9]{10,15}$/', $booking['phone'])) {
    http_response_code(400);
    $errorMsg = "Invalid phone number format: " . $booking['phone'];
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

// Validate dates
$checkInDate = DateTime::createFromFormat('Y-m-d', $booking['checkInDate']);
$checkOutDate = DateTime::createFromFormat('Y-m-d', $booking['checkOutDate']);
if (!$checkInDate || !$checkOutDate || $checkInDate >= $checkOutDate) {
    http_response_code(400);
    $errorMsg = "Invalid dates: check-in must be before check-out";
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

// Validate cart items
foreach ($cartItems as $index => $item) {
    if (!isset($item['name']) || !isset($item['price']) || !is_numeric($item['price']) || $item['price'] <= 0) {
        http_response_code(400);
        $errorMsg = "Invalid cart item at index $index: missing name or invalid price";
        logMessage($errorMsg);
        echo json_encode(["status" => "error", "message" => $errorMsg]);
        exit;
    }
}

// Validate total amount and quantity
if (!is_numeric($totalAmount) || $totalAmount <= 0 || !is_numeric($totalQuantity) || $totalQuantity <= 0) {
    http_response_code(400);
    $errorMsg = "Invalid total amount ($totalAmount) or quantity ($totalQuantity)";
    logMessage($errorMsg);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

logMessage("Input validation passed");

// Start transaction
$conn->begin_transaction();
try {
    // Handle hotel info
    $khach_san_id = null;
    if ($hotelInfo && isset($hotelInfo['id'])) {
        $khach_san_id = intval($hotelInfo['id']);
        $resultHotel = $conn->query("SELECT id FROM khach_san WHERE id = $khach_san_id");
        if ($resultHotel->num_rows == 0) {
            $hotelName = $conn->real_escape_string($hotelInfo['name']);
            $hotelAddress = $conn->real_escape_string($hotelInfo['address'] ?? '');
            $sqlInsertHotel = "INSERT INTO khach_san (id, ten, dia_chi) VALUES ($khach_san_id, '$hotelName', '$hotelAddress')";
            if (!$conn->query($sqlInsertHotel)) {
                throw new Exception("Error inserting hotel: " . $conn->error);
            }
        }
    } else if (isset($sourceInfo['hotelId'])) {
        $khach_san_id = intval($sourceInfo['hotelId']);
        $result = $conn->query("SELECT id FROM khach_san WHERE id = $khach_san_id");
        if ($result->num_rows === 0) {
            logMessage("Invalid khach_san_id: $khach_san_id, setting to NULL");
            $khach_san_id = null;
        }
    }

    // Handle room info
    $phong_id = null;
    if ($roomInfo && $khach_san_id) {
        $roomName = $conn->real_escape_string($roomInfo['name']);
        $roomPrice = floatval($roomInfo['price']);
        $roomCapacity = intval($roomInfo['capacity'] ?? 2);
        $sqlCheckRoom = "SELECT id FROM phong WHERE khach_san_id = $khach_san_id AND ten = '$roomName'";
        $resultRoom = $conn->query($sqlCheckRoom);
        if ($resultRoom->num_rows > 0) {
            $rowRoom = $resultRoom->fetch_assoc();
            $phong_id = $rowRoom['id'];
        } else {
            $sqlInsertRoom = "INSERT INTO phong (khach_san_id, ten, gia, tong_so_phong, so_nguoi_toi_da, so_nguoi_hien_tai) 
                             VALUES ($khach_san_id, '$roomName', $roomPrice, 1, $roomCapacity, " . intval($booking['numberOfPeople']) . ")";
            if (!$conn->query($sqlInsertRoom)) {
                throw new Exception("Error inserting into phong: " . $conn->error);
            }
            $phong_id = $conn->insert_id;
        }
    }

    // Handle destination info
    $tour_id = null;
    if ($destinationInfo && isset($destinationInfo['name'])) {
        $destName = $conn->real_escape_string($destinationInfo['name']);
        $sqlCheckDest = "SELECT id FROM dia_diem WHERE ten = '$destName'";
        $resultDest = $conn->query($sqlCheckDest);
        if ($resultDest->num_rows > 0) {
            $rowDest = $resultDest->fetch_assoc();
            $tour_id = $rowDest['id'];
            logMessage("Using existing destination ID: $tour_id for name: $destName");
        } else {
            $destDesc = $conn->real_escape_string($destinationInfo['description'] ?? '');
            $destPrice = floatval($destinationInfo['price'] ?? 0);
            $destAddress = $conn->real_escape_string($destinationInfo['address'] ?? '');
            $sqlInsertDest = "INSERT INTO dia_diem (ten, mo_ta, gia, dia_chi) 
                             VALUES ('$destName', '$destDesc', $destPrice, '$destAddress')";
            if (!$conn->query($sqlInsertDest)) {
                throw new Exception("Error inserting into dia_diem: " . $conn->error);
            }
            $tour_id = $conn->insert_id;
            logMessage("Inserted new destination with ID: $tour_id for name: $destName");
        }
    }

    // Insert into dat_phong
    $ngay_vao = $conn->real_escape_string($booking['checkInDate']);
    $ngay_ra = $conn->real_escape_string($booking['checkOutDate']);
    $email = $conn->real_escape_string($booking['email']);
    $ten = $conn->real_escape_string($booking['fullName']);
    $so_nguoi = intval($booking['numberOfPeople']);
    $sdt = $conn->real_escape_string($booking['phone']);
    $yeu_cau_dac_biet = $conn->real_escape_string($booking['specialRequests'] ?? '');

    $sql = "INSERT INTO dat_phong (phong_id, khach_san_id, ngay_vao, ngay_ra, email, ten, so_nguoi, sdt, yeu_cau_dac_biet, trang_thai, tour_id)
            VALUES (" . ($phong_id ? $phong_id : 'NULL') . ", " . 
                      ($khach_san_id ? $khach_san_id : 'NULL') . ", 
                      '$ngay_vao', '$ngay_ra', '$email', '$ten', $so_nguoi, '$sdt', 
                      '$yeu_cau_dac_biet', 'Chờ xác nhận', " . 
                      ($tour_id ? $tour_id : 'NULL') . ")";
    logMessage("Executing dat_phong query: $sql");
    if (!$conn->query($sql)) {
        throw new Exception("Error inserting into dat_phong: " . $conn->error);
    }
    $bookingId = $conn->insert_id;
    logMessage("Inserted dat_phong with ID: $bookingId");

    // Insert into gio_hang_items
    foreach ($cartItems as $index => $item) {
        $ten = $conn->real_escape_string($item['name']);
        $dia_diem = $conn->real_escape_string($item['description'] ?? '');
        $gia = floatval($item['price']);
        $loai = $conn->real_escape_string($item['type'] ?? 'Dịch vụ');
        $so_luong = intval($item['quantity'] ?? 1);
        $ngay_nhan_phong = isset($item['checkIn']) ? $conn->real_escape_string($item['checkIn']) : $ngay_vao;
        $ngay_tra_phong = isset($item['checkOut']) ? $conn->real_escape_string($item['checkOut']) : $ngay_ra;
        $so_ngay = intval($item['days'] ?? calculateDays($ngay_nhan_phong, $ngay_tra_phong));

        $dia_diem_id = null;
        if ($loai === 'Đặt tour trực tiếp' && $tour_id) {
            $dia_diem_id = $tour_id;
            logMessage("Using tour_id $tour_id as dia_diem_id for direct destination item: $ten");
        } elseif (isset($item['id']) && $item['id']) {
            $checkId = intval($item['id']);
            $sqlCheckDiaDiem = "SELECT id FROM dia_diem WHERE id = $checkId";
            $resultDiaDiem = $conn->query($sqlCheckDiaDiem);
            if ($resultDiaDiem->num_rows > 0) {
                $dia_diem_id = $checkId;
                logMessage("Using verified dia_diem_id $dia_diem_id for item: $ten");
            } else {
                logMessage("Invalid dia_diem_id $checkId for item: $ten, setting to NULL");
            }
        }

        $sqlDetail = "INSERT INTO gio_hang_items (dat_phong_id, dia_diem_id, ten, dia_diem, gia, loai, ngay_nhan_phong, ngay_tra_phong, so_ngay, so_luong)
                      VALUES ($bookingId, " . ($dia_diem_id ? $dia_diem_id : 'NULL') . ", 
                              '$ten', '$dia_diem', $gia, '$loai', 
                              '$ngay_nhan_phong', '$ngay_tra_phong', $so_ngay, $so_luong)";
        logMessage("Executing gio_hang_items query: $sqlDetail");
        if (!$conn->query($sqlDetail)) {
            throw new Exception("Error inserting into gio_hang_items: " . $conn->error);
        }
    }

    // Insert into thanh_toan
    $phuong_thuc_thanh_toan = $conn->real_escape_string($paymentMethod);
    $tong_so_tien = floatval($totalAmount);
    $tong_so_luong = intval($totalQuantity);
    $ma_giao_dich = generateTransactionId();

    $sqlPayment = "INSERT INTO thanh_toan (dat_phong_id, phuong_thuc_thanh_toan, tong_so_tien, tong_so_luong, trang_thai_thanh_toan, thoi_gian_thanh_toan, ma_giao_dich)
                   VALUES ($bookingId, '$phuong_thuc_thanh_toan', $tong_so_tien, $tong_so_luong, 'Chưa thanh toán', NOW(), '$ma_giao_dich')";
    logMessage("Executing thanh_toan query: $sqlPayment");
    if (!$conn->query($sqlPayment)) {
        throw new Exception("Error inserting into thanh_toan: " . $conn->error);
    }

    // Handle VNPay payment initiation
    if ($paymentMethod === 'vnpay') {
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:5173/thankyou"; // Same file handles callback
        $vnp_TmnCode = "LYE5QSH7"; // Your VNPay TmnCode
        $vnp_HashSecret = "FC3731AMJQ13YF261SEG5E3F6X2YKRFJ"; // Your VNPay secret

        $vnp_TxnRef = $bookingId;
        $vnp_OrderInfo = "Thanh toan don hang $bookingId";
        $vnp_OrderType = "tourism";
        $vnp_Amount = $tong_so_tien * 100; // VNPay requires amount in VND * 100
        $vnp_Locale = "vn";
        $vnp_BankCode = ""; // Let user choose bank on VNPay page
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
        $vnp_ExpireDate = date('YmdHis', strtotime('+1 hour')); // Expire in 1 hour
        $vnp_Bill_Mobile = $sdt;
        $vnp_Bill_Email = $email;
        $fullName = trim($ten);
        $vnp_Bill_FirstName = $fullName;
        $vnp_Bill_LastName = "";
        if (isset($fullName) && trim($fullName) != '') {
            $name = explode(' ', $fullName);
            $vnp_Bill_FirstName = array_shift($name);
            $vnp_Bill_LastName = array_pop($name);
        }
        $vnp_Bill_Address = $destinationInfo['address'] ?? '';
        $vnp_Bill_City = "";
        $vnp_Bill_Country = "VN";
        $vnp_Bill_State = "";
        $vnp_Inv_Phone = $sdt;
        $vnp_Inv_Email = $email;
        $vnp_Inv_Customer = $ten;
        $vnp_Inv_Address = $vnp_Bill_Address;
        $vnp_Inv_Company = "";
        $vnp_Inv_Taxcode = "";
        $vnp_Inv_Type = "";

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

        // Only include fields that are required by VNPay
        // Comment out or remove any fields that VNPay doesn't expect
        /*
        $inputData = array_merge($inputData, [
            "vnp_Bill_Mobile" => $vnp_Bill_Mobile,
            "vnp_Bill_Email" => $vnp_Bill_Email,
            "vnp_Bill_FirstName" => $vnp_Bill_FirstName,
            "vnp_Bill_LastName" => $vnp_Bill_LastName,
            "vnp_Bill_Address" => $vnp_Bill_Address,
            "vnp_Bill_City" => $vnp_Bill_City,
            "vnp_Bill_Country" => $vnp_Bill_Country,
            "vnp_Inv_Phone" => $vnp_Inv_Phone,
            "vnp_Inv_Email" => $vnp_Inv_Email,
            "vnp_Inv_Customer" => $vnp_Inv_Customer,
            "vnp_Inv_Address" => $vnp_Inv_Address,
            "vnp_Inv_Company" => $vnp_Inv_Company,
            "vnp_Inv_Taxcode" => $vnp_Inv_Taxcode,
            "vnp_Inv_Type" => $vnp_Inv_Type
        ]);
        */

        if ($vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if ($vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        // Log the input data to verify
        logMessage("VNPay input data: " . json_encode($inputData));

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

        logMessage("VNPay query string: " . $query);
        logMessage("VNPay hash data: " . $hashdata);

        $vnp_Url = $vnp_Url . "?" . $query;
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        logMessage("VNPay generated hash: " . $vnpSecureHash);
        
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;

        $conn->commit();
        logMessage("VNPay payment initiated for booking $bookingId: $vnp_Url");
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "VNPay payment initiated",
            "bookingId" => $bookingId,
            "payUrl" => $vnp_Url
        ]);
        exit;
    }

    // For COD, commit transaction and return success
    $conn->commit();
    logMessage("Transaction committed successfully for COD");
    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Booking processed successfully",
        "bookingId" => $bookingId,
        "transactionId" => $ma_giao_dich
    ]);
} catch (Exception $e) {
    $conn->rollback();
    $errorMsg = "Error processing booking: " . $e->getMessage();
    logMessage($errorMsg);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $errorMsg]);
} finally {
    $conn->close();
    logMessage("Database connection closed");
}

// Helper functions
function calculateDays($startDate, $endDate) {
    $start = new DateTime($startDate);
    $end = new DateTime($endDate);
    $interval = $start->diff($end);
    $days = $interval->days;
    return $days > 0 ? $days : 1;
}

function generateTransactionId() {
    return 'TXN' . time() . rand(1000, 9999);
}
?>