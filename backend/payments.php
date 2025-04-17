<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// === CORS xử lý ===
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// === KẾT NỐI DATABASE ===
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "form";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "Kết nối thất bại: " . $conn->connect_error
    ]);
    exit;
}

// === XỬ LÝ DỮ LIỆU JSON ===
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['bookingInfo']) || !isset($data['cartItems'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Thiếu dữ liệu"
    ]);
    exit;
}

$booking = $data['bookingInfo'];
$cartItems = $data['cartItems'];
$paymentMethod = $data['paymentMethod'];
$totalAmount = $data['totalAmount'];
$totalQuantity = $data['totalQuantity'];

// Kiểm tra dữ liệu cartItems
foreach ($cartItems as $item) {
    if (!isset($item['price'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Item thiếu giá trị 'price'"
        ]);
        exit;
    }
}

// === LƯU BOOKING ===
$ngay_vao = $conn->real_escape_string($booking['checkInDate']);
$ngay_ra = $conn->real_escape_string($booking['checkOutDate']);
$email = $conn->real_escape_string($booking['email']);
$ten = $conn->real_escape_string($booking['fullName']);
$so_nguoi = intval($booking['numberOfPeople']);
$sdt = $conn->real_escape_string($booking['phone']);

$conn->begin_transaction();
try {
    $sql = "INSERT INTO bookings (ngay_vao, ngay_ra, email, ten, so_nguoi, sdt)
            VALUES ('$ngay_vao', '$ngay_ra', '$email', '$ten', $so_nguoi, '$sdt')";
    $conn->query($sql);
    $bookingId = $conn->insert_id;

    foreach ($cartItems as $item) {
        $id = intval($item['id']);
        $name = $conn->real_escape_string($item['name']);
        $description = $conn->real_escape_string($item['description']);
        $price = floatval($item['price']); // ✅ đã sửa

        $sqlDetail = "INSERT INTO cart_items (booking_id, ten, dia_diem, gia)
                      VALUES ($bookingId, '$name',' $description', '$price')";
        $conn->query($sqlDetail);
    }

    $conn->commit();
    echo json_encode([
        "status" => "success",
        "message" => "Đặt chỗ thành công."
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        "status" => "error",
        "message" => "Lỗi khi lưu dữ liệu: " . $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>
