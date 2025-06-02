import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  ArrowRight,
  Star,
  MapPin,
  Calendar,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import "../style/home.css";
import "../style/all_linh_kien.css";
import { motion , AnimatePresence} from "framer-motion";
import { FaGift } from "react-icons/fa";
import { Variants } from "./funtion/Menu";

// import * as motion from "motion/react-client"

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const [openedIndex, setOpenedIndex] = useState(null);
  const [showUrl, setShowUrl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
const [marqueeText, setMarqueeText] = useState(0);
  const messages = [
    "🔥 Flash Sale: Giảm đến 30% cho tất cả linh kiện PC! Nhanh tay đặt hàng ngay hôm nay! 🔥",
    "🎁 Mua combo linh kiện, nhận quà tặng đặc biệt!",
    "🚚 Miễn phí vận chuyển cho đơn hàng trên 5 triệu!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMarqueeText((prev) => (prev + 1) % messages.length);
    }, 5000); // Match the 15s animation duration
    return () => clearInterval(interval);
  }, []);

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { days, hours, minutes, seconds } = prev;

        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };

        clearInterval(timer);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const slides = [
    {
      id: "gpu001",
      image: ["/photos/k.jpg"],
      title: "NVIDIA GeForce RTX 4090",
      description: "Sức mạnh đồ họa vượt trội cho game thủ",
    },
    {
      id: "peripheral009",
      image:
        "/photos/n.jpg",
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
      images: ["/photos/intel ultra.jpg"],
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

  const promoSlides = [
    {
      id: "psu002",
      image: "/photos/sea.jpg",
      title: "Seasonic Prime TX-1000",
      brand: "Thương hiệu: Seasonic",
      price: "6.50.000 VNĐ"
    },
    {
      id: "gpu006",
      image: "/photos/sap.jpg",
      title: "Sapphire NITRO+ RX 7900 XT 24GB GDDR6",
      brand: "Thương hiệu: Sapphire",
      price: "3.190.000 VNĐ"
    },
    {
      id: "cpu010",
      image: "/photos/ry.jpg",
      title: "AMD Ryzen 7 9800X3D",
      brand: "Thương hiệu: AMD",
      price: "14.390.000 VNĐ"
    },
    {
      id: "gpu008",
      image: "/photos/po.jpg",
      title: "PowerColor RX 7600 Fighter 8GB GDDR6",
      brand: "Thương hiệu: PowerColor",
      price: "12.900.000 VNĐ"
    },
    {
      id: "mb007",
      image: "/photos/main.png",
      title: "Asrock B760M Pro RS\/D4",
      brand: "Thương hiệu: Asrock",
      price: "4.390.000 VNĐ"
    },
    {
      id: "mb006",
      image: "/photos/giga.jpg",
      title: "Gigabyte Z790M Aorus Elite AX D5",
      brand: "Thương hiệu: Gigabyte",
      price: "5.290.000 VNĐ"
    },
  ];

  const prevRef = useRef(null);
  const nextRef = useRef(null);


  const newsData = [
    {
      title: 'DDR5 RAM: Bước tiến tốc độ trong build PC 2025',
      description: 'DDR5 ngày càng phổ biến trong các bộ PC hiệu năng cao, mang lại tốc độ vượt trội và hỗ trợ tối ưu cho các vi xử lý thế hệ mới.',
      date: 'April 8, 2025',
      category: 'Hardware',
      readMoreLink: '#',
      image: '/photos/ram.jpg',
    },
    {
      title: 'Top 5 phần mềm tối ưu hệ thống Windows không thể thiếu',
      description: 'Giới thiệu những phần mềm hàng đầu giúp dọn dẹp, tối ưu hiệu suất và bảo vệ máy tính Windows khỏi rác và phần mềm độc hại.',
      date: 'May 1, 2025',
      category: 'Software',
      readMoreLink: '#',
      image: '/photos/w.jpg',
    },
    {
      title: 'M.2 Gen 5 SSD: Chuẩn lưu trữ siêu nhanh cho gaming và sáng tạo nội dung',
      description: 'Ổ cứng M.2 Gen 5 mang lại tốc độ vượt trội, phù hợp cho người dùng chuyên nghiệp và game thủ muốn giảm thời gian tải xuống gần như bằng 0.',
      date: 'March 18, 2025',
      category: 'Storage',
      readMoreLink: '#',
      image: '/photos/ssd.jpg',
    },
    {
      title: 'Mini PC Workstation: Xu hướng làm việc nhỏ gọn mà mạnh mẽ',
      description: 'Mini PC đang thay thế dần desktop truyền thống trong văn phòng hiện đại, nhờ thiết kế gọn nhẹ nhưng vẫn mạnh mẽ và dễ nâng cấp.',
      date: 'February 20, 2025',
      category: 'PC Builds',
      readMoreLink: '#',
      image: '/photos/mini.jpg',
    },
  ];

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="home-container">

      {/* Toggle button */}
      <div>
        <Variants />
      </div>

      {/* Hero Slider */}
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


            {/* Slide indicators */}
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
            <p className="brandBanner-subtitle">Từ <span>2.500K VNĐ</span></p>
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
            <p className="brandBanner-subtitle">Từ <span>4.390K VNĐ</span></p>
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
            <p className="brandBanner-subtitle">Từ <span>3.750K VNĐ</span></p>
            <p className="brandBanner-text">LINH KIỆN MỌI MÁY</p>
            <h2 className="brandBanner-title">RM850X</h2>
            <Link to="/linh-kien/psu001">
              <button className="brandBanner-button">SHOP NOW</button>
            </Link>
          </div>
        </div>
      </div>




      <div className="section destinations-section" id="linhkien">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <div className="section-header">
          <div className="section-title-part">
            <h2 className="section-title" id="diem-den">HOT COMPONENTS</h2>
            <p className="section-subtitle">
              Những mặt hàng được đánh giá cao trong năm 2025
              <div class="title-icon-line">
                <span class="line"></span>
                <i class="fas fa-computer icon"></i>
                <span class="line"></span>
              </div>
            </p>

          </div>
          <button
            className="view-all-button"
            onClick={() => navigate("/AllLinhKien")}
          >
            Xem tất cả <ArrowRight className="button-icon-small" />
          </button>{" "}
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

              {/* Nội dung hiển thị khi hover */}
              <div className="products-details">
                <h3 className="products-name">{lk.ten}</h3>
                <p className="products-brand">Thương hiệu: {lk.hang}</p>
                <p className="products-price">
                  {lk.gia.toLocaleString("vi-VN")} VNĐ
                </p>
                {lk.khuyen_mai && (
                  <p className="products-sale">
                    <FaGift style={{ marginRight: "6px" }} />
                    {lk.khuyen_mai}
                  </p>
                )}
                <button className="shop-now-btn"
                  onClick={() => navigate(`/linh-kien/${lk.id}`)}
                >Shop Now →</button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Promotion */}
      <div className="promotion-section" id="uudai">
        <div className="promotion-container">
          <div className="promotion-content">
            <div className="promotion-text">
              <h2 className="promotion-title" id="discount">Ưu đãi linh kiện 2025</h2>
              <p className="promotion-description">
                Giảm đến 30% cho các mua hàng combo. Đặt ngay hôm nay để
                nhận thêm quà tặng đặc biệt!
              </p>
            </div>
            <div className="promotion-deals">
              <div className="deals-card">
                <div className="deals-header">
                  <Calendar className="deals-icon" />
                  <h3 className="deals-title">Linh kiện hot trong tháng</h3>
                </div>
                <ul className="deals-list">
                  {[
                    {
                      id: "cpu001",
                      name: "CPU Intel Core i9-13900K",
                      price: "13,999,000đ",
                      trend: "+15%",
                    },
                    { id: "cpu006", name: "AMD Ryzen 9 7950X3D", price: "15,999,000đ", trend: "+23%" },
                    {
                      id: "mb001",
                      name: "ASUS ROG Strix Z790-E Gaming",
                      price: "10,000,000đ",
                      trend: "+18%",
                    },
                  ].map((tour, idx) => (
                    <li key={idx} className="deal-item"
                      onClick={() => navigate(`/linh-kien/${tour.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="deal-name">{tour.name}</span>
                      <div className="deal-info">
                        <span className="deal-price">{tour.price}</span>
                        <div className="deal-trend">
                          <TrendingUp className="trend-icon" />
                          <span className="trend-value">{tour.trend}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Discount */}
      <div className="uudai">
        <section className="recommended-section">
          <h2 className="uudai-title"> Ưu đãi trong tháng</h2>
          <div class="background-text-deal">DEAL</div>
        </section>

 {/* Dynamic Marquee with Right-to-Left Scrolling */}
      <div className="marquee-container" role="marquee" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={marqueeText}
            className="marquee-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="marquee-text glow">
              {messages[marqueeText]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

        <div className="uudai-content">
          <div className="uudai-header">
            <div className="uudai-countdown">
              <div className="countdown-box">
                <span className="countdown-value">{timeLeft.days.toString().padStart(2, '0')}</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-box">
                <span className="countdown-value">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-box">
                <span className="countdown-value">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="countdown-label">Mins</span>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-box">
                <span className="countdown-value">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="countdown-label">Secs</span>
              </div>
            </div>
          </div>

          <div className="uudai-wrapper">
            {/* Main Product */}
            <div className="uudai-left">
              <img
                src="https:\/\/bizweb.dktcdn.net\/thumb\/1024x1024\/100\/410\/941\/products\/screenshot-2023-06-03-111330-03c3d347-c279-4168-8efc-ae1700ca15f4.png?v=1685766864083"
                alt="Russet Idaho Potatoes"
                className="uudai-main-image"
              />
              <div className="uudai-product-main"
                onClick={() => navigate(`/linh-kien/ram003`)}
                style={{ cursor: "pointer" }}>
                <p className="uudai-category">RAM</p>
                <h3 className="uudai-price">5.990.000 VNĐ</h3>
                <p className="uudai-stars">★★★★★ (5.00)</p>
                <p className="uudai-desc">Kingston Fury Beast RGB DDR5 64GB mang lại hiệu suất vượt trội cho game thủ và người sáng tạo nội dung cần bộ nhớ lớn và tốc độ cao. Với tốc độ 6000MHz và dung lượng 64GB (2x32GB), RAM hỗ trợ xử lý đa nhiệm nặng, dựng video, mô phỏng 3D và chơi game AAA một cách mượt mà. Sản phẩm tích hợp RGB có thể tùy chỉnh qua phần mềm Kingston FURY CTRL hoặc đồng bộ với phần mềm bo mạch chủ. Hỗ trợ XMP 3.0 giúp ép xung dễ dàng, điện áp 1.35V và tản nhiệt nhôm giúp vận hành ổn định. Đây là lựa chọn lý tưởng cho hệ thống cao cấp yêu cầu cả tốc độ, dung lượng và tính thẩm mỹ.</p>
              </div>
            </div>

            {/* Product Grid */}
            <div className="uudai-right">
              {[
                {
                  id: "gpu007",
                  category: "GPU",
                  name: "ZOTAC RTX 4060 Ti Twin Edge 8GB GDDR6",
                  price: "11.900.000 VNĐ",
                  oldPrice: "12.900.000 VNĐ",
                  rating: 4.00,
                  image: "https:\/\/nguyencongpc.vn\/media\/product\/25073-card-m--n-h--nh-zotac-gaming-geforce-rtx-4060-ti-8gb-twin-edge-7.jpg"
                },
                {
                  id: "case001",
                  category: "Case",
                  name: "Lian Li PC-O11 Dynamic",
                  price: "2.900.000 VNĐ",
                  oldPrice: "3.500.000 VNĐ",
                  rating: 5.00,
                  image: "https:\/\/www.createpcs.co.uk\/wp-content\/uploads\/2022\/05\/lian-li-o11-dynamic-evo-i7-12700kf-rtx3050-white-custom-pc-27-Large.jpg"
                },
                {
                  id: "cool002",
                  category: "Cooling",
                  name: "NZXT Kraken Z73 RGB",
                  price: "5.600.000 VNĐ",
                  oldPrice: "6.500.000 VNĐ",
                  rating: 4.00,
                  image: "https:\/\/cdn2.cellphones.com.vn\/x\/media\/catalog\/product\/c\/a\/case-may-tinh-nzxt-h9-elite-atx_12_.png"
                },
                {
                  id: "cool003",
                  category: "Cooling",
                  name: "Xigmatek Epix II",
                  price: "3.400.000 VNĐ",
                  oldPrice: "4.500.000 VNĐ",
                  rating: 4.00,
                  image: "https:\/\/cdn2.cellphones.com.vn\/x\/media\/catalog\/product\/n\/g\/nguon-may-tinh-xigmatek-x-power-iii-500-artic-450w_4__2.png"
                },
                {
                  id: "storage002",
                  category: "Storage",
                  name: "WD Black SN850X 2TB",
                  price: "3.800.000 VNĐ",
                  oldPrice: "4.500.000 VNĐ",
                  rating: 5.00,
                  image: "https:\/\/bizweb.dktcdn.net\/thumb\/1024x1024\/100\/329\/122\/products\/wd-black-sn850x-2tb-3d-hr.jpg?v=1741160387027"
                },
                {
                  id: "ram005",
                  category: "RAM",
                  name: "ADATA XPG LANCER RGB DDR5 32GB",
                  price: "2.800.000 VNĐ",
                  oldPrice: "3.690.000 VNĐ",
                  rating: 5.00,
                  image: "https:\/\/minhducpc.vn\/\/uploads\/thu_vien\/ram-adata-xpg-lancer-rgb-16gb-6000mhz-6.webp"
                }
              ].map((item, index) => (
                <div className="uudai-card"
                  key={item.id}
                  onClick={() => navigate(`/linh-kien/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="uudai-card-content">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="uudai-product-image"
                    />
                    <div className="uudai-product-info">
                      <p className="uudai-category">{item.category}</p>
                      <p className="uudai-price">
                        {item.price}
                        {item.oldPrice && <span className="uudai-old-price">{item.oldPrice}</span>}
                      </p>
                      <p className="uudai-name">{item.name}</p>
                      <p className="uudai-stars">
                        {'★'.repeat(Math.floor(item.rating))}
                        ({item.rating.toFixed(2)})
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
                <button onClick={() => window.open(showUrl, '_blank')}>Mở trong tab mới</button>
              </div>
            )}

          </div>
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



      {/* NEW */}
      <div className="promo-carousel-container">
        <div className="promo-content">
          <h2 className="carousel-title">Linh kiện mới</h2>
          <p className="sub-carousel-title">
            Khuyến mãi hấp dẫn từ các thương hiệu hàng đầu
          </p>
        </div>

        <div className="custom-slider-container">
          <div ref={prevRef} className="custom-swiper-button-prev">&#10094;</div>
          <div ref={nextRef} className="custom-swiper-button-next">&#10095;</div>
          <Swiper
            modules={[Navigation, Autoplay]}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            spaceBetween={20}
            slidesPerView={4}
            loop
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1.2, // Trên mobile: chỉ hiển thị 1 slide chính, 1 chút của slide kế
              },
              480: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
          >
            {promoSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div
                  className="slider-card"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="slider-overlay">
                    <p className="slider-title">{slide.title}</p>
                    <p className="slider-brand">{slide.brand}</p>
                    <p className="slider-price">{slide.price}</p>
                    <button className="shop-button"
                      onClick={() => navigate(`/linh-kien/${slide.id}`)}>SHOP NOW →</button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>


      {/* Services */}
      <div className="section services-section" id="dich-vu">
        <section class="recommended-section">
          <div class="background-text">SERVICES</div>
          <div class="content">
            <h2>Dịch vụ của chúng tôi</h2>
            <a href="#" class="view-all">View All Recommended →</a>
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

      {/* Tin tức */}
      <div className="news-wrapper">
        <section className="recommended-section" id="tintuc">
          <div class="background-text">BLOG</div>
          <div className="content">
            <h2>Tin tức</h2>
            <p href="/blog" className="view-all">Xem tin tức và sự kiện mới nhất gần đây</p>
          </div>
        </section>
        <div className="news-list">
          {newsData.map((post, index) => {
            const date = new Date(post.date);
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();

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
                    <button class="news-readmore">Read more</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>



      {/* Newsletter */}
      <div class="newsletter-section" id="dang-ki">
        <div class="newsletter-wrapper">
          {/* Left */}
          <div class="newsletter-content">
            <h2 class="newsletter-title">Ở nhà an toàn - Mua sắm nhu yếu phẩm tại shop chúng tôi</h2>
            <p class="newsletter-description">
              Mua sắm mỗi ngày cùng <span class="highlight">NANOCORE4</span>
            </p>
            <div class="newsletter-form">
              <Link to="/contact">
                <button class="newsletter-button">Subscribe</button>
              </Link>
            </div>
          </div>

          {/* Right */}
          <div class="newsletter-image">
            <img src="/photos/newsletter.jpg" alt="Delivery" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
