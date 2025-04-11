<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "form");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Kết nối thất bại"]);
    exit;
}

$action = $_GET['action'] ?? '';

// 🔹 Lấy danh sách bookings
if ($action === 'get_bookings') {
    $result = $conn->query("SELECT * FROM bookings ORDER BY id DESC");
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
    exit;
}

// 🔹 Lấy chi tiết cart_items theo booking_id
if ($action === 'get_booking_detail' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $result = $conn->query("SELECT * FROM cart_items WHERE booking_id = $id");
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
    exit;
}

// 🔹 Xóa booking và các cart_items liên quan
if ($action === 'delete_booking' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $conn->query("DELETE FROM cart_items WHERE booking_id = $id");
    $conn->query("DELETE FROM bookings WHERE id = $id");
    echo json_encode(["success" => true]);
    exit;
}

echo json_encode(["error" => "Hành động không hợp lệ"]);
?>
