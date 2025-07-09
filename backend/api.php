<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

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
                LEFT JOIN dang_ky dk ON dh.ma_nguoi_dung = dk.id
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
            LEFT JOIN dang_ky dk ON dh.ma_nguoi_dung = dk.id
            WHERE dh.id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $order = $stmt->get_result()->fetch_assoc();
    
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
    
    // Prepare response
    $response = [
        'order' => $order,
        'items' => $items,
        'address' => $address,
        'payment' => $payment
    ];
    
    echo json_encode($response);
    break;

    case 'delete_order':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id === 0) {
            echo json_encode(["success" => false, "error" => "Invalid order ID"]);
            break;
        }
        $sql = "DELETE FROM don_hang WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        echo json_encode(["success" => $success]);
        break;

    case 'update_order_status':
        // Hỗ trợ cả GET lẫn POST/body JSON
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $status = isset($_GET['status']) ? $_GET['status'] : '';
        // Nếu là POST hoặc body JSON
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            if (isset($data['id'])) $id = intval($data['id']);
            if (isset($data['trang_thai'])) $status = $data['trang_thai'];
            if (isset($data['status'])) $status = $data['status']; // fallback nếu frontend gửi key là status
        }
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Updating order ID: $id, Status: $status\n", FILE_APPEND);
        if ($id === 0 || empty($status)) {
            echo json_encode(["success" => false, "error" => "Invalid ID or status"]);
            break;
        }
        // Update don_hang
        $sql = "UPDATE don_hang SET trang_thai = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Prepare failed: " . $conn->error . "\n", FILE_APPEND);
            echo json_encode(["success" => false, "error" => "SQL prepare failed"]);
            break;
        }
        $stmt->bind_param("si", $status, $id);
        $stmt->execute();
        $affected_rows = $stmt->affected_rows;
        $stmt->close();
        // Update thanh_toan nếu có bản ghi
        $sql2 = "UPDATE thanh_toan SET trang_thai = ? WHERE ma_don_hang = ?";
        $stmt2 = $conn->prepare($sql2);
        if ($stmt2) {
            $stmt2->bind_param("si", $status, $id);
            $stmt2->execute();
            $affected_rows2 = $stmt2->affected_rows;
            $stmt2->close();
        } else {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Prepare failed (thanh_toan): " . $conn->error . "\n", FILE_APPEND);
        }
        if ($affected_rows > 0 || (isset($affected_rows2) && $affected_rows2 > 0)) {
            echo json_encode(["success" => true, "affected_rows" => $affected_rows, "affected_rows_thanh_toan" => $affected_rows2 ?? 0]);
        } else {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - No rows affected for ID: $id\n", FILE_APPEND);
            echo json_encode(["success" => false, "error" => "No rows updated"]);
        }
        break;

    // Users management
    case 'get_users':
        $sql = "SELECT id, user, phone, email, role, is_active FROM dang_ky ORDER BY user";
        $result = $conn->query($sql);
        if (!$result) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - SQL error: " . $conn->error . "\n", FILE_APPEND);
            echo json_encode(["error" => "Query failed: " . $conn->error]);
            break;
        }
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - SQL get_users: $sql\n", FILE_APPEND);
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row; // Password is excluded from SELECT
        }
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Users fetched: " . json_encode($users) . "\n", FILE_APPEND);
        echo json_encode($users);
        break;

    case 'delete_user':
        $phone = isset($_GET['phone']) ? $_GET['phone'] : '';
        if (empty($phone)) {
            echo json_encode(["success" => false, "error" => "Phone number is required"]);
            break;
        }
        $sql = "DELETE FROM dang_ky WHERE phone = ?";
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
        $sql = "UPDATE dang_ky SET is_active = ? WHERE phone = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Prepare failed: " . $conn->error . "\n", FILE_APPEND);
            echo json_encode(["success" => false, "error" => "Database error"]);
            break;
        }
        $stmt->bind_param("is", $is_active, $phone);
        $success = $stmt->execute();
        if ($success) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Updated user status for phone: $phone, is_active: $is_active\n", FILE_APPEND);
            echo json_encode(["success" => true, "message" => "User status updated successfully"]);
        } else {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - Failed to update user status for phone: $phone\n", FILE_APPEND);
            echo json_encode(["success" => false, "error" => "Failed to update user status"]);
        }
        $stmt->close();
        break;

    // Reviews management
    case 'get_reviews':
        $sql = "SELECT dg.*, dk.user AS ten_nguoi_dung
                FROM danh_gia dg
                LEFT JOIN dang_ky dk ON dg.ma_nguoi_dung = dk.id
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
                LEFT JOIN dang_ky dk ON phr.ma_nguoi_tra_loi = dk.id
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
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - SQL error: " . $conn->error . "\n", FILE_APPEND);
            echo json_encode(["error" => "Query failed: " . $conn->error]);
            break;
        }
        $payments = [];
        while ($row = $result->fetch_assoc()) {
            $payments[] = $row;
        }
        echo json_encode($payments);
        break;

    case 'delete_payment':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id === 0) {
            echo json_encode(["success" => false, "error" => "Invalid payment ID"]);
            break;
        }
        $sql = "DELETE FROM thanh_toan WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        echo json_encode(["success" => $success]);
        break;

    // Promotions management
    case 'get_promotions':
        $sql = "SELECT * FROM khuyen_mai ORDER BY id";
        $result = $conn->query($sql);
        if (!$result) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - SQL error: " . $conn->error . "\n", FILE_APPEND);
            echo json_encode(["error" => "Query failed: " . $conn->error]);
            break;
        }
        $promotions = [];
        while ($row = $result->fetch_assoc()) {
            $promotions[] = $row;
        }
        echo json_encode($promotions);
        break;

    case 'delete_promotion':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        if ($id === 0) {
            echo json_encode(["success" => false, "error" => "Invalid promotion ID"]);
            break;
        }
        $sql = "DELETE FROM khuyen_mai WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        echo json_encode(["success" => $success]);
        break;

    // Total payment - Fixed to return proper format
    case 'get_total_payment':
        $sql = "SELECT SUM(tong_tien) AS tong FROM don_hang WHERE trang_thai = 'Đã thanh toán'";
        $result = $conn->query($sql);
        if (!$result) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - SQL error: " . $conn->error . "\n", FILE_APPEND);
            echo json_encode(["error" => "Query failed: " . $conn->error]);
            break;
        }
        $row = $result->fetch_assoc();
        echo json_encode(['tong' => floatval($row['tong'] ?? 0)]);
        break;

    // Enhanced Statistics for Dashboard
    case 'get_statistics':
        $month = isset($_GET['month']) ? intval($_GET['month']) : date('m');
        $year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');
        
        // Monthly revenue
        $sql_revenue = "SELECT SUM(tong_tien) AS tong_doanh_thu 
                       FROM don_hang 
                       WHERE trang_thai = 'Đã thanh toán' 
                       AND MONTH(created_at) = ? 
                       AND YEAR(created_at) = ?";
        $stmt = $conn->prepare($sql_revenue);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $revenue = $result->fetch_assoc();
        
        // Monthly orders count
        $sql_orders = "SELECT COUNT(*) AS tong_don_hang 
                      FROM don_hang 
                      WHERE MONTH(created_at) = ? 
                      AND YEAR(created_at) = ?";
        $stmt = $conn->prepare($sql_orders);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $orders_count = $result->fetch_assoc();
        
        // Active users count (users who made orders in this month)
        $sql_active_users = "SELECT COUNT(DISTINCT ma_nguoi_dung) AS nguoi_dung_hoat_dong
                            FROM don_hang 
                            WHERE MONTH(created_at) = ? 
                            AND YEAR(created_at) = ?";
        $stmt = $conn->prepare($sql_active_users);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $active_users = $result->fetch_assoc();
        
        // Total payments count (paid orders)
        $sql_total_payments = "SELECT COUNT(*) AS tong_thanh_toan
                              FROM don_hang 
                              WHERE trang_thai = 'Đã thanh toán'
                              AND MONTH(created_at) = ? 
                              AND YEAR(created_at) = ?";
        $stmt = $conn->prepare($sql_total_payments);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $total_payments = $result->fetch_assoc();
        
        // Top selling products (fix: join chi_tiet_don_hang + san_pham)
        // Sửa JOIN để lấy đúng sản phẩm bán chạy nhất dù dùng id hay ma_sp
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
        
        // Daily revenue for chart
        $sql_daily_revenue = "SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS ngay, SUM(tong_tien) AS tong_doanh_thu
                             FROM don_hang
                             WHERE trang_thai = 'Đã thanh toán'
                             AND MONTH(created_at) = ?
                             AND YEAR(created_at) = ?
                             GROUP BY ngay
                             ORDER BY ngay";
        $stmt = $conn->prepare($sql_daily_revenue);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $daily_revenue = [];
        while ($row = $result->fetch_assoc()) {
            $daily_revenue[] = [
                'ngay' => $row['ngay'],
                'tong_doanh_thu' => floatval($row['tong_doanh_thu'])
            ];
        }
        // Daily orders for chart
        $sql_daily_orders = "SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS ngay, COUNT(*) AS tong_don_hang
                            FROM don_hang
                            WHERE MONTH(created_at) = ?
                            AND YEAR(created_at) = ?
                            GROUP BY ngay
                            ORDER BY ngay";
        $stmt = $conn->prepare($sql_daily_orders);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $daily_orders = [];
        while ($row = $result->fetch_assoc()) {
            $daily_orders[] = [
                'ngay' => $row['ngay'],
                'tong_don_hang' => intval($row['tong_don_hang'])
            ];
        }
        // Daily active users for chart
        $sql_daily_users = "SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS ngay, COUNT(DISTINCT ma_nguoi_dung) AS tong_nguoi_dung
                           FROM don_hang
                           WHERE MONTH(created_at) = ?
                           AND YEAR(created_at) = ?
                           GROUP BY ngay
                           ORDER BY ngay";
        $stmt = $conn->prepare($sql_daily_users);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $daily_users = [];
        while ($row = $result->fetch_assoc()) {
            $daily_users[] = [
                'ngay' => $row['ngay'],
                'tong_nguoi_dung' => intval($row['tong_nguoi_dung'])
            ];
        }
        // Daily reviews for chart
        $sql_daily_reviews = "SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS ngay, COUNT(*) AS tong_danh_gia
                     FROM danh_gia
                     WHERE MONTH(created_at) = ?
                     AND YEAR(created_at) = ?
                     GROUP BY ngay
                     ORDER BY ngay";
        $stmt = $conn->prepare($sql_daily_reviews);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $daily_reviews = [];
        while ($row = $result->fetch_assoc()) {
            $daily_reviews[] = [
                'ngay' => $row['ngay'],
                'tong_danh_gia' => intval($row['tong_danh_gia'])
            ];
        }

        // Daily payments for chart (ensure always array)
        $daily_payments = [];
        // Example: If you want to count payments per day (adjust as needed)
        $sql_daily_payments = "SELECT DATE_FORMAT(thoi_gian_thanh_toan, '%Y-%m-%d') AS ngay, COUNT(*) AS tong_thanh_toan
            FROM thanh_toan
            WHERE thoi_gian_thanh_toan IS NOT NULL
              AND MONTH(thoi_gian_thanh_toan) = ?
              AND YEAR(thoi_gian_thanh_toan) = ?
            GROUP BY ngay
            ORDER BY ngay";
        $stmt = $conn->prepare($sql_daily_payments);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $daily_payments[] = [
                'ngay' => $row['ngay'],
                'tong_thanh_toan' => intval($row['tong_thanh_toan'])
            ];
        }

        // Add to $statistics array
        $statistics = [
            'tong_doanh_thu' => floatval($revenue['tong_doanh_thu'] ?? 0),
            'tong_don_hang' => intval($orders_count['tong_don_hang'] ?? 0),
            'nguoi_dung_hoat_dong' => intval($active_users['nguoi_dung_hoat_dong'] ?? 0),
            'tong_thanh_toan' => intval($total_payments['tong_thanh_toan'] ?? 0),
            'san_pham_ban_chay' => $top_products,
            'doanh_thu_theo_ngay' => $daily_revenue,
            'don_hang_theo_ngay' => $daily_orders,
            'nguoi_dung_theo_ngay' => $daily_users,
            'thanh_toan_theo_ngay' => $daily_payments, // always array
            'thang' => $month,
            'nam' => $year,
            'danh_gia_theo_ngay'=> $daily_reviews
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
    if ($id > 0) {
        $sql = "DELETE FROM lien_he WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Không thể xóa liên hệ']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'ID không hợp lệ']);
    }
    break;
        case 'get_dashboard_metrics':
    // Tổng đơn hàng
    $result = $conn->query("SELECT COUNT(*) AS total FROM don_hang");
    $don_hang = $result->fetch_assoc()['total'];
    // Tổng người dùng
    $result = $conn->query("SELECT COUNT(*) AS total FROM dang_ky");
    $tai_khoan = $result->fetch_assoc()['total'];
    // Tổng thanh toán
    $result = $conn->query("SELECT COUNT(*) AS total FROM thanh_toan");
    $thanh_toan = $result->fetch_assoc()['total'];
    // Tổng sản phẩm tồn kho (chuẩn SQL mới)
    $result = $conn->query("SELECT SUM(so_luong) AS total FROM san_pham");
    $san_pham = $result->fetch_assoc()['total'];
    // Trả JSON
    echo json_encode([
        'don_hang' => $don_hang,
        'tai_khoan' => $tai_khoan,
        'thanh_toan' => $thanh_toan,
        'san_pham' => $san_pham
    ]);
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


    default:
        echo json_encode(["error" => "Invalid action"]);
        break;
}

$conn->close();
?>
