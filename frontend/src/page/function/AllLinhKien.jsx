import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGift, FaTimes, FaSearch, FaFilter, FaStar } from "react-icons/fa";
import { PacmanLoader } from "react-spinners";
import { useAllLinhKienLogic } from "../../hooks/alllinhkien/useAllLinhKienLogic";
import "../../style/all_linh_kien.css";

// Utility function for formatting currency
const formatCurrency = (amount) => {
  const validAmount = typeof amount === 'number' ? amount : (typeof amount === 'object' && amount.value ? amount.value : 0);
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(validAmount);
};

const normalizeText = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

// Properly define SelectedOptions as a functional component
const SelectedOptions = ({ selectedOptions, sortOrder, toggleOption, handleSortChange }) => (
  <div className="selected-options">
    <span className="selected-label">Đã chọn:</span>
    {selectedOptions.map((option) => (
      <div key={option} className="selected-item" onClick={() => toggleOption(option)}>
        {option}
        {selectedOptions.includes(option) && <FaTimes className="remove-icon" />}
      </div>
    ))}
    {sortOrder === "lowToHigh" && (
      <div className="selected-item">
        Giá Thấp - Cao
        <button onClick={() => handleSortChange("default")}>
          <FaTimes className="remove-icon" />
        </button>
      </div>
    )}
    {sortOrder === "highToLow" && (
      <div className="selected-item">
        Giá Cao - Thấp
        <button onClick={() => handleSortChange("default")}>
          <FaTimes className="remove-icon" />
        </button>
      </div>
    )}
  </div>
);

const BannerAd = () => {
  const fallbackImages = [
    "https://tinhocanhphat.vn/media/lib/28-02-2023/may-tinh-do-hoa.jpg",
    "https://hanoicomputercdn.com/media/category/cb_75ff8d6ff1f6f3eb0aaa2a201b374ac0.png",
    "https://file.hstatic.net/200000053304/article/file_psd_banner_fb__6000018b277c40ec82da58cedf0ee4ea.png",
    "https://kimlongcenter.com/upload/news/huong-dan-build-cau-hinh-pc-choi-game-cho-sinh-vien-2024_4.jpg",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:350/q:90/plain/https://dashboard.cellphones.com.vn/storage/PC%20CPS_1920x193.png",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:350/q:90/plain/https://dashboard.cellphones.com.vn/storage/pc-10-trieu-desktop-15-11.png"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fallbackImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + fallbackImages.length) % fallbackImages.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [fallbackImages.length]);

  return (
    <div className="banner-ad">
      <div className="slider-container">
        <button className="prev-btn" onClick={prevSlide}>❮</button>
        <div className="slider-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {fallbackImages.map((src, index) => (
            <img key={index} src={src} alt={`Banner ${index + 1}`} className="slider-image" />
          ))}
        </div>
        <button className="next-btn" onClick={nextSlide}>❯</button>
      </div>
    </div>
  );
};

// Component Loading Skeleton
const ProductCardSkeleton = () => (
  <div className="product-card skeleton">
    <div className="product-image-container skeleton-shimmer">
      <div className="skeleton-image"></div>
    </div>
    <div className="product-details">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-price"></div>
      <div className="skeleton-line skeleton-specs"></div>
    </div>
  </div>
);

const LoadingGrid = () => (
  <div className="loading-container">
    <PacmanLoader
      color="#ff6b35"
      size={25}
      cssOverride={{
        display: "block",
        margin: "50px auto",
      }}
    />
    <p className="loading-text">Đang tải sản phẩm...</p>
  </div>
);

