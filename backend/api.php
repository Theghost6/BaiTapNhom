<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

// Define log file
$logFile = __DIR__ . '/debug.log';

// Database connection
$conn = new mysqli("localhost", "root", "", "form");
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - DB connection error: " . $conn->connect_error . "\n", FILE_APPEND);
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Get action parameter
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    // Orders management
    case 'get_orders':
        $sql = "SELECT dh.*, dk.user AS ten_nguoi_dung, dk.email, dk.phone
                FROM don_hang dh
                LEFT JOIN dang_ky dk ON dh.ma_nguoi_dung = dk.id
                ORDER BY dh.ngay_dat DESC";
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
        $sql = "SELECT hd.ten_san_pham, hd.ten_nguoi, hd.tong_tien, hd.dia_chi, hd.phuong_thuc_thanh_toan, hd.ngay_tao
                FROM hoa_don hd
                WHERE hd.ma_don_hang = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $items = [];
        if ($row = $result->fetch_assoc()) {
            // Parse ten_san_pham into an array of products
            $products = [];
            if (!empty($row['ten_san_pham'])) {
                $product_list = explode(', ', $row['ten_san_pham']);
                foreach ($product_list as $product) {
                    // Assuming format: "Product Name (xQuantity)"
                    preg_match('/^(.*)\s\(x(\d+)\)$/', trim($product), $matches);
                    if ($matches) {
                        $products[] = [
                            'ten_san_pham' => $matches[1],
                            'so_luong' => (int)$matches[2]
                        ];
                    } else {
                        $products[] = [
                            'ten_san_pham' => $product,
                            'so_luong' => 1 // Default quantity if not specified
                        ];
                    }
                }
            }
            $items = [
                'ten_nguoi' => $row['ten_nguoi'],
                'tong_tien' => $row['tong_tien'],
                'dia_chi' => $row['dia_chi'],
                'phuong_thuc_thanh_toan' => $row['phuong_thuc_thanh_toan'],
                'ngay_tao' => $row['ngay_tao'],
                'san_pham' => $products
            ];
        }
        $sql = "SELECT dcgh.* 
                FROM dia_chi_giao_hang dcgh
                JOIN don_hang dh ON dcgh.ma_dia_chi = dh.ma_dia_chi
                WHERE dh.id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $address = $result->fetch_assoc();
        echo json_encode(['items' => $items, 'address' => $address]);
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
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $status = isset($_GET['status']) ? $_GET['status'] : '';
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Updating order ID: $id, Status: $status\n", FILE_APPEND);
        if ($id === 0 || empty($status)) {
            echo json_encode(["success" => false, "error" => "Invalid ID or status"]);
            break;
        }
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
        if ($affected_rows > 0) {
            echo json_encode(["success" => true, "affected_rows" => $affected_rows]);
        } else {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - No rows affected for ID: $id\n", FILE_APPEND);
            echo json_encode(["success" => false, "error" => "No rows updated"]);
        }
        $stmt->close();
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
        $sql = "SELECT * FROM danh_gia ORDER BY ngay DESC";
        $result = $conn->query($sql);
        if (!$result) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - SQL error: " . $conn->error . "\n", FILE_APPEND);
            echo json_encode(["error" => "Query failed: " . $conn->error]);
            break;
        }
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
        $sql = "SELECT * FROM phan_hoi_review WHERE id_danh_gia = ? ORDER BY ngay DESC";
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
        $sql = "SELECT * FROM thanh_toan ORDER BY id DESC";
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
                       AND MONTH(ngay_dat) = ? 
                       AND YEAR(ngay_dat) = ?";
        $stmt = $conn->prepare($sql_revenue);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $revenue = $result->fetch_assoc();
        
        // Monthly orders count
        $sql_orders = "SELECT COUNT(*) AS tong_don_hang 
                      FROM don_hang 
                      WHERE MONTH(ngay_dat) = ? 
                      AND YEAR(ngay_dat) = ?";
        $stmt = $conn->prepare($sql_orders);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $orders_count = $result->fetch_assoc();
        
        // Active users count (users who made orders in this month)
        $sql_active_users = "SELECT COUNT(DISTINCT ma_nguoi_dung) AS nguoi_dung_hoat_dong
                            FROM don_hang 
                            WHERE MONTH(ngay_dat) = ? 
                            AND YEAR(ngay_dat) = ?";
        $stmt = $conn->prepare($sql_active_users);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $active_users = $result->fetch_assoc();
        
        // Total payments count (paid orders)
        $sql_total_payments = "SELECT COUNT(*) AS tong_thanh_toan
                              FROM don_hang 
                              WHERE trang_thai = 'Đã thanh toán'
                              AND MONTH(ngay_dat) = ? 
                              AND YEAR(ngay_dat) = ?";
        $stmt = $conn->prepare($sql_total_payments);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $total_payments = $result->fetch_assoc();
        
        // Top selling products
        $sql_top_products = "SELECT hd.ten_san_pham
                            FROM hoa_don hd
                            JOIN don_hang dh ON hd.ma_don_hang = dh.id
                            WHERE MONTH(dh.ngay_dat) = ? 
                            AND YEAR(dh.ngay_dat) = ?
                            AND dh.trang_thai = 'Đã thanh toán'";
        $stmt = $conn->prepare($sql_top_products);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $product_counts = [];
        while ($row = $result->fetch_assoc()) {
            if (!empty($row['ten_san_pham'])) {
                $product_list = explode(', ', $row['ten_san_pham']);
                foreach ($product_list as $product) {
                    preg_match('/^(.*)\s\(x(\d+)\)$/', trim($product), $matches);
                    $product_name = $matches[1] ?? trim($product);
                    $quantity = isset($matches[2]) ? (int)$matches[2] : 1;
                    if (!isset($product_counts[$product_name])) {
                        $product_counts[$product_name] = 0;
                    }
                    $product_counts[$product_name] += $quantity;
                }
            }
        }
        arsort($product_counts);
        $top_products = array_slice(array_map(function($name, $quantity) {
            return ['ten_san_pham' => $name, 'tong_so_luong' => $quantity];
        }, array_keys($product_counts), $product_counts), 0, 5);
        
        // Daily revenue for chart
        $sql_daily_revenue = "SELECT DAY(ngay_dat) AS ngay, SUM(tong_tien) AS doanh_thu
                             FROM don_hang
                             WHERE trang_thai = 'Đã thanh toán'
                             AND MONTH(ngay_dat) = ?
                             AND YEAR(ngay_dat) = ?
                             GROUP BY DAY(ngay_dat)
                             ORDER BY ngay";
        $stmt = $conn->prepare($sql_daily_revenue);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $daily_revenue = [];
        while ($row = $result->fetch_assoc()) {
            $daily_revenue[] = [
                'ngay' => intval($row['ngay']),
                'doanh_thu' => floatval($row['doanh_thu'])
            ];
        }
        
        // Daily orders for chart
        $sql_daily_orders = "SELECT DAY(ngay_dat) AS ngay, COUNT(*) AS don_hang
                            FROM don_hang
                            WHERE MONTH(ngay_dat) = ?
                            AND YEAR(ngay_dat) = ?
                            GROUP BY DAY(ngay_dat)
                            ORDER BY ngay";
        $stmt = $conn->prepare($sql_daily_orders);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $daily_orders = [];
        while ($row = $result->fetch_assoc()) {
            $daily_orders[] = [
                'ngay' => intval($row['ngay']),
                'don_hang' => intval($row['don_hang'])
            ];
        }
        
        // Daily active users for chart
        $sql_daily_users = "SELECT DAY(ngay_dat) AS ngay, COUNT(DISTINCT ma_nguoi_dung) AS nguoi_dung
                           FROM don_hang
                           WHERE MONTH(ngay_dat) = ?
                           AND YEAR(ngay_dat) = ?
                           GROUP BY DAY(ngay_dat)
                           ORDER BY ngay";
        $stmt = $conn->prepare($sql_daily_users);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $daily_users = [];
        while ($row = $result->fetch_assoc()) {
            $daily_users[] = [
                'ngay' => intval($row['ngay']),
                'nguoi_dung' => intval($row['nguoi_dung'])
            ];
        }
        
        // Daily payments for chart
        $sql_daily_payments = "SELECT DAY(ngay_dat) AS ngay, COUNT(*) AS thanh_toan
                              FROM don_hang
                              WHERE trang_thai = 'Đã thanh toán'
                              AND MONTH(ngay_dat) = ?
                              AND YEAR(ngay_dat) = ?
                              GROUP BY DAY(ngay_dat)
                              ORDER BY ngay";
        $stmt = $conn->prepare($sql_daily_payments);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $daily_payments = [];
        while ($row = $result->fetch_assoc()) {
            $daily_payments[] = [
                'ngay' => intval($row['ngay']),
                'thanh_toan' => intval($row['thanh_toan'])
            ];
        }
        $sql_daily_reviews = "SELECT DAY(ngay) AS ngay, COUNT(*) AS danh_gia
                     FROM danh_gia
                     WHERE MONTH(ngay) = ?
                     AND YEAR(ngay) = ?
                     GROUP BY DAY(ngay)
                     ORDER BY ngay";
