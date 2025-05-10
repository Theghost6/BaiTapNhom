<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$action = isset($_GET['action']) ? $_GET['action'] : '';

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "form";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $e->getMessage()]);
    exit;
}

if ($action === 'track_order') {
    $order_id = isset($_GET['order_id']) ? trim($_GET['order_id']) : '';
    $phone = isset($_GET['phone']) ? trim($_GET['phone']) : '';

    if (empty($order_id) && empty($phone)) {
        echo json_encode(["success" => false, "message" => "Vui lòng cung cấp mã đơn hàng hoặc số điện thoại"]);
        exit;
    }

    $query = "SELECT o.*, u.user, u.email 
              FROM don_hang o 
              LEFT JOIN dang_ky u ON o.ma_nguoi_dung = u.id 
              WHERE 1=1";
    $params = [];

    if (!empty($order_id)) {
        $query .= " AND o.id = :order_id";
        $params[':order_id'] = $order_id;
    }
    if (!empty($phone)) {
        $query .= " AND u.phone = :phone";
        $params[':phone'] = $phone;
    }

    try {
        $stmt = $conn->prepare($query);
        $stmt->execute($params);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($order) {
            // Get order items
            $stmt = $conn->prepare("SELECT * FROM chi_tiet_don_hang WHERE ma_don_hang = :order_id");
            $stmt->execute([':order_id' => $order['id']]);
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get shipping address
            $address = null;
            if ($order['ma_dia_chi']) {
                $stmt = $conn->prepare("SELECT * FROM dia_chi_giao_hang WHERE ma_dia_chi = :ma_dia_chi");
                $stmt->execute([':ma_dia_chi' => $order['ma_dia_chi']]);
                $address = $stmt->fetch(PDO::FETCH_ASSOC);
            }

            echo json_encode([
                "success" => true,
                "order" => $order,
                "items" => $items,
                "address" => $address
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Không tìm thấy đơn hàng với thông tin đã cung cấp"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Lỗi truy vấn: " . $e->getMessage()]);
    }
    exit;
}
?>