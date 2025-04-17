<?php
// Enable CORS if needed
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json; charset=UTF-8");

// Database connection
$servername = "localhost";
$username = "root"; // Replace with your actual MySQL username
$password = ""; // Replace with your actual MySQL password
$dbname = "form";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Connection failed: " . $conn->connect_error
    ]));
}

// Set charset to handle UTF-8 properly
$conn->set_charset("utf8mb4");

// Handle GET request to retrieve reviews
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get the tour ID from the request
    if (!isset($_GET['id_tour'])) {
        echo json_encode([
            "success" => false,
            "message" => "Missing tour ID"
        ]);
        exit;
    }
    
    $tourId = $conn->real_escape_string($_GET['id_tour']);
    
    // Query to get all reviews for the specific tour
    $sql = "SELECT * FROM reviews WHERE id_tour = ? ORDER BY ngay DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $tourId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $reviews = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $reviews[] = [
                "id" => $row["id"],
                "id_tour" => $row["id_tour"],
                "ten_nguoi_dung" => $row["ten_nguoi_dung"],
                "danh_gia" => $row["danh_gia"],
                "binh_luan" => $row["binh_luan"],
                "ngay" => $row["ngay"]
            ];
        }
    }
    
    // Return the reviews as JSON
    echo json_encode($reviews);
    
    // Close statement
    $stmt->close();
}
// Handle POST request to add a new review
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate required fields
    if (!isset($_POST['id_tour']) || !isset($_POST['ten_nguoi_dung']) ||
        !isset($_POST['danh_gia']) || !isset($_POST['binh_luan'])) {
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields"
        ]);
        exit;
    }
    
    // Get and sanitize data
    $id_tour = $conn->real_escape_string($_POST['id_tour']);
    $ten_nguoi_dung = $conn->real_escape_string($_POST['ten_nguoi_dung']);
    $danh_gia = (int)$_POST['danh_gia'];
    $binh_luan = $conn->real_escape_string($_POST['binh_luan']);
    $ngay = isset($_POST['ngay']) ? $conn->real_escape_string($_POST['ngay']) : date('Y-m-d');
    
    // Validate rating (1-5)
    if ($danh_gia < 1 || $danh_gia > 5) {
        echo json_encode([
            "success" => false,
            "message" => "Rating must be between 1 and 5"
        ]);
        exit;
    }
    
    // Check if tour exists before adding a review
    // $checkTourSql = "SELECT id FROM tour WHERE id = ?";
    // $checkStmt = $conn->prepare($checkTourSql);
    // $checkStmt->bind_param("i", $id_tour);
    // $checkStmt->execute();
    // $checkResult = $checkStmt->get_result();
    
    // if ($checkResult->num_rows === 0) {
    //     echo json_encode([
    //         "success" => false,
    //         "message" => "Tour ID does not exist"
    //     ]);
    //     $checkStmt->close();
    //     $conn->close();
    //     exit;
    // }
    // $checkStmt->close();
    
    // Insert the review
    $sql = "INSERT INTO reviews (id_tour, ten_nguoi_dung, danh_gia, binh_luan, ngay)
            VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isiss", $id_tour, $ten_nguoi_dung, $danh_gia, $binh_luan, $ngay);
    
    if ($stmt->execute()) {
        // Get the inserted ID
        $lastId = $conn->insert_id;
        
        echo json_encode([
            "success" => true,
            "message" => "Review added successfully",
            "id" => $lastId
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Error: " . $stmt->error
        ]);
    }
    
    // Close statement
    $stmt->close();
} else {
    // Handle unsupported request methods
    echo json_encode([
        "success" => false,
        "message" => "Unsupported request method"
    ]);
}

// Close connection
$conn->close();
?>