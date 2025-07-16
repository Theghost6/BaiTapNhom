<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Database connection using connect.php
require_once __DIR__ . '/connect.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$conn->set_charset("utf8mb4");

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action !== 'track_order') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid action"]);
    exit;
}

$order_id = isset($_GET['order_id']) ? intval($_GET['order_id']) : 0;
$phone = isset($_GET['phone']) ? trim($_GET['phone']) : '';

if ($order_id <= 0 && empty($phone)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Vui lòng cung cấp mã đơn hàng hoặc số điện thoại"]);
    exit;
}

// Build query based on provided parameters
$query = "SELECT 
            dh.id as ma_don_hang,
            dh.tong_tien,
            dh.trang_thai,
            dh.created_at as ngay_dat,
            dh.ghi_chu,
            dk.user as ten_nguoi_dung,
            dk.email,
            dk.phone,
            dcgh.nguoi_nhan,
            dcgh.sdt_nhan,
            dcgh.dia_chi,
            dcgh.tinh_thanh,
            dcgh.quan_huyen,
            dcgh.phuong_xa,
            GROUP_CONCAT(CONCAT(sp.ten_sp, ' (x', ctdh.so_luong, ')') SEPARATOR ', ') as ten_san_pham
          FROM don_hang dh
          LEFT JOIN tai_khoan dk ON dh.ma_nguoi_dung = dk.id
          LEFT JOIN dia_chi_giao_hang dcgh ON dh.ma_dia_chi = dcgh.ma_dia_chi
          LEFT JOIN chi_tiet_don_hang ctdh ON dh.id = ctdh.ma_don_hang
          LEFT JOIN san_pham sp ON ctdh.ma_sp = sp.ma_sp
          WHERE 1=1";

$conditions = [];
$types = "";
$params = [];

if ($order_id > 0) {
    $conditions[] = "dh.id = ?";
    $types .= "i";
    $params[] = $order_id;
}

if (!empty($phone)) {
    $conditions[] = "dk.phone = ?";
    $types .= "s";
    $params[] = $phone;
}

if (!empty($conditions)) {
    $query .= " AND " . implode(" AND ", $conditions);
}

$query .= " GROUP BY dh.id, dh.tong_tien, dh.trang_thai, dh.created_at, dh.ghi_chu, dk.user, dk.email, dk.phone, dcgh.nguoi_nhan, dcgh.sdt_nhan, dcgh.dia_chi, dcgh.tinh_thanh, dcgh.quan_huyen, dcgh.phuong_xa ";
$query .= " ORDER BY dh.created_at DESC";

$stmt = $conn->prepare($query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

// Bind parameters if any
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Query execution failed: " . $conn->error]);
    exit;
}

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

$stmt->close();

if (empty($orders)) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Không tìm thấy đơn hàng"]);
    exit;
}

// Process each order
$result_orders = [];
foreach ($orders as $order) {
    // Parse ten_san_pham into items array
    $items = [];
    if (!empty($order['ten_san_pham'])) {
        $product_list = explode(', ', $order['ten_san_pham']);
        foreach ($product_list as $product) {
            // Assuming format: "Product Name (xQuantity)"
            preg_match('/^(.*)\s\(x(\d+)\)$/', trim($product), $matches);
            if ($matches) {
                $items[] = [
                    'ten_san_pham' => $matches[1],
                    'so_luong' => (int)$matches[2]
                ];
            } else {
                $items[] = [
                    'ten_san_pham' => $product,
                    'so_luong' => 1 // Default quantity if not specified
                ];
            }
        }
    }

    // Prepare address data
    $address = [
        'nguoi_nhan' => $order['nguoi_nhan'],
        'sdt_nhan' => $order['sdt_nhan'],
        'dia_chi' => $order['dia_chi'],
        'tinh_thanh' => $order['tinh_thanh'],
        'quan_huyen' => $order['quan_huyen'],
        'phuong_xa' => $order['phuong_xa']
    ];

    // Prepare order data
    $response_order = [
        'ma_don_hang' => $order['ma_don_hang'],
        'tong_tien' => $order['tong_tien'],
        'trang_thai' => $order['trang_thai'],
        'ngay_dat' => $order['ngay_dat'],
        'ghi_chu' => $order['ghi_chu'],
        'ten_nguoi_dung' => $order['ten_nguoi_dung'],
        'email' => $order['email'],
        'phone' => $order['phone'],
        'items' => $items,
        'address' => $address
    ];

    $result_orders[] = $response_order;
}

http_response_code(200);
echo json_encode([
    "success" => true,
    "orders" => $result_orders
]);

$conn->close();
?>