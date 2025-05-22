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
        $sql = "SELECT ctdh.* FROM chi_tiet_don_hang ctdh WHERE ctdh.ma_don_hang = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
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

    // Total payment
    case 'get_total_payment':
        $sql = "SELECT SUM(tong_tien) AS tong FROM don_hang WHERE trang_thai = 'Đã thanh toán'";
        $result = $conn->query($sql);
        if (!$result) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - SQL error: " . $conn->error . "\n", FILE_APPEND);
            echo json_encode(["error" => "Query failed: " . $conn->error]);
            break;
        }
        $row = $result->fetch_assoc();
        echo json_encode(['tong' => $row['tong'] ?? 0]);
        break;

    // Statistics
    case 'get_statistics':
        $month = isset($_GET['month']) ? intval($_GET['month']) : date('m');
        $year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');
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
        $sql_orders = "SELECT COUNT(*) AS tong_don_hang 
                      FROM don_hang 
                      WHERE MONTH(ngay_dat) = ? 
                      AND YEAR(ngay_dat) = ?";
        $stmt = $conn->prepare($sql_orders);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $orders_count = $result->fetch_assoc();
        $sql_top_products = "SELECT ctdh.ten_san_pham, SUM(ctdh.so_luong) AS tong_so_luong
                            FROM chi_tiet_don_hang ctdh
                            JOIN don_hang dh ON ctdh.ma_don_hang = dh.id
                            WHERE MONTH(dh.ngay_dat) = ? 
                            AND YEAR(dh.ngay_dat) = ?
                            AND dh.trang_thai = 'Đã thanh toán'
                            GROUP BY ctdh.ten_san_pham
                            ORDER BY tong_so_luong DESC
                            LIMIT 5";
        $stmt = $conn->prepare($sql_top_products);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $top_products = [];
        while ($row = $result->fetch_assoc()) {
            $top_products[] = $row;
        }
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
            $daily_revenue[] = $row;
        }
        $statistics = [
            'tong_doanh_thu' => $revenue['tong_doanh_thu'] ?? 0,
            'tong_don_hang' => $orders_count['tong_don_hang'] ?? 0,
            'san_pham_ban_chay' => $top_products,
            'doanh_thu_theo_ngay' => $daily_revenue,
            'thang' => $month,
            'nam' => $year
        ];
        echo json_encode($statistics);
        break;

    default:
        echo json_encode(["error" => "Invalid action"]);
        break;
}

$conn->close();
?>