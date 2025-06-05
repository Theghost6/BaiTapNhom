<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
$host = 'localhost';
$dbname = 'form';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['path']) ? $_GET['path'] : '';
$pathParts = explode('/', trim($path, '/'));

if (empty($pathParts[0])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid endpoint']);
    exit;
}

$table = $pathParts[0];
$id = isset($pathParts[1]) ? $pathParts[1] : null;

// Validate table name
$allowedTables = ['banner', 'footer', 'top_menu', 'chu_chay'];
if (!in_array($table, $allowedTables)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid table name']);
    exit;
}

// Handle different HTTP methods
switch ($method) {
    case 'GET':
        handleGet($pdo, $table, $id);
        break;
    case 'POST':
        handlePost($pdo, $table);
        break;
    case 'PUT':
        handlePut($pdo, $table, $id);
        break;
    case 'DELETE':
        handleDelete($pdo, $table, $id);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

// GET - Retrieve data
function handleGet($pdo, $table, $id) {
    try {
        if ($id) {
            // Get single record
            $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
            $stmt->execute([$id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result) {
                echo json_encode(['success' => true, 'data' => $result]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Record not found']);
            }
        } else {
            // Get all records
            $orderBy = getOrderBy($table);
            $stmt = $pdo->query("SELECT * FROM $table $orderBy");
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'data' => $results]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

// POST - Create new record
function handlePost($pdo, $table) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }
    
    try {
        $fields = getTableFields($table);
        $data = [];
        $placeholders = [];
        
        foreach ($fields as $field) {
            if (isset($input[$field])) {
                // Validate required fields
                if (($field === 'noi_dung' || $field === 'toc_do') && empty($input[$field])) {
                    http_response_code(400);
                    echo json_encode(['error' => "Field $field is required"]);
                    return;
                }
                
                $data[$field] = $input[$field];
                $placeholders[] = '?';
            }
        }
        
        if (empty($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid fields provided']);
            return;
        }
        
        $fieldNames = implode(', ', array_keys($data));
        $placeholderStr = implode(', ', $placeholders);
        
        $stmt = $pdo->prepare("INSERT INTO $table ($fieldNames) VALUES ($placeholderStr)");
        $stmt->execute(array_values($data));
        
        $lastId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Record created successfully',
            'id' => $lastId
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
// PUT - Update existing record
function handlePut($pdo, $table, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required for update']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }
    
    try {
        // Check if record exists
        $stmt = $pdo->prepare("SELECT id FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Record not found']);
            return;
        }
        
        $fields = getTableFields($table);
        $data = [];
        $setParts = [];
        
        foreach ($fields as $field) {
            if (isset($input[$field])) {
                $data[] = $input[$field];
                $setParts[] = "$field = ?";
            }
        }
        
        if (empty($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid fields provided']);
            return;
        }
        
        $data[] = $id; // Add ID for WHERE clause
        $setStr = implode(', ', $setParts);
        
        $stmt = $pdo->prepare("UPDATE $table SET $setStr WHERE id = ?");
        $stmt->execute($data);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Record updated successfully'
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

// DELETE - Delete record
function handleDelete($pdo, $table, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required for delete']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT id FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Record not found']);
            return;
        }
        
        $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Record deleted successfully'
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

// Get table fields based on table name
function getTableFields($table) {
    switch ($table) {
        case 'banner':
            return ['hinh_anh', 'thu_tu', 'is_active'];
        case 'footer':
            return ['noi_dung', 'tac_gia', 'ban_quyen', 'dia_diem', 'ten_lop', 'ten_truong', 'trang_thai'];
        case 'top_menu':
            return ['ten', 'url', 'thu_tu', 'trang_thai'];
        case 'chu_chay':
            return ['noi_dung', 'toc_do', 'trang_thai'];
        default:
            return [];
    }
}

// Get order by clause based on table
function getOrderBy($table) {
    switch ($table) {
        case 'banner':
        case 'top_menu':
            return 'ORDER BY thu_tu ASC';
        case 'footer':
        case 'chu_chay':
            return 'ORDER BY created_at DESC';
        default:
            return 'ORDER BY id DESC';
    }
}
?>
