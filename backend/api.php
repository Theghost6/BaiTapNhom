<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

// Database connection
$conn = new mysqli("localhost", "root", "", "form");
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Get action parameter
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    // Bookings management
    case 'get_bookings':
        $sql = "SELECT * FROM bookings ORDER BY id DESC";
        $result = $conn->query($sql);
        
        $bookings = [];
        while ($row = $result->fetch_assoc()) {
            $bookings[] = $row;
        }
        
        echo json_encode($bookings);
        break;
        
    case 'get_booking_detail':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        $sql = "SELECT * FROM cart_items WHERE booking_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
        
        echo json_encode($items);
        break;
        
    case 'delete_booking':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        // Delete from bookings (cascades to cart_items and thanh_toan due to foreign key constraints)
        $sql = "DELETE FROM bookings WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        
        echo json_encode(["success" => $success]);
        break;
    
    // Users management
    case 'get_users':
        $sql = "SELECT * FROM register ORDER BY user";
        $result = $conn->query($sql);
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            // Remove password for security
            unset($row['pass']);
            $users[] = $row;
        }
        
        echo json_encode($users);
        break;
        
    case 'delete_user':
        $phone = isset($_GET['phone']) ? $_GET['phone'] : '';
        
        $sql = "DELETE FROM register WHERE phone = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $phone);
        $success = $stmt->execute();
        
        echo json_encode(["success" => $success]);
        break;
    
    // Reviews management
    case 'get_reviews':
        $sql = "SELECT * FROM reviews ORDER BY ngay DESC";
        $result = $conn->query($sql);
        
        $reviews = [];
        while ($row = $result->fetch_assoc()) {
            $reviews[] = $row;
        }
        
        echo json_encode($reviews);
        break;
        
    case 'delete_review':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        $sql = "DELETE FROM reviews WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        
        echo json_encode(["success" => $success]);
        break;
    
    // Payments management
    case 'get_payments':
        $sql = "SELECT * FROM thanh_toan ORDER BY id DESC";
        $result = $conn->query($sql);
        
        $payments = [];
        while ($row = $result->fetch_assoc()) {
            $payments[] = $row;
        }
        
        echo json_encode($payments);
        break;
        
    case 'delete_payment':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        $sql = "DELETE FROM thanh_toan WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        
        echo json_encode(["success" => $success]);
        break;
    
    // Hotels management
    case 'get_hotels':
        $sql = "SELECT * FROM khach_san ORDER BY id";
        $result = $conn->query($sql);
        
        $hotels = [];
        while ($row = $result->fetch_assoc()) {
            $hotels[] = $row;
        }
        
        echo json_encode($hotels);
        break;
        
    case 'delete_hotel':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        $sql = "DELETE FROM khach_san WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $success = $stmt->execute();
        
        echo json_encode(["success" => $success]);
        break;
        //Tính tổng tiền
    case 'get_total_payment':
        $sql = "SELECT SUM(tong_sotien) AS tong FROM thanh_toan";
        $result = $conn->query($sql);

        if($result){
            $row = $result->fetch_assoc();
            echo json_encode(['tong' => $row['tong']] ?? 0);
        }else{
            echo json_encode(['error' => "Tinh toan bi loi"]);
        }
        break;
        
    default:
        echo json_encode(["error" => "Lỗi action"]);
        break;
}

$conn->close();
?>