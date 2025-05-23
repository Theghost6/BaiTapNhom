<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content Ministrations-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "form";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Connection failed: " . $e->getMessage()]);
    exit;
}

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

// Lấy tất cả đơn hàng của người dùng
function getOrderHistory($conn, $user_id) {
    $query = "SELECT 
                dh.id as ma_don_hang, 
                dh.tong_tien, 
                dh.trang_thai, 
                dh.ngay_dat, 
                dh.ghi_chu,
                dcgh.nguoi_nhan, 
                dcgh.sdt_nhan, 
                dcgh.dia_chi, 
                dcgh.tinh_thanh, 
                dcgh.quan_huyen, 
                dcgh.phuong_xa,
                tt.phuong_thuc_thanh_toan, 
                tt.trang_thai_thanh_toan,
                hd.ten_san_pham
              FROM don_hang dh
              LEFT JOIN dia_chi_giao_hang dcgh ON dh.ma_dia_chi = dcgh.ma_dia_chi
              LEFT JOIN thanh_toan tt ON dh.id = tt.ma_don_hang
              LEFT JOIN hoa_don hd ON dh.id = hd.ma_don_hang
              WHERE dh.ma_nguoi_dung = ?
              ORDER BY dh.ngay_dat DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute([$user_id]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($orders as &$order) {
        $order_id = $order['ma_don_hang'];
        // Split ten_san_pham into an array for consistency with previous structure
        $products = [];
        if (!empty($order['ten_san_pham'])) {
            $product_list = explode(', ', $order['ten_san_pham']);
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
        $order['san_pham'] = $products;
        // Remove ten_san_pham from top-level to avoid redundancy
        unset($order['ten_san_pham']);
    }

    return $orders;
}

// Lấy thông tin chi tiết một đơn hàng cụ thể
function getOrderDetail($conn, $user_id, $order_id) {
    // Kiểm tra đơn hàng có thuộc về người dùng không
    $check_query = "SELECT COUNT(*) as count FROM don_hang WHERE id = ? AND ma_nguoi_dung = ?";
    $stmt = $conn->prepare($check_query);
    $stmt->execute([$order_id, $user_id]);
    $check_row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($check_row['count'] == 0) {
        return null; // Đơn hàng không thuộc về người dùng này
    }
    
    $query = "SELECT 
                dh.id as ma_don_hang, 
                dh.tong_tien, 
                dh.trang_thai, 
                dh.ngay_dat, 
                dh.ghi_chu,
                dcgh.nguoi_nhan, 
                dcgh.sdt_nhan, 
                dcgh.dia_chi, 
                dcgh.tinh_thanh, 
                dcgh.quan_huyen, 
                dcgh.phuong_xa,
                tt.phuong_thuc_thanh_toan, 
                tt.trang_thai_thanh_toan,
                tt.thoi_gian_thanh_toan,
                tt.ma_giao_dich,
                hd.ten_san_pham
              FROM don_hang dh
              LEFT JOIN dia_chi_giao_hang dcgh ON dh.ma_dia_chi = dcgh.ma_dia_chi
              LEFT JOIN thanh_toan tt ON dh.id = tt.ma_don_hang
              LEFT JOIN hoa_don hd ON dh.id = hd.ma_don_hang
              WHERE dh.id = ? AND dh.ma_nguoi_dung = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->execute([$order_id, $user_id]);
    
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Process ten_san_pham into products array
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
        
        $row['san_pham'] = $products;
        unset($row['ten_san_pham']); // Remove ten_san_pham from top-level
        return $row;
    }
    
    return null;
}

// Xử lý yêu cầu
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['order_id'])) {
            // Lấy chi tiết đơn hàng cụ thể
            $order_id = intval($_GET['order_id']);
            $order = getOrderDetail($conn, $user_id, $order_id);
            
            if ($order) {
                http_response_code(200);
                echo json_encode(array("data" => $order));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Không tìm thấy đơn hàng"));
            }
        } else {
            // Lấy tất cả đơn hàng
            $orders = getOrderHistory($conn, $user_id);
            
            if (count($orders) > 0) {
                http_response_code(200);
                echo json_encode(array("data" => $orders));
            } else {
                http_response_code(200);
                echo json_encode(array("data" => [], "message" => "Không có đơn hàng nào"));
            }
        }
        break;
    
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Phương thức không được hỗ trợ"));
        break;
}

$conn = null;
?>