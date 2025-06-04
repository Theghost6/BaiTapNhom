import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaGift, FaTimes, FaSearch, FaFilter, FaStar } from "react-icons/fa";
import LinhKien from "../../page/funtion/Linh_kien.json";
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

const SelectedOptions = React.memo(({ selectedOptions, sortOrder, toggleOption, handleSortChange }) => (
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
));

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

  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      setBannerError(null);

      try {
        console.log('Fetching bmanners...');
        const response = await fetch('http://localhost/BaiTapNhom/backend/tt_home.php?path=banner', {
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
        console.log('Response data:', data);

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const itemsPerPage = 20;

  const categories = [
    "Tất cả loại hàng",
    "Bộ xử lý (CPU)",
    "Bo mạch chủ (Mainboard)",
    "Bộ nhớ (RAM)",
    "Ổ cứng (Storage)",
    "Card đồ họa (GPU)",
    "Nguồn (PSU)",
    "Tản nhiệt (Cooling)",
    "Vỏ máy (Case)",
    "Thiết bị ngoại vi (Peripherals)",
  ];

  const categoryMapping = {
    "Tất cả loại hàng": "Tất cả loại hàng",
    "Bộ xử lý (CPU)": "CPU",
    "Bo mạch chủ (Mainboard)": "Mainboard",
    "Bộ nhớ (RAM)": "RAM",
    "Ổ cứng (Storage)": "Storage",
    "Card đồ họa (GPU)": "GPU",
    "Nguồn (PSU)": "PSU",
    "Tản nhiệt (Cooling)": "Cooling",
    "Vỏ máy (Case)": "Case",
    "Thiết bị ngoại vi (Peripherals)": "Peripherals",
  };

  const brands = [
    "Tất cả hãng",
    ...new Set(
      Object.values(LinhKien)
        .flatMap(category => Array.isArray(category) ? category.map(item => item.hang) : [])
        .filter(brand => brand)
    ),
  ];

  const priceRanges = [
    "Tất cả giá",
    "Dưới 2 triệu",
    "2-5 triệu",
    "5-10 triệu",
    "Trên 10 triệu",
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedOptions, searchTerm, sortOrder]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-bar')) {
        setActiveFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      let newSelectedOptions = [...selectedOptions];
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

  const activeCategory = categories.find(cat => cat !== "Tất cả loại hàng" && selectedOptions.includes(cat)) || "Tất cả loại hàng";
  const activeBrand = brands.find(br => br !== "Tất cả hãng" && selectedOptions.includes(br)) || "Tất cả hãng";
  const activePrice = priceRanges.find(price => price !== "Tất cả giá" && selectedOptions.includes(price)) || "Tất cả giá";

  const allProducts = Object.values(LinhKien).flat();

  const matchesSearchTerm = (product) => {
    if (!searchTerm) return true;

    const normalizedSearchTerm = normalizeText(searchTerm);
    const normalizedProductName = normalizeText(product.ten);
    const normalizedBrand = product.hang ? normalizeText(product.hang) : "";
    const normalizedCategory = product.danh_muc ? normalizeText(product.danh_muc) : "";

    let matches =
      normalizedProductName.includes(normalizedSearchTerm) ||
      normalizedBrand.includes(normalizedSearchTerm) ||
      normalizedCategory.includes(normalizedSearchTerm);

    if (normalizedSearchTerm.includes('chuot') || normalizedSearchTerm.includes('mouse')) {
      matches = matches || ['peripherals', 'thiet bi ngoai vi'].includes(normalizedCategory);
    }

    return matches;
  };

  const filteredItems = useMemo(() => {
    return allProducts.filter((product) => {
      if (!product.ten || !product.gia) return false;

      const originalCategory = categoryMapping[activeCategory];
      const matchesCategory =
        activeCategory === "Tất cả loại hàng" ||
        (product.danh_muc && product.danh_muc.toLowerCase() === originalCategory.toLowerCase());

      const matchesBrand =
        activeBrand === "Tất cả hãng" ||
        (product.hang && product.hang === activeBrand);

      const productPrice = parseFloat(product.gia);
      const matchesPrice =
        activePrice === "Tất cả giá" ||
        (activePrice === "Dưới 2 triệu" && productPrice < 2000000) ||
        (activePrice === "2-5 triệu" && productPrice >= 2000000 && productPrice <= 5000000) ||
        (activePrice === "5-10 triệu" && productPrice >= 5000000 && productPrice <= 10000000) ||
        (activePrice === "Trên 10 triệu" && productPrice > 10000000);

      return matchesSearchTerm(product) && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [allProducts, searchTerm, activeCategory, activeBrand, activePrice]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const priceA = parseFloat(a.gia);
      const priceB = parseFloat(b.gia);
      if (sortOrder === "lowToHigh") return priceA - priceB;
      if (sortOrder === "highToLow") return priceB - priceA;
      return 0;
    });
  }, [filteredItems, sortOrder]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const clearAllFilters = () => {
    setSelectedOptions([]);
    setSearchTerm("");
    setActiveFilter(null);
    setSortOrder("default");
  };

  const handleProductClick = (productId) => {
    navigate(`/linh-kien/${productId}`);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const suggestRelatedProducts = () => {
    const related = allProducts.filter(product => {
      const normalizedCategory = product.danh_muc ? normalizeText(product.danh_muc) : "";
      return ['peripherals', 'thiet bi ngoai vi'].includes(normalizedCategory);
    });
    return related.length > 0 ? related.slice(0, 4) : allProducts.slice(0, 4);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star-icon" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star-icon half-star" />);
    }
    return stars;
  };

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
              const originalPrice = product.gia_goc || product.gia * 1.1;
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
                        {product.danh_muc === "CPU" && product.thong_so.cores && (
                          <div>{product.thong_so.cores} cores</div>
                        )}
                        {product.danh_muc === "Mainboard" && product.thong_so.memorySlots && (
                          <div>{product.thong_so.memorySlots} RAM slots</div>
                        )}
                        {product.danh_muc === "RAM" && product.thong_so.capacity && (
                          <div>{product.thong_so.capacity} RAM </div>
                        )}
                        {product.danh_muc === "Storage" && (
                          <div>{product.thong_so.readSpeed} </div>
                        )}
                        {product.danh_muc === "GPU" && (
                          <div> Vram {product.thong_so.vram} </div>
                        )}
                        {product.danh_muc === "PSU" && (
                          <div> Max {product.thong_so.wattage} </div>
                        )}
                        {product.danh_muc === "Cooling" && (
                          <div> {product.thong_so.type} </div>
                        )}
                        {product.danh_muc === "Peripherals" && (
                          <div> {product.thong_so.type} </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="product-details">
                    <h3 className="product-name" title={product.ten}>
                      {product.ten}
                    </h3>
                    <div className="product-price-container">
                      <p className="product-price discounted">
                        {formatCurrency(product.gia)}
                      </p>
                      {originalPrice > product.gia && (
                        <p className="product-price original">
                          {formatCurrency(originalPrice)}
                        </p>
                      )}
                    </div>
                    {product.khuyen_mai && (
                      <p className="product-member-discount">
                        {product.khuyen_mai}
                      </p>
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
                {suggestRelatedProducts().map((product, index) => (
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
                        alt={product.ten}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = "/photos/placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="product-details">
                      <h3 className="product-name" title={product.ten}>
                        {product.ten}
                      </h3>
                      <p className="product-price">
                        {formatCurrency(product.gia)}
                      </p>
                    </div>
                  </div>
                ))}
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
