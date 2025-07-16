// ================================================================
// FILE CẤU HÌNH SẢN PHẨM HIỂN THỊ TRÊN TRANG CHỦ
// ================================================================
// Chỉ cần thay đổi các ma_sp bên dưới để thay đổi sản phẩm hiển thị
// Không cần biết code, chỉ cần thay đổi các mã sản phẩm
// ================================================================

// 🎯 BANNER CHÍNH (3 sản phẩm trượt ở đầu trang)
export const HERO_SLIDES = [
    'gpu001',        // Banner 1: Thay bằng ma_sp bạn muốn
    'cpu003',        // Banner 2: Thay bằng ma_sp bạn muốn  
    'peripheral004'  // Banner 3: Thay bằng ma_sp bạn muốn
];

// 🌟 SẢN PHẨM NỔI BẬT (6 sản phẩm)
export const FEATURED_PRODUCTS = [
    'kb001',      // Sản phẩm nổi bật 1: Thay bằng ma_sp bạn muốn
    'case009',    // Sản phẩm nổi bật 2: Thay bằng ma_sp bạn muốn
    'cpu003',     // Sản phẩm nổi bật 3: Thay bằng ma_sp bạn muốn
    'cool001',    // Sản phẩm nổi bật 4: Thay bằng ma_sp bạn muốn
    'mb002',      // Sản phẩm nổi bật 5: Thay bằng ma_sp bạn muốn
    'storage004'  // Sản phẩm nổi bật 6: Thay bằng ma_sp bạn muốn
];

// 🔥 SẢN PHẨM HOT (3 sản phẩm)
export const HOT_ITEMS = [
    'cpu001',     // Hot item 1: Thay bằng ma_sp bạn muốn
    'cpu006',     // Hot item 2: Thay bằng ma_sp bạn muốn
    'mb001'       // Hot item 3: Thay bằng ma_sp bạn muốn
];

// 📱 BANNER THƯƠNG HIỆU (3 banner nhỏ)
export const BRAND_BANNERS = [
    'peripheral004',  // Banner thương hiệu 1: Thay bằng ma_sp bạn muốn
    'mb007',          // Banner thương hiệu 2: Thay bằng ma_sp bạn muốn
    'psu001'          // Banner thương hiệu 3: Thay bằng ma_sp bạn muốn
];

// ================================================================
// HƯỚNG DẪN SỬ DỤNG:
// ================================================================
// 1. Tìm ma_sp của sản phẩm bạn muốn hiển thị (kiểm tra trong database)
// 2. Thay thế các ma_sp ở trên bằng ma_sp mới
// 3. Lưu file (Ctrl + S)
// 4. Website sẽ tự động cập nhật

// VÍ DỤ: Nếu bạn muốn thay đổi banner chính:
// HERO_SLIDES = [
//     'mouse001',    // Thay vì 'gpu001'
//     'keyboard002', // Thay vì 'cpu003'
//     'monitor003'   // Thay vì 'peripheral004'
// ];
// ================================================================
