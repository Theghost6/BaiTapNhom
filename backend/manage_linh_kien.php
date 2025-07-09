<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}
// Đường dẫn tới file JSON
$file = '../src/page/function/Linh_kien.json';

// Đọc dữ liệu từ file JSON
function readData($file) {
    if (!file_exists($file)) return [];
    $json = file_get_contents($file);
    return json_decode($json, true) ?: [];
}

// Ghi dữ liệu vào file JSON
function writeData($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Lấy action và loại linh kiện từ request
$action = $_GET['action'] ?? $_POST['action'] ?? '';
$loai = $_GET['loai'] ?? $_POST['loai'] ?? '';

switch ($action) {
    case 'get_all':
        echo json_encode(readData($file));
        break;

    case 'add':
        $data = readData($file);
        $item = json_decode($_POST['item'] ?? '', true);
        if (!$item || !$loai) {
            echo json_encode(['success' => false, 'error' => 'Dữ liệu không hợp lệ']);
            break;
        }
        $item['id'] = uniqid();
        if (!isset($data[$loai]) || !is_array($data[$loai])) $data[$loai] = [];
        $data[$loai][] = $item;
        writeData($file, $data);
        echo json_encode(['success' => true, 'item' => $item]);
        break;

    case 'update':
        $data = readData($file);
        $id = $_POST['id'] ?? '';
        $item = json_decode($_POST['item'] ?? '', true);
        if (!$loai || !isset($data[$loai]) || !is_array($data[$loai])) {
            echo json_encode(['success' => false, 'error' => 'Loại không hợp lệ']);
            break;
        }
        $found = false;
        foreach ($data[$loai] as &$row) {
            if ($row['id'] == $id) {
                $row = array_merge($row, $item);
                $found = true;
                break;
            }
        }
        if ($found) {
            writeData($file, $data);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Không tìm thấy linh kiện']);
        }
        break;

    case 'delete':
        $data = readData($file);
        $id = $_POST['id'] ?? '';
        if (!$loai || !isset($data[$loai]) || !is_array($data[$loai])) {
            echo json_encode(['success' => false, 'error' => 'Loại không hợp lệ']);
            break;
        }
        $data[$loai] = array_values(array_filter($data[$loai], function($row) use ($id) {
            return $row['id'] != $id;
        }));
        writeData($file, $data);
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['error' => 'No action specified']);
        break;
}
?> 