// Rest of the AllLinhKien component remains unchanged
const AllLinhKien = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    isSearchExpanded,
    setIsSearchExpanded,
    selectedOptions,
    setSelectedOptions,
    activeFilter,
    setActiveFilter,
    sortOrder,
    setSortOrder,
    categories,
    brands,
    priceRanges,
    activeCategory,
    activeBrand,
    activePrice,
    toggleOption,
    handleFilterClick,
    clearAllFilters,
    handleSortChange,
    currentItems,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    sortedItems,
    handleProductClick,
    suggestRelatedProducts,
    currentPage,
    handlePageChange,
    allProducts,
    loading, // Thêm loading state từ hook
  } = useAllLinhKienLogic();

  // State tạm thời cho filter sidebar
  const [sidebarCategory, setSidebarCategory] = useState("");
  const [sidebarBrand, setSidebarBrand] = useState("");
  const [sidebarPrice, setSidebarPrice] = useState("");
  // const [sidebarRating, setSidebarRating] = useState(""); // Bỏ đánh giá
  const [sidebarStatus, setSidebarStatus] = useState("");

  // Accordion state cho từng nhóm filter
  const [openSection, setOpenSection] = useState('category');
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const handleClearSidebarFilters = () => {
    setSidebarCategory("");
    setSidebarBrand("");
    setSidebarPrice("");
    // setSidebarRating(""); // Bỏ đánh giá
    setSidebarStatus("");
    setSelectedOptions([]);
  };

  // Khi bấm Áp dụng, cập nhật selectedOptions dựa trên các filter sidebar
  const handleApplySidebarFilters = () => {
    const newOptions = [];
    if (sidebarCategory) newOptions.push(sidebarCategory);
    if (sidebarBrand) newOptions.push(sidebarBrand);
    if (sidebarPrice) newOptions.push(sidebarPrice);
    if (sidebarStatus) newOptions.push(sidebarStatus);
    setSelectedOptions(newOptions);
    setActiveFilter(null);
  };

  // Hàm xóa từng filter đã chọn
  const handleRemoveSelectedFilter = (filter) => {
    if (categories.includes(filter)) setSidebarCategory("");
    if (brands.includes(filter)) setSidebarBrand("");
    if (priceRanges.includes(filter)) setSidebarPrice("");
    if (["Còn hàng", "Hết hàng"].includes(filter)) setSidebarStatus("");
    // Cập nhật selectedOptions
    setSelectedOptions(selectedOptions.filter(opt => opt !== filter));
  };

  return (
    <div className="all-products-page">
      <div className="hero-banner">
        <img src="/photos/a.jpg" alt="Linh kiện máy tính" className="hero-image" />
        <div className="hero-text">
          <h1 className="hero-title">Tất cả linh kiện máy tính</h1>
          <p className="hero-subtitle">Khám phá các linh kiện chất lượng hàng đầu cho máy tính của bạn</p>
        </div>
      </div>
      <BannerAd />
      <div className="all-products-layout">
        <aside className="sidebar-filter">
          <div className="sidebar-title">Bộ lọc sản phẩm</div>
          {/* Hiển thị filter đã chọn */}
          {(sidebarCategory || sidebarBrand || sidebarPrice || sidebarStatus) && (
            <div className="selected-filters">
              {sidebarCategory && (
                <span className="selected-filter-chip" onClick={() => handleRemoveSelectedFilter(sidebarCategory)}>
                  {sidebarCategory} <FaTimes className="remove-icon" />
                </span>
              )}
              {sidebarBrand && (
                <span className="selected-filter-chip" onClick={() => handleRemoveSelectedFilter(sidebarBrand)}>
                  {sidebarBrand} <FaTimes className="remove-icon" />
                </span>
              )}
              {sidebarPrice && (
                <span className="selected-filter-chip" onClick={() => handleRemoveSelectedFilter(sidebarPrice)}>
                  {sidebarPrice} <FaTimes className="remove-icon" />
                </span>
              )}
              {sidebarStatus && (
                <span className="selected-filter-chip" onClick={() => handleRemoveSelectedFilter(sidebarStatus)}>
                  {sidebarStatus} <FaTimes className="remove-icon" />
                </span>
              )}
            </div>
          )}
          {/* Loại sản phẩm */}
          <div className="sidebar-section">
            <div className="sidebar-section-title" onClick={() => setOpenSection(openSection === 'category' ? '' : 'category')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Loại sản phẩm <span>{openSection === 'category' ? '▲' : '▼'}</span>
            </div>
            {openSection === 'category' && (
              <div>
                {(showAllCategories ? categories.filter(c => c !== "Tất cả loại hàng") : categories.filter(c => c !== "Tất cả loại hàng").slice(0, 5)).map((cat) => (
                  <label key={cat} className="sidebar-filter-label">
                    <input
                      type="radio"
                      name="sidebarCategory"
                      checked={sidebarCategory === cat}
                      onChange={() => setSidebarCategory(cat)}
                    />
                    {cat}
                  </label>
                ))}
                {categories.length > 6 && (
                  <button className="sidebar-more-btn" onClick={() => setShowAllCategories(v => !v)}>
                    {showAllCategories ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Hãng */}
          <div className="sidebar-section">
            <div className="sidebar-section-title" onClick={() => setOpenSection(openSection === 'brand' ? '' : 'brand')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Hãng <span>{openSection === 'brand' ? '▲' : '▼'}</span>
            </div>
            {openSection === 'brand' && (
              <div>
                {(showAllBrands ? brands.filter(b => b !== "Tất cả hãng") : brands.filter(b => b !== "Tất cả hãng").slice(0, 5)).map((brand) => (
                  <label key={brand} className="sidebar-filter-label">
                    <input
                      type="radio"
                      name="sidebarBrand"
                      checked={sidebarBrand === brand}
                      onChange={() => setSidebarBrand(brand)}
                    />
                    {brand}
                  </label>
                ))}
                {brands.length > 6 && (
                  <button className="sidebar-more-btn" onClick={() => setShowAllBrands(v => !v)}>
                    {showAllBrands ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Mức giá */}
          <div className="sidebar-section">
            <div className="sidebar-section-title" onClick={() => setOpenSection(openSection === 'price' ? '' : 'price')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Mức giá <span>{openSection === 'price' ? '▲' : '▼'}</span>
            </div>
            {openSection === 'price' && (
              <div>
                {priceRanges.filter(p => p !== "Tất cả giá").map((price) => (
                  <label key={price} className="sidebar-filter-label">
                    <input
                      type="radio"
                      name="sidebarPrice"
                      checked={sidebarPrice === price}
                      onChange={() => setSidebarPrice(price)}
                    />
                    {price}
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* Trạng thái hàng */}
          <div className="sidebar-section">
            <div className="sidebar-section-title" onClick={() => setOpenSection(openSection === 'status' ? '' : 'status')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Trạng thái hàng <span>{openSection === 'status' ? '▲' : '▼'}</span>
            </div>
            {openSection === 'status' && (
              <div>
                {["Còn hàng", "Hết hàng"].map((status) => (
                  <label key={status} className="sidebar-filter-label">
                    <input
                      type="radio"
                      name="sidebarStatus"
                      checked={sidebarStatus === status}
                      onChange={() => setSidebarStatus(status)}
                    />
                    {status}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="sidebar-apply-btn" onClick={handleApplySidebarFilters}>Áp dụng</button>
            <button className="sidebar-clear-btn" onClick={handleClearSidebarFilters}>Xóa tất cả</button>
          </div>
        </aside>
        <main className="main-content">
          {/* Giữ lại search bar */}
          <div className="search-bar">
            <div className={`search-input-container ${isSearchExpanded ? 'expanded' : 'collapsed'}`}>
              <FaSearch
                className="search-icon"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              />
              <input
                type="text"
                value={searchTerm}
                placeholder="Tìm kiếm linh kiện, thương hiệu, loại sản phẩm..."
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setCurrentPage(1)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}> <FaTimes /> </button>
              )}
            </div>
          </div>
          {/* XÓA filter-bar, SelectedOptions, clear-all-button ở main-content */}
          <div className="products-count-zone">
            <div className="results-header">
              <div className="results-info">
                <span className="results-count">
                  Hiển thị <strong>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedItems.length)}</strong> trong <strong>{sortedItems.length}</strong> sản phẩm
                </span>
                {searchTerm && (
                  <span className="search-info">cho "{searchTerm}"</span>
                )}
              </div>
            </div>
            {/* Products grid */}
            <div className="products-main-area">
              <div className="products-grid-area">
                {loading ? (
                  <LoadingGrid />
                ) : (
                  <div className="products-grid">
                    {currentItems.length > 0 ? (
                      currentItems.map((product, index) => {
                        // const originalPrice = product.gia_sau || product.gia * 1.1;
                        const originalPrice = product.gia_sau;
                        const discountPercent = product.khuyen_mai ? parseInt(product.khuyen_mai) : Math.round(((originalPrice - product.gia) / originalPrice) * 100);

                        return (
                          <div
                            key={`${product.id}-${index}`}
                            className="product-card clickable"
                            onClick={() => handleProductClick(product.id)}
                          >
                            <div className="product-image-container">
                              {discountPercent > 0 && (
                                <div className="discount-badge">
                                  Giảm {discountPercent}%
                                </div>
                              )}
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
                              {product.thong_so && (
                                <div className="product-specs">
                                  {product.loai === "CPU" && product.thong_so.cores && (
                                    <div>{product.thong_so.cores} cores</div>
                                  )}
                                  {product.loai === "Mainboard" && product.thong_so.memorySlots && (
                                    <div>{product.thong_so.memorySlots} RAM slots</div>
                                  )}
                                  {product.loai === "RAM" && product.thong_so.dung_luong && (
                                    <div>{product.thong_so.dung_luong} RAM </div>
                                  )}
                                  {product.loai === "Storage" && (
                                    <div>{product.thong_so.toc_do_doc} </div>
                                  )}
                                  {product.loai === "GPU" && (
                                    <div>{product.thong_so.Chipset} </div>
                                  )}
                                  {product.loai === "PSU" && (
                                    <div> Max {product.thong_so.cong_suat_nguon} </div>
                                  )}
                                  {product.loai === "Cooling" && (
                                    <div> {product.thong_so.loai_tan_nhiet} </div>
                                  )}
                                  {product.loai === "Peripherals" && (
                                    <div> {product.thong_so.type} </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="product-details">
                              <h3 className="product-name" title={product.ten_sp}>
                                {product.ten_sp}
                              </h3>
                              <div className="product-price-container">
                                <p className="product-price discounted">
                                  {!product.gia_sau || parseFloat(product.gia_sau) === 0
                                    ? <span className="out-of-stock">Tạm hết hàng</span>
                                    : <span className="product-price">{Number(product.gia_sau).toLocaleString()}₫</span>
                                  }
                                </p>
                                {product.gia_truoc && product.gia_sau !== null && product.gia_sau !== undefined && Number(product.gia_truoc) > Number(product.gia_sau) && (
                                  <p className="product-price original" style={{ textDecoration: 'line-through', color: '#888', marginLeft: 8 }}>
                                    {formatCurrency(Number(product.gia_truoc))}
                                  </p>
                                )}
                              </div>
                              {product.gia_truoc && product.gia_sau !== null && product.gia_sau !== undefined && Number(product.gia_truoc) > Number(product.gia_sau) && (
                                <div className="product-member-discount" style={{ color: '#000', fontWeight: 500 }}>
                                  Tiết kiệm thêm {formatCurrency(Number(product.gia_truoc) - Number(product.gia_sau))} cho Smembe
                                </div>
                              )}
                              {product.rating && (
                                <div className="product-rating">
                                  {renderStars(product.rating)}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="empty-state">
                        <img src="/photos/empty-search.svg" alt="Không tìm thấy" />
                        <h3>Không tìm thấy sản phẩm phù hợp</h3>
                        <p>Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc</p>
                        {(searchTerm || selectedOptions.length > 0 || sortOrder !== "default") && (
                          <button className="clear-all-button" onClick={clearAllFilters}>
                            Xóa tất cả bộ lọc
                          </button>
                        )}
                        <h4>Có thể bạn quan tâm:</h4>
                        <div className="related-products">
                          {(() => {
                            let related = [];
                            if (sortedItems.length > 0) {
                              // Lấy sản phẩm liên quan dựa trên sản phẩm đầu tiên của kết quả lọc
                              related = suggestRelatedProducts(sortedItems[0]);
                            } else if (allProducts.length > 0) {
                              // Nếu không có sản phẩm lọc, random 4 sản phẩm bất kỳ
                              related = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 4);
                            }
                            return related.map((product, index) => (
                              <div
                                key={`${product.id}-${index}`}
                                className="product-card clickable"
                                onClick={() => handleProductClick(product.id)}
                              >
                                <div className="product-image-container">
                                  <img
                                    src={(Array.isArray(product.images) && product.images.length > 0)
                                      ? product.images[0]
                                      : "/photos/placeholder.jpg"}
                                    alt={product.ten_sp}
                                    className="product-image"
                                    onError={(e) => {
                                      e.target.src = "/photos/placeholder.jpg";
                                    }}
                                  />
                                </div>
                                <div className="product-details">
                                  <h3 className="product-name" title={product.ten_sp}>
                                    {product.ten_sp}
                                  </h3>
                                  <pre style={{ fontSize: '10px', color: '#888', background: '#f7f7f7', padding: 4, borderRadius: 4, margin: 0, overflowX: 'auto' }}>
                                    {JSON.stringify(product, null, 2)}
                                  </pre>
                                  <p className="product-price">
                                    {product.gia_sau === null || product.gia_sau === undefined ? (
                                      product.trang_thai_hang || 'Tạm hết hàng'
                                    ) : product.gia_sau ? formatCurrency(Number(product.gia_sau))
                                      : product.gia ? formatCurrency(Number(product.gia))
                                        : 'Liên hệ'}
                                  </p>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {!loading && totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-button prev-next"
                    >
                      ← Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;
                      const showPage = pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2);
                      if (showPage) {
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
                      return null;
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-button prev-next"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllLinhKien;
