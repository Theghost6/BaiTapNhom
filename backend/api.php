<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

// Database connection
$conn = new mysqli("localhost", "root", "", "form");
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
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

        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }

        echo json_encode($orders);
        break;

    case 'get_order_detail':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        // Get order items
        $sql = "SELECT ctdh.*
                FROM chi_tiet_don_hang ctdh
                WHERE ctdh.ma_don_hang = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        
        // Get delivery address information
        $sql = "SELECT dcgh.* 
                FROM dia_chi_giao_hang dcgh
                JOIN don_hang dh ON dcgh.ma_dia_chi = dh.ma_dia_chi
                WHERE dh.id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $address = $result->fetch_assoc();
        
        // Return both items and address
        echo json_encode([
            'items' => $items,
            'address' => $address
        ]);
        break;

    case 'delete_order':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        $sql = "DELETE FROM don_hang WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();

        echo json_encode(["success" => $success]);
        break;

        case 'update_order_status':
            $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
            $status = isset($_GET['status']) ? $_GET['status'] : '';
            error_log("Updating order ID: $id, Status: $status");
            if ($id === 0 || empty($status)) {
                echo json_encode(["success" => false, "error" => "Invalid ID or status"]);
                break;
            }
        
            $sql = "UPDATE don_hang SET trang_thai = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                error_log("Prepare failed: " . $conn->error);
                echo json_encode(["success" => false, "error" => "SQL prepare failed"]);
                break;
            }
            $stmt->bind_param("si", $status, $id);
            $stmt->execute();
            $affected_rows = $stmt->affected_rows;
            if ($affected_rows > 0) {
                echo json_encode(["success" => true, "affected_rows" => $affected_rows]);
            } else {
                error_log("No rows affected for ID: $id");
                echo json_encode(["success" => false, "error" => "No rows updated"]);
            }
            $stmt->close();
            break;
    // Users management
    case 'get_users':
        $sql = "SELECT * FROM dang_ky ORDER BY user";
        $result = $conn->query($sql);

        $users = [];
        while ($row = $result->fetch_assoc()) {
            unset($row['pass']); // Remove password for security
            $users[] = $row;
        }

        echo json_encode($users);
        break;

    case 'delete_user':
        $phone = isset($_GET['phone']) ? $_GET['phone'] : '';

        $sql = "DELETE FROM dang_ky WHERE phone = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $phone);
        $success = $stmt->execute();

        echo json_encode(["success" => $success]);
        break;

    // Reviews management
    case 'get_reviews':
        $sql = "SELECT * FROM danh_gia ORDER BY ngay DESC";
        $result = $conn->query($sql);

        $reviews = [];
        while ($row = $result->fetch_assoc()) {
            $reviews[] = $row;
        }

        echo json_encode($reviews);
        break;

    case 'delete_review':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        $sql = "DELETE FROM danh_gia WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();

        echo json_encode(["success" => $success]);
        break;

    case 'get_review_replies':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

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

        $payments = [];
        while ($row = $result->fetch_assoc()) {
            $payments[] = $row;
        }

        echo json_encode($payments);
        break;

    case 'delete_payment':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

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

        $promotions = [];
        while ($row = $result->fetch_assoc()) {
            $promotions[] = $row;
        }

        echo json_encode($promotions);
        break;

    case 'delete_promotion':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

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

        if ($result) {
            $row = $result->fetch_assoc();
            echo json_encode(['tong' => $row['tong'] ?? 0]);
        } else {
            echo json_encode(['error' => "Tính toán bị lỗi"]);
        }
        break;

    // Statistics
    case 'get_statistics':
        // Lấy tháng hiện tại hoặc tháng được chỉ định
        $month = isset($_GET['month']) ? intval($_GET['month']) : date('m');
        $year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');
        
        // Tổng doanh thu trong tháng
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
        
        // Số lượng đơn hàng trong tháng
        $sql_orders = "SELECT COUNT(*) AS tong_don_hang 
                      FROM don_hang 
                      WHERE MONTH(ngay_dat) = ? 
                      AND YEAR(ngay_dat) = ?";
        $stmt = $conn->prepare($sql_orders);
        $stmt->bind_param("ii", $month, $year);
        $stmt->execute();
        $result = $stmt->get_result();
        $orders_count = $result->fetch_assoc();
        
        // Sản phẩm bán nhiều nhất trong tháng
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
        
        // Doanh thu theo ngày trong tháng
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
        
        // Tổng hợp và trả về kết quả
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
        //Inventory management
        case 'get_inventory':
            $sql = "SELECT * FROM ton_kho ORDER BY id_san_pham";
            $result = $conn->query($sql);
        
            $inventory = [];
            while ($row = $result->fetch_assoc()) {
                $inventory[] = $row;
            }
        
            echo json_encode($inventory);
            break;
        
            case 'update_inventory':
                $id = isset($_GET['id']) ? $_GET['id'] : '';
                $quantity = isset($_GET['quantity']) ? intval($_GET['quantity']) : 0;
            
                error_log("Updating inventory - ID: $id, Quantity: $quantity");
            
                if (empty($id) || $quantity < 0) {
                    error_log("Invalid parameters - ID: $id, Quantity: $quantity");
                    echo json_encode(["success" => false, "error" => "Invalid ID or quantity"]);
                    break;
                }
            
                $sql = "UPDATE ton_kho SET solg_trong_kho = ? WHERE id_san_pham = ?";
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    error_log("Prepare failed: " . $conn->error);
                    echo json_encode(["success" => false, "error" => "Database error"]);
                    break;
                }
                
                $stmt->bind_param("is", $quantity, $id);
                $success = $stmt->execute();
                
                if ($success) {
                    error_log("Update successful for ID: $id");
                    echo json_encode(["success" => true, "message" => "Cập nhật số lượng thành công"]);
                } else {
                    error_log("Update failed: " . $stmt->error);
                    echo json_encode(["success" => false, "error" => "Không thể cập nhật số lượng"]);
                }
                $stmt->close();
                break;
        
        default:
            echo json_encode(["error" => "Hành động không hợp lệ"]);
            break;
        
  }

$conn->close();
?>