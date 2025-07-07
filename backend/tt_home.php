<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Define log file for debugging
$logFile = __DIR__ . '/tt_home_debug.log';

try {
    require_once __DIR__ . '/connect.php';
    
    // Kiểm tra kết nối MySQLi
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("MySQLi connection not available");
    }

    // Get request method and path
    $method = $_SERVER['REQUEST_METHOD'];
    $path = isset($_GET['path']) ? $_GET['path'] : '';
    $pathParts = explode('/', trim($path, '/'));

    // Log request for debugging
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Request: $method $path" . PHP_EOL, FILE_APPEND);

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
        echo json_encode(['error' => 'Invalid table name: ' . $table]);
        exit;
    }

    // Handle different HTTP methods
    switch ($method) {
        case 'GET':
            handleGet($conn, $table, $id);
            break;
        case 'POST':
            handlePost($conn, $table);
            break;
        case 'PUT':
            handlePut($conn, $table, $id);
            break;
        case 'DELETE':
            handleDelete($conn, $table, $id);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }

} catch (Exception $e) {
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}

// GET - Retrieve data
function handleGet($conn, $table, $id) {
    global $logFile;
    try {
        if ($id) {
            // Get single record
            $id = $conn->real_escape_string($id);
            $sql = "SELECT * FROM `$table` WHERE id = '$id'";
            $result = $conn->query($sql);
            
            if ($result && $result->num_rows > 0) {
                $data = $result->fetch_assoc();
                echo json_encode(['success' => true, 'data' => $data]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Record not found']);
            }
        } else {
            // Get all records
            $orderBy = getOrderBy($table);
            $sql = "SELECT * FROM `$table` $orderBy";
            $result = $conn->query($sql);
            
            $data = [];
            if ($result && $result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
            }
            echo json_encode(['success' => true, 'data' => $data]);
        }
    } catch(Exception $e) {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - GET Error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

// POST - Create new record
function handlePost($conn, $table) {
    global $logFile;
    $input = json_decode(file_get_contents('php://input'), true);
    
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - POST Input: " . print_r($input, true) . PHP_EOL, FILE_APPEND);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }
    
    try {
        $fields = getTableFields($table);
        $fieldNames = [];
        $fieldValues = [];
        
        foreach ($fields as $field) {
            if (isset($input[$field])) {
                // Validate required fields
                if (($field === 'noi_dung' || $field === 'toc_do') && empty($input[$field])) {
                    http_response_code(400);
                    echo json_encode(['error' => "Field $field is required"]);
                    return;
                }
                
                $fieldNames[] = "`$field`";
                $fieldValues[] = "'" . $conn->real_escape_string($input[$field]) . "'";
            }
        }
        
        if (empty($fieldNames)) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid fields provided']);
            return;
        }
        
        $fieldNamesStr = implode(', ', $fieldNames);
        $fieldValuesStr = implode(', ', $fieldValues);
        
        $sql = "INSERT INTO `$table` ($fieldNamesStr) VALUES ($fieldValuesStr)";
        
        if ($conn->query($sql)) {
            $lastId = $conn->insert_id;
            echo json_encode([
                'success' => true, 
                'message' => 'Record created successfully',
                'id' => $lastId
            ]);
        } else {
            throw new Exception($conn->error);
        }
        
    } catch(Exception $e) {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - POST Error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

// PUT - Update existing record
function handlePut($conn, $table, $id) {
    global $logFile;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required for update']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    file_put_contents($logFile, date('Y-m-d H:i:s') . " - PUT Input: " . print_r($input, true) . PHP_EOL, FILE_APPEND);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }
    
    try {
        // Check if record exists
        $id = $conn->real_escape_string($id);
        $checkSql = "SELECT id FROM `$table` WHERE id = '$id'";
        $checkResult = $conn->query($checkSql);
        
        if (!$checkResult || $checkResult->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Record not found']);
            return;
        }
        
        $fields = getTableFields($table);
        $setParts = [];
        
        foreach ($fields as $field) {
            if (array_key_exists($field, $input)) {
                $value = $conn->real_escape_string($input[$field]);
                $setParts[] = "`$field` = '$value'";
            }
        }
        
        if (empty($setParts)) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid fields provided']);
            return;
        }
        
        $setStr = implode(', ', $setParts);
        $sql = "UPDATE `$table` SET $setStr WHERE id = '$id'";
        
        if ($conn->query($sql)) {
            echo json_encode([
                'success' => true, 
                'message' => 'Record updated successfully'
            ]);
        } else {
            throw new Exception($conn->error);
        }
        
    } catch(Exception $e) {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - PUT Error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

// DELETE - Delete record
function handleDelete($conn, $table, $id) {
    global $logFile;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required for delete']);
        return;
    }
    
    try {
        $id = $conn->real_escape_string($id);
        
        // Check if record exists
        $checkSql = "SELECT id FROM `$table` WHERE id = '$id'";
        $checkResult = $conn->query($checkSql);
        
        if (!$checkResult || $checkResult->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Record not found']);
            return;
        }
        
        $sql = "DELETE FROM `$table` WHERE id = '$id'";
        
        if ($conn->query($sql)) {
            echo json_encode([
                'success' => true, 
                'message' => 'Record deleted successfully'
            ]);
        } else {
            throw new Exception($conn->error);
        }
        
    } catch(Exception $e) {
        file_put_contents($logFile, date('Y-m-d H:i:s') . " - DELETE Error: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
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