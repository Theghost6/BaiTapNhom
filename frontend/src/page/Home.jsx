import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  ArrowRight,
  Calendar,
  Fan,
  Mouse,
  Keyboard,
} from "lucide-react";
import "../style/home.css";
import "../style/all_linh_kien.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaGift } from "react-icons/fa";
import 'swiper/css/effect-coverflow';
import { useHomeLogic } from "../hooks/home/useHomeLogic";
// Import nhiều hiệu ứng hơn từ react-awesome-reveal
import { Fade, Slide, Zoom, Bounce, Flip } from 'react-awesome-reveal';

const slides = [
  {
    id: "gpu001",
    image: ["/photos/k.jpg"],
    title: "NVIDIA GeForce RTX 4090",
    description: "Sức mạnh đồ họa vượt trội cho game thủ",
  },
  {
    id: "peripheral009",
    image: "/photos/n.jpg",
    title: "Keychron K6",
    description: "Trải nghiệm gõ phím tuyệt vời với đèn RGB",
  },
  {
    id: "peripheral004",
    image: "https://w.wallhaven.cc/full/nr/wallhaven-nrkp6w.jpg",
    title: "Logitech MX Master 3S",
    description: "Chuột chơi game với cảm biến HERO 25K",
  },
];

const Hanghoa = [
  {
    id: "kb001",
    ten: "Keychron K8 Pro",
    hang: "Keychron",
    gia: 2500000,
    images: ["/photos/l.jpg"],
  },
  {
    id: "case009",
    ten: "NZXT H9 Elite",
    hang: "NZXT",
    gia: 3690000,
    images: ["/photos/case008.jpg"],
  },
  {
    id: "cpu003",
    ten: "CPU Intel Core Ultra 9 285K",
    hang: "INTEL",
    gia: 17290000,
    images: ["/photos/e.jpg"],
  },
  {
    id: "cool001",
    ten: "Noctua NH-D15",
    hang: "Noctua",
    gia: 2500000,
    images: ["/photos/p.jpg"],
  },
  {
    id: "mb002",
    ten: "MSI MPG B650 Tomahawk WiFi",
    hang: "MSI",
    gia: 6500000,
    images: ["/photos/mainboard.png"],
  },
  {
    id: "storage004",
    ten: "Crucial P3 Plus 2TB NVMe PCIe Gen4",
    hang: "Crucial",
    gia: 3890000,
    images: ["/photos/storage.jpg"],
  },
];

const hotItems = [
  {
    id: "cpu001",
    name: "CPU Intel Core i9-13900K",
    price: "13,999,000đ",
    trend: "+15%",
    icon: <Keyboard className="w-5 h-5" />,
    trendColor: "text-green-500",
  },
  {
    id: "cpu006",
    name: "AMD Ryzen 9 7950X3D",
    price: "15,999,000đ",
    trend: "+23%",
    icon: <Mouse className="w-5 h-5" />,
    trendColor: "text-red-500",
  },
  {
    id: "mb001",
    name: "ASUS ROG Strix Z790-E Gaming",
    price: "10,000,000đ",
    trend: "+18%",
    icon: <Fan className="w-5 h-5" />,
    trendColor: "text-red-500",
  },
];

