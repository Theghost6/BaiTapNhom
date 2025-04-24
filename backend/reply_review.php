<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "form";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['id_danh_gia']) || !isset($_POST['ten_nguoi_tra_loi']) || !isset($_POST['noi_dung_phan_hoi']) || !isset($_POST['ngay'])) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    $id_danh_gia = $conn->real_escape_string($_POST['id_danh_gia']);
    $ten_nguoi_tra_loi = $conn->real_escape_string($_POST['ten_nguoi_tra_loi']);
    $noi_dung_phan_hoi = $conn->real_escape_string($_POST['noi_dung_phan_hoi']);
    $ngay = $conn->real_escape_string($_POST['ngay']);

    $sql = "INSERT INTO phan_hoi_review (id_danh_gia, ten_nguoi_tra_loi, noi_dung_phan_hoi, ngay)
            VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isss", $id_danh_gia, $ten_nguoi_tra_loi, $noi_dung_phan_hoi, $ngay);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Reply added successfully"
        ]);
    } else {
        http_response_code(500); // hoặc 400
        echo json_encode([
            "success" => false,
            "message" => "Reply failed: " . $stmt->error
        ]);
    }
    
    
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Unsupported method"]);
}

$conn->close();
?>
