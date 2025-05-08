-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 08, 2025 at 09:23 AM
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
-- Table structure for table `chi_tiet_don_hang`
--

CREATE TABLE `chi_tiet_don_hang` (
  `id` int NOT NULL,
  `ma_don_hang` int NOT NULL,
  `id_product` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ten_san_pham` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `danh_muc` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `so_luong` int NOT NULL,
  `gia` int NOT NULL,
  `phuong_thuc_van_chuyen` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ship'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chi_tiet_don_hang`
--

INSERT INTO `chi_tiet_don_hang` (`id`, `ma_don_hang`, `id_product`, `ten_san_pham`, `danh_muc`, `so_luong`, `gia`, `phuong_thuc_van_chuyen`) VALUES
(21, 18, 'mouse001', 'Logitech G Pro X Superlight', 'Peripherals', 1, 3750000, 'pickup'),
(22, 18, 'cpu001', 'Intel Core i9-13900K', 'CPU', 1, 14000000, 'pickup'),
(23, 19, 'mouse002', 'Razer DeathAdder V3 Pro', 'Peripherals', 1, 4000000, 'pickup'),
(25, 21, 'ram002', 'Corsair Vengeance DDR5 32GB', 'RAM', 1, 3400000, 'pickup'),
(26, 22, 'mb001', 'ASUS ROG Strix Z790-E Gaming', 'Mainboard', 6, 10000000, 'pickup'),
(29, 24, 'mb002', 'MSI MPG B650 Tomahawk WiFi', 'Mainboard', 1, 6500000, 'ship'),
(30, 25, 'mb002', 'MSI MPG B650 Tomahawk WiFi', 'Mainboard', 4, 6500000, 'ship'),
(31, 26, 'gpu001', 'NVIDIA GeForce RTX 4090', 'GPU', 2, 40000000, 'ship'),
(32, 27, 'cpu006', 'AMD Ryzen 9 7950X3D', 'CPU', 1, 16500000, 'pickup'),
(33, 28, 'storage002', 'WD Black SN850X 2TB', 'Storage', 1, 4500000, 'pickup'),
(34, 29, 'cpu005', 'CPU Intel Core i5 14500', 'CPU', 1, 66900000, 'pickup'),
(35, 30, 'cpu006', 'AMD Ryzen 9 7950X3D', 'CPU', 10, 16500000, 'pickup'),
(36, 31, 'peripheral010', 'Razer Basilisk V3 Pro 35K', 'Peripherals', 2, 3500000, 'pickup'),
(37, 32, 'cpu001', 'Intel Core i9-13900K', 'CPU', 3, 14000000, 'pickup'),
(38, 33, 'cpu001', 'Intel Core i9-13900K', 'CPU', 3, 14000000, 'pickup'),
(39, 34, 'cpu001', 'Intel Core i9-13900K', 'CPU', 3, 14000000, 'ship');

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
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dang_ky`
--

INSERT INTO `dang_ky` (`id`, `user`, `phone`, `email`, `pass`, `role`) VALUES
(1, 'ubuntu', '0987654333', 'ubuntu@gmail.com', '123456', 'user'),
(2, 'admin', '1234567890', 'admin@travelweb.com', '123456', 'admin'),
(3, 'test', '0123456789', 'test@gmail.com', '123456', 'user'),
(4, 'test123', '1111111112', 't@gmail.com', '123456', 'user'),
(6, 'test12345', '1111111114', 'test12434@gmail.com', '123456', 'user');

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
(7, 'cpu001', 'admin', 5, 'ok', '2025-05-06 00:00:00');

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
(27, 2, 'admin32', '7878987909', 'HCM', 'TP HCM', 'Quận 1', 'Phường 1', 0);

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
(33, 2, 26, 42030000, 'Chờ xử lý', '2025-05-08 08:02:56', ''),
(34, 2, 27, 42000000, 'Chờ xử lý', '2025-05-08 08:10:18', '');

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

--
-- Dumping data for table `gio_hang`
--

INSERT INTO `gio_hang` (`id`, `ma_nguoi_dung`, `id_product`, `so_luong`, `ngay_them`) VALUES
(3, 4, 'ram001', 1, '2025-04-27 14:31:54'),
(4, 4, 'cpu003', 1, '2025-04-27 15:18:18'),
(6, 4, 'cpu001', 1, '2025-04-27 16:07:37'),
(38, 2, 'cpu001', 1, '2025-05-08 15:44:40');

-- --------------------------------------------------------

--
-- Table structure for table `khuyen_mai`
--

CREATE TABLE `khuyen_mai` (
  `id` int NOT NULL,
  `ten_khuyen_mai` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mo_ta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date NOT NULL,
  `id_product` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `khuyen_mai`
--

INSERT INTO `khuyen_mai` (`id`, `ten_khuyen_mai`, `mo_ta`, `ngay_bat_dau`, `ngay_ket_thuc`, `id_product`) VALUES
(1, 'Tặng keo tản nhiệt Noctua NT-H1', 'Tặng keo tản nhiệt khi mua Intel Core i9-13900K', '2025-04-01', '2025-05-31', 'cpu001'),
(2, 'Giảm 5% combo GPU', 'Giảm 5% khi mua RTX 4090 cùng PSU 1000W', '2025-04-15', '2025-06-30', 'gpu001'),
(3, 'Tặng game AMD', 'Tặng mã game khi mua Radeon RX 7900 XTX', '2025-04-20', '2025-05-31', NULL);

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
(14, 5, 'seo', '2025-05-06', 'admin');

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
(18, 18, 'cod', 17780000, 'Chưa thanh toán', NULL, NULL, NULL),
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
(34, 34, 'cod', 42000000, 'Chưa thanh toán', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ton_kho`
--

CREATE TABLE `ton_kho` (
  `id_san_pham` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ten_san_pham` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `solg_trong_kho` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ton_kho`
--

INSERT INTO `ton_kho` (`id_san_pham`, `ten_san_pham`, `solg_trong_kho`) VALUES
('cpu001', 'Intel Core i9-13900K', 1),
('cpu002', 'Intel Core i9-14900K', 50),
('cpu003', 'Core Ultra 9 285K', 30),
('cpu004', 'Intel Core i7 14700K', 40),
('cpu005', 'Intel Core i5 14500', 20),
('cpu006', 'AMD Ryzen 9 7950X3D', 30),
('cpu007', 'AMD Ryzen 9 9950X', 25),
('cpu008', 'AMD Ryzen 7 5700X', 40),
('cpu009', 'AMD Ryzen 5 5600GT', 50),
('cpu010', 'AMD Ryzen 7 9800X3D', 30),
('mb001', 'ASUS ROG Strix Z790-E', 20),
('mb002', 'MSI MPG B650 Tomahawk', 25),
('mb003', 'ASUS TUF Gaming Z790', 20),
('mb004', 'ASUS TUF Gaming B760M', 30),
('mb005', 'MSI PRO Z790-S WIFI', 22),
('mb006', 'Gigabyte Z790M Aorus', 18),
('mb007', 'Asrock B760M Pro RS', 20),
('mb008', 'Gigabyte B760M Gaming', 25),
('mb009', 'ASRock B660M Pro RS', 30),
('mb010', 'MSI H610M-E DDR4', 40),
('ram001', 'G.Skill Trident Z5', 25),
('ram002', 'Corsair Vengeance DDR5', 30),
('ram003', 'Kingston Fury Beast', 20),
('ram004', 'TeamGroup T-Force', 25),
('ram005', 'G.Skill Ripjaws DDR4', 40),
('ram006', 'Corsair Dominator DDR5', 15),
('ram007', 'Crucial DDR5 16GB', 35),
('ram008', 'Corsair Vengeance DDR4', 30),
('ram009', 'Kingston Fury Renegade', 25),
('ram010', 'Crucial Ballistix DDR4', 40),
('gpu001', 'NVIDIA GeForce RTX 4090', 10),
('gpu002', 'AMD Radeon RX 7900 XTX', 15),
('gpu003', 'NVIDIA GeForce RTX 4080', 12),
('gpu004', 'AMD Radeon RX 7800 XT', 20),
('gpu005', 'NVIDIA GeForce RTX 4070', 25),
('gpu006', 'NVIDIA GeForce RTX 4060', 30),
('gpu007', 'AMD Radeon RX 7700 XT', 18),
('gpu008', 'NVIDIA GeForce RTX 3060', 35),
('gpu009', 'AMD Radeon RX 7600', 40),
('gpu010', 'NVIDIA GeForce GTX 1660', 50),
('storage001', 'Samsung 990 Pro 1TB', 50),
('storage002', 'WD Black SN850X 2TB', 40),
('storage003', 'Crucial MX500 1TB', 60),
('storage004', 'Samsung 870 EVO 2TB', 45),
('storage005', 'Seagate Barracuda 4TB', 30),
('storage006', 'Kingston NV2 1TB', 55),
('storage007', 'WD Blue 2TB', 50),
('storage008', 'Crucial P3 Plus 2TB', 35),
('storage009', 'Samsung 980 500GB', 60),
('storage010', 'Seagate IronWolf 8TB', 20),
('psu001', 'Corsair RM850x', 50),
('psu002', 'Seasonic Focus GX-1000', 40),
('psu003', 'EVGA SuperNOVA 750', 45),
('psu004', 'ASUS ROG Thor 1200W', 20),
('psu005', 'Cooler Master MWE 650', 60),
('psu006', 'Thermaltake Toughpower', 35),
('psu007', 'Gigabyte UD850GM', 50),
('psu008', 'Corsair CX550M', 70),
('psu009', 'Seasonic Prime TX-850', 25),
('psu010', 'EVGA BQ 600W', 80),
('cooling001', 'NZXT Kraken X63', 25),
('cooling002', 'Noctua NH-D15', 30),
('cooling003', 'Corsair H100i Elite', 20),
('cooling004', 'Cooler Master ML240L', 40),
('cooling005', 'DeepCool AK620', 35),
('cooling006', 'Arctic Freezer 34', 50),
('cooling007', 'Be Quiet! Pure Rock 2', 45),
('cooling008', 'Thermaltake UX100', 60),
('cooling009', 'Corsair iCUE H150i', 15),
('cooling010', 'Noctua NH-U12S', 50),
('case001', 'Lian Li PC-O11 Dynamic', 30),
('case002', 'NZXT H510 Flow', 40),
('case003', 'Fractal Design Meshify', 25),
('case004', 'Corsair 7000D Airflow', 20),
('case005', 'MSI MAG FORGE 120A', 49),
('case006', 'Corsair 2500X mATX', 22),
('case007', 'DeepCool CK560 3F', 83),
('case008', 'NZXT H9 Elite', 20),
('case009', 'Corsair ICUE 4000D', 30),
('case010', 'Xigmatek Aqua III', 51),
('mouse001', 'Logitech G Pro X', 80),
('kb001', 'Keychron K8 Pro', 45),
('mouse002', 'Razer DeathAdder V3', 50),
('peripheral003', 'Razer BlackWidow V4', 30),
('peripheral004', 'Logitech MX Master 3S', 40),
('peripheral005', 'SteelSeries Apex Pro', 35),
('peripheral006', 'Corsair K70 RGB MK.2', 50),
('peripheral007', 'HyperX Pulsefire Haste', 60),
('peripheral008', 'Logitech G502 X Plus', 45),
('peripheral009', 'Keychron K6', 50),
('peripheral010', 'Razer Basilisk V3 Pro', 40);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_don_hang` (`ma_don_hang`);

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
-- Indexes for table `gio_hang`
--
ALTER TABLE `gio_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gio_hang_ibfk_1` (`ma_nguoi_dung`);

--
-- Indexes for table `khuyen_mai`
--
ALTER TABLE `khuyen_mai`
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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `dang_ky`
--
ALTER TABLE `dang_ky`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `danh_gia`
--
ALTER TABLE `danh_gia`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `dia_chi_giao_hang`
--
ALTER TABLE `dia_chi_giao_hang`
  MODIFY `ma_dia_chi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `don_hang`
--
ALTER TABLE `don_hang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `gio_hang`
--
ALTER TABLE `gio_hang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `khuyen_mai`
--
ALTER TABLE `khuyen_mai`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `phan_hoi_review`
--
ALTER TABLE `phan_hoi_review`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `thanh_toan`
--
ALTER TABLE `thanh_toan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD CONSTRAINT `chi_tiet_don_hang_ibfk_1` FOREIGN KEY (`ma_don_hang`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE;

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
-- Constraints for table `phan_hoi_review`
--
ALTER TABLE `phan_hoi_review`
  ADD CONSTRAINT `phan_hoi_review_ibfk_1` FOREIGN KEY (`id_danh_gia`) REFERENCES `danh_gia` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `thanh_toan`
--
ALTER TABLE `thanh_toan`
  ADD CONSTRAINT `thanh_toan_ibfk_1` FOREIGN KEY (`ma_don_hang`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
