<?php

// ... existing code ...

case 'get_statistics':
    // ... existing code ...
    echo json_encode($statistics);
    break;

// Inventory management
case 'get_inventory':
    $sql = "SELECT * FROM ton_kho ORDER BY id_san_pham";
    $result = $conn->query($sql);

    $inventory = [];
    while ($row = $result->fetch_assoc()) {
        $inventory[] = $row;
    }

    echo json_encode($inventory);
    break;

case 'update_inventory':
    $id = isset($_GET['id']) ? $_GET['id'] : '';
    $quantity = isset($_GET['quantity']) ? intval($_GET['quantity']) : 0;

    error_log("Updating inventory - ID: $id, Quantity: $quantity");

    if (empty($id) || $quantity < 0) {
        error_log("Invalid parameters - ID: $id, Quantity: $quantity");
        echo json_encode(["success" => false, "error" => "Invalid ID or quantity"]);
        break;
    }

    $sql = "UPDATE ton_kho SET solg_trong_kho = ? WHERE id_san_pham = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        error_log("Prepare failed: " . $conn->error);
        echo json_encode(["success" => false, "error" => "Database error"]);
        break;
    }
    
    $stmt->bind_param("is", $quantity, $id);
    $success = $stmt->execute();
    
    if ($success) {
        error_log("Update successful for ID: $id");
        echo json_encode(["success" => true, "message" => "Cập nhật số lượng thành công"]);
    } else {
        error_log("Update failed: " . $stmt->error);
        echo json_encode(["success" => false, "error" => "Không thể cập nhật số lượng"]);
    }
    $stmt->close();
    break;

default:
    echo json_encode(["error" => "Hành động không hợp lệ"]);
    break;
}

$conn->close();
?> 