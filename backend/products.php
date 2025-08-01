<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Set timezone to Vietnam
date_default_timezone_set('Asia/Ho_Chi_Minh');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/connect.php';

if (isset($_GET['search'])) {
    $search = trim($_GET['search']);
    $search = mb_strtolower($search, 'UTF-8');
    $search_no_sign = iconv('UTF-8', 'ASCII//TRANSLIT', $search);
    $sql = "SELECT sp.*, dm.ten_danh_muc, nsx.ten_nha_san_xuat
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.id_danh_muc = dm.id
            LEFT JOIN nha_san_xuat nsx ON sp.id_nha_san_xuat = nsx.id
            WHERE sp.trang_thai = 1";
    $result = $conn->query($sql);
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $fields = [
            mb_strtolower($row['ten_sp'], 'UTF-8'),
            mb_strtolower($row['loai'], 'UTF-8'),
            mb_strtolower($row['ten_danh_muc'], 'UTF-8'),
            mb_strtolower($row['ten_nha_san_xuat'], 'UTF-8')
        ];
        $fields_no_sign = array_map(function($str) {
            return iconv('UTF-8', 'ASCII//TRANSLIT', $str);
        }, $fields);
        $match = false;
        foreach ($fields as $f) {
            if (strpos($f, $search) !== false) $match = true;
        }
        if (!$match) {
            foreach ($fields_no_sign as $f) {
                if (strpos($f, $search_no_sign) !== false) $match = true;
            }
        }
        if ($match) {
            // Lấy ảnh sản phẩm (dùng ma_sp)
            $imgSql = "SELECT url FROM anh_sp WHERE ma_sp = ? ORDER BY thu_tu ASC";
            $imgStmt = $conn->prepare($imgSql);
            $imgStmt->bind_param('s', $row['ma_sp']);
            $imgStmt->execute();
            $imgResult = $imgStmt->get_result();
            $images = [];
            while ($img = $imgResult->fetch_assoc()) {
                $images[] = $img['url'];
            }
            $row['images'] = $images;
            $imgStmt->close();

            // Lấy thông số kỹ thuật (dùng ma_sp)
            $specSql = "SELECT ten_thong_so, gia_tri_thong_so FROM thong_so WHERE ma_sp = ?";
            $specStmt = $conn->prepare($specSql);
            $specStmt->bind_param('s', $row['ma_sp']);
            $specStmt->execute();
            $specResult = $specStmt->get_result();
            $thong_so = [];
            while ($spec = $specResult->fetch_assoc()) {
                $thong_so[$spec['ten_thong_so']] = $spec['gia_tri_thong_so'];
            }
            $row['thong_so'] = $thong_so;
            $specStmt->close();

            // Parse các trường dạng JSON nếu có
            if (isset($row['tinh_nang']) && is_string($row['tinh_nang'])) {
                $row['tinh_nang'] = json_decode($row['tinh_nang'], true) ?: $row['tinh_nang'];
            }
            if (isset($row['thiet_bi_tuong_thich']) && is_string($row['thiet_bi_tuong_thich'])) {
                $row['thiet_bi_tuong_thich'] = json_decode($row['thiet_bi_tuong_thich'], true) ?: $row['thiet_bi_tuong_thich'];
            }

            // Đảm bảo luôn có trường gia_sau cho frontend
            $gia_sau = isset($row['gia_sau']) ? $row['gia_sau'] : (isset($row['gia']) ? $row['gia'] : null);
            if ($gia_sau === null || $gia_sau === '' || $gia_sau === '0' || $gia_sau === 0) {
                $row['gia_sau'] = null;
                $row['trang_thai_hang'] = 'Tạm hết hàng';
            } else {
                $row['gia_sau'] = $gia_sau;
                $row['trang_thai_hang'] = '';
            }
            if (!isset($row['gia_truoc']) || $row['gia_truoc'] === '' || $row['gia_truoc'] === '0' || $row['gia_truoc'] === 0) {
                $row['gia_truoc'] = null;
            }

            if (isset($row['ten_danh_muc'])) {
                $row['danh_muc'] = $row['ten_danh_muc'];
            } else {
                $row['danh_muc'] = null;
            }

            $products[] = $row;
        }
    }
    echo json_encode(['success' => true, 'data' => $products]);
    $conn->close();
    exit();
}

