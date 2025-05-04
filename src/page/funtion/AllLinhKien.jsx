import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { FaGift } from "react-icons/fa";

import LinhKien from "../../page/funtion/Linh_kien";
import "../../style/all_linh_kien.css"; // Cập nhật CSS tương ứng

const AllLinhKien = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // Lấy danh sách danh mục và thương hiệu từ Linh_kien.js
  const categories = [
    "Tất cả loại hàng",
    "CPU",
    "Mainboard",
    "RAM",
    "Storage",
    "GPU",
    "PSU",
    "Cooling",
    "Case",
    "Peripherals",
  ];
  const brands = [
    "Tất cả hãng",
    ...new Set(
      Object.values(LinhKien).flatMap((category) =>
        category.map((item) => item.hang) // Sử dụng 'hang' thay vì 'brand'
      )
    ),
  ];
  const priceRanges = [
    "Tất cả giá",
    "Dưới 2 triệu",
    "2-5 triệu",
    "5-10 triệu",
    "Trên 10 triệu",
  ];
  const [hovered, setHovered] = useState("hang")

  // Cập nhật các bộ lọc từ selectedOptions
  const activeCategory =
    categories.find(
      (cat) => cat !== "Tất cả loại hàng" && selectedOptions.includes(cat)
    ) || "Tất cả loại hàng";

  const activeBrand =
    brands.find(
      (br) => br !== "Tất cả hãng" && selectedOptions.includes(br)
    ) || "Tất cả hãng";

  const activePrice =
    priceRanges.find(
      (price) => price !== "Tất cả giá" && selectedOptions.includes(price)
    ) || "Tất cả giá";

  const [hovered, setHovered] = useState("hang")

  // Lấy tất cả sản phẩm từ các danh mục
  const allProducts = Object.values(LinhKien).flat();

  // Lọc sản phẩm
  const filteredItems = allProducts.filter((product) => {
    const matchesSearchTerm =
      !searchTerm ||
      product.ten.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "Tất cả loại hàng" ||
      product.danh_muc?.toLowerCase() === activeCategory.toLowerCase();

    const matchesBrand =
      activeBrand === "Tất cả hãng" || product.hang === activeBrand;

    const matchesPrice =
      activePrice === "Tất cả giá" ||
      (activePrice === "Dưới 2 triệu" && product.gia < 2000000) ||
      (activePrice === "2-5 triệu" &&
        product.gia >= 2000000 &&
        product.gia <= 5000000) ||
      (activePrice === "5-10 triệu" &&
        product.gia >= 5000000 &&
        product.gia <= 10000000) ||
      (activePrice === "Trên 10 triệu" && product.gia > 10000000);

    return matchesSearchTerm && matchesCategory && matchesBrand && matchesPrice;
  });



  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="all-products-container">
      <div className="hero-banner">
        <img
          src="/photos/a.jpg"
          alt="Background"
          className="hero-image"
        />
        <div className="hero-text">
          <h1 className="hero-title">Tất cả linh kiện máy tính</h1>
          <p className="hero-subtitle">
            Khám phá các linh kiện chất lượng nhất
          </p>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          placeholder="Tìm kiếm linh kiện (CPU, RAM, GPU...)"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Bộ lọc */}
      <div className="filter-bar">
        <div className="filter-left">
          <div
            className={`filter-item ${hovered === "Hãng" ? "active" : ""}`}
            onMouseEnter={() => setHovered("Hãng")}
          >
            Hãng
          </div>
          <div
            className={`filter-item ${hovered === "Giá" ? "active" : ""}`}
            onMouseEnter={() => setHovered("Giá")}
          >
            Giá
          </div>
          <div
            className={`filter-item ${hovered === "Loại" ? "active" : ""}`}
            onMouseEnter={() => setHovered("Loại")}
          >
            Loại linh kiện
          </div>
        </div>

        <div className="filter-right">
          {hovered === "Hãng" && (
            <div className="filter-content">
              {brands.map((brand) => (
                <div
                  key={brand}
                  className={`filter-option ${selectedOptions.includes(brand) ? "selected" : ""}`}
                  onClick={() => toggleOption(brand)}
                >
                  {brand}
                </div>
              ))}
            </div>
          )}
          {hovered === "Giá" && (
            <div className="filter-content">
              {priceRanges.map((price) => (
                <div
                  key={price}
                  className={`filter-option ${selectedOptions.includes(price) ? "selected" : ""}`}
                  onClick={() => toggleOption(price)}
                >
                  {price}
                </div>
              ))}
            </div>
          )}
          {hovered === "Loại" && (
            <div className="filter-content">
              {categories.map((category) => (
                <div
                  key={category}
                  className={`filter-option ${selectedOptions.includes(category) ? "selected" : ""}`}
                  onClick={() => toggleOption(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Options Display */}
      <div className="selected-options">
        {selectedOptions.map((option) => (
          <div key={option} className="selected-item">
            {option}
            <button onClick={() => toggleOption(option)}>✕</button>
          </div>
        ))}
      </div>


      {/* Danh sách sản phẩm */}
      <div className="products-grid">
        {currentItems.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img
                src={product.images[0] || "https://example.com/placeholder.jpg"}
                alt={product.ten}
                className="product-image"
              />
            </div>
            <div className="product-details">
              <h3 className="product-name">{product.ten}</h3>
              <p className="product-brand">Thương hiệu: {product.hang}</p>
              <p className="product-price">
                {product.gia.toLocaleString("vi-VN")} VNĐ
              </p>
              <p className="product-warranty">
                Bảo hành: {product.bao_hanh}
              </p>
              <p className="product-compatible">
                Tương thích: {product.thiet_bi_tuong_thich.join(", ")}
              </p>
              {product.khuyen_mai && (
                <p className="product-sale">
                  <FaGift style={{ marginRight: "6px" }} />
                  {product.khuyen_mai}
                </p>
              )}
              <button
                className="details-button"
                onClick={() => navigate(`/linh-kien/${product.id}`)}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Trước
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? "active" : ""
              }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default AllLinhKien;
