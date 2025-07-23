<?php
// Set timezone to Vietnam
date_default_timezone_set('Asia/Ho_Chi_Minh');

// CẤU HÌNH CORS LUÔN ĐẶT ĐẦU FILE, TRƯỚC MỌI LỆNH PHP KHÁC
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Bật error reporting để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Xử lý preflight request (OPTIONS) NGAY SAU HEADER
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối database qua connect.php (sau header và OPTIONS)
require_once 'connect.php';
// Kiểm tra kết nối DB
if (!isset($conn) || !$conn) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Lỗi kết nối database! Kiểm tra lại file connect.php.'
    ]);
    exit();
}

// Xử lý GET request để kiểm tra tồn kho
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $ma_sp = $conn->real_escape_string($_GET['id']);
    $stmt = $conn->prepare("SELECT ma_sp, ten_san_pham, solg_trong_kho FROM ton_kho WHERE ma_sp = ?");
    $stmt->bind_param('s', $ma_sp);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    if (!$row) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Không tìm thấy sản phẩm'
        ]);
        exit();
    }
    echo json_encode([
        'status' => 'success',
        'product' => [
            'ma_sp' => $row['ma_sp'],
            'ten_san_pham' => $row['ten_san_pham'],
            'solg_trong_kho' => (int)$row['solg_trong_kho']
        ]
    ]);
    exit();
}

// Xử lý POST request để cập nhật tồn kho
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    if (!$data || !isset($data['items']) || !is_array($data['items']) || empty($data['items'])) {
        echo json_encode(['status' => 'error', 'message' => 'Dữ liệu không hợp lệ']);
        exit();
    }

    // Xác định hành động: kiểm tra hoặc cập nhật
    $action = isset($data['action']) ? $data['action'] : 'update';
    $isCheckOnly = ($action === 'check') || 
                   (count($data['items']) === 1 && (!isset($data['items'][0]['so_luong']) || intval($data['items'][0]['so_luong']) === 0));

    if (!$isCheckOnly) {
        $conn->begin_transaction();
    }

    $errors = [];
    $updated_items = [];

    foreach ($data['items'] as $item) {
        if (!isset($item['ma_sp'])) {
            $errors[] = 'Thiếu dữ liệu sản phẩm';
            continue;
        }
        $ma_sp = $conn->real_escape_string($item['ma_sp']);
        $so_luong = isset($item['so_luong']) ? intval($item['so_luong']) : 0;

        $stmt = $conn->prepare("SELECT ma_sp, ten_san_pham, solg_trong_kho FROM ton_kho WHERE ma_sp = ?");
        $stmt->bind_param('s', $ma_sp);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if (!$row) {
            $errors[] = "Sản phẩm ID: $ma_sp không tồn tại";
            continue;
        }

        $current_stock = $row['solg_trong_kho'];
        $ten_san_pham = $row['ten_san_pham'];

        // Nếu chỉ kiểm tra thì không cập nhật database
        if ($isCheckOnly) {
            $updated_items[] = [
                'ma_sp' => $ma_sp,
                'ten_san_pham' => $ten_san_pham,
                'so_luong_cu' => $current_stock,
                'so_luong_moi' => $current_stock
            ];
            continue;
        }

        // Nếu cập nhật, kiểm tra đủ hàng không
        if ($current_stock < $so_luong) {
            $errors[] = "Sản phẩm ID: $ma_sp ($ten_san_pham) chỉ còn $current_stock sản phẩm";
            continue;
        }

        // Cập nhật số lượng tồn kho
        $new_stock = $current_stock - $so_luong;
        $update_stmt = $conn->prepare("UPDATE ton_kho SET solg_trong_kho = ? WHERE ma_sp = ?");
        $update_stmt->bind_param('is', $new_stock, $ma_sp);
        $update_stmt->execute();

        $updated_items[] = [
            'ma_sp' => $ma_sp,
            'ten_san_pham' => $ten_san_pham,
            'so_luong_cu' => $current_stock,
            'so_luong_moi' => $new_stock,
            'so_luong_mua' => $so_luong
        ];
    }

    if (!empty($errors) && !$isCheckOnly) {
        $conn->rollback();
        echo json_encode([
            'status' => 'error',
            'message' => 'Có lỗi khi cập nhật tồn kho',
            'errors' => $errors
        ]);
        exit();
    }

    if (!$isCheckOnly) {
        $conn->commit();
        $order_id = 'ORDER-' . time() . '-' . rand(1000, 9999);
    }

    echo json_encode([
        'status' => 'success',
        'message' => $isCheckOnly ? 'Kiểm tra tồn kho thành công' : 'Cập nhật tồn kho thành công',
        'orderId' => $isCheckOnly ? null : $order_id,
        'updated_items' => $updated_items
    ]);
    exit();
}

// Nếu không phải GET hoặc POST
echo json_encode([
    'status' => 'error',
    'message' => 'Phương thức không được hỗ trợ'
]);
?>