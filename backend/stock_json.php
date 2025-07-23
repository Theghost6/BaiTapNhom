<?php 
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); 
header('Access-Control-Allow-Headers: Content-Type, Authorization'); 
header('Content-Type: application/json; charset=utf-8'); 

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ====== KẾT NỐI MYSQL ======
require_once __DIR__ . '/connect.php';
$conn->set_charset('utf8mb4');

function logDebug($message) {
    $logFile = 'debug.log';
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
}

// Đảm bảo không có output nào ngoài JSON, kể cả khi lỗi PHP
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
ob_start(); // Bắt đầu buffer output để chặn mọi output ngoài JSON
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    $msg = "PHP Error [$errno] $errstr at $errfile:$errline";
    file_put_contents('debug.log', "[".date('Y-m-d H:i:s')."] $msg\n", FILE_APPEND);
    safe_json_response(['success' => false, 'error' => 'Lỗi hệ thống'], $msg);
});
set_exception_handler(function($e) {
    http_response_code(500);
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    $msg = "Uncaught Exception: " . $e->getMessage();
    file_put_contents('debug.log', "[".date('Y-m-d H:i:s')."] $msg\n", FILE_APPEND);
    safe_json_response(['success' => false, 'error' => 'Lỗi hệ thống'], $msg);
});
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        $msg = $error['message'] . ' at ' . $error['file'] . ':' . $error['line'];
        if (ob_get_length()) ob_end_clean();
        safe_json_response(['success' => false, 'error' => 'Lỗi hệ thống'], $msg);
    } else {
        if (ob_get_length()) ob_end_flush();
    }
});

// Đảm bảo buffer output được clean khi exit ở mọi nhánh
// Nếu có lỗi hệ thống, trả về JSON có thêm chi tiết lỗi (debug) nếu là localhost
function safe_json_response($data, $debug = null) {
    if (ob_get_length()) ob_end_clean();
    if ($debug !== null && isset($_SERVER['HTTP_HOST']) && (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || $_SERVER['REMOTE_ADDR'] === '127.0.0.1')) {
        $data['debug'] = $debug;
    }
    echo json_encode($data);
    exit();
}

// Đảm bảo không có ký tự trắng, BOM hoặc output nào trước <?php
if (headers_sent()) {
    if (ob_get_length()) ob_end_clean();
    safe_json_response(['success' => false, 'error' => 'Lỗi hệ thống: headers sent quá sớm']);
}

// GET: Kiểm tra tồn kho
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    logDebug("GET request cho ID: " . $_GET['id']);
    $ma_sp = intval($_GET['id']);
    $sql = "SELECT id, ten_sp, so_luong FROM san_pham WHERE id = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $ma_sp);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    if (!$row) {
        logDebug("Không tìm thấy sản phẩm ID: " . $ma_sp);
        safe_json_response([
            'status' => 'error',
            'message' => 'Không tìm thấy sản phẩm'
        ]);
    }
    $response = [
        'status' => 'success',
        'product' => [
            'ma_sp' => $row['id'],
            'ten_san_pham' => $row['ten_sp'],
            'solg_trong_kho' => (int)$row['so_luong']
        ]
    ];
    logDebug("GET response: " . json_encode($response));
    safe_json_response($response);
}

// POST: Cập nhật tồn kho hoặc chỉ kiểm tra tồn kho
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    logDebug("POST request nhận được");

    // Ưu tiên lấy id sản phẩm từ nhiều key (ma_sp, id, id_product) nếu nhận qua JSON (fetch)
    $rawInput = file_get_contents('php://input');
    $jsonInput = json_decode($rawInput, true);
    $id = '';
    $so_luong_mua = 0;
    $action = '';
    if (is_array($jsonInput) && isset($jsonInput['items']) && is_array($jsonInput['items']) && count($jsonInput['items']) > 0) {
        $item = $jsonInput['items'][0];
        if (!empty($item['ma_sp'])) {
            $id = $item['ma_sp'];
        } elseif (!empty($item['id'])) {
            $id = $item['id'];
        } elseif (!empty($item['id_product'])) {
            $id = $item['id_product'];
        }
        $action = $jsonInput['action'] ?? '';
        if ($action === 'check') {
            $so_luong_mua = 1;
        } elseif (isset($item['so_luong'])) {
            $so_luong_mua = intval($item['so_luong']);
        }
    } else {
        $id = $_POST['id'] ?? '';
        $so_luong_mua = intval($_POST['so_luong'] ?? 0);
        $action = $_POST['action'] ?? '';
    }

    logDebug("ID nhận được: '$id'");
    logDebug("Số lượng nhận được: '$so_luong_mua'");
    logDebug("Action nhận được: '$action'");

    // Kiểm tra dữ liệu đầu vào
    if (empty($id)) {
        logDebug("Lỗi: ID trống");
        safe_json_response([
            'success' => false,
            'error' => 'ID sản phẩm không được để trống'
        ]);
    }
    if ($action !== 'check' && $so_luong_mua <= 0) {
        logDebug("Lỗi: Số lượng không hợp lệ");
        safe_json_response([
            'success' => false,
            'error' => 'Số lượng phải lớn hơn 0'
        ]);
    }
    // Lấy thông tin sản phẩm
    $sql = "SELECT id, ten_sp, so_luong FROM san_pham WHERE id = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    if (!$row) {
        logDebug("Không tìm thấy sản phẩm với ID: $id");
        safe_json_response([
            'success' => false,
            'error' => "Không tìm thấy sản phẩm với ID: $id"
        ]);
    }
    $old_quantity = (int)$row['so_luong'];
    $product_name = $row['ten_sp'];
    // Nếu chỉ kiểm tra tồn kho (action: check) thì trả về số lượng hiện tại
    if (isset($jsonInput['action']) && $jsonInput['action'] === 'check') {
        $response = [
            'success' => true,
            'updated_items' => [[
                'id' => $id,
                'so_luong_cu' => $old_quantity,
                'ten_sp' => $product_name
            ]]
        ];
        logDebug("Check tồn kho: " . json_encode($response));
        safe_json_response($response);
    }
    // Nếu là cập nhật tồn kho (trừ số lượng)
    if ($old_quantity < $so_luong_mua) {
        logDebug("Không đủ hàng: có $old_quantity, cần $so_luong_mua");
        safe_json_response([
            'success' => false,
            'error' => "Không đủ hàng trong kho. Chỉ còn $old_quantity sản phẩm."
        ]);
    }
    $new_quantity = $old_quantity - $so_luong_mua;
    $sqlUpdate = "UPDATE san_pham SET so_luong = ? WHERE id = ?";
    $stmtUpdate = $conn->prepare($sqlUpdate);
    $stmtUpdate->bind_param('ii', $new_quantity, $id);
    $stmtUpdate->execute();
    $response = [
        'success' => true,
        'message' => 'Cập nhật tồn kho thành công',
        'data' => [
            'id' => $id,
            'ten_san_pham' => $product_name,
            'so_luong_cu' => $old_quantity,
            'so_luong_da_mua' => $so_luong_mua,
            'so_luong_con_lai' => $new_quantity
        ]
    ];
    logDebug("Response: " . json_encode($response));
    safe_json_response($response);
}

// Phương thức khác
logDebug("Phương thức không được hỗ trợ: " . $_SERVER['REQUEST_METHOD']);
http_response_code(405);
safe_json_response([
    'status' => 'error',
    'message' => 'Phương thức không được hỗ trợ'
]);

// Đóng kết nối MySQL cuối file để tránh lỗi trả về HTML hoặc warning không mong muốn
$conn->close();
?>