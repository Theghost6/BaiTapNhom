<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "form";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
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
                ct.phuong_thuc_van_chuyen
              FROM don_hang dh
              LEFT JOIN dia_chi_giao_hang dcgh ON dh.ma_dia_chi = dcgh.ma_dia_chi
              LEFT JOIN thanh_toan tt ON dh.id = tt.ma_don_hang
              LEFT JOIN chi_tiet_don_hang ct ON dh.id = ct.ma_don_hang
              WHERE dh.ma_nguoi_dung = ?
              ORDER BY dh.ngay_dat DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute([$user_id]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($orders as &$order) {
        $order_id = $order['ma_don_hang'];
        $query_details = "SELECT 
                            ctdh.id_product, 
                            ctdh.ten_san_pham, 
                            ctdh.danh_muc,
                            ctdh.so_luong, 
                            ctdh.gia,
                            ctdh.phuong_thuc_van_chuyen
                          FROM chi_tiet_don_hang ctdh
                          WHERE ctdh.ma_don_hang = ?";

        $stmt_details = $conn->prepare($query_details);
        $stmt_details->execute([$order_id]);
        $products = $stmt_details->fetchAll(PDO::FETCH_ASSOC);

        $order['san_pham'] = $products;
    }

    return $orders;
}


// Lấy thông tin chi tiết một đơn hàng cụ thể
function getOrderDetail($conn, $user_id, $order_id) {
    // Kiểm tra đơn hàng có thuộc về người dùng không
    $check_query = "SELECT COUNT(*) as count FROM don_hang WHERE id = ? AND ma_nguoi_dung = ?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param("ii", $order_id, $user_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    $check_row = $check_result->fetch_assoc();
    
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
                tt.ma_giao_dich
              FROM don_hang dh
              LEFT JOIN dia_chi_giao_hang dcgh ON dh.ma_dia_chi = dcgh.ma_dia_chi
              LEFT JOIN thanh_toan tt ON dh.id = tt.ma_don_hang
              WHERE dh.id = ? AND dh.ma_nguoi_dung = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $order_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        // Lấy chi tiết sản phẩm trong đơn hàng
        $query_details = "SELECT 
                            ctdh.id_product, 
                            ctdh.ten_san_pham,
                            ctdh.danh_muc, 
                            ctdh.so_luong, 
                            ctdh.gia,
                            ctdh.phuong_thuc_van_chuyen
                          FROM chi_tiet_don_hang ctdh
                          WHERE ctdh.ma_don_hang = ?";
        
        $stmt_details = $conn->prepare($query_details);
        $stmt_details->bind_param("i", $order_id);
        $stmt_details->execute();
        $result_details = $stmt_details->get_result();
        
        $products = array();
        while ($product = $result_details->fetch_assoc()) {
            $products[] = $product;
        }
        
        $row['san_pham'] = $products;
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
            $order_id = $_GET['order_id'];
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