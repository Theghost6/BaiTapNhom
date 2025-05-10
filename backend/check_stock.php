<?php
// Cấu hình CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Bật error reporting để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);


// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Cấu hình kết nối database
$host = 'localhost';
$db_name = 'form';
$username = 'root';
$password = '';

// Xử lý GET request để kiểm tra tồn kho
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    try {
        $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $id_san_pham = $_GET['id'];
        
        // Sửa lại câu query để lấy thông tin chính xác
        $stmt = $conn->prepare("SELECT id_san_pham, ten_san_pham, solg_trong_kho FROM ton_kho WHERE id_san_pham = :id_san_pham");
        $stmt->execute(['id_san_pham' => $id_san_pham]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$result) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Không tìm thấy sản phẩm'
            ]);
            exit();
        }
        
        // Trả về dữ liệu với format chuẩn
        echo json_encode([
            'status' => 'success',
            'product' => [
                'id_san_pham' => $result['id_san_pham'],
                'ten_san_pham' => $result['ten_san_pham'],
                'solg_trong_kho' => (int)$result['solg_trong_kho'] // Đảm bảo trả về số
            ]
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Lỗi database: ' . $e->getMessage()
        ]);
    }
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

    try {
        $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Xác định hành động: kiểm tra hoặc cập nhật
        $action = isset($data['action']) ? $data['action'] : 'update';
        $isCheckOnly = ($action === 'check') || 
                       (count($data['items']) === 1 && (!isset($data['items'][0]['so_luong']) || intval($data['items'][0]['so_luong']) === 0));

        if (!$isCheckOnly) {
            $conn->beginTransaction();
        }

        $errors = [];
        $updated_items = [];

        foreach ($data['items'] as $item) {
            if (!isset($item['id_san_pham'])) {
                $errors[] = 'Thiếu dữ liệu sản phẩm';
                continue;
            }

            $id_san_pham = $item['id_san_pham'];
            $so_luong = isset($item['so_luong']) ? intval($item['so_luong']) : 0;

            $stmt = $conn->prepare("SELECT id_san_pham, ten_san_pham, solg_trong_kho FROM ton_kho WHERE id_san_pham = :id_san_pham");
            $stmt->execute(['id_san_pham' => $id_san_pham]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$result) {
                $errors[] = "Sản phẩm ID: $id_san_pham không tồn tại";
                continue;
            }

            $current_stock = $result['solg_trong_kho'];
            $ten_san_pham = $result['ten_san_pham'];

            // Nếu chỉ kiểm tra thì không cập nhật database
            if ($isCheckOnly) {
                $updated_items[] = [
                    'id_san_pham' => $id_san_pham,
                    'ten_san_pham' => $ten_san_pham,
                    'so_luong_cu' => $current_stock,
                    'so_luong_moi' => $current_stock
                ];
                continue;
            }

            // Nếu cập nhật, kiểm tra đủ hàng không
            if ($current_stock < $so_luong) {
                $errors[] = "Sản phẩm ID: $id_san_pham ($ten_san_pham) chỉ còn $current_stock sản phẩm";
                continue;
            }

            // Cập nhật số lượng tồn kho
            $new_stock = $current_stock - $so_luong;
            $update_stmt = $conn->prepare("UPDATE ton_kho SET solg_trong_kho = :new_stock WHERE id_san_pham = :id_san_pham");
            $update_stmt->execute([
                'new_stock' => $new_stock,
                'id_san_pham' => $id_san_pham
            ]);

            $updated_items[] = [
                'id_san_pham' => $id_san_pham,
                'ten_san_pham' => $ten_san_pham,
                'so_luong_cu' => $current_stock,
                'so_luong_moi' => $new_stock,
                'so_luong_mua' => $so_luong
            ];
        }

        if (!empty($errors) && !$isCheckOnly) {
            $conn->rollBack();
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
        
    } catch (PDOException $e) {
        if (isset($conn) && $conn->inTransaction()) {
            $conn->rollBack();
        }
        echo json_encode([
            'status' => 'error',
            'message' => 'Lỗi database: ' . $e->getMessage()
        ]);
    }
    exit();
}

// Nếu không phải GET hoặc POST
echo json_encode([
    'status' => 'error',
    'message' => 'Phương thức không được hỗ trợ'
]);
?>