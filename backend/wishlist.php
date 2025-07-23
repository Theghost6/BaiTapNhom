<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Check database connection first
if (!isset($conn) || !$conn || $conn->connect_error) {
    http_response_code(500);
    die(json_encode([
        "success" => false,
        "message" => "Database connection error: " . ($conn ? $conn->connect_error : 'No connection')
    ]));
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $ma_nguoi_dung = isset($_GET['ma_nguoi_dung']) ? intval($_GET['ma_nguoi_dung']) : 0;
        $ma_sp = isset($_GET['ma_sp']) ? $conn->real_escape_string($_GET['ma_sp']) : '';

        if ($ma_sp) {
            if ($ma_nguoi_dung <= 0) {
                http_response_code(400);
                die(json_encode(["success" => false, "message" => "Missing user ID for product check"]));
            }

            $sql = "SELECT id FROM yeu_thich WHERE ma_nguoi_dung = ? AND ma_sp = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            $stmt->bind_param("is", $ma_nguoi_dung, $ma_sp);
            $stmt->execute();
            $result = $stmt->get_result();

            echo json_encode([
                "success" => true,
                "isInWishlist" => $result->num_rows > 0
            ]);
            $stmt->close();
        } else {
            $sql = "SELECT yt.id, yt.ma_nguoi_dung, yt.ma_sp, yt.created_at, sp.ten_sp as ten_san_pham
                    FROM yeu_thich yt
                    LEFT JOIN san_pham sp ON yt.ma_sp = sp.ma_sp";

            if ($ma_nguoi_dung > 0) {
                $sql .= " WHERE yt.ma_nguoi_dung = ?";
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    throw new Exception("Prepare failed: " . $conn->error);
                }
                $stmt->bind_param("i", $ma_nguoi_dung);
            } else {
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    throw new Exception("Prepare failed: " . $conn->error);
                }
            }

            $stmt->execute();
            $result = $stmt->get_result();

            $items = [];
            while ($row = $result->fetch_assoc()) {
                $items[] = [
                    'id' => $row['id'] ?? null,
                    'ma_nguoi_dung' => $row['ma_nguoi_dung'] ?? null,
                    'ma_sp' => $row['ma_sp'] ?? null,
                    'created_at' => $row['created_at'] ?? null,
                    'ten_san_pham' => $row['ten_san_pham'] ?? "Không xác định"
                ];
            }

            echo json_encode([
                "success" => true,
                "items" => $items
            ]);
            $stmt->close();
        }
    } elseif ($method === 'POST') {
        $json = file_get_contents('php://input');
        file_put_contents('wishlist_debug.log', date('Y-m-d H:i:s', time() + 7*3600)."\nJSON: ".$json."\n", FILE_APPEND);

        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            die(json_encode(["success" => false, "message" => "Invalid JSON input"]));
        }

        $ma_nguoi_dung = isset($data['ma_nguoi_dung']) ? intval($data['ma_nguoi_dung']) : 0;
        $ma_sp = isset($data['ma_sp']) ? $conn->real_escape_string($data['ma_sp']) : '';
        $action = isset($data['action']) ? $data['action'] : '';

        if ($ma_nguoi_dung <= 0 || empty($ma_sp) || !in_array($action, ['add', 'remove'])) {
            http_response_code(400);
            die(json_encode(["success" => false, "message" => "Invalid data"]));
        }

        // Verify product exists
        $check_product = $conn->prepare("SELECT id FROM san_pham WHERE ma_sp = ?");
        if (!$check_product) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $check_product->bind_param("s", $ma_sp);
        $check_product->execute();
        $product_result = $check_product->get_result();

        if ($product_result->num_rows === 0) {
            http_response_code(404);
            die(json_encode(["success" => false, "message" => "Product not found"]));
        }
        $check_product->close();

        if ($action === 'add') {
            // Check if already in wishlist
            $check = $conn->prepare("SELECT id FROM yeu_thich WHERE ma_nguoi_dung = ? AND ma_sp = ?");
            if (!$check) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            $check->bind_param("is", $ma_nguoi_dung, $ma_sp);
            $check->execute();

            if ($check->get_result()->num_rows > 0) {
                $check->close();
                die(json_encode(["success" => false, "message" => "Product already in wishlist"]));
            }
            $check->close();

            $sql = "INSERT INTO yeu_thich (ma_nguoi_dung, ma_sp, created_at) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            $vietnam_time = date('Y-m-d H:i:s', time() + 7*3600);
            $stmt->bind_param("iss", $ma_nguoi_dung, $ma_sp, $vietnam_time);
            $success = $stmt->execute();
            $insert_id = $stmt->insert_id;
            $stmt->close();

            echo json_encode([
                "success" => $success,
                "message" => $success ? "Added to wishlist successfully" : "Failed to add to wishlist",
                "id" => $insert_id
            ]);
        } else {
            $sql = "DELETE FROM yeu_thich WHERE ma_nguoi_dung = ? AND ma_sp = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            $stmt->bind_param("is", $ma_nguoi_dung, $ma_sp);
            $success = $stmt->execute();
            $stmt->close();

            echo json_encode([
                "success" => $success,
                "message" => $success ? "Removed from wishlist successfully" : "Failed to remove from wishlist"
            ]);
        }
    } else {
        http_response_code(405);
        die(json_encode(["success" => false, "message" => "Method not allowed"]));
    }
} catch (Exception $e) {
    http_response_code(500);
    die(json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]));
}

$conn->close();

