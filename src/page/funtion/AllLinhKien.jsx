import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGift, FaTimes, FaSearch } from "react-icons/fa";

import LinhKien from "../../page/funtion/Linh_kien.json";
import "../../style/all_linh_kien.css";

const AllLinhKien = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showSelectedOptions, setShowSelectedOptions] = useState(false);
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOptions, searchTerm]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-bar')) {
        setActiveFilter(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      // If selecting a new category/brand/price range, remove the previous selection from same group
      let newSelectedOptions = [...selectedOptions];
      
      // Check which group the option belongs to
      if (categories.includes(option) && option !== "Tất cả loại hàng") {
        newSelectedOptions = newSelectedOptions.filter(item => !categories.includes(item) || item === "Tất cả loại hàng");
      } else if (brands.includes(option) && option !== "Tất cả hãng") {
        newSelectedOptions = newSelectedOptions.filter(item => !brands.includes(item) || item === "Tất cả hãng");
      } else if (priceRanges.includes(option) && option !== "Tất cả giá") {
        newSelectedOptions = newSelectedOptions.filter(item => !priceRanges.includes(item) || item === "Tất cả giá");
      }
      
      setSelectedOptions([...newSelectedOptions, option]);
    }
  };

  // Categories data
  const categories = [
    "Tất cả loại hàng",
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
  
  // Get unique brands from data
  const brands = [
    "Tất cả hãng",
    ...new Set(
      Object.values(LinhKien)
        .flatMap(category => Array.isArray(category) ? category.map(item => item.hang) : [])
        .filter(brand => brand) // Filter out undefined/null
    ),
  ];
  
  const priceRanges = [
    "Tất cả giá",
    "Dưới 2 triệu",
    "2-5 triệu",
    "5-10 triệu",
    "Trên 10 triệu",
  ];

  // Get active filters from selectedOptions
  const activeCategory =
    categories.find(
      (cat) => cat !== "Tất cả loại hàng" && selectedOptions.includes(cat)
    ) || "Tất cả loại hàng";
    
  const activeBrand =
    brands.find(
      (br) => br !== "Tất cả hãng" && selectedOptions.includes(br)
    ) || "Tất cả hãng";

  const activePrice =
    priceRanges.find(
      (price) => price !== "Tất cả giá" && selectedOptions.includes(price)
    ) || "Tất cả giá";

  // Get all products from all categories
  const allProducts = Object.values(LinhKien).flat();

  // Filter products based on search and selected options
  const filteredItems = allProducts.filter((product) => {
    if (!product.ten || !product.gia) {
      return false; // Skip invalid products
    }

    const matchesSearchTerm =
      !searchTerm ||
      product.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.hang && product.hang.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      activeCategory === "Tất cả loại hàng" ||
      (product.danh_muc && product.danh_muc.toLowerCase() === activeCategory.toLowerCase());

    const matchesBrand =
      activeBrand === "Tất cả hãng" || 
      (product.hang && product.hang === activeBrand);

    const productPrice = parseFloat(product.gia);
    const matchesPrice =
      activePrice === "Tất cả giá" ||
      (activePrice === "Dưới 2 triệu" && productPrice < 2000000) ||
      (activePrice === "2-5 triệu" &&
        productPrice >= 2000000 &&
        productPrice <= 5000000) ||
      (activePrice === "5-10 triệu" &&
        productPrice >= 5000000 &&
        productPrice <= 10000000) ||
      (activePrice === "Trên 10 triệu" && productPrice > 10000000);

    return matchesSearchTerm && matchesCategory && matchesBrand && matchesPrice;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Toggle filter dropdown
  const handleFilterClick = (filter) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  return (
    <div className="all-products-container">
      {/* Hero Banner */}
      <div className="hero-banner">
        <img
          src="/photos/a.jpg"
          alt="Linh kiện máy tính"
          className="hero-image"
        />
        <div className="hero-text">
          <h1 className="hero-title">Tất cả linh kiện máy tính</h1>
          <p className="hero-subtitle">
            Khám phá các linh kiện chất lượng hàng đầu cho máy tính của bạn
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          placeholder="Tìm kiếm linh kiện, thương hiệu, loại sản phẩm..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-left">
          <div
            className={`filter-item ${activeFilter === "Hãng" ? "active" : ""}`}
            onClick={() => handleFilterClick("Hãng")}
          >
            Hãng sản xuất
          </div>
          <div
            className={`filter-item ${activeFilter === "Giá" ? "active" : ""}`}
            onClick={() => handleFilterClick("Giá")}
          >
            Mức giá
          </div>
          <div
            className={`filter-item ${activeFilter === "Loại" ? "active" : ""}`}
            onClick={() => handleFilterClick("Loại")}
          >
            Loại linh kiện
          </div>
        </div>

        <div className="filter-right">
          {activeFilter === "Hãng" && (
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
          {activeFilter === "Giá" && (
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
          {activeFilter === "Loại" && (
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
      {selectedOptions.length > 0 && (
        <div className="selected-options">
          {selectedOptions.map((option) => (
            <div key={option} className="selected-item">
              {option}
              <button onClick={() => toggleOption(option)}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Products Count */}
      <div style={{ marginBottom: '20px', fontWeight: '500' }}>
        Đang hiển thị {currentItems.length} trong {filteredItems.length} sản phẩm
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {currentItems.length > 0 ? (
          currentItems.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={(Array.isArray(product.images) && product.images.length > 0) 
                    ? product.images[0] 
                    : "/photos/placeholder.jpg"}
                  alt={product.ten}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = "/photos/placeholder.jpg";
                  }}
                />
              </div>
              <div className="product-details">
                <h3 className="product-name">{product.ten}</h3>
                <p className="product-brand">{product.hang || "Không xác định"}</p>
                <p className="product-price">
                  {formatCurrency(product.gia)}
                </p>
                {product.bao_hanh && (
                  <p className="product-warranty">
                    {product.bao_hanh}
                  </p>
                )}
                {product.thiet_bi_tuong_thich && (
                  <p className="product-compatible">
                    {Array.isArray(product.thiet_bi_tuong_thich) 
                      ? product.thiet_bi_tuong_thich.join(", ") 
                      : product.thiet_bi_tuong_thich}
                  </p>
                )}
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
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '50px 0',
            color: '#666' 
          }}>
            Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Trước
          </button>
          
          {/* Display pagination numbers intelligently */}
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            // Always show first page, last page, current page, and pages around current
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`pagination-button ${currentPage === pageNumber ? "active" : ""}`}
                >
                  {pageNumber}
                </button>
              );
            }
            // Show ellipsis for gaps
            if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
              return <span key={pageNumber} style={{ margin: '0 8px' }}>...</span>;
            }
            return null;
          })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="pagination-button"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default AllLinhKien;
