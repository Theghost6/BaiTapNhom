import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { motion } from "framer-motion";
import { FaGift } from "react-icons/fa";
import { Variants } from "./funtion/Menu";
// import * as motion from "motion/react-client"

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const [openedIndex, setOpenedIndex] = useState(null);
  const [showUrl, setShowUrl] = useState(null);

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
      image: ["/photos/m.jpeg"],
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
      images: ["/photos/i.jpg"],
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

  ];
  const promoSlides = [
    // {
    //   id: 1,
    //   image: "/photos/nv.jpg",
    //   title: "NVDIA - Global leader in AI computing and graphics processing, known for its cutting-edge GPUs and innovative solutions in gaming, AI, and data science.",
    // },
    // {
    //   id: 2,
    //   image: "/photos/cs.jpg",
    //   title: "CORSAIR - Gaming peripherals and components.",
    // },
    // {
    //   id: 3,
    //   image: "/photos/rz.jpg",
    //   title: "RAZER - A global leader in gaming hardware, software, and systems.",
    // },
    {
      id: 4,
      image: "/photos/msi.jpg",
      title: "MSI - Innovating gaming laptops and components for enthusiasts.",
    },
    // {
    //   id: 5,
    //   image: "/photos/ss.jpg",
    //   title: "SAMSUNG - Pioneering innovation in memory, and consumer electronics.",
    // },
    {
      id: 6,
      image: "/photos/asus.jpg",
      title: "ASUS - Leading the way in computer hardware and electronics.",
    },
    {
      id: 7,
      image: "/photos/amd.jpg",
      title: "AMD - Pioneering high-performance computing and graphics solutions.",
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
              className={`slide-indicator${index === activeSlide ? " active-indicator" : ""
                }`}
              aria-label={`Slide ${index + 1}`}
              aria-current={index === activeSlide ? "true" : undefined}
            />
          ))}
        </div>
      </div>

      <div className="promo-grid-container">
        <div className="promo-grid">
          {promoSlides.map((item) => (
            <div key={item.id} className="promo-card">
              <div
                className="promo-image"
                style={{ backgroundImage: `url('${item.image}')` }}
              ></div>
              {/* <div className="promo-title">{item.title}</div> */}
            </div>
          ))}
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
                  {console.log("wrfwedewdwed", lk)}
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
      <div className="promotion-section" id = "uudai">
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
        <div className="uudai-header">
          <h2 className="uudai-title">Deal Of The Week</h2>
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

        <div className="uudai-content">
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


      
      {/* Newsletter */}
      <div class="newsletter-section" id="dang-ki">
        <div class="newsletter-wrapper">
          {/* left */}
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

          {/* right */}
          {/* <div class="newsletter-image">
            <img src="/photos/g.jpg" alt="Delivery" />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
