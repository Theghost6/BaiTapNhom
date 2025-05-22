<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$file = '../src/page/funtion/Linh_kien.json';

function readData($file) {
    if (!file_exists($file)) return [];
    $json = file_get_contents($file);
    return json_decode($json, true) ?: [];
}

function writeData($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// GET: kiểm tra tồn kho (unchanged)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id']) && isset($_GET['loai'])) {
    $id_san_pham = $_GET['id'];
    $loai = $_GET['loai'];
    $data = readData($file);
    if (!isset($data[$loai]) || !is_array($data[$loai])) {
        echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy loại linh kiện']);
        exit();
    }
    $result = null;
    foreach ($data[$loai] as $item) {
        if ($item['id'] == $id_san_pham) {
            $result = $item;
            break;
        }
    }
    if (!$result) {
        echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy sản phẩm']);
        exit();
    }
    echo json_encode([
        'status' => 'success',
        'product' => [
            'id_san_pham' => $result['id'],
            'ten_san_pham' => $result['ten'],
            'solg_trong_kho' => (int)($result['so_luong'] ?? 0)
        ]
    ]);
    exit();
}

// POST: cập nhật tồn kho (giảm số lượng) dựa trên id
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $so_luong_mua = intval($_POST['so_luong'] ?? 0);

    if (!$id || $so_luong_mua <= 0) {
        echo json_encode(['success' => false, 'error' => 'Dữ liệu không hợp lệ']);
        exit;
    }

    $data = readData($file);
    $found = false;

    // Duyệt qua tất cả các danh mục trong JSON
    foreach ($data as $loai => &$items) {
        if (!is_array($items)) continue;
        foreach ($items as &$item) {
            if ($item['id'] == $id) {
                $item['so_luong'] = max(0, intval($item['so_luong']) - $so_luong_mua);
                $found = true;
                break 2; // Thoát cả hai vòng lặp
            }
        }
    }

    if ($found) {
        writeData($file, $data);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Không tìm thấy sản phẩm']);
    }
    exit();
}

// Nếu không đúng định dạng
http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Phương thức hoặc tham số không hợp lệ']);
?>
