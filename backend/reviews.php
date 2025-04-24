<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "form";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Connection failed: " . $conn->connect_error
    ]));
}

// === HANDLE GET REQUEST ===
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['id_tour'])) {
        echo json_encode([
            "success" => false,
            "message" => "Missing tour ID"
        ]);
        exit;
    }

    $tourId = $conn->real_escape_string($_GET['id_tour']);
    $sql = "SELECT * FROM danh_gia WHERE id_tour = ? ORDER BY ngay DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $tourId);
    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviewId = $row["id"];
        $replies = [];

        $replyQuery = "SELECT * FROM phan_hoi_review WHERE id_danh_gia = ? ORDER BY ngay ASC";
        $replyStmt = $conn->prepare($replyQuery);
        if ($replyStmt) {
            $replyStmt->bind_param("i", $reviewId);
            $replyStmt->execute();
            $replyResult = $replyStmt->get_result();

            while ($reply = $replyResult->fetch_assoc()) {
                $replies[] = $reply;
            }
            $replyStmt->close();
        }

        $row["replies"] = $replies;
        $reviews[] = $row;
    }

    $stmt->close();
    echo json_encode($reviews);
    exit;
}

// === HANDLE POST REQUEST ===
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['id_tour']) || !isset($_POST['ten_nguoi_dung']) ||
        !isset($_POST['so_sao']) || !isset($_POST['binh_luan'])) {
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields"
        ]);
        exit;
    }

    $id_tour = $conn->real_escape_string($_POST['id_tour']);
    $ten_nguoi_dung = $conn->real_escape_string($_POST['ten_nguoi_dung']);
    $so_sao = (int)$_POST['so_sao'];
    $binh_luan = $conn->real_escape_string($_POST['binh_luan']);
    $ngay = isset($_POST['ngay']) ? $conn->real_escape_string($_POST['ngay']) : date('Y-m-d');

    if ($so_sao < 1 || $so_sao > 5) {
        echo json_encode([
            "success" => false,
            "message" => "Rating must be between 1 and 5"
        ]);
        exit;
    }

    $sql = "INSERT INTO danh_gia (id_tour, ten_nguoi_dung, so_sao, binh_luan, ngay)
            VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isiss", $id_tour, $ten_nguoi_dung, $so_sao, $binh_luan, $ngay);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Review added successfully",
            "id" => $conn->insert_id
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Error: " . $stmt->error
        ]);
    }

    $stmt->close();
    exit;
}

// === Unsupported method ===
echo json_encode([
    "success" => false,
    "message" => "Unsupported request method"
]);
$conn->close();
?>
