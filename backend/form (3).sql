-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 28, 2025 at 02:27 PM
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
(13, 12, 'cpu003', 'AMD Ryzen 9 7950X3D', 'CPU', 1, 16500000, 'ship'),
(14, 12, 'mb001', 'ASUS ROG Strix Z790-E Gaming', 'Mainboard', 1, 10000000, 'ship'),
(15, 13, 'gpu001', 'NVIDIA GeForce RTX 4090', 'GPU', 1, 40000000, 'ship');

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
(4, 'cpu003', 'admin', 5, 'hello there\\n', '2025-04-28 00:00:00');

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
(10, 3, 'vip', '0987654321', 'hn', 'TP HCM', 'Quận 4', 'Phường 2', 0);

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
(12, 1, 8, 26500000, 'Chờ xử lý', '2025-04-28 10:22:03', 'giao vào buổi chiều'),
(13, 3, 9, 40000000, 'Chờ xử lý', '2025-04-28 10:27:00', 'tận cửa');

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
(5, 2, 'cpu001', 1, '2025-04-27 16:06:15'),
(6, 4, 'cpu001', 1, '2025-04-27 16:07:37');

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
(13, 4, 'ok hi', '2025-04-28', 'admin');

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
(12, 12, 'cod', 26500000, 'Chưa thanh toán', NULL, NULL, NULL),
(13, 13, 'cod', 40000000, 'Chưa thanh toán', NULL, NULL, NULL);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `dang_ky`
--
ALTER TABLE `dang_ky`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `danh_gia`
--
ALTER TABLE `danh_gia`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `dia_chi_giao_hang`
--
ALTER TABLE `dia_chi_giao_hang`
  MODIFY `ma_dia_chi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `don_hang`
--
ALTER TABLE `don_hang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `gio_hang`
--
ALTER TABLE `gio_hang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `khuyen_mai`
--
ALTER TABLE `khuyen_mai`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `phan_hoi_review`
--
ALTER TABLE `phan_hoi_review`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `thanh_toan`
--
ALTER TABLE `thanh_toan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

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
