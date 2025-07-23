-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 14, 2025 at 02:24 PM
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
-- Table structure for table `anh_sp`
--

CREATE TABLE `anh_sp` (
  `id` int NOT NULL,
  `ma_sp` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  `thu_tu` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_don_hang`
--

CREATE TABLE `chi_tiet_don_hang` (
  `id` int NOT NULL,
  `ma_don_hang` int NOT NULL,
  `ma_sp` varchar(50) NOT NULL,
  `so_luong` int NOT NULL DEFAULT '1',
  `don_gia` decimal(12,2) NOT NULL,
  `giam_gia` decimal(12,2) DEFAULT '0.00',
  `thanh_tien` decimal(12,2) GENERATED ALWAYS AS ((`so_luong` * (`don_gia` - `giam_gia`))) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danh_gia`
--

CREATE TABLE `danh_gia` (
  `id` int NOT NULL,
  `ma_sp` varchar(50) NOT NULL,
  `ma_nguoi_dung` int NOT NULL,
  `so_sao` int NOT NULL,
  `binh_luan` text NOT NULL,
  `trang_thai` tinyint(1) DEFAULT '1' COMMENT '1: Hiển thị, 0: Ẩn',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danh_muc`
--

CREATE TABLE `danh_muc` (
  `id` int NOT NULL,
  `ten_danh_muc` varchar(100) NOT NULL,
  `mo_ta` text,
  `trang_thai` tinyint(1) DEFAULT '1',
  `ma_nguoi_tao` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dia_chi_giao_hang`
--

CREATE TABLE `dia_chi_giao_hang` (
  `ma_dia_chi` int NOT NULL,
  `ma_tk` int NOT NULL,
  `nguoi_nhan` varchar(100) NOT NULL,
  `sdt_nhan` varchar(20) NOT NULL,
  `dia_chi` text NOT NULL,
  `tinh_thanh` varchar(50) NOT NULL,
  `quan_huyen` varchar(50) NOT NULL,
  `phuong_xa` varchar(50) NOT NULL,
  `mac_dinh` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `don_hang`
--

CREATE TABLE `don_hang` (
  `id` int NOT NULL,
  `ma_nguoi_dung` int NOT NULL,
  `ma_dia_chi` int DEFAULT NULL,
  `tong_tien` decimal(12,2) NOT NULL,
  `phi_van_chuyen` decimal(12,2) DEFAULT '0.00',
  `trang_thai` varchar(50) DEFAULT 'Chờ xử lý',
  `ghi_chu` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hoa_don`
--

CREATE TABLE `hoa_don` (
  `id` int NOT NULL,
  `ma_don_hang` int NOT NULL,
  `ma_thanh_toan` int DEFAULT NULL,
  `noi_dung` text NOT NULL,
  `tong_tien` decimal(12,2) NOT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lien_he`
--

CREATE TABLE `lien_he` (
  `id` int NOT NULL,
  `ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `sdt` varchar(20) DEFAULT NULL,
  `noi_dung` text NOT NULL,
  `ma_nguoi_xu_ly` int DEFAULT NULL,
  `trang_thai` varchar(20) DEFAULT 'moi',
  `thoi_gian_gui` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `thoi_gian_xu_ly` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nha_san_xuat`
--

CREATE TABLE `nha_san_xuat` (
  `id` int NOT NULL,
  `ten_nha_san_xuat` varchar(100) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `mo_ta` text,
  `trang_thai` tinyint(1) DEFAULT '1',
  `ma_nguoi_tao` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phan_hoi_review`
--

CREATE TABLE `phan_hoi_review` (
  `id` int NOT NULL,
  `id_danh_gia` int NOT NULL,
  `ma_nguoi_tra_loi` int NOT NULL,
  `noi_dung` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `san_pham`
--

CREATE TABLE `san_pham` (
  `id` int NOT NULL,
  `ma_sp` varchar(50) NOT NULL COMMENT 'Mã sản phẩm',
  `ten_sp` varchar(255) NOT NULL,
  `gia_sau` decimal(12,2) NOT NULL,
  `gia_truoc` decimal(12,2) DEFAULT NULL,
  `so_luong` int NOT NULL DEFAULT '0',
  `bao_hanh` varchar(50) DEFAULT NULL,
  `mo_ta` text,
  `id_danh_muc` int DEFAULT NULL,
  `id_nha_san_xuat` int DEFAULT NULL,
  `trang_thai` tinyint(1) DEFAULT '1',
  `ma_nguoi_tao` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tai_khoan`
--

CREATE TABLE `tai_khoan` (
  `id` int NOT NULL,
  `user` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pass` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thanh_toan`
--

CREATE TABLE `thanh_toan` (
  `id` int NOT NULL,
  `ma_don_hang` int NOT NULL,
  `phuong_thuc` varchar(50) NOT NULL,
  `tong_tien` decimal(12,2) NOT NULL,
  `trang_thai` varchar(50) DEFAULT 'Chưa thanh toán',
  `ma_giao_dich` varchar(100) DEFAULT NULL,
  `thoi_gian_thanh_toan` datetime DEFAULT NULL,
  `thoi_gian_cap_nhat` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thong_so`
--

CREATE TABLE `thong_so` (
  `id` int NOT NULL,
  `ma_sp` varchar(50) NOT NULL,
  `ten_thong_so` varchar(100) NOT NULL,
  `gia_tri_thong_so` varchar(255) NOT NULL,
  `thu_tu` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `yeu_thich`
--

CREATE TABLE `yeu_thich` (
  `id` int NOT NULL,
  `ma_nguoi_dung` int NOT NULL,
  `ma_sp` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anh_sp`
--
ALTER TABLE `anh_sp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_sp` (`ma_sp`);

--
-- Indexes for table `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_don_hang` (`ma_don_hang`),
  ADD KEY `ma_sp` (`ma_sp`);

--
-- Indexes for table `danh_gia`
--
ALTER TABLE `danh_gia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_sp` (`ma_sp`),
  ADD KEY `ma_nguoi_dung` (`ma_nguoi_dung`);

--
-- Indexes for table `danh_muc`
--
ALTER TABLE `danh_muc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_nguoi_tao` (`ma_nguoi_tao`);

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
-- Indexes for table `hoa_don`
--
ALTER TABLE `hoa_don`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_don_hang` (`ma_don_hang`),
  ADD KEY `ma_thanh_toan` (`ma_thanh_toan`);

--
-- Indexes for table `lien_he`
--
ALTER TABLE `lien_he`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_nguoi_xu_ly` (`ma_nguoi_xu_ly`);

--
-- Indexes for table `nha_san_xuat`
--
ALTER TABLE `nha_san_xuat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_nguoi_tao` (`ma_nguoi_tao`);

--
-- Indexes for table `phan_hoi_review`
--
ALTER TABLE `phan_hoi_review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_danh_gia` (`id_danh_gia`),
  ADD KEY `ma_nguoi_tra_loi` (`ma_nguoi_tra_loi`);

--
-- Indexes for table `san_pham`
--
ALTER TABLE `san_pham`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_sp` (`ma_sp`),
  ADD KEY `fk_sp_danh_muc` (`id_danh_muc`),
  ADD KEY `fk_sp_nha_sx` (`id_nha_san_xuat`),
  ADD KEY `ma_nguoi_tao` (`ma_nguoi_tao`);

--
-- Indexes for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `thanh_toan`
--
ALTER TABLE `thanh_toan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_don_hang` (`ma_don_hang`);

--
-- Indexes for table `thong_so`
--
ALTER TABLE `thong_so`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ma_sp` (`ma_sp`);

--
-- Indexes for table `yeu_thich`
--
ALTER TABLE `yeu_thich`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favorite` (`ma_nguoi_dung`,`ma_sp`),
  ADD KEY `ma_sp` (`ma_sp`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anh_sp`
--
ALTER TABLE `anh_sp`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `danh_gia`
--
ALTER TABLE `danh_gia`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `danh_muc`
--
ALTER TABLE `danh_muc`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dia_chi_giao_hang`
--
ALTER TABLE `dia_chi_giao_hang`
  MODIFY `ma_dia_chi` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `don_hang`
--
ALTER TABLE `don_hang`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hoa_don`
--
ALTER TABLE `hoa_don`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lien_he`
--
ALTER TABLE `lien_he`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nha_san_xuat`
--
ALTER TABLE `nha_san_xuat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phan_hoi_review`
--
ALTER TABLE `phan_hoi_review`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `san_pham`
--
ALTER TABLE `san_pham`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thanh_toan`
--
ALTER TABLE `thanh_toan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thong_so`
--
ALTER TABLE `thong_so`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `yeu_thich`
--
ALTER TABLE `yeu_thich`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anh_sp`
--
ALTER TABLE `anh_sp`
  ADD CONSTRAINT `anh_sp_ibfk_1` FOREIGN KEY (`ma_sp`) REFERENCES `san_pham` (`ma_sp`) ON DELETE CASCADE;

--
-- Constraints for table `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD CONSTRAINT `chi_tiet_don_hang_ibfk_1` FOREIGN KEY (`ma_don_hang`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chi_tiet_don_hang_ibfk_2` FOREIGN KEY (`ma_sp`) REFERENCES `san_pham` (`ma_sp`) ON DELETE CASCADE;

--
-- Constraints for table `danh_gia`
--
ALTER TABLE `danh_gia`
  ADD CONSTRAINT `danh_gia_ibfk_1` FOREIGN KEY (`ma_sp`) REFERENCES `san_pham` (`ma_sp`) ON DELETE CASCADE,
  ADD CONSTRAINT `danh_gia_ibfk_2` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `danh_muc`
--
ALTER TABLE `danh_muc`
  ADD CONSTRAINT `danh_muc_ibfk_1` FOREIGN KEY (`ma_nguoi_tao`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `dia_chi_giao_hang`
--
ALTER TABLE `dia_chi_giao_hang`
  ADD CONSTRAINT `dia_chi_giao_hang_ibfk_1` FOREIGN KEY (`ma_tk`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `don_hang`
--
ALTER TABLE `don_hang`
  ADD CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `don_hang_ibfk_2` FOREIGN KEY (`ma_dia_chi`) REFERENCES `dia_chi_giao_hang` (`ma_dia_chi`) ON DELETE SET NULL;

--
-- Constraints for table `hoa_don`
--
ALTER TABLE `hoa_don`
  ADD CONSTRAINT `hoa_don_ibfk_1` FOREIGN KEY (`ma_don_hang`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hoa_don_ibfk_3` FOREIGN KEY (`ma_thanh_toan`) REFERENCES `thanh_toan` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `lien_he`
--
ALTER TABLE `lien_he`
  ADD CONSTRAINT `lien_he_ibfk_1` FOREIGN KEY (`ma_nguoi_xu_ly`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `nha_san_xuat`
--
ALTER TABLE `nha_san_xuat`
  ADD CONSTRAINT `nha_san_xuat_ibfk_1` FOREIGN KEY (`ma_nguoi_tao`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `phan_hoi_review`
--
ALTER TABLE `phan_hoi_review`
  ADD CONSTRAINT `phan_hoi_review_ibfk_1` FOREIGN KEY (`id_danh_gia`) REFERENCES `danh_gia` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `phan_hoi_review_ibfk_2` FOREIGN KEY (`ma_nguoi_tra_loi`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `san_pham`
--
ALTER TABLE `san_pham`
  ADD CONSTRAINT `fk_sp_danh_muc` FOREIGN KEY (`id_danh_muc`) REFERENCES `danh_muc` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sp_nha_sx` FOREIGN KEY (`id_nha_san_xuat`) REFERENCES `nha_san_xuat` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `san_pham_ibfk_1` FOREIGN KEY (`ma_nguoi_tao`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `thanh_toan`
--
ALTER TABLE `thanh_toan`
  ADD CONSTRAINT `thanh_toan_ibfk_1` FOREIGN KEY (`ma_don_hang`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `thong_so`
--
ALTER TABLE `thong_so`
  ADD CONSTRAINT `thong_so_ibfk_1` FOREIGN KEY (`ma_sp`) REFERENCES `san_pham` (`ma_sp`) ON DELETE CASCADE;

--
-- Constraints for table `yeu_thich`
--
ALTER TABLE `yeu_thich`
  ADD CONSTRAINT `yeu_thich_ibfk_1` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `tai_khoan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `yeu_thich_ibfk_2` FOREIGN KEY (`ma_sp`) REFERENCES `san_pham` (`ma_sp`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