$stmt = $conn->prepare($sql_daily_reviews);
$stmt->bind_param("ii", $month, $year);
$stmt->execute();
$result = $stmt->get_result();
$daily_reviews = [];
while ($row = $result->fetch_assoc()) {
    $daily_reviews[] = [
        'ngay' => intval($row['ngay']),
        'danh_gia' => intval($row['danh_gia'])
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
            'thanh_toan_theo_ngay' => $daily_payments,
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

    // Tổng sản phẩm tồn kho
    $result = $conn->query("
        SELECT SUM(solg_trong_kho) AS total FROM (
            SELECT solg_trong_kho FROM cpu
            UNION ALL SELECT solg_trong_kho FROM mainboard
            UNION ALL SELECT solg_trong_kho FROM ram
            UNION ALL SELECT solg_trong_kho FROM ssd
            UNION ALL SELECT solg_trong_kho FROM psu
            UNION ALL SELECT solg_trong_kho FROM case
            UNION ALL SELECT solg_trong_kho FROM gpu
            UNION ALL SELECT solg_trong_kho FROM keyboard
            UNION ALL SELECT solg_trong_kho FROM mouse
            UNION ALL SELECT solg_trong_kho FROM monitor
        ) AS tong_sp
    ");
    $san_pham = $result->fetch_assoc()['total'];

    // Trả JSON
    echo json_encode([
        'don_hang' => $don_hang,
        'tai_khoan' => $tai_khoan,
        'thanh_toan' => $thanh_toan,
        'san_pham' => $san_pham
    ]);
    break;


    default:
        echo json_encode(["error" => "Invalid action"]);
        break;
}

$conn->close();
?>