const promoSlides = [
  {
    id: "psu002",
    image: "/photos/sea.jpg",
    title: "Seasonic Prime TX-1000",
    brand: "Thương hiệu: Seasonic",
    price: "6.50.000 VNĐ",
  },
  {
    id: "gpu006",
    image: "/photos/sap.jpg",
    title: "Sapphire NITRO+ RX 7900 XT 24GB GDDR6",
    brand: "Thương hiệu: Sapphire",
    price: "3.190.000 VNĐ",
  },
  {
    id: "cpu010",
    image: "/photos/ry.jpg",
    title: "AMD Ryzen 7 9800X3D",
    brand: "Thương hiệu: AMD",
    price: "14.390.000 VNĐ",
  },
  {
    id: "gpu008",
    image: "/photos/po.jpg",
    title: "PowerColor RX 7600 Fighter 8GB GDDR6",
    brand: "Thương hiệu: PowerColor",
    price: "12.900.000 VNĐ",
  },
  {
    id: "mb007",
    image: "/photos/main.png",
    title: "Asrock B760M Pro RS/D4",
    brand: "Thương hiệu: Asrock",
    price: "4.390.000 VNĐ",
  },
  {
    id: "mb006",
    image: "/photos/giga.jpg",
    title: "Gigabyte Z790M Aorus Elite AX D5",
    brand: "Thương hiệu: Gigabyte",
    price: "5.290.000 VNĐ",
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

const Home = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_HOST;
  const {
    activeSlide,
    setActiveSlide,
    showUrl,
    setShowUrl,
    timeLeft,
    prevRef,
    nextRef,
  } = useHomeLogic(apiUrl);

  // XÓA HOÀN TOÀN đoạn useEffect liên quan đến messages/marqueeText
  // React.useEffect(() => {
  //   if (messages.length === 0 || loading || error) return;
  //   const interval = setInterval(() => {
  //     setMarqueeText((prev) => (prev + 1) % messages.length);
  //   }, (messages[marqueeText]?.toc_do * 1000 || 15000) - 900);
  //   return () => clearInterval(interval);
  // }, [messages, marqueeText, loading, error]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="home-container">
      <Zoom triggerOnce duration={900}>
        <div className="hero-slider" id="hero-slider">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[activeSlide].id}
              className="slide-background"
              style={{ backgroundImage: `url('${slides[activeSlide].image}')` }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="slide-background"
                style={{ backgroundImage: `url('${slides[activeSlide].image}')` }}
              >
                <div className="slide-overlay"></div>
                <div className="slide-content">
                  <div className="slide-text">
                    <h1 className="slide-title">{slides[activeSlide].title}</h1>
                    <p className="slide-description">{slides[activeSlide].description}</p>
                    <div className="slide-buttons">
                      <button
                        className="primary-button"
                        onClick={() => navigate(`/linh-kien/${slides[activeSlide].id}`)}
                      >
                        Đặt hàng ngay <ArrowRight className="button-icon" />
                      </button>
                      <button
                        className="secondary-button"
                        onClick={() => navigate(`/linh-kien/${slides[activeSlide].id}`)}
                      >
                        Tìm hiểu thêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="slide-indicators">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`slide-indicator${index === activeSlide ? " active-indicator" : ""}`}
                    aria-label={`Slide ${index + 1}`}
                    aria-current={index === activeSlide ? "true" : undefined}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Zoom>

      <Slide direction="left" triggerOnce duration={900} delay={100}>
        <div className="brandBanner-container">
          <div className="brandBanner-slide">
            <img src="/photos/j.jpg" alt="Slide" className="brandBanner-image" />
            <div className="brandBanner-overlay">
              <p className="brandBanner-subtitle">
                Từ <span>2.500K VNĐ</span>
              </p>
              <p className="brandBanner-text">LINH KIỆN MỌI MÁY</p>
              <h2 className="brandBanner-title">MX Master 3S</h2>
              <Link to="/linh-kien/peripheral004">
                <button className="brandBanner-button">SHOP NOW</button>
              </Link>
            </div>
          </div>

          <div className="brandBanner-slide">
            <img src="/photos/asrock.jpg" alt="Slide" className="brandBanner-image" />
            <div className="brandBanner-overlay">
              <p className="brandBanner-subtitle">
                Từ <span>4.390K VNĐ</span>
              </p>
              <p className="brandBanner-text">LINH KIỆN MỌI MÁY</p>
              <h2 className="brandBanner-title">B760M Pro</h2>
              <Link to="/linh-kien/mb007">
                <button className="brandBanner-button">SHOP NOW</button>
              </Link>
            </div>
          </div>

          <div className="brandBanner-slide">
            <img src="/photos/nguon.jpg" alt="Slide" className="brandBanner-image" />
            <div className="brandBanner-overlay">
              <p className="brandBanner-subtitle">
                Từ <span>3.750K VNĐ</span>
              </p>
              <p className="brandBanner-text">LINH KIỆN MỌI MÁY</p>
              <h2 className="brandBanner-title">RM850X</h2>
              <Link to="/linh-kien/psu001">
                <button className="brandBanner-button">SHOP NOW</button>
              </Link>
            </div>
          </div>
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
                Những mặt hàng được đánh giá cao trong năm 2025
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
            {Hanghoa.map((lk, idx) => (
              <div key={idx} className="products-card">
                <div className="products-image-container">
                  <img
                    src={lk.images[0] || "https://example.com/placeholder.jpg"}
                    alt={lk.ten}
                    className="products-image"
                  />
                </div>
                <div className="products-details">
                  <h3 className="products-name">{lk.ten}</h3>
                  <p className="products-brand">Thương hiệu: {lk.hang}</p>
                  <p className="products-price">{lk.gia.toLocaleString("vi-VN")} VNĐ</p>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      <Bounce triggerOnce duration={1000} delay={300}>
        <section className="promotion-section">
          <div className="promotion-container">
            <div className="promotion-left">
              <h2>Ưu đãi linh kiện 2025</h2>
              <p>
                Giảm đến 30% cho các mua hàng combo. Đặt ngay hôm nay để nhận thêm quà tặng đặc biệt!
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
                      <span className="icon">{item.icon}</span>
                      <span className="item-name">{item.name}</span>
                    </div>
                    <div className="item-right">
                      <div className="item-price">{item.price}</div>
                      <div className={`item-trend ${item.color}`}>{item.trend}</div>
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
                title: "Sửa chữa và bảo trì",
                desc: "Chúng tôi cung cấp dịch vụ sửa chữa và bảo trì cho tất cả các thiết bị điện tử.",
              },
              {
                icon: "🚚",
                title: "Vận chuyển hàng hóa tận nơi",
                desc: "Dịch vụ vận chuyển hàng hóa tận nơi với giá cả hợp lý.",
              },
              {
                icon: "🛡️",
                title: "Bảo hành và hỗ trợ",
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
              <h2>Tin tức</h2>
              <p href="/blog" className="view-all">
                Xem tin tức và sự kiện mới nhất gần đây
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
                Mua sắm mỗi ngày cùng <span className="highlight">NANOCORE4</span>
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
};

export default Home;