try {
    // Nếu có tham số id hoặc ma_sp, chỉ lấy 1 sản phẩm
    if (isset($_GET['id']) || isset($_GET['ma_sp'])) {
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = "SELECT sp.*, dm.ten_danh_muc, nsx.ten_nha_san_xuat
                    FROM san_pham sp
                    LEFT JOIN danh_muc dm ON sp.id_danh_muc = dm.id
                    LEFT JOIN nha_san_xuat nsx ON sp.id_nha_san_xuat = nsx.id
                    WHERE sp.trang_thai = 1 AND sp.id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('i', $id);
        } else {
            $ma_sp = $_GET['ma_sp'];
            $sql = "SELECT sp.*, dm.ten_danh_muc, nsx.ten_nha_san_xuat
                    FROM san_pham sp
                    LEFT JOIN danh_muc dm ON sp.id_danh_muc = dm.id
                    LEFT JOIN nha_san_xuat nsx ON sp.id_nha_san_xuat = nsx.id
                    WHERE sp.trang_thai = 1 AND sp.ma_sp = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('s', $ma_sp);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        if ($row) {
            // Lấy ảnh sản phẩm (dùng ma_sp)
            $imgSql = "SELECT url FROM anh_sp WHERE ma_sp = ? ORDER BY thu_tu ASC";
            $imgStmt = $conn->prepare($imgSql);
            $imgStmt->bind_param('s', $row['ma_sp']);
            $imgStmt->execute();
            $imgResult = $imgStmt->get_result();
            $images = [];
            while ($img = $imgResult->fetch_assoc()) {
                $images[] = $img['url'];
            }
            $row['images'] = $images;
            $imgStmt->close();

            // Lấy thông số kỹ thuật (dùng ma_sp)
            $specSql = "SELECT ten_thong_so, gia_tri_thong_so FROM thong_so WHERE ma_sp = ?";
            $specStmt = $conn->prepare($specSql);
            $specStmt->bind_param('s', $row['ma_sp']);
            $specStmt->execute();
            $specResult = $specStmt->get_result();
            $thong_so = [];
            while ($spec = $specResult->fetch_assoc()) {
                $thong_so[$spec['ten_thong_so']] = $spec['gia_tri_thong_so'];
            }
            $row['thong_so'] = $thong_so;
            $specStmt->close();

            // Parse các trường dạng JSON nếu có
            if (isset($row['tinh_nang']) && is_string($row['tinh_nang'])) {
                $row['tinh_nang'] = json_decode($row['tinh_nang'], true) ?: $row['tinh_nang'];
            }
            if (isset($row['thiet_bi_tuong_thich']) && is_string($row['thiet_bi_tuong_thich'])) {
                $row['thiet_bi_tuong_thich'] = json_decode($row['thiet_bi_tuong_thich'], true) ?: $row['thiet_bi_tuong_thich'];
            }

            // Đảm bảo luôn có trường gia_sau cho frontend
            $gia_sau = isset($row['gia_sau']) ? $row['gia_sau'] : (isset($row['gia']) ? $row['gia'] : null);
            if ($gia_sau === null || $gia_sau === '' || $gia_sau === '0' || $gia_sau === 0) {
                $row['gia_sau'] = null;
                $row['trang_thai_hang'] = 'Tạm hết hàng';
            } else {
                $row['gia_sau'] = $gia_sau;
                $row['trang_thai_hang'] = '';
            }
            if (!isset($row['gia_truoc']) || $row['gia_truoc'] === '' || $row['gia_truoc'] === '0' || $row['gia_truoc'] === 0) {
                $row['gia_truoc'] = null;
            }

            if (isset($row['ten_danh_muc'])) {
                $row['danh_muc'] = $row['ten_danh_muc'];
            } else {
                $row['danh_muc'] = null;
            }

            echo json_encode(['success' => true, 'data' => $row]);
        } else {
            http_response_code(404);
            if (isset($_GET['id'])) {
                echo json_encode(['success' => false, 'message' => 'Không tìm thấy sản phẩm với ID: ' . $_GET['id']]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Không tìm thấy sản phẩm với mã: ' . $_GET['ma_sp']]);
            }
        }
        $stmt->close();
    } else {
        $sql = "SELECT sp.*, dm.ten_danh_muc, nsx.ten_nha_san_xuat
                FROM san_pham sp
                LEFT JOIN danh_muc dm ON sp.id_danh_muc = dm.id
                LEFT JOIN nha_san_xuat nsx ON sp.id_nha_san_xuat = nsx.id
                WHERE sp.trang_thai = 1";
        $result = $conn->query($sql);
        $products = [];
        while ($row = $result->fetch_assoc()) {
            // Lấy ảnh sản phẩm (dùng ma_sp)
            $imgSql = "SELECT url FROM anh_sp WHERE ma_sp = ? ORDER BY thu_tu ASC";
            $imgStmt = $conn->prepare($imgSql);
            $imgStmt->bind_param('s', $row['ma_sp']);
            $imgStmt->execute();
            $imgResult = $imgStmt->get_result();
            $images = [];
            while ($img = $imgResult->fetch_assoc()) {
                $images[] = $img['url'];
            }
            $row['images'] = $images;
            $imgStmt->close();

            // Lấy thông số kỹ thuật (dùng ma_sp)
            $specSql = "SELECT ten_thong_so, gia_tri_thong_so FROM thong_so WHERE ma_sp = ?";
            $specStmt = $conn->prepare($specSql);
            $specStmt->bind_param('s', $row['ma_sp']);
            $specStmt->execute();
            $specResult = $specStmt->get_result();
            $thong_so = [];
            while ($spec = $specResult->fetch_assoc()) {
                $thong_so[$spec['ten_thong_so']] = $spec['gia_tri_thong_so'];
            }
            $row['thong_so'] = $thong_so;
            $specStmt->close();

            // Parse các trường dạng JSON nếu có
            if (isset($row['tinh_nang']) && is_string($row['tinh_nang'])) {
                $row['tinh_nang'] = json_decode($row['tinh_nang'], true) ?: $row['tinh_nang'];
            }
            if (isset($row['thiet_bi_tuong_thich']) && is_string($row['thiet_bi_tuong_thich'])) {
                $row['thiet_bi_tuong_thich'] = json_decode($row['thiet_bi_tuong_thich'], true) ?: $row['thiet_bi_tuong_thich'];
            }

            // Đảm bảo luôn có trường gia_sau cho frontend
            $gia_sau = isset($row['gia_sau']) ? $row['gia_sau'] : (isset($row['gia']) ? $row['gia'] : null);
            if ($gia_sau === null || $gia_sau === '' || $gia_sau === '0' || $gia_sau === 0) {
                $row['gia_sau'] = null;
                $row['trang_thai_hang'] = 'Tạm hết hàng';
            } else {
                $row['gia_sau'] = $gia_sau;
                $row['trang_thai_hang'] = '';
            }
            if (!isset($row['gia_truoc']) || $row['gia_truoc'] === '' || $row['gia_truoc'] === '0' || $row['gia_truoc'] === 0) {
                $row['gia_truoc'] = null;
            }

            if (isset($row['ten_danh_muc'])) {
                $row['danh_muc'] = $row['ten_danh_muc'];
            } else {
                $row['danh_muc'] = null;
            }

            $products[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $products]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Lỗi server: ' . $e->getMessage()]);
}
$conn->close();
