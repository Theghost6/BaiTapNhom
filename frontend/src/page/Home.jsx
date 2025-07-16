import React, { memo, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
} from "lucide-react";
import "../style/home.css";
import "../style/all_linh_kien.css";
import "../style/performance.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaGift } from "react-icons/fa";
import { Fade, Slide, Zoom, Bounce, Flip } from 'react-awesome-reveal';
import useProductData from '../hooks/home/useProductData';
import useOptimizedSlider from '../hooks/home/useOptimizedSlider';
import HeroSlider from '../components/HeroSlider';

// Fallback data với ảnh cố định
const fallbackSlides = [
  {
    id: 2,
    image: "https://cdn-media.sforum.vn/storage/app/media/tiz/nvidia-geforce-rtx-5090-gpu.jpg",
    title: "Geforce RTX 5090",
    description: "Sức mạnh đồ họa vượt trội cho game thủ",
  },
  {
    id: 1715,
    image: "https://w.wallhaven.cc/full/nr/wallhaven-nrkp6w.jpg",
    title: "Asus ROG Falchion RX",
    description: "Bàn phím Gaming Asus ROG Falchion RX Low Profile",
  },
  {
    id: 1696,
    image: "https://w.wallhaven.cc/full/21/wallhaven-21gpm6.png",
    title: "HyperWork Helios",
    description: "Chuột chơi game không dây HyperWork Helios",
  },
];

// Fallback data cho brand banner
const fallbackBrandBanner = [
  {
    id: 1711,
    image: "/photos/j.jpg",
    subtitle: "LINH KIỆN MỌI MÁY",
  },
  {
    id: 164,
    image: "/photos/asrock.jpg",
    subtitle: "LINH KIỆN MỌI MÁY",
  },
  {
    id: 245,
    image: "/photos/nguon.jpg",
    subtitle: "LINH KIỆN MỌI MÁY",
  },
];

const fallbackHanghoa = [
  {
    id: 1707,
    images: ["https://i.pinimg.com/1200x/3f/e4/5e/3fe45e565dd9277f0cc318391e12bb12.jpg"],
  },
  {
    id: 143,
    images: ["/photos/case008.jpg"],
  },
  {
    id: 161,
    images: ["/photos/d.jpg"],
  },
  {
    id: 491,
    images: ["/photos/p.jpg"],
  },
  {
    id: 432,
    images: ["/photos/mainboard.png"],
  },
  {
    id: 6,
    images: ["/photos/storage.jpg"],
  },
];

const fallbackHotItems = [
  {
    id: 1699,
    icon: "⌨️",
    trend: "+15%",
    trendColor: "text-green-500",
  },
  {
    id: 1698,
    icon: "🖱️",
    trend: "+23%",
    trendColor: "text-red-500",
  },
  {
    id: 1697,
    icon: "🌀",
    trend: "+18%",
    trendColor: "text-red-500",
  },
];

const newsData = [
  {
    title: "DDR5 RAM: Bước tiến tốc độ trong build PC 2025",
    description:
      "DDR5 ngày càng phổ biến trong các bộ PC hiệu năng cao, mang lại tốc độ vượt trội và hỗ trợ tối ưu cho các vi xử lý thế hệ mới.",
    date: "April 8, 2025",
    category: "Hardware",
    readMoreLink: "#",
    image: "/photos/ram.jpg",
  },
  {
    title: "Top 5 phần mềm tối ưu hệ thống Windows không thể thiếu",
    description:
      "Giới thiệu những phần mềm hàng đầu giúp dọn dẹp, tối ưu hiệu suất và bảo vệ máy tính Windows khỏi rác và phần mềm độc hại.",
    date: "May 1, 2025",
    category: "Software",
    readMoreLink: "#",
    image: "/photos/w.jpg",
  },
  {
    title: "M.2 Gen 5 SSD: Chuẩn lưu trữ siêu nhanh cho gaming và sáng tạo nội dung",
    description:
      "Ổ cứng M.2 Gen 5 mang lại tốc độ vượt trội, phù hợp cho người dùng chuyên nghiệp và game thủ muốn giảm thời gian tải xuống gần như bằng 0.",
    date: "March 18, 2025",
    category: "Storage",
    readMoreLink: "#",
    image: "/photos/ssd.jpg",
  },
  {
    title: "Mini PC Workstation: Xu hướng làm việc nhỏ gọn mà mạnh mẽ",
    description:
      "Mini PC đang thay thế dần desktop truyền thống trong văn phòng hiện đại, nhờ thiết kế gọn nhẹ nhưng vẫn mạnh mẽ và dễ nâng cấp.",
    date: "February 20, 2025",
    category: "PC Builds",
    readMoreLink: "#",
    image: "/photos/mini.jpg",
  },
];

