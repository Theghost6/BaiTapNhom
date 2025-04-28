import React, { useState } from "react";
import { useNavigate } from "react-router-dom";import { Star } from "lucide-react";
import LinhKien from "../../page/funtion/Linh_kien";
import "../../style/all_linh_kien.css"; // Cập nhật CSS tương ứng

const AllLinhKien = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Bộ lọc
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [selectedPrice, setSelectedPrice] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách danh mục và thương hiệu từ Linh_kien.js
  const categories = [
    "Tất cả",
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
    "Tất cả",
    ...new Set(
      Object.values(LinhKien).flatMap((category) =>
        category.map((item) => item.hang) // Sử dụng 'hang' thay vì 'brand'
      )
    ),
  ];
  const priceRanges = [
    "Tất cả",
    "Dưới 2 triệu",
    "2-5 triệu",
    "5-10 triệu",
    "Trên 10 triệu",
  ];
  const [hovered, setHovered] = useState("hang")

  // Lấy tất cả sản phẩm từ các danh mục
  const allProducts = Object.values(LinhKien).flat();

  // Lọc sản phẩm
  const filteredItems = allProducts.filter((product) => {
    const matchesSearchTerm =
      !searchTerm ||
      product.ten.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" ||
      Object.keys(products).find((key) =>
        products[key].some((item) => item.id === product.id)
      )?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesBrand =
      selectedBrand === "Tất cả" || product.hang === selectedBrand;
    const matchesPrice =
      selectedPrice === "Tất cả" ||
      (selectedPrice === "Dưới 2 triệu" && product.gia < 2000000) ||
      (selectedPrice === "2-5 triệu" &&
        product.gia >= 2000000 &&
        product.gia <= 5000000) ||
      (selectedPrice === "5-10 triệu" &&
        product.gia >= 5000000 &&
        product.gia <= 10000000) ||
      (selectedPrice === "Trên 10 triệu" && product.gia > 10000000);

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
          src="https://example.com/computer-components.jpg"
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
                  className="filter-option"
                  onClick={() => {
                    setSelectedBrand(brand);
                    setCurrentPage(1);
                  }}
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
                  className="filter-option"
                  onClick={() => {
                    setSelectedPrice(price);
                    setCurrentPage(1);
                  }}
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
                  className="filter-option"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>
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
                <p className="product-sale">{product.khuyen_mai}</p>
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
