import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGift, FaTimes, FaSearch, FaFilter, FaStar } from "react-icons/fa";
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
  // const fallbackImages = [
  //   "https://tinhocanhphat.vn/media/lib/28-02-2023/may-tinh-do-hoa.jpg",
  //   "https://no1computer.vn/upload_images/images/CPU/Chip%20hi%E1%BB%87u%20n%C4%83ng%20cao/i9/i9-13900HX/core-i9-13900HX.jpg",
  //   "https://file.hstatic.net/200000053304/article/file_psd_banner_fb__6000018b277c40ec82da58cedf0ee4ea.png",
  //   "https://kimlongcenter.com/upload/news/huong-dan-build-cau-hinh-pc-choi-game-cho-sinh-vien-2024_4.jpg"
  // ];

  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const apiUrl = import.meta.env.VITE_HOST;
  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      setBannerError(null);

      try {
        console.log('Fetching bmanners...');
        const response = await fetch(`  ${apiUrl}/tt_home.php?path=banner`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const activeBanners = data.data
            .filter(item => item.trang_thai == 1) // Use == for loose comparison
            .sort((a, b) => parseInt(a.thu_tu) - parseInt(b.thu_tu))
            .map(item => item.hinh_anh);

          console.log('Active banners:', activeBanners);
          setBanners(activeBanners.length > 0 ? activeBanners : []);
        } else {
          console.error('API returned error:', data);
          setBannerError(data.error || 'Failed to load banners');
          // setBanners(fallbackImages);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setBannerError('Error fetching banners: ' + error.message);
        // setBanners(fallbackImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="banner-ad">
      {isLoading ? (
        <div className="banner-loading" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Đang tải banner...
        </div>
      ) : bannerError ? (
        <div className="banner-error" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          {bannerError}
        </div>
      ) : (
        <div className="slider-container">
          <button className="prev-btn" onClick={prevSlide}>❮</button>
          <div className="slider-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {banners.map((src, index) => (
              <img key={index} src={src} alt={`Banner ${index + 1}`} className="slider-image" />
            ))}
          </div>
          <button className="next-btn" onClick={nextSlide}>❯</button>
        </div>
      )}
    </div>
  );
};

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
  } = useAllLinhKienLogic();

  return (
    <div className="all-products-container">
      <div className="hero-banner">
        <img src="/photos/a.jpg" alt="Linh kiện máy tính" className="hero-image" />
        <div className="hero-text">
          <h1 className="hero-title">Tất cả linh kiện máy tính</h1>
          <p className="hero-subtitle">Khám phá các linh kiện chất lượng hàng đầu cho máy tính của bạn</p>
        </div>
      </div>

      <BannerAd />

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
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-left">
          <div className="filter-label">
            <FaFilter style={{ marginRight: '8px' }} />
            Bộ lọc:
          </div>
          <div
            className={`filter-item ${activeFilter === "Loại" ? "active" : ""}`}
            onClick={() => handleFilterClick("Loại")}
          >
            Loại linh kiện
            {activeCategory !== "Tất cả loại hàng" && (
              <span className="filter-active-indicator">({activeCategory})</span>
            )}
          </div>
          <div
            className={`filter-item ${activeFilter === "Hãng" ? "active" : ""}`}
            onClick={() => handleFilterClick("Hãng")}
          >
            Hãng sản xuất
            {activeBrand !== "Tất cả hãng" && (
              <span className="filter-active-indicator">({activeBrand})</span>
            )}
          </div>
          <div
            className={`filter-item ${activeFilter === "Giá" ? "active" : ""}`}
            onClick={() => handleFilterClick("Giá")}
          >
            Mức giá
            {activePrice !== "Tất cả giá" && (
              <span className="filter-active-indicator">({activePrice})</span>
            )}
          </div>
          <div
            className={`filter-item ${activeFilter === "Sắp xếp" ? "active" : ""}`}
            onClick={() => handleFilterClick("Sắp xếp")}
          >
            Sắp xếp
            {(sortOrder === "lowToHigh" || sortOrder === "highToLow") && (
              <span className="filter-active-indicator">
                ({sortOrder === "lowToHigh" ? "Giá Thấp - Cao" : "Giá Cao - Thấp"})
              </span>
            )}
          </div>
          {(selectedOptions.length > 0 || sortOrder !== "default") && (
            <button className="clear-filters" onClick={clearAllFilters}>
              Xóa tất cả
            </button>
          )}
        </div>

        {activeFilter && (
          <div className="filter-right">
            <div className="filter-header">
              <button onClick={() => setActiveFilter(null)}>
                <FaTimes />
              </button>
            </div>
            {activeFilter === "Hãng" && (
              <div className="filter-content">
                {brands.map((brand) => (
                  <div
                    key={brand}
                    className={`filter-option ${selectedOptions.includes(brand) ? "selected" : ""}`}
                    onClick={() => toggleOption(brand)}
                  >
                    {brand}
                    {selectedOptions.includes(brand) && <FaTimes className="remove-icon" />}
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
                    {selectedOptions.includes(price) && <FaTimes className="remove-icon" />}
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
                    {selectedOptions.includes(category) && <FaTimes className="remove-icon" />}
                  </div>
                ))}
              </div>
            )}
            {activeFilter === "Sắp xếp" && (
              <div className="filter-content">
                <div
                  className={`filter-option ${sortOrder === "lowToHigh" ? "selected" : ""}`}
                  onClick={() => handleSortChange("lowToHigh")}
                >
                  Giá Thấp - Cao
                  {sortOrder === "lowToHigh" && <FaTimes className="remove-icon" />}
                </div>
                <div
                  className={`filter-option ${sortOrder === "highToLow" ? "selected" : ""}`}
                  onClick={() => handleSortChange("highToLow")}
                >
                  Giá Cao - Thấp
                  {sortOrder === "highToLow" && <FaTimes className="remove-icon" />}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {(selectedOptions.length > 0 || sortOrder !== "default") && (
        <SelectedOptions
          selectedOptions={selectedOptions}
          sortOrder={sortOrder}
          toggleOption={toggleOption}
          handleSortChange={handleSortChange}
        />
      )}

      <div className="products-count-zone">
        <div className="results-header">
          <div className="results-info">
            <span className="results-count">
              Hiển thị <strong>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedItems.length)}</strong> trong <strong>{sortedItems.length}</strong> sản phẩm
            </span>
            {(searchTerm || selectedOptions.length > 0 || sortOrder !== "default") && (
              <span className="search-info">
                {searchTerm && `cho "${searchTerm}"`}
                {selectedOptions.length > 0 && ` với ${selectedOptions.length} bộ lọc`}
                {sortOrder !== "default" && ` sắp xếp ${sortOrder === "lowToHigh" ? "Giá Thấp - Cao" : "Giá Cao - Thấp"}`}
              </span>
            )}
          </div>
        </div>

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
                  const related = suggestRelatedProducts();
                  console.log('Related products:', related);
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
                        {/* Debug: Hiển thị toàn bộ thông tin sản phẩm */}
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
      </div>

      {totalPages > 1 && (
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
  );
};

export default AllLinhKien;
