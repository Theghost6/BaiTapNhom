<?php
// Tắt hiển thị lỗi ra output, chỉ log vào file
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/reviews_error.log');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/connect.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawData = file_get_contents("php://input");
    $contentType = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : 'unknown';
    $data = json_decode($rawData, true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid JSON: " . json_last_error_msg(), "rawData" => $rawData]);
        exit;
    }
    if (!isset($data['ma_sp']) || !isset($data['ma_nguoi_dung']) || 
        !isset($data['so_sao']) || !isset($data['binh_luan'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required fields", "received" => $data]);
        exit;
    }
    $ma_sp = $conn->real_escape_string($data['ma_sp']);
    $ma_nguoi_dung = (int)$data['ma_nguoi_dung'];
    $so_sao = (int)$data['so_sao'];
    $binh_luan = $conn->real_escape_string($data['binh_luan']);

    // Validate product ID format
    if ($ma_sp === '' || $ma_nguoi_dung <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid product or user ID"]);
        exit;
    }

    $sql = "INSERT INTO danh_gia (ma_sp, ma_nguoi_dung, so_sao, binh_luan) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("siss", $ma_sp, $ma_nguoi_dung, $so_sao, $binh_luan);

    if ($stmt->execute()) {
        file_put_contents('sql_success.txt', "Review inserted: id_product=$ma_sp, user=$ma_nguoi_dung, time=" . date('Y-m-d H:i:s') . PHP_EOL, FILE_APPEND);
        echo json_encode(["success" => true, "message" => "Review added successfully", "id" => $conn->insert_id]);
    } else {
        file_put_contents('sql_error.txt', "Review error: " . $stmt->error . ", time=" . date('Y-m-d H:i:s') . PHP_EOL, FILE_APPEND);
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Review failed: " . $stmt->error]);
    }
    
    $stmt->close();
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['ma_sp'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing ma_sp"]);
        exit;
    }
    $ma_sp = $conn->real_escape_string($_GET['ma_sp']);
    if ($ma_sp === '') {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid product ID"]);
        exit;
    }
    $sql = "SELECT dg.id, dg.ma_nguoi_dung, dg.so_sao, dg.binh_luan, dg.created_at AS ngay, dk.user AS ten_nguoi_dung, dk.email FROM danh_gia dg LEFT JOIN tai_khoan dk ON dg.ma_nguoi_dung = dk.id WHERE dg.ma_sp = ? ORDER BY dg.created_at DESC";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        file_put_contents('debug_review.txt', "Prepare failed: " . $conn->error . PHP_EOL, FILE_APPEND);
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
        exit;
    }
    $stmt->bind_param("s", $ma_sp);
    $stmt->execute();
    $result = $stmt->get_result();
    $reviews = [];
    $review_count = 0;
    while ($row = $result->fetch_assoc()) {
        $review_count++;
        // Ưu tiên lấy user, nếu không có thì lấy email hoặc id
        $row['ten_nguoi_dung'] = $row['ten_nguoi_dung'] ?: ($row['email'] ?: $row['ma_nguoi_dung']);
        unset($row['email']);
        // Fetch replies for each review
        $reply_sql = "SELECT pr.id, pr.ma_nguoi_tra_loi, dk.user AS ten_nguoi_tra_loi, dk.email, pr.noi_dung, pr.created_at AS ngay FROM phan_hoi_review pr LEFT JOIN tai_khoan dk ON pr.ma_nguoi_tra_loi = dk.id WHERE pr.id_danh_gia = ? ORDER BY pr.created_at ASC";
        $reply_stmt = $conn->prepare($reply_sql);
        if ($reply_stmt) {
            $reply_stmt->bind_param("i", $row['id']);
            $reply_stmt->execute();
            $reply_result = $reply_stmt->get_result();
            $replies = [];
            $reply_count = 0;
            while ($reply_row = $reply_result->fetch_assoc()) {
                $reply_count++;
                $reply_row['ten_nguoi_tra_loi'] = $reply_row['ten_nguoi_tra_loi'] ?: ($reply_row['email'] ?: $reply_row['ma_nguoi_tra_loi']);
                unset($reply_row['email']);
                $replies[] = $reply_row;
            }
            $row['replies'] = $replies;
            $reply_stmt->close();
            file_put_contents('debug_review.txt', "Review id {$row['id']} replies: $reply_count" . PHP_EOL, FILE_APPEND);
        } else {
            $row['replies'] = [];
            file_put_contents('debug_review.txt', "Reply prepare failed for review id {$row['id']}: " . $conn->error . PHP_EOL, FILE_APPEND);
        }
        $reviews[] = $row;
    }
    file_put_contents('debug_review.txt', "Total reviews: $review_count" . PHP_EOL, FILE_APPEND);
    echo json_encode(["success" => true, "data" => $reviews]);
    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Unsupported method"]);
}

$conn->close();

// Thêm hàm getUserAvatar vào cuối file (copy từ get-profile.php)
function getUserAvatar($userId) {
    // Lấy host cho ảnh từ biến môi trường BACKEND_HOST (nếu có)
    $backendHost = getenv('BACKEND_HOST') ?: 'http://localhost:8080';
    $avatarDir = __DIR__ . '/uploads/avatars/';
    $avatarPattern = $avatarDir . 'avatar_' . $userId . '.*';
    $existingAvatars = glob($avatarPattern);
    if (!empty($existingAvatars)) {
        $existingAvatar = basename($existingAvatars[0]);
        return rtrim($backendHost, '/') . '/uploads/avatars/' . $existingAvatar;
    }
    return null;
}