const Home = memo(() => {
  const navigate = useNavigate();

  // Memoize static data để tránh re-create
  const slideIds = useMemo(() => [2, 1715, 1696], []);
  const brandBannerIds = useMemo(() => [1711, 164, 245], []);
  const hanghoaIds = useMemo(() => [1707, 143, 161, 491, 432, 6], []);
  const hotItemIds = useMemo(() => [1699, 1698, 1697], []);

  // Fetch dữ liệu từ API với optimization
  const { products: slides, loading: slidesLoading } = useProductData(slideIds, fallbackSlides);
  const { products: brandBanners, loading: brandBannersLoading } = useProductData(brandBannerIds, fallbackBrandBanner);
  const { products: Hanghoa, loading: hanghoaLoading } = useProductData(hanghoaIds, fallbackHanghoa);
  const { products: hotItems, loading: hotItemsLoading } = useProductData(hotItemIds, fallbackHotItems);


  // Optimized slider hook
  const {
    activeSlide,
    setActiveSlide,
    handleMouseEnter,
    handleMouseLeave,
    handleKeyDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useOptimizedSlider(slides, 4000);

  React.useEffect(() => {
    // Thêm keyboard navigation
    const handleGlobalKeyDown = (event) => {
      if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        handleKeyDown(event);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="home-container">
      <HeroSlider
        slides={slides}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        handleKeyDown={handleKeyDown}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
        navigate={navigate}
      />

      <Slide direction="left" triggerOnce duration={900} delay={100}>
        <div className="brandBanner-container">
          {brandBannersLoading ? (
            <div>Loading banners...</div>
          ) : (
            brandBanners.map((banner, idx) => (
              <div key={idx} className="brandBanner-slide">
                <img src={banner.image} alt="Slide" className="brandBanner-image" />
                <div className="brandBanner-overlay">
                  <p className="brandBanner-subtitle">
                    Từ <span>
                      {banner.gia_sau
                        ? `${(parseFloat(banner.gia_sau) / 1000).toFixed(0)}K VNĐ`
                        : '0K VNĐ'
                      }
                    </span>
                  </p>
                  <p className="brandBanner-text">{banner.subtitle || 'LINH KIỆN MỌI MÁY'}</p>
                  <h2 className="brandBanner-title" style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.3',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    maxHeight: '3.2rem'
                  }}>
                    {banner.ten_sp ?
                      (banner.ten_sp.length > 40 ?
                        banner.ten_sp.substring(0, 40) + '...' :
                        banner.ten_sp
                      ) :
                      (banner.title || 'Đang tải...')
                    }
                  </h2>
                  <Link to={`/linh-kien/${banner.id}`}>
                    <button className="brandBanner-button">SHOP NOW</button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </Slide>

      <Slide direction="up" triggerOnce duration={900} delay={200}>
        <div className="section destinations-section" id="linhkien">
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          />
          <div className="section-header">
            <div className="section-title-part">
              <h2 className="section-title" id="diem-den">
                HOT COMPONENTS
              </h2>
              <p className="section-subtitle">
                Những mặt hàng được đánh giá cao trong năm 2025
              </p>
              <div className="title-icon-line">
                <span className="line"></span>
                <i className="fas fa-computer icon"></i>
                <span className="line"></span>
              </div>
            </div>
            <button
              className="view-all-button"
              onClick={() => navigate("/AllLinhKien")}
            >
              Xem tất cả <ArrowRight className="button-icon-small" />
            </button>
          </div>

          <div className="destination-grid">
            {hanghoaLoading ? (
              <div>Loading products...</div>
            ) : (
              Hanghoa.map((lk, idx) => (
                <div key={idx} className="products-card">
                  <div className="products-image-container">
                    <img
                      src={lk.images && lk.images[0] ? lk.images[0] : "https://example.com/placeholder.jpg"}
                      alt={lk.ten_sp || lk.ten || 'Sản phẩm'}
                      className="products-image"
                    />
                  </div>
                  <div className="products-details">
                    <h3 className="products-name">{lk.ten_sp || lk.ten || 'Đang tải...'}</h3>
                    <p className="products-brand">
                      Thương hiệu: {lk.ten_nha_san_xuat || lk.hang || 'Đang cập nhật'}
                    </p>
                    <p className="products-price">
                      {(lk.gia_sau && lk.gia_sau !== "0.00" && lk.gia_sau !== "0") ||
                        (lk.gia && lk.gia !== "0.00" && lk.gia !== "0")
                        ? `${parseFloat(lk.gia_sau || lk.gia).toLocaleString("vi-VN")} VNĐ`
                        : 'Liên hệ'
                      }
                    </p>
                    {lk.khuyen_mai && (
                      <p className="products-sale">
                        <FaGift style={{ marginRight: "6px" }} />
                        {lk.khuyen_mai}
                      </p>
                    )}
                    <button
                      className="shop-now-btn"
                      onClick={() => navigate(`/linh-kien/${lk.id}`)}
                    >
                      Shop Now →
                    </button>
                    {/* Debug info - remove after testing */}
                    <div style={{ fontSize: '10px', color: '#ccc', marginTop: '5px' }}>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Slide>

      <Bounce triggerOnce duration={1000} delay={300}>
        <section className="promotion-section">
          <div className="promotion-container">
            <div className="promotion-left">
              <h2>Ưu đãi linh kiện 2025</h2>
              <p>
                Giảm đến 30% cho các mua hàng combo. Đặt ngay hôm nay để nhận thêm quà tặng đặc biệt!
              </p>
            </div>
            <div className="promotion-right">
              <div className="promotion-header">
                <Calendar className="icon" />
                <h3>Linh kiện hot trong tháng</h3>
              </div>
              <ul className="promotion-list">
                {hotItems.map((item, idx) => (
                  <li
                    key={idx}
                    className="promotion-item"
                    onClick={() => navigate(`/linh-kien/${item.id}`)}
                  >
                    <div className="item-left">
                      <span className="icon">{item.icon || '🔥'}</span>
                      <span className="item-name">{item.ten_sp || item.name || 'Đang tải...'}</span>
                    </div>
                    <div className="item-right">
                      <div className="item-price">
                        {item.gia_sau || item.gia
                          ? `${parseFloat(item.gia_sau || item.gia).toLocaleString('vi-VN')}đ`
                          : (item.price || 'Liên hệ')
                        }
                      </div>
                      <div className={`item-trend ${item.trendColor || 'text-green-500'}`}>
                        {item.trend || '+10%'}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Bounce>

      <Flip direction="horizontal" triggerOnce duration={1000} delay={500}>
        <div className="section services-section" id="dich-vu">
          <section className="recommended-section">
            <div className="background-text">SERVICES</div>
            <div className="content">
              <h2>Dịch vụ của chúng tôi</h2>
              <a href="#" className="view-all">
                View All Recommended →
              </a>
            </div>
          </section>

          <div className="services-grid">
            {[
              {
                icon: "🛠️",
                title: "Sửa chữa và bảo trì",
                desc: "Chúng tôi cung cấp dịch vụ sửa chữa và bảo trì cho tất cả các thiết bị điện tử.",
              },
              {
                icon: "🚚",
                title: "Vận chuyển hàng hóa tận nơi",
                desc: "Dịch vụ vận chuyển hàng hóa tận nơi với giá cả hợp lý.",
              },
              {
                icon: "🛡️",
                title: "Bảo hành và hỗ trợ",
                desc: "Chúng tôi cung cấp dịch vụ bảo hành và hỗ trợ kỹ thuật 24/7.",
              },
            ].map((service, idx) => (
              <div key={idx} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Flip>

      <Slide direction="right" triggerOnce duration={900} delay={600}>
        <div className="news-wrapper">
          <section className="recommended-section" id="tintuc">
            <div className="background-text">BLOG</div>
            <div className="content">
              <h2>Tin tức</h2>
              <p className="view-all">
                Xem tin tức và sự kiện mới nhất gần đây
              </p>
            </div>
          </section>
          <div className="news-list">
            {newsData.map((post, index) => {
              const date = new Date(post.date);
              const day = date.getDate().toString().padStart(2, "0");
              const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();

              return (
                <div className="news-card" key={index}>
                  <div className="news-image-wrapper">
                    <img src={post.image} alt={post.title} className="news-image" />
                    <div className="news-date">
                      <div>{day}</div>
                      <div>{month}</div>
                    </div>
                  </div>
                  <div className="news-content">
                    <p className="news-category">{post.category}</p>
                    <h3 className="news-title">{post.title}</h3>
                    <Link to="/blog">
                      <button className="news-readmore">Read more</button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Slide>

      <Zoom triggerOnce duration={900} delay={700}>
        <div className="newsletter-section" id="dang-ki">
          <div className="newsletter-wrapper">
            <div className="newsletter-content">
              <h2 className="newsletter-title">
                Ở nhà an toàn - Mua sắm nhu yếu phẩm tại shop chúng tôi
              </h2>
              <p className="newsletter-description">
                Mua sắm mỗi ngày cùng <span className="highlight">SH3</span>
              </p>
              <div className="newsletter-form">
                <Link to="/contact">
                  <button className="newsletter-button">Subscribe</button>
                </Link>
              </div>
            </div>
            <div className="newsletter-image">
              <img src="/photos/newsletter.jpg" alt="Delivery" />
            </div>
          </div>
        </div>
      </Zoom>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
