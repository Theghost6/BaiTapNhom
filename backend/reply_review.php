<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
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
    file_put_contents('debug_reply.txt', $rawData . PHP_EOL, FILE_APPEND);
    $data = json_decode($rawData, true);

    if (!$data || !isset($data['id_danh_gia']) || !isset($data['ten_nguoi_tra_loi']) || 
        !isset($data['noi_dung']) || !isset($data['ngay'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required fields", "received" => $data]);
        exit;
    }

    $id_danh_gia = (int)$data['id_danh_gia'];
    $ten_nguoi_tra_loi = $conn->real_escape_string($data['ten_nguoi_tra_loi']);
    $noi_dung_phan_hoi = $conn->real_escape_string($data['noi_dung']);
    $ngay = $conn->real_escape_string($data['ngay']);

    $checkSql = "SELECT id FROM danh_gia WHERE id = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("i", $id_danh_gia);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows === 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid review ID"]);
        $checkStmt->close();
        exit;
    }
    $checkStmt->close();

    $sql = "INSERT INTO phan_hoi_review (id_danh_gia, ten_nguoi_tra_loi, noi_dung_phan_hoi, ngay) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isss", $id_danh_gia, $ten_nguoi_tra_loi, $noi_dung_phan_hoi, $ngay);

    if ($stmt->execute()) {
        file_put_contents('sql_success.txt', "Reply inserted: id_danh_gia=$id_danh_gia, time=" . date('Y-m-d H:i:s') . PHP_EOL, FILE_APPEND);
        echo json_encode(["success" => true, "message" => "Reply added successfully", "id" => $conn->insert_id]);
    } else {
        file_put_contents('sql_error.txt', "Reply error: " . $stmt->error . ", time=" . date('Y-m-d H:i:s') . PHP_EOL, FILE_APPEND);
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Reply failed: " . $stmt->error]);
    }
    
    $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['id_danh_gia'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing id_danh_gia"]);
        exit;
    }

    $id_danh_gia = (int)$_GET['id_danh_gia'];
    $sql = "SELECT id, ten_nguoi_tra_loi, noi_dung_phan_hoi AS noi_dung, ngay 
            FROM phan_hoi_review 
            WHERE id_danh_gia = ? 
            ORDER BY ngay ASC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_danh_gia);
    $stmt->execute();
    $result = $stmt->get_result();

    $replies = [];
    while ($row = $result->fetch_assoc()) {
        $replies[] = $row;
    }

    echo json_encode(["success" => true, "data" => $replies]);
    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Unsupported method"]);
}

$conn->close();
?>