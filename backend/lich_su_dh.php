<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: content-type, authorization, x-requested-with");

// Xử lý preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Set timezone to Vietnam
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Sử dụng file connect.php
require_once __DIR__ . '/connect.php';

// Kiểm tra kết nối MySQLi
if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Connection failed: " . ($conn->connect_error ?? "Connection not available")]);
    exit;
}

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

// Lấy tất cả đơn hàng của người dùng
function getOrderHistory($conn, $user_id) {
    $user_id = $conn->real_escape_string($user_id);

    $query = "SELECT 
                dh.id as ma_don_hang, 
                dh.tong_tien, 
                dh.trang_thai, 
                dh.updated_at as ngay_dat, 
                dh.ghi_chu,
                dcgh.nguoi_nhan, 
                dcgh.sdt_nhan, 
                dcgh.dia_chi, 
                dcgh.tinh_thanh, 
                dcgh.quan_huyen, 
                dcgh.phuong_xa,
                tt.phuong_thuc, 
                tt.trang_thai as trang_thai_thanh_toan
              FROM don_hang dh
              LEFT JOIN dia_chi_giao_hang dcgh ON dh.ma_dia_chi = dcgh.ma_dia_chi
              LEFT JOIN thanh_toan tt ON dh.id = tt.ma_don_hang
              WHERE dh.ma_nguoi_dung = '$user_id'
              ORDER BY dh.updated_at DESC";

    $result = $conn->query($query);
    $orders = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $order_id = $row['ma_don_hang'];
            // Lấy danh sách sản phẩm cho đơn hàng này
            $product_query = "SELECT 
                                ctdh.ma_sp, 
                                sp.ten_sp, 
                                ctdh.so_luong, 
                                ctdh.don_gia,
                                (SELECT url FROM anh_sp WHERE ma_sp = ctdh.ma_sp ORDER BY thu_tu ASC LIMIT 1) as anh
                              FROM chi_tiet_don_hang ctdh
                              JOIN san_pham sp ON ctdh.ma_sp = sp.ma_sp
                              WHERE ctdh.ma_don_hang = '$order_id'";
            $product_result = $conn->query($product_query);
            $products = [];
            if ($product_result && $product_result->num_rows > 0) {
                while ($prod = $product_result->fetch_assoc()) {
                    $products[] = $prod;
                }
            }
            $row['san_pham'] = $products;
            $orders[] = $row;
        }
    }

    return $orders;
}

// Lấy thông tin chi tiết một đơn hàng cụ thể
function getOrderDetail($conn, $user_id, $order_id) {
    $user_id = $conn->real_escape_string($user_id);
    $order_id = $conn->real_escape_string($order_id);

    // Kiểm tra đơn hàng có thuộc về người dùng không
    $check_query = "SELECT COUNT(*) as count FROM don_hang WHERE id = '$order_id' AND ma_nguoi_dung = '$user_id'";
    $check_result = $conn->query($check_query);

    if (!$check_result) {
        return null;
    }

    $check_row = $check_result->fetch_assoc();

    if ($check_row['count'] == 0) {
        return null; // Đơn hàng không thuộc về người dùng này
    }

    $query = "SELECT 
                dh.id as ma_don_hang, 
                dh.tong_tien, 
                dh.trang_thai, 
                dh.updated_at as ngay_dat, 
                dh.ghi_chu,
                dcgh.nguoi_nhan, 
                dcgh.sdt_nhan, 
                dcgh.dia_chi, 
                dcgh.tinh_thanh, 
                dcgh.quan_huyen, 
                dcgh.phuong_xa,
                tt.phuong_thuc, 
                tt.trang_thai as trang_thai_thanh_toan,
                tt.thoi_gian_thanh_toan,
                tt.ma_giao_dich
              FROM don_hang dh
              LEFT JOIN dia_chi_giao_hang dcgh ON dh.ma_dia_chi = dcgh.ma_dia_chi
              LEFT JOIN thanh_toan tt ON dh.id = tt.ma_don_hang
              WHERE dh.id = '$order_id' AND dh.ma_nguoi_dung = '$user_id'";

    $result = $conn->query($query);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();

        // Lấy danh sách sản phẩm cho đơn hàng này
        $product_query = "SELECT 
                            ctdh.ma_sp, 
                            sp.ten_sp, 
                            ctdh.so_luong, 
                            ctdh.don_gia,
                            (SELECT url FROM anh_sp WHERE ma_sp = ctdh.ma_sp ORDER BY thu_tu ASC LIMIT 1) as anh
                          FROM chi_tiet_don_hang ctdh
                          JOIN san_pham sp ON ctdh.ma_sp = sp.ma_sp
                          WHERE ctdh.ma_don_hang = '$order_id'";
        $product_result = $conn->query($product_query);
        $products = [];
        if ($product_result && $product_result->num_rows > 0) {
            while ($prod = $product_result->fetch_assoc()) {
                $products[] = $prod;
            }
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
        // ...existing GET code...
        if (isset($_GET['ma_nguoi_dung']) && isset($_GET['ma_sp'])) {
            $user_id = intval($_GET['ma_nguoi_dung']);
            $ma_sp = $conn->real_escape_string($_GET['ma_sp']);
            $sql = "SELECT COUNT(*) as count
                    FROM don_hang dh
                    JOIN chi_tiet_don_hang ctdh ON dh.id = ctdh.ma_don_hang
                    WHERE dh.ma_nguoi_dung = $user_id
                      AND ctdh.ma_sp = '$ma_sp'";
            $result = $conn->query($sql);
            if ($result) {
                $row = $result->fetch_assoc();
                echo json_encode([
                    "success" => true,
                    "da_mua" => ($row['count'] > 0) ? 1 : 0
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Lỗi truy vấn cơ sở dữ liệu"
                ]);
            }
            exit;
        } else if (isset($_GET['order_id'])) {
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
    case 'POST':
        // Hủy đơn hàng
        $input = json_decode(file_get_contents('php://input'), true);
        $order_id = isset($input['order_id']) ? intval($input['order_id']) : 0;
        $user_id = isset($input['user_id']) ? intval($input['user_id']) : 0;
        if (!$order_id) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Thiếu mã đơn hàng"]);
            break;
        }
        // Kiểm tra trạng thái thanh toán
        $check_sql = "SELECT dh.trang_thai, tt.trang_thai as trang_thai_thanh_toan FROM don_hang dh LEFT JOIN thanh_toan tt ON dh.id = tt.ma_don_hang WHERE dh.id = '$order_id'";
        $check_result = $conn->query($check_sql);
        if ($check_result && $check_result->num_rows > 0) {
            $row = $check_result->fetch_assoc();
            if ($row['trang_thai'] !== 'Chờ xử lý' || $row['trang_thai_thanh_toan'] === 'Thành công') {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Đơn hàng không thể hủy!"]);
                break;
            }
            // Thực hiện hủy đơn hàng
            $update_sql = "UPDATE don_hang SET trang_thai = 'Đã hủy' WHERE id = '$order_id'";
            if ($conn->query($update_sql)) {
                http_response_code(200);
                echo json_encode(["success" => true, "message" => "Đã hủy đơn hàng thành công!"]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Lỗi khi cập nhật trạng thái đơn hàng"]);
            }
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Không tìm thấy đơn hàng"]);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Phương thức không được hỗ trợ"));
        break;
}

// Đóng kết nối
if (isset($conn)) {
    $conn->close();
}
?>