<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost:3306", "root", "", "form");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$conn->set_charset("utf8mb4");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $ma_nguoi_dung = isset($_GET['ma_nguoi_dung']) ? intval($_GET['ma_nguoi_dung']) : 0;
    $id_product = isset($_GET['id_product']) ? $conn->real_escape_string($_GET['id_product']) : '';

    if ($ma_nguoi_dung <= 0) {
        echo json_encode(["success" => false, "message" => "Thiếu mã người dùng"]);
        exit();
    }

    if ($id_product) {
        // Kiểm tra trạng thái yêu thích của một sản phẩm cụ thể
        $sql = "SELECT id FROM yeu_thich WHERE ma_nguoi_dung = ? AND id_product = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $ma_nguoi_dung, $id_product);
        $stmt->execute();
        $result = $stmt->get_result();

        echo json_encode([
            "success" => true,
            "isInWishlist" => $result->num_rows > 0
        ]);
        $stmt->close();
    } else {
        // Lấy toàn bộ danh sách sản phẩm yêu thích
        $sql = "SELECT id, id_product, ngay_them FROM yeu_thich WHERE ma_nguoi_dung = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $ma_nguoi_dung);
        $stmt->execute();
        $result = $stmt->get_result();

        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }

        echo json_encode([
            "success" => true,
            "items" => $items
        ]);
        $stmt->close();
    }
} elseif ($method === 'POST') {
    // Thêm hoặc xóa khỏi danh sách yêu thích
    $data = json_decode(file_get_contents("php://input"), true);
    $ma_nguoi_dung = isset($data['ma_nguoi_dung']) ? intval($data['ma_nguoi_dung']) : 0;
    $id_product = isset($data['id_product']) ? $conn->real_escape_string($data['id_product']) : '';
    $action = isset($data['action']) ? $data['action'] : '';

    if ($ma_nguoi_dung <= 0 || empty($id_product) || !in_array($action, ['add', 'remove'])) {
        echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
        exit();
    }

    if ($action === 'add') {
        $sql = "INSERT INTO yeu_thich (ma_nguoi_dung, id_product, ngay_them) VALUES (?, ?, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $ma_nguoi_dung, $id_product);
        $success = $stmt->execute();
        $insert_id = $stmt->insert_id;
        $stmt->close();

        echo json_encode([
            "success" => $success,
            "message" => $success ? "Thêm vào danh sách yêu thích thành công" : "Lỗi khi thêm vào danh sách yêu thích",
            "id" => $insert_id
        ]);
    } else {
        $sql = "DELETE FROM yeu_thich WHERE ma_nguoi_dung = ? AND id_product = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $ma_nguoi_dung, $id_product);
        $success = $stmt->execute();
        $stmt->close();

        echo json_encode([
            "success" => $success,
            "message" => $success ? "Xóa khỏi danh sách yêu thích thành công" : "Lỗi khi xóa khỏi danh sách yêu thích"
        ]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Phương thức không được hỗ trợ"]);
}

$conn->close();
?>
