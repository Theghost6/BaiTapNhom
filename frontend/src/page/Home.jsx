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
    image: "/photos/h.jpg",
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
    marqueeText,
    messages,
    loading,
    error,
    timeLeft,
    prevRef,
    nextRef,
  } = useHomeLogic(apiUrl);

  // Cycle through messages based on toc_do
  React.useEffect(() => {
    if (messages.length === 0 || loading || error) return;

    const interval = setInterval(() => {
      setMarqueeText((prev) => (prev + 1) % messages.length);
    }, (messages[marqueeText]?.toc_do * 1000 || 15000) - 900); // Reduce delay by 500ms

    return () => clearInterval(interval);
  }, [messages, marqueeText, loading, error]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="home-container">
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

      <div className="uudai">
        <section className="recommended-section">
          <h2 className="uudai-title">Ưu đãi trong tháng</h2>
          <div className="background-text-deal">DEAL</div>
        </section>

        <div className="marquee-container" role="marquee" aria-live="polite">
          {loading ? (
            <div className="marquee-inner">
              <span className="marquee-text glow">Đang tải...</span>
            </div>
          ) : error ? (
            <div className="marquee-inner">
              <span className="marquee-text glow">Lỗi: {error}</span>
            </div>
          ) : messages.length > 0 ? (
            <div
              className="marquee-inner"
              style={{ whiteSpace: "nowrap", animationDuration: "20s" }}
            >
              {messages.map((message, index) => (
                <span
                  key={index}
                  className="marquee-text glow"
                  style={{ marginRight: "50px" }}
                >
                  {message.noi_dung}
                </span>
              ))}
            </div>
          ) : (
            <div className="marquee-inner">
              <span className="marquee-text glow">Không có thông báo</span>
            </div>
          )}
        </div>

        <div className="uudai-content">
          <div className="uudai-header">
            <div className="uudai-countdown">
              <div className="countdown-box">
                <span className="countdown-value">{timeLeft.days.toString().padStart(2, "0")}</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-box">
                <span className="countdown-value">{timeLeft.hours.toString().padStart(2, "0")}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-box">
                <span className="countdown-value">{timeLeft.minutes.toString().padStart(2, "0")}</span>
                <span className="countdown-label">Mins</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-box">
                <span className="countdown-value">{timeLeft.seconds.toString().padStart(2, "0")}</span>
                <span className="countdown-label">Secs</span>
              </div>
            </div>
          </div>

          <div className="uudai-wrapper">
            <div className="uudai-left">
              <img
                src="https://bizweb.dktcdn.net/thumb/1024x1024/100/410/941/products/screenshot-2023-06-03-111330-03c3d347-c279-4168-8efc-ae1700ca15f4.png?v=1685766864083"
                alt="Russet Idaho Potatoes"
                className="uudai-main-image"
              />
              <div
                className="uudai-product-main"
                onClick={() => navigate(`/linh-kien/ram003`)}
                style={{ cursor: "pointer" }}
              >
                <p className="uudai-category">RAM</p>
                <h3 className="uudai-price">5.990.000 VNĐ</h3>
                <p className="uudai-stars">★★★★★ (5.00)</p>
                <p className="uudai-desc">
                  Kingston Fury Beast RGB DDR5 64GB mang lại hiệu suất vượt trội cho game thủ và người sáng tạo nội dung cần bộ nhớ lớn và tốc độ cao. Với tốc độ 6000MHz và dung lượng 64GB (2x32GB), RAM hỗ trợ xử lý đa nhiệm nặng, dựng video, mô phỏng 3D và chơi game AAA một cách mượt mà. Sản phẩm tích hợp RGB có thể tùy chỉnh qua phần mềm Kingston FURY CTRL hoặc đồng bộ với phần mềm bo mạch chủ. Hỗ trợ XMP 3.0 giúp ép xung dễ dàng, điện áp 1.35V và tản nhiệt nhôm giúp vận hành ổn định. Đây là lựa chọn lý tưởng cho hệ thống cao cấp yêu cầu cả tốc độ, dung lượng và tính thẩm mỹ.
                </p>
              </div>
            </div>

            <div className="uudai-right">
              {[
                {
                  id: "gpu007",
                  category: "GPU",
                  name: "ZOTAC RTX 4060 Ti Twin Edge 8GB GDDR6",
                  price: "11.900.000 VNĐ",
                  oldPrice: "12.900.000 VNĐ",
                  rating: 4.0,
                  image:
                    "https://nguyencongpc.vn/media/product/25073-card-m--n-h--nh-zotac-gaming-geforce-rtx-4060-ti-8gb-twin-edge-7.jpg",
                },
                {
                  id: "case001",
                  category: "Case",
                  name: "Lian Li PC-O11 Dynamic",
                  price: "2.900.000 VNĐ",
                  oldPrice: "3.500.000 VNĐ",
                  rating: 5.0,
                  image:
                    "./photos/lian-li.jpg",
                },
                {
                  id: "cool002",
                  category: "Cooling",
                  name: "NZXT Kraken Z73 RGB",
                  price: "5.600.000 VNĐ",
                  oldPrice: "6.500.000 VNĐ",
                  rating: 4.0,
                  image:
                    "https://cdn2.cellphones.com.vn/x/media/catalog/product/c/a/case-may-tinh-nzxt-h9-elite-atx_12_.png",
                },
                {
                  id: "cool003",
                  category: "Cooling",
                  name: "Xigmatek Epix II",
                  price: "3.400.000 VNĐ",
                  oldPrice: "4.500.000 VNĐ",
                  rating: 4.0,
                  image:
                    "https://cdn2.cellphones.com.vn/x/media/catalog/product/n/g/nguon-may-tinh-xigmatek-x-power-iii-500-artic-450w_4__2.png",
                },
                {
                  id: "storage002",
                  category: "Storage",
                  name: "WD Black SN850X 2TB",
                  price: "3.800.000 VNĐ",
                  oldPrice: "4.500.000 VNĐ",
                  rating: 5.0,
                  image:
                    "https://bizweb.dktcdn.net/thumb/1024x1024/100/329/122/products/wd-black-sn850x-2tb-3d-hr.jpg?v=1741160387027",
                },
                {
                  id: "ram005",
                  category: "RAM",
                  name: "ADATA XPG LANCER RGB DDR5 32GB",
                  price: "2.800.000 VNĐ",
                  oldPrice: "3.690.000 VNĐ",
                  rating: 5.0,
                  image:
                    "https://minhducpc.vn/uploads/thu_vien/ram-adata-xpg-lancer-rgb-16gb-6000mhz-6.webp",
                },
              ].map((item, index) => (
                <div
                  className="uudai-card"
                  key={item.id}
                  onClick={() => navigate(`/linh-kien/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="uudai-card-content">
                    <img src={item.image} alt={item.name} className="uudai-product-image" />
                    <div className="uudai-product-info">
                      <p className="uudai-category">{item.category}</p>
                      <p className="uudai-price">
                        {item.price}
                        {item.oldPrice && <span className="uudai-old-price">{item.oldPrice}</span>}
                      </p>
                      <p className="uudai-name">{item.name}</p>
                      <p className="uudai-stars">
                        {"★".repeat(Math.floor(item.rating))} ({item.rating.toFixed(2)})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showUrl && (
              <div className="url-popup">
                <p>Đường dẫn sản phẩm: {showUrl}</p>
                <button onClick={() => setShowUrl(null)}>Đóng</button>
                <button onClick={() => window.open(showUrl, "_blank")}>Mở trong tab mới</button>
              </div>
            )}
          </div>
        </div>

        <div className="brandBanner-uudai-slide">
          <div className="brandBanner-uudai-overlay">
            <div className="brandBanner-uudai-content-box">
              <p className="brandBanner-uudai-text">
                📘 Xem thêm nhiều ưu đãi khác cùng với linh kiện
              </p>
              <p className="brandBanner-uudai-subtext">
                🔥 Giảm đến 30% cho linh kiện PC - chỉ trong tuần này!
              </p>
              <Link to="/AllLinhKien">
                <button className="brandBanner-uudai-button">SHOP NOW</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="promo-carousel-container">
          <div className="promo-content">
            <h2 className="carousel-title">Linh kiện mới</h2>
            <p className="sub-carousel-title">
              Khuyến mãi hấp dẫn từ các thương hiệu hàng đầu
            </p>
          </div>

          <div className="custom-slider-container">
            <div ref={prevRef} className="custom-swiper-button-prev">
              ❮
            </div>
            <div ref={nextRef} className="custom-swiper-button-next">
              ❯
            </div>
            <Swiper
              modules={[Navigation, Autoplay, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={3} // Hiển thị 3 slide (1 lớn ở giữa, 2 nhỏ ở hai bên)
              coverflowEffect={{
                rotate: 0, // Không xoay slide
                stretch: 30, // Kéo các slide gần nhau hơn để tăng hiệu ứng
                depth: 5, // Tăng depth để slide ngoài nhỏ lại rõ rệt hơn
                modifier: 4, // Tăng modifier để phóng đại hiệu ứng
                slideShadows: false, // Tắt bóng để giao diện sạch
              }}
              spaceBetween={10} // Giảm khoảng cách giữa các slide
              loop={true}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1, // Chỉ 1 slide trên mobile
                  coverflowEffect: {
                    depth: 0, // Tắt hiệu ứng coverflow trên mobile
                    modifier: 0,
                  },
                },
                480: {
                  slidesPerView: 2,
                  coverflowEffect: {
                    depth: 100, // Hiệu ứng nhẹ trên màn hình nhỏ
                    modifier: 1.5,
                  },
                },
                768: {
                  slidesPerView: 3,
                  coverflowEffect: {
                    depth: 150, // Hiệu ứng vừa phải trên tablet
                    modifier: 2,
                  },
                },
                1024: {
                  slidesPerView: 3,
                  coverflowEffect: {
                    depth: 200, // Hiệu ứng mạnh trên desktop
                    modifier: 3,
                  },
                },
              }}
            >
              {promoSlides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className="slider-card" style={{ backgroundImage: `url(${slide.image})` }}>
                    <div className="slider-overlay">
                      <p className="slider-title">{slide.title}</p>
                      <p className="slider-brand">{slide.brand}</p>
                      <p className="slider-price">{slide.price}</p>
                      <button
                        className="shop-button"
                        onClick={() => navigate(`/linh-kien/${slide.id}`)}
                      >
                        SHOP NOW →
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default Home;
