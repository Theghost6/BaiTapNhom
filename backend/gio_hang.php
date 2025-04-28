<?php
// Hiển thị lỗi để debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Log file
$logFile = __DIR__ . '/gio_hang.log';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Kết nối cơ sở dữ liệu
try {
    $conn = new mysqli("localhost", "root", "", "form");

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // Xử lý yêu cầu
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $rawData = file_get_contents("php://input");
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - POST Raw Request: " . $rawData . PHP_EOL, FILE_APPEND);

        if (empty($rawData)) {
            echo json_encode(['success' => false, 'message' => 'Không nhận được dữ liệu']);
            exit();
        }

        $data = json_decode($rawData, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            file_put_contents($logFile, date('Y-m-d H:i:s') . " - JSON Parse Error: " . json_last_error_msg() . PHP_EOL, FILE_APPEND);
            echo json_encode(['success' => false, 'message' => 'Lỗi định dạng JSON: ' . json_last_error_msg()]);
            exit();
        }

        file_put_contents($logFile, date('Y-m-d H:i:s') . " - Parsed POST data: " . print_r($data, true) . PHP_EOL, FILE_APPEND);

        $action = $data['action'] ?? 'add';

        if ($action === 'add') {
            $user_id = $data['user_id'] ?? null;
            $product_id = $data['product_id'] ?? null;
            $quantity = $data['quantity'] ?? 1;

            if (!$user_id || !$product_id || $quantity < 1) {
                echo json_encode(['success' => false, 'message' => 'Thiếu thông tin cần thiết']);
                exit();
            }

            // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng
            $stmt = $conn->prepare("SELECT id, so_luong FROM gio_hang WHERE ma_nguoi_dung = ? AND id_product = ?");
            $stmt->bind_param("is", $user_id, $product_id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // Cập nhật số lượng nếu sản phẩm đã có
                $row = $result->fetch_assoc();
                $new_quantity = $row['so_luong'] + $quantity;
                $stmt = $conn->prepare("UPDATE gio_hang SET so_luong = ?, ngay_them = NOW() WHERE id = ?");
                $stmt->bind_param("ii", $new_quantity, $row['id']);
                if ($stmt->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Cập nhật giỏ hàng thành công']);
                } else {
                    throw new Exception("Lỗi khi cập nhật giỏ hàng: " . $stmt->error);
                }
            } else {
                // Thêm sản phẩm mới vào giỏ hàng
                $stmt = $conn->prepare("INSERT INTO gio_hang (ma_nguoi_dung, id_product, so_luong, ngay_them) VALUES (?, ?, ?, NOW())");
                $stmt->bind_param("isi", $user_id, $product_id, $quantity);
                if ($stmt->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Thêm vào giỏ hàng thành công']);
                } else {
                    throw new Exception("Lỗi khi thêm vào giỏ hàng: " . $stmt->error);
                }
            }
        } elseif ($action === 'update_quantity') {
            $user_id = $data['user_id'] ?? null;
            $product_id = $data['product_id'] ?? null;
            $quantity = $data['quantity'] ?? null;

            if (!$user_id || !$product_id || $quantity < 1) {
                echo json_encode(['success' => false, 'message' => 'Thiếu thông tin cần thiết']);
                exit();
            }

            $stmt = $conn->prepare("UPDATE gio_hang SET so_luong = ?, ngay_them = NOW() WHERE ma_nguoi_dung = ? AND id_product = ?");
            $stmt->bind_param("iis", $quantity, $user_id, $product_id);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Cập nhật số lượng thành công']);
            } else {
                throw new Exception("Lỗi khi cập nhật số lượng: " . $stmt->error);
            }
        } elseif ($action === 'delete') {
            $user_id = $data['user_id'] ?? null;
            $product_id = $data['product_id'] ?? null;

            if (!$user_id || !$product_id) {
                echo json_encode(['success' => false, 'message' => 'Thiếu thông tin cần thiết']);
                exit();
            }

            $stmt = $conn->prepare("DELETE FROM gio_hang WHERE ma_nguoi_dung = ? AND id_product = ?");
            $stmt->bind_param("is", $user_id, $product_id);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Xóa sản phẩm thành công']);
            } else {
                throw new Exception("Lỗi khi xóa sản phẩm: " . $stmt->error);
            }
        } elseif ($action === 'clear') {
            $user_id = $data['user_id'] ?? null;

            if (!$user_id) {
                echo json_encode(['success' => false, 'message' => 'Thiếu thông tin người dùng']);
                exit();
            }

            $stmt = $conn->prepare("DELETE FROM gio_hang WHERE ma_nguoi_dung = ?");
            $stmt->bind_param("i", $user_id);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Xóa giỏ hàng thành công']);
            } else {
                throw new Exception("Lỗi khi xóa giỏ hàng: " . $stmt->error);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Hành động không hợp lệ']);
            exit();
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $user_id = $_GET['user_id'] ?? null;

        if (!$user_id) {
            echo json_encode(['success' => false, 'message' => 'Thiếu thông tin người dùng']);
            exit();
        }

        $stmt = $conn->prepare("SELECT id, ma_nguoi_dung, id_product, so_luong, ngay_them FROM gio_hang WHERE ma_nguoi_dung = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $cartItems = [];
        while ($row = $result->fetch_assoc()) {
            $cartItems[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $cartItems]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Phương thức không được hỗ trợ']);
    }

    $conn->close();

} catch (Exception $e) {
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Lỗi server: ' . $e->getMessage()]);
}
?>