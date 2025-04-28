<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "form";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawData = file_get_contents("php://input");
    file_put_contents('debug_review.txt', $rawData . PHP_EOL, FILE_APPEND);
    
    $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : 'unknown';
    file_put_contents('debug_review.txt', "Content-Type: $contentType" . PHP_EOL, FILE_APPEND);
    
    $data = json_decode($rawData, true);

    if (!$data) {
        file_put_contents('debug_review.txt', "JSON decode error: " . json_last_error_msg() . PHP_EOL, FILE_APPEND);
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid JSON: " . json_last_error_msg(), "rawData" => $rawData]);
        exit;
    }

    if (!isset($data['id_product']) || !isset($data['ten_nguoi_dung']) || 
        !isset($data['so_sao']) || !isset($data['binh_luan']) || !isset($data['ngay'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required fields", "received" => $data]);
        exit;
    }

    $id_product = $conn->real_escape_string($data['id_product']);
    $ten_nguoi_dung = $conn->real_escape_string($data['ten_nguoi_dung']);
    $so_sao = (int)$data['so_sao'];
    $binh_luan = $conn->real_escape_string($data['binh_luan']);
    $ngay = $conn->real_escape_string($data['ngay']);

    // Bỏ qua việc kiểm tra sản phẩm có tồn tại trong bảng san_pham
    // Thay vào đó, ta có thể kiểm tra định dạng ID sản phẩm nếu muốn
    if (!preg_match('/^[a-zA-Z0-9]+$/', $id_product)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid product ID format"]);
        exit;
    }

    $sql = "INSERT INTO danh_gia (id_product, ten_nguoi_dung, so_sao, binh_luan, ngay) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssiss", $id_product, $ten_nguoi_dung, $so_sao, $binh_luan, $ngay);

    if ($stmt->execute()) {
        file_put_contents('sql_success.txt', "Review inserted: id_product=$id_product, time=" . date('Y-m-d H:i:s') . PHP_EOL, FILE_APPEND);
        echo json_encode(["success" => true, "message" => "Review added successfully", "id" => $conn->insert_id]);
    } else {
        file_put_contents('sql_error.txt', "Review error: " . $stmt->error . ", time=" . date('Y-m-d H:i:s') . PHP_EOL, FILE_APPEND);
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Review failed: " . $stmt->error]);
    }
    
    $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['id_product'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing id_product"]);
        exit;
    }

    $id_product = $conn->real_escape_string($_GET['id_product']);
    $sql = "SELECT id, ten_nguoi_dung, so_sao, binh_luan, ngay FROM danh_gia WHERE id_product = ? ORDER BY ngay DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id_product);
    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        // Fetch replies for each review
        $reply_sql = "SELECT id, ten_nguoi_tra_loi, noi_dung_phan_hoi AS noi_dung, ngay 
                      FROM phan_hoi_review 
                      WHERE id_danh_gia = ? 
                      ORDER BY ngay ASC";
        $reply_stmt = $conn->prepare($reply_sql);
        $reply_stmt->bind_param("i", $row['id']);
        $reply_stmt->execute();
        $reply_result = $reply_stmt->get_result();
        
        $replies = [];
        while ($reply_row = $reply_result->fetch_assoc()) {
            $replies[] = $reply_row;
        }
        $row['replies'] = $replies;
        $reviews[] = $row;
        $reply_stmt->close();
    }

    echo json_encode(["success" => true, "data" => $reviews]);
    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Unsupported method"]);
}

$conn->close();
?>