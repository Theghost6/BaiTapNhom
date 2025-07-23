<?php
// Set timezone to Vietnam
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Function to load environment variables
function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue; // Skip comments
        }
        
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);
            
            if (!array_key_exists($name, $_ENV)) {
                $_ENV[$name] = $value;
                putenv("$name=$value");
            }
        }
    }
}

// Load environment variables
loadEnv(__DIR__ . '/.env');

// Get backend host from environment
$backend_host = $_ENV['BACKEND_HOST'] ?? 'http://localhost/BaiTapNhom/backend';

// Define log file
$logFile = __DIR__ . '/debug.log';

// Kết nối database qua connect.php
require_once 'connect.php';

// Get action parameter
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    // Orders management
    case 'get_orders':
        $sql = "SELECT dh.*, dk.user AS ten_nguoi_dung, dk.email, dk.phone
                FROM don_hang dh
                LEFT JOIN tai_khoan dk ON dh.ma_nguoi_dung = dk.id
                ORDER BY dh.created_at DESC";
        $result = $conn->query($sql);
        if (!$result) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - SQL error: " . $conn->error . "\n", FILE_APPEND);
            echo json_encode(["error" => "Query failed: " . $conn->error]);
            break;
        }
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
        echo json_encode($orders);
        break;

    case 'get_order_detail':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id === 0) {
            echo json_encode(["error" => "Invalid order ID"]);
            break;
        }

        // Get basic order info
        $sql = "SELECT dh.*, dk.user AS ten_nguoi_dung, dk.email, dk.phone
                FROM don_hang dh
                LEFT JOIN tai_khoan dk ON dh.ma_nguoi_dung = dk.id
                WHERE dh.id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $order = $stmt->get_result()->fetch_assoc();
        
        if (!$order) {
            echo json_encode(["error" => "Order not found"]);
            break;
        }
        
        // Get order items
        $sql_items = "SELECT ctdh.*, sp.ten_sp, sp.gia_sau
                     FROM chi_tiet_don_hang ctdh
                     JOIN san_pham sp ON ctdh.ma_sp = sp.ma_sp
                     WHERE ctdh.ma_don_hang = ?";
        $stmt = $conn->prepare($sql_items);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $items_result = $stmt->get_result();
        $items = [];
        while ($row = $items_result->fetch_assoc()) {
            $items[] = [
                'ten_san_pham' => $row['ten_sp'],
                'so_luong' => $row['so_luong'],
                'don_gia' => $row['don_gia'],
                'giam_gia' => $row['giam_gia'],
                'thanh_tien' => $row['thanh_tien']
            ];
        }
        
        // Get shipping address
        $address = [];
        if ($order['ma_dia_chi']) {
            $sql_address = "SELECT * FROM dia_chi_giao_hang WHERE ma_dia_chi = ?";
            $stmt = $conn->prepare($sql_address);
            $stmt->bind_param("i", $order['ma_dia_chi']);
            $stmt->execute();
            $address = $stmt->get_result()->fetch_assoc();
        }
        
        // Get payment info
        $payment = [];
        $sql_payment = "SELECT * FROM thanh_toan WHERE ma_don_hang = ?";
        $stmt = $conn->prepare($sql_payment);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $payment_result = $stmt->get_result();
        if ($payment_result->num_rows > 0) {
            $payment = $payment_result->fetch_assoc();
        }
        
        echo json_encode([
            'order' => $order,
            'items' => $items,
            'address' => $address,
            'payment' => $payment
        ]);
        break;

    case 'update_order_status':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $status = isset($_GET['status']) ? $_GET['status'] : '';
        
        // Handle POST request with JSON body
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            if (isset($data['id'])) $id = intval($data['id']);
            if (isset($data['trang_thai'])) $status = $data['trang_thai'];
            if (isset($data['status'])) $status = $data['status'];
        }
        
        if ($id === 0 || empty($status)) {
            echo json_encode(["success" => false, "error" => "Invalid ID or status"]);
            break;
        }
        
        // Update don_hang
        $sql = "UPDATE don_hang SET trang_thai = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode(["success" => false, "error" => "SQL prepare failed"]);
            break;
        }
        
        $stmt->bind_param("si", $status, $id);
        $stmt->execute();
        $affected_rows = $stmt->affected_rows;
        $stmt->close();
        
        // Update thanh_toan if exists
        if ($status === 'Đã thanh toán') {
            // Update both status and payment time when status is "Đã thanh toán"
            $sql2 = "UPDATE thanh_toan SET trang_thai = ?, thoi_gian_thanh_toan = NOW() WHERE ma_don_hang = ?";
        } else {
            // Only update status for other cases
            $sql2 = "UPDATE thanh_toan SET trang_thai = ? WHERE ma_don_hang = ?";
        }
        
        $stmt2 = $conn->prepare($sql2);
        if ($stmt2) {
            $stmt2->bind_param("si", $status, $id);
            $stmt2->execute();
            $affected_rows2 = $stmt2->affected_rows;
            $stmt2->close();
        }
        
        if ($affected_rows > 0 || (isset($affected_rows2) && $affected_rows2 > 0)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => "No rows updated"]);
        }
        break;

    // Users management
    case 'get_users':
        $sql = "SELECT id, user, phone, email, role, is_active FROM tai_khoan ORDER BY user";
        $result = $conn->query($sql);
        if (!$result) {
            echo json_encode(["error" => "Query failed: " . $conn->error]);
            break;
        }
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        echo json_encode($users);
        break;

    case 'delete_user':
        $phone = isset($_GET['phone']) ? $_GET['phone'] : '';
        if (empty($phone)) {
            echo json_encode(["success" => false, "error" => "Phone number is required"]);
            break;
        }
        $sql = "DELETE FROM tai_khoan WHERE phone = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $phone);
        $success = $stmt->execute();
        echo json_encode(["success" => $success]);
        break;

    case 'toggle_user_status':
        $phone = isset($_GET['phone']) ? $_GET['phone'] : '';
        $is_active = isset($_GET['is_active']) ? intval($_GET['is_active']) : 0;
        
        if (empty($phone)) {
            echo json_encode(["success" => false, "error" => "Phone number is required"]);
            break;
        }
        
        $sql = "UPDATE tai_khoan SET is_active = ? WHERE phone = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode(["success" => false, "error" => "Database error"]);
            break;
        }
        
        $stmt->bind_param("is", $is_active, $phone);
        $success = $stmt->execute();
        $stmt->close();
        
        echo json_encode(["success" => $success, "message" => $success ? "User status updated successfully" : "Failed to update user status"]);
        break;

    // Reviews management
    case 'get_reviews':
        $sql = "SELECT dg.*, dk.user AS ten_nguoi_dung
                FROM danh_gia dg
                LEFT JOIN tai_khoan dk ON dg.ma_nguoi_dung = dk.id
                ORDER BY dg.created_at DESC";
        $result = $conn->query($sql);
        $reviews = [];
        while ($row = $result->fetch_assoc()) {
            $reviews[] = $row;
        }
        echo json_encode($reviews);
        break;

    case 'delete_review':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id === 0) {
            echo json_encode(["success" => false, "error" => "Invalid review ID"]);
            break;
        }
        $sql = "DELETE FROM danh_gia WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        echo json_encode(["success" => $success]);
        break;

    case 'get_review_replies':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id === 0) {
            echo json_encode(["success" => false, "error" => "Invalid review ID"]);
            break;
        }
        $sql = "SELECT phr.*, dk.user AS ten_nguoi_tra_loi
                FROM phan_hoi_review phr
                LEFT JOIN tai_khoan dk ON phr.ma_nguoi_tra_loi = dk.id
                WHERE phr.id_danh_gia = ?
                ORDER BY phr.created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $replies = [];
        while ($row = $result->fetch_assoc()) {
            $replies[] = $row;
        }
        echo json_encode($replies);
        break;

    // Payments management
    case 'get_payments':
        $sql = "SELECT * FROM thanh_toan ORDER BY thoi_gian_thanh_toan DESC, id DESC";
        $result = $conn->query($sql);
        if (!$result) {
            echo json_encode(["error" => "Query failed: " . $conn->error]);
            break;
        }
        
        $payments = [];
        while ($row = $result->fetch_assoc()) {
            $payments[] = $row;
        }
        echo json_encode($payments);
        break;

    // Enhanced Statistics for Dashboard
    case 'get_statistics':
        $month = isset($_GET['month']) ? intval($_GET['month']) : date('m');
        $year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');
        
        // Prepare common WHERE conditions
        $month_year_condition = "MONTH(created_at) = ? AND YEAR(created_at) = ?";
        
        // Monthly stats - Combined query
        $sql_monthly = "SELECT 
            (SELECT SUM(tong_tien) FROM don_hang WHERE trang_thai = 'Đã thanh toán' AND $month_year_condition) AS tong_doanh_thu,
            (SELECT COUNT(*) FROM don_hang WHERE $month_year_condition) AS tong_don_hang,
            (SELECT COUNT(*) FROM danh_gia WHERE $month_year_condition) AS tong_danh_gia,
            (SELECT COUNT(*) FROM danh_gia WHERE so_sao >= 3 AND $month_year_condition) AS danh_gia_tich_cuc,
            (SELECT COUNT(*) FROM don_hang WHERE trang_thai = 'Đã thanh toán' AND $month_year_condition) AS tong_thanh_toan";
        
        $stmt = $conn->prepare($sql_monthly);
        $stmt->bind_param("iiiiiiiiii", $month, $year, $month, $year, $month, $year, $month, $year, $month, $year);
        $stmt->execute();
        $monthly_stats = $stmt->get_result()->fetch_assoc();
        
        // User stats - separate as they don't need month/year filter
        $sql_users = "SELECT 
            (SELECT COUNT(*) FROM tai_khoan WHERE is_active = 1) AS nguoi_dung_hoat_dong,
            (SELECT COUNT(*) FROM tai_khoan) AS tong_nguoi_dung";
        $result = $conn->query($sql_users);
        $user_stats = $result->fetch_assoc();
        
        // Top products
        $sql_top_products = "SELECT sp.ma_sp, sp.ten_sp, SUM(ctdh.so_luong) AS tong_so_luong
                            FROM chi_tiet_don_hang ctdh
                            JOIN don_hang dh ON ctdh.ma_don_hang = dh.id
                            JOIN san_pham sp ON ctdh.ma_sp = sp.ma_sp
                            WHERE dh.trang_thai = 'Đã thanh toán'
                              AND MONTH(dh.created_at) = ?
                              AND YEAR(dh.created_at) = ?
                            GROUP BY sp.ma_sp, sp.ten_sp
                            ORDER BY tong_so_luong DESC
                            LIMIT 5";
        $stmt = $conn->prepare($sql_top_products);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $top_products = [];
        while ($row = $result->fetch_assoc()) {
            $top_products[] = [
                'ma_sp' => $row['ma_sp'],
                'ten_san_pham' => $row['ten_sp'],
                'tong_so_luong' => (int)$row['tong_so_luong']
            ];
        }
        
        // Daily charts data
        $daily_queries = [
            'revenue' => "SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS ngay, SUM(tong_tien) AS value
                         FROM don_hang WHERE trang_thai = 'Đã thanh toán' AND MONTH(created_at) = ? AND YEAR(created_at) = ?
                         GROUP BY ngay ORDER BY ngay",
            'orders' => "SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS ngay, COUNT(*) AS value
                        FROM don_hang WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
                        GROUP BY ngay ORDER BY ngay",
            'users' => "SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS ngay, COUNT(DISTINCT ma_nguoi_dung) AS value
                       FROM don_hang WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
                       GROUP BY ngay ORDER BY ngay",
            'reviews' => "SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS ngay, COUNT(*) AS value
                         FROM danh_gia WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
                         GROUP BY ngay ORDER BY ngay",
            'payments' => "SELECT DATE_FORMAT(thoi_gian_thanh_toan, '%Y-%m-%d') AS ngay, COUNT(*) AS value
                          FROM thanh_toan WHERE thoi_gian_thanh_toan IS NOT NULL 
                          AND MONTH(thoi_gian_thanh_toan) = ? AND YEAR(thoi_gian_thanh_toan) = ?
                          GROUP BY ngay ORDER BY ngay"
        ];
        
        $daily_data = [];
        foreach ($daily_queries as $key => $sql) {
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ii", $month, $year);
            $stmt->execute();
            $result = $stmt->get_result();
            $daily_data[$key] = [];
            while ($row = $result->fetch_assoc()) {
                $value = ($key === 'revenue') ? floatval($row['value']) : intval($row['value']);
                $daily_data[$key][] = [
                    'ngay' => $row['ngay'],
                    ($key === 'revenue' ? 'tong_doanh_thu' : 
                     ($key === 'orders' ? 'tong_don_hang' :
                      ($key === 'users' ? 'tong_nguoi_dung' :
                       ($key === 'reviews' ? 'tong_danh_gia' : 'tong_thanh_toan')))) => $value
                ];
            }
        }
        
        // Prepare final response
        $statistics = [
            'tong_doanh_thu' => floatval($monthly_stats['tong_doanh_thu'] ?? 0),
            'tong_don_hang' => intval($monthly_stats['tong_don_hang'] ?? 0),
            'nguoi_dung_hoat_dong' => intval($user_stats['nguoi_dung_hoat_dong'] ?? 0),
            'tong_nguoi_dung' => intval($user_stats['tong_nguoi_dung'] ?? 0),
            'tong_danh_gia' => intval($monthly_stats['tong_danh_gia'] ?? 0),
            'danh_gia_tich_cuc' => intval($monthly_stats['danh_gia_tich_cuc'] ?? 0),
            'tong_thanh_toan' => intval($monthly_stats['tong_thanh_toan'] ?? 0),
            'san_pham_ban_chay' => $top_products,
            'doanh_thu_theo_ngay' => $daily_data['revenue'],
            'don_hang_theo_ngay' => $daily_data['orders'],
            'nguoi_dung_theo_ngay' => $daily_data['users'],
            'thanh_toan_theo_ngay' => $daily_data['payments'],
            'danh_gia_theo_ngay' => $daily_data['reviews'],
            'thang' => $month,
            'nam' => $year
        ];
        
        echo json_encode($statistics);
        break;
    case 'get_contacts':
        $sql = "SELECT * FROM lien_he ORDER BY thoi_gian_gui DESC";
        $result = $conn->query($sql);
        $contacts = [];
        while ($row = $result->fetch_assoc()) {
            $contacts[] = $row;
        }
        echo json_encode($contacts);
        break;
    case 'delete_contact':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id === 0) {
            echo json_encode(['success' => false, 'error' => 'ID không hợp lệ']);
            break;
        }
        
        $sql = "DELETE FROM lien_he WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        $stmt->close();
        
        echo json_encode(['success' => $success, 'error' => $success ? null : 'Không thể xóa liên hệ']);
        break;
    case 'get_dashboard_metrics':
        // Get metrics in parallel
        $queries = [
            'don_hang' => "SELECT COUNT(*) AS total FROM don_hang",
            'tai_khoan' => "SELECT COUNT(*) AS total FROM tai_khoan", 
            'thanh_toan' => "SELECT COUNT(*) AS total FROM thanh_toan",
            'san_pham' => "SELECT SUM(so_luong) AS total FROM san_pham"
        ];
        
        $metrics = [];
        foreach ($queries as $key => $sql) {
            $result = $conn->query($sql);
            if ($result) {
                $row = $result->fetch_assoc();
                $metrics[$key] = $row['total'] ? $row['total'] : 0;
            } else {
                $metrics[$key] = 0;
            }
        }
        
        echo json_encode($metrics);
        break;
    // CRUD sản phẩm (Product CRUD)
    case 'get_products':
        $sql = "SELECT sp.*, nsx.ten_nha_san_xuat 
            FROM san_pham sp
            LEFT JOIN nha_san_xuat nsx ON sp.id_nha_san_xuat = nsx.id
            ORDER BY sp.id DESC";
        $result = $conn->query($sql);
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        echo json_encode($products);
        break;
    case 'add_product':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            echo json_encode(['success' => false, 'error' => 'No data provided']);
            break;
        }
        // Validate required fields
        $required = ['ma_sp', 'ten_sp', 'gia_sau', 'so_luong'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                echo json_encode(['success' => false, 'error' => "Thiếu trường bắt buộc: $field"]);
                break 2;
            }
        }
        // Chuẩn bị dữ liệu
        $fields = [
            'ma_sp', 'ten_sp', 'gia_sau', 'gia_truoc', 'so_luong', 'bao_hanh',
            'mo_ta', 'id_danh_muc', 'id_nha_san_xuat', 'trang_thai'
        ];
        $placeholders = [];
        $values = [];
        $types = '';
        foreach ($fields as $field) {
            $placeholders[] = '?';
            $values[] = $data[$field] ?? null;
            // Kiểu dữ liệu
            if (in_array($field, ['gia_sau', 'gia_truoc'])) $types .= 'd';
            else if (in_array($field, ['so_luong', 'id_danh_muc', 'id_nha_san_xuat', 'trang_thai'])) $types .= 'i';
            else $types .= 's';
        }
        $sql = "INSERT INTO san_pham (" . implode(",", $fields) . ") VALUES (" . implode(",", $placeholders) . ")";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode(['success' => false, 'error' => 'SQL error: ' . $conn->error]);
            break;
        }
        try {
            $stmt->bind_param($types, ...$values);
            $success = $stmt->execute();
            if ($success) {
                echo json_encode(['success' => true, 'id' => $conn->insert_id]);
            } else {
                // Kiểm tra lỗi duplicate entry
                if ($stmt->errno == 1062) {
                    echo json_encode(['success' => false, 'error' => 'Mã sản phẩm đã tồn tại!']);
                } else {
                    echo json_encode(['success' => false, 'error' => $stmt->error]);
                }
            }
        } catch (mysqli_sql_exception $e) {
            if ($e->getCode() == 1062) {
                echo json_encode(['success' => false, 'error' => 'Mã sản phẩm đã tồn tại!']);
            } else {
                echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            }
        }
        break;
    case 'update_product':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $data = json_decode(file_get_contents('php://input'), true);
        if ($id === 0 || !$data) {
            echo json_encode(['success' => false, 'error' => 'Invalid ID or data']);
            break;
        }
        $fields = ['ten_sp', 'mo_ta', 'gia_sau', 'gia_truoc', 'so_luong', 'bao_hanh', 'id_danh_muc', 'id_nha_san_xuat', 'trang_thai'];
        $set = [];
        $values = [];
        $types = '';
        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $set[] = "$field = ?";
                $values[] = $data[$field];
                if (in_array($field, ['gia_sau', 'gia_truoc'])) $types .= 'd';
                else if (in_array($field, ['so_luong', 'id_danh_muc', 'id_nha_san_xuat', 'trang_thai'])) $types .= 'i';
                else $types .= 's';
            }
        }
        if (empty($set)) {
            echo json_encode(['success' => false, 'error' => 'No fields to update']);
            break;
        }
        $values[] = $id;
        $types .= 'i';
        $sql = "UPDATE san_pham SET " . implode(", ", $set) . " WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$values);
        $success = $stmt->execute();
        echo json_encode(['success' => $success]);
        break;
    case 'delete_product':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id === 0) {
            echo json_encode(['success' => false, 'error' => 'Invalid product ID']);
            break;
        }
        $sql = "DELETE FROM san_pham WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        echo json_encode(['success' => $success]);
        break;

    // Product Images Management
    case 'get_product_images':
        try {
            if (!isset($_GET['ma_sp']) || empty($_GET['ma_sp'])) {
                throw new Exception('Mã sản phẩm không được để trống');
            }

            $ma_sp = $_GET['ma_sp'];
            
            // Get product images
            $stmt = $conn->prepare("SELECT id, ma_sp, url, thu_tu FROM anh_sp WHERE ma_sp = ? ORDER BY thu_tu ASC");
            $stmt->bind_param("s", $ma_sp);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $images = [];
            while ($row = $result->fetch_assoc()) {
                $images[] = [
                    'id' => $row['id'],
                    'ma_sp' => $row['ma_sp'],
                    'url' => $row['url'],
                    'thu_tu' => $row['thu_tu']
                ];
            }
            
            $stmt->close();
            
            echo json_encode([
                'success' => true,
                'images' => $images,
                'count' => count($images)
            ]);

        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'upload_product_image':
        try {
            if (!isset($_POST['ma_sp']) || empty($_POST['ma_sp'])) {
                throw new Exception('Mã sản phẩm không được để trống');
            }

            if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) {
                throw new Exception('Không có ảnh nào được tải lên');
            }

            $ma_sp = $_POST['ma_sp'];
            
            // Verify that ma_sp exists in san_pham table
            $check_stmt = $conn->prepare("SELECT ma_sp FROM san_pham WHERE ma_sp = ?");
            $check_stmt->bind_param('s', $ma_sp);
            $check_stmt->execute();
            $check_result = $check_stmt->get_result();
            
            if ($check_result->num_rows === 0) {
                $check_stmt->close();
                throw new Exception("Sản phẩm với mã '{$ma_sp}' không tồn tại trong database");
            }
            $check_stmt->close();
            
            $upload_dir = 'uploads/products/';
            
            // Create upload directory if it doesn't exist
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $uploaded_images = [];
            $errors = [];

            // Process multiple images
            $file_count = count($_FILES['images']['name']);
            
            for ($i = 0; $i < $file_count; $i++) {
                if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {
                    $file_name = $_FILES['images']['name'][$i];
                    $file_tmp = $_FILES['images']['tmp_name'][$i];
                    $file_size = $_FILES['images']['size'][$i];
                    $file_type = $_FILES['images']['type'][$i];

                    // Validate file type
                    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                    if (!in_array($file_type, $allowed_types)) {
                        $errors[] = "File {$file_name} không phải là ảnh hợp lệ";
                        continue;
                    }

                    // Validate file size (5MB max)
                    if ($file_size > 5 * 1024 * 1024) {
                        $errors[] = "File {$file_name} quá lớn (tối đa 5MB)";
                        continue;
                    }

                    // Generate unique file name
                    $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);
                    $unique_name = $ma_sp . '_' . time() . '_' . $i . '.' . $file_extension;
                    $upload_path = $upload_dir . $unique_name;

                    // Move uploaded file
                    if (move_uploaded_file($file_tmp, $upload_path)) {
                        // Create full URL for the image
                        $image_url = $backend_host . '/' . $upload_path;
                        
                        // Insert into database
                        $stmt = $conn->prepare("INSERT INTO anh_sp (ma_sp, url, thu_tu) VALUES (?, ?, ?)");
                        $thu_tu = $i + 1; // Order starting from 1
                        
                        if ($stmt->bind_param('ssi', $ma_sp, $image_url, $thu_tu) && $stmt->execute()) {
                            $uploaded_images[] = [
                                'id' => $conn->insert_id,
                                'ma_sp' => $ma_sp,
                                'url' => $image_url,
                                'thu_tu' => $thu_tu
                            ];
                        } else {
                            $errors[] = "Không thể lưu thông tin ảnh {$file_name} vào database: " . $stmt->error;
                            // Remove uploaded file if database insert fails
                            unlink($upload_path);
                        }
                        $stmt->close();
                    } else {
                        $errors[] = "Không thể tải lên file {$file_name}";
                    }
                } else {
                    $errors[] = "Lỗi tải lên file {$_FILES['images']['name'][$i]}";
                }
            }

            // Response
            if (!empty($uploaded_images)) {
                echo json_encode([
                    'success' => true,
                    'message' => count($uploaded_images) . ' ảnh đã được tải lên thành công',
                    'images' => $uploaded_images,
                    'errors' => $errors
                ]);
            } else {
                throw new Exception('Không có ảnh nào được tải lên thành công. Lỗi: ' . implode(', ', $errors));
            }

        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'add_product_image_urls':
        try {
            // Get JSON input
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['ma_sp']) || empty($input['ma_sp'])) {
                throw new Exception('Mã sản phẩm không được để trống');
            }

            if (!isset($input['urls']) || !is_array($input['urls']) || empty($input['urls'])) {
                throw new Exception('Danh sách URL ảnh không được để trống');
            }

            $ma_sp = $input['ma_sp'];
            $urls = $input['urls'];
            
            $added_images = [];
            $errors = [];

            // Process URLs
            foreach ($urls as $index => $url) {
                $url = trim($url);
                
                // Validate URL
                if (!filter_var($url, FILTER_VALIDATE_URL)) {
                    $errors[] = "URL không hợp lệ: {$url}";
                    continue;
                }

                // Insert into database
                $stmt = $conn->prepare("INSERT INTO anh_sp (ma_sp, url, thu_tu) VALUES (?, ?, ?)");
                $thu_tu = $index + 1; // Order starting from 1
                
                if ($stmt->bind_param('ssi', $ma_sp, $url, $thu_tu) && $stmt->execute()) {
                    $added_images[] = [
                        'id' => $conn->insert_id,
                        'ma_sp' => $ma_sp,
                        'url' => $url,
                        'thu_tu' => $thu_tu
                    ];
                } else {
                    $errors[] = "Không thể lưu URL ảnh: {$url} - " . $stmt->error;
                }
                $stmt->close();
            }

            // Response
            if (!empty($added_images)) {
                echo json_encode([
                    'success' => true,
                    'message' => count($added_images) . ' URL ảnh đã được thêm thành công',
                    'images' => $added_images,
                    'errors' => $errors
                ]);
            } else {
                throw new Exception('Không có URL ảnh nào được thêm thành công. Lỗi: ' . implode(', ', $errors));
            }

        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'delete_product_image':
        try {
            // Get JSON input
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['id']) || empty($input['id'])) {
                throw new Exception('ID ảnh không được để trống');
            }

            $image_id = $input['id'];
            
            // Get image info first
            $stmt = $conn->prepare("SELECT url FROM anh_sp WHERE id = ?");
            $stmt->bind_param("i", $image_id);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                throw new Exception('Không tìm thấy ảnh');
            }
            
            $image_data = $result->fetch_assoc();
            $image_url = $image_data['url'];
            $stmt->close();
            
            // Delete from database
            $stmt = $conn->prepare("DELETE FROM anh_sp WHERE id = ?");
            $stmt->bind_param("i", $image_id);
            
            if ($stmt->execute()) {
                // Try to delete physical file if it's a local file
                if (strpos($image_url, $backend_host . '/') === 0) {
                    $file_path = str_replace($backend_host . '/', '', $image_url);
                    if (file_exists($file_path)) {
                        unlink($file_path);
                    }
                }
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Xóa ảnh thành công'
                ]);
            } else {
                throw new Exception('Không thể xóa ảnh');
            }
            
            $stmt->close();

        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    // Product Technical Specifications Management
    case 'get_product_thongso':
        try {
            if (!isset($_GET['ma_sp']) || empty($_GET['ma_sp'])) {
                throw new Exception('Mã sản phẩm không được để trống');
            }

            $ma_sp = $_GET['ma_sp'];
            
            // Get product thong so
            $stmt = $conn->prepare("SELECT id, ma_sp, ten_thong_so, gia_tri_thong_so, thu_tu FROM thong_so WHERE ma_sp = ? ORDER BY thu_tu ASC, id ASC");
            $stmt->bind_param("s", $ma_sp);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $thongso = [];
            while ($row = $result->fetch_assoc()) {
                $thongso[] = [
                    'id' => $row['id'],
                    'ma_sp' => $row['ma_sp'],
                    'ten_thong_so' => $row['ten_thong_so'],
                    'gia_tri_thong_so' => $row['gia_tri_thong_so'],
                    'thu_tu' => $row['thu_tu']
                ];
            }
            
            $stmt->close();
            
            echo json_encode([
                'success' => true,
                'thongso' => $thongso,
                'count' => count($thongso)
            ]);

        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case 'save_product_thongso':
        try {
            // Get JSON input
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($input['ma_sp']) || empty($input['ma_sp'])) {
                throw new Exception('Mã sản phẩm không được để trống');
            }

            if (!isset($input['thongso']) || !is_array($input['thongso'])) {
                throw new Exception('Dữ liệu thông số không hợp lệ');
            }

            $ma_sp = $input['ma_sp'];
            $thongso_list = $input['thongso'];
            
            // Verify that ma_sp exists in san_pham table
            $check_stmt = $conn->prepare("SELECT ma_sp FROM san_pham WHERE ma_sp = ?");
            $check_stmt->bind_param('s', $ma_sp);
            $check_stmt->execute();
            $check_result = $check_stmt->get_result();
            
            if ($check_result->num_rows === 0) {
                $check_stmt->close();
                throw new Exception("Sản phẩm với mã '{$ma_sp}' không tồn tại trong database");
            }
            $check_stmt->close();
            
            // Begin transaction
            $conn->autocommit(false);
            
            try {
                // Delete existing thong so for this product
                $delete_stmt = $conn->prepare("DELETE FROM thong_so WHERE ma_sp = ?");
                $delete_stmt->bind_param('s', $ma_sp);
                $delete_stmt->execute();
                $delete_stmt->close();
                
                $saved_thongso = [];
                
                // Insert new thong so
                foreach ($thongso_list as $ts) {
                    if (empty($ts['ten_thong_so']) || empty($ts['gia_tri_thong_so'])) {
                        continue; // Skip empty entries
                    }
                    
                    $thu_tu = isset($ts['thu_tu']) && is_numeric($ts['thu_tu']) ? intval($ts['thu_tu']) : 0;
                    
                    $stmt = $conn->prepare("INSERT INTO thong_so (ma_sp, ten_thong_so, gia_tri_thong_so, thu_tu) VALUES (?, ?, ?, ?)");
                    $stmt->bind_param('sssi', $ma_sp, $ts['ten_thong_so'], $ts['gia_tri_thong_so'], $thu_tu);
                    
                    if ($stmt->execute()) {
                        $saved_thongso[] = [
                            'id' => $conn->insert_id,
                            'ma_sp' => $ma_sp,
                            'ten_thong_so' => $ts['ten_thong_so'],
                            'gia_tri_thong_so' => $ts['gia_tri_thong_so'],
                            'thu_tu' => $thu_tu
                        ];
                    } else {
                        throw new Exception("Không thể lưu thông số: {$ts['ten_thong_so']} - " . $stmt->error);
                    }
                    $stmt->close();
                }
                
                // Commit transaction
                $conn->commit();
                
                echo json_encode([
                    'success' => true,
                    'message' => count($saved_thongso) . ' thông số đã được lưu thành công',
                    'thongso' => $saved_thongso
                ]);
                
            } catch (Exception $e) {
                // Rollback transaction
                $conn->rollback();
                throw $e;
            } finally {
                $conn->autocommit(true);
            }

        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    default:
        echo json_encode(["error" => "Invalid action"]);
        break;
}

$conn->close();
?>
