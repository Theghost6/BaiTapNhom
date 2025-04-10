<?php
// Thiết lập headers để hỗ trợ CORS và đảm bảo dữ liệu là UTF-8
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Kiểm tra các yêu cầu OPTIONS trước khi xử lý POST
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Kết nối với cơ sở dữ liệu MySQL
$servername = "localhost"; // Máy chủ MySQL
$username = "root";        // Tên người dùng MySQL
$password = "";            // Mật khẩu MySQL (thường là rỗng khi dùng XAMPP)
$dbname = "form";          // Tên cơ sở dữ liệu bạn muốn sử dụng

// Tạo kết nối MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Kết nối thất bại: " . $conn->connect_error]);
    exit;
}

// Lấy dữ liệu từ frontend (React) gửi đến dưới dạng JSON
$data = json_decode(file_get_contents('php://input'), true);

// In ra dữ liệu để kiểm tra (Lưu ý: Dùng với `error_log()` hoặc ghi vào file log thay vì var_dump())
error_log(print_r($data, true)); // Ghi vào file log của PHP, tránh việc in trực tiếp ra trình duyệt

// Kiểm tra xem dữ liệu có hợp lệ không
if (!$data) {
    echo json_encode(["status" => "error", "message" => "Dữ liệu không hợp lệ"]);
    exit;
}

// Kiểm tra xem dữ liệu có đầy đủ không
if (!isset($data['bookingInfo'])) {
    echo json_encode(["status" => "error", "message" => "Dữ liệu không đầy đủ"]);
    exit;
}

$bookingInfo = $data['bookingInfo'];
$paymentMethod = $data['paymentMethod'];
$cartItems = $data['cartItems'];
$totalAmount = $data['totalAmount'];
$totalQuantity = $data['totalQuantity'];

// Lấy thông tin đặt chỗ từ bookingInfo
$ngay_vao = $bookingInfo['checkInDate'];  // Sử dụng checkInDate từ React
$ngay_ra = $bookingInfo['checkOutDate'];  // Sử dụng checkOutDate từ React
$email = $bookingInfo['email'];
$ten = $bookingInfo['fullName'];  // Sử dụng fullName từ React
$so_nguoi = $bookingInfo['numberOfPeople'];  // Sử dụng numberOfPeople từ React
$sdt = $bookingInfo['phone'];  // Sử dụng phone từ React

// Câu lệnh SQL để thêm thông tin đặt chỗ vào cơ sở dữ liệu
$sql = "INSERT INTO bookings (ngay_vao, ngay_ra, email, ten, so_nguoi, sdt)
        VALUES ('$ngay_vao', '$ngay_ra', '$email', '$ten', $so_nguoi, '$sdt')";
// Thêm phương thức chuyển khoản
$sql1 = "INSERT INTO bookin";
// Thực thi câu lệnh SQL
if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Đặt chỗ và thanh toán thành công"]);
} else {
    echo json_encode(["status" => "error", "message" => "Lỗi khi thực hiện giao dịch"]);
}

// Đóng kết nối
$conn->close();
?>
