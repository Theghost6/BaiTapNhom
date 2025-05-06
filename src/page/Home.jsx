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
import "../style/home.css"; // Import CSS từ file riêng
import "../style/all_linh_kien.css";
import { motion } from "framer-motion";
import { FaGift } from "react-icons/fa";
import { Variants } from "./funtion/Menu";
// import * as motion from "motion/react-client"

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("khachsan");
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const slides = [
    {
      id: 8,
      image: ["/photos/k.jpg"],
      title: "GPU NVIDIA GeForce RTX 4090",
      description: "Sức mạnh đồ họa vượt trội cho game thủ",
    },
    {
      id: 7,
      image:
        "/photos/l.jpg",
      title: "Bàn phím cơ Corsair K100",
      description: "Trải nghiệm gõ phím tuyệt vời với đèn RGB",
    },
    {
      id: 25,
      image: "/photos/j.jpg",
      title: "Chuột Logitech G502",
      description: "Chuột chơi game với cảm biến HERO 25K",
    },
  ];
  const LinhKien = [
    {
      id: "cpu001",
      ten: "Intel Core i9-13900K",
      hang: "Intel",
      gia: 14000000,
      bao_hanh: "3 năm",
      images: ["/photos/i.jpg"],
      thiet_bi_tuong_thich: ["Bo mạch chủ Intel 600/700-series"],
      khuyen_mai: "Tặng keo tản nhiệt Noctua NT-H1",
    },
    {
      id: "cpu001",
      ten: "Intel Core i9-13900K",
      hang: "Intel",
      gia: 14000000,
      bao_hanh: "3 năm",
      images: ["/photos/f.jpg"],
      thiet_bi_tuong_thich: ["Bo mạch chủ Intel 600/700-series"],
      khuyen_mai: "Tặng keo tản nhiệt Noctua NT-H1",
    },
    {
      id: "cpu001",
      ten: "Intel Core i9-13900K",
      hang: "Intel",
      gia: 14000000,
      bao_hanh: "3 năm",
      images: ["/photos/d.jpg"],
      thiet_bi_tuong_thich: ["Bo mạch chủ Intel 600/700-series"],
      khuyen_mai: "Tặng keo tản nhiệt Noctua NT-H1",
    },

  ];
  const promoSlides = [
    {
      id: 1,
      image: "/photos/nv.jpg",
      title: "NVDIA - Global leader in AI computing and graphics processing, known for its cutting-edge GPUs and innovative solutions in gaming, AI, and data science.",
    },
    {
      id: 2,
      image: "/photos/cs.jpg",
      title: "CORSAIR - Gaming peripherals and components.",
    },
    {
      id: 3,
      image: "/photos/rz.jpg",
      title: "RAZER - A global leader in gaming hardware, software, and systems.",
    },
    {
      id: 4,
      image: "/photos/msi.jpg",
      title: "MSI - Innovating gaming laptops and components for enthusiasts.",
    },
    {
      id: 5,
      image: "/photos/ss.jpg",
      title: "SAMSUNG - Pioneering innovation in memory, and consumer electronics.",
    },
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

  // Menu
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };

    if (menuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisible]);


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
                  onClick={() => navigate(`/dia-diem/${slides[activeSlide].id}`)}
                >
                  Đặt hàng ngay <ArrowRight className="button-icon" />
                </button>
                <button
                  className="secondary-button"
                  onClick={() => navigate(`/dia-diem/${slides[activeSlide].id}`)}
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
              <div className="promo-title">{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Navigation Bar - added here as requested */}
      {/* <div className="travel-container">
        <div className="travel-tabs">
          <div
            className={`tab-item ${activeTab === "khachsan" ? "active" : ""}`}
            onClick={() => setActiveTab("khachsan")}
          >
            <div className="tab-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M19,7h-8C9.9,7,9,7.9,9,9v10h12V9C21,7.9,20.1,7,19,7z M13,15h-2v-2h2V15z M13,11h-2V9h2V11z M17,15h-2v-2h2V15z M17,11h-2V9h2V11z M7,9H3v10h4V9z M5,15H3v-2h2V15z M5,11H3V9h2V11z M14,5c-1.1,0-2,0.9-2,2h-2.2C9.9,4.9,8.1,3.5,6,3.5v2C7.3,5.5,8.4,6.3,8.8,7.5H6C4.9,7.5,4,8.4,4,9.5v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-10c0-0.3-0.1-0.6-0.2-0.9c0-0.1,0.2-0.6,0.2-1.1C20,5.7,17.3,5,14,5z" />
              </svg>
            </div>
            <span>Khách sạn</span>
          </div>


          <div
            className={`tab-item ${activeTab === "combo" ? "active" : ""}`}
            onClick={() => setActiveTab("combo")}
          >
            <div className="tab-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M19,7h-8C9.9,7,9,7.9,9,9v10h12V9C21,7.9,20.1,7,19,7z M13,15h-2v-2h2V15z M13,11h-2V9h2V11z M17,15h-2v-2h2V15z M17,11h-2V9h2V11z M7,9H3v10h4V9z M5,15H3v-2h2V15z M5,11H3V9h2V11z" />
              </svg>
              <span>+</span>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M21,16v-2l-8-5V3.5C13,2.67,12.33,2,11.5,2S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5 L21,16z" />
              </svg>
            </div>
            <span>Combo</span>
          </div>

        </div>
        {activeTab === "khachsan" && <HotelSearch />}
        {activeTab === "maybay" && <FlySearch />}
        {activeTab === "combo" && <ComboSearch />}

      </div> */}

      <div className="section destinations-section">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <div className="section-header">
          <div>
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
          {LinhKien.map((lk, idx) => (
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
                <p className="products-price">
                  {lk.gia.toLocaleString("vi-VN")} VNĐ
                </p>
                <p className="products-warranty">
                  Bảo hành: {lk.bao_hanh}
                </p>
                <p className="products-compatible">
                  Tương thích: {lk.thiet_bi_tuong_thich.join(", ")}
                </p>
                {lk.khuyen_mai && (
                  <p className="products-sale">
                    <FaGift style={{ marginRight: "6px" }} />
                    {lk.khuyen_mai}
                  </p>
                )}
                {/* <div className="product-footer">
                  <span className="product-price">Từ {lk.gia}</span>
                  <button
                    className="details-button"
                    onClick={() => navigate(`/dia-diem/${lk.id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div> */}
              </div>
            </div>
          ))}
        </div>

      </div>


      {/* Promotion */}
      <div className="promotion-section">
        <div className="promotion-container">
          <div className="promotion-content">
            <div className="promotion-text">
              <h2 className="promotion-title" id="discount">Ưu đãi linh kiện 2025</h2>
              <p className="promotion-description">
                Giảm đến 30% cho các mua hàng combo. Đặt ngay hôm nay để
                nhận thêm quà tặng đặc biệt!
              </p>
              <div className="promotion-buttons">
                <button className="promotion-primary-button">Đặt ngay</button>
                <button className="promotion-secondary-button">
                  Xem ưu đãi
                </button>
              </div>
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
                      name: "CPU Intel Core i9-13900K",
                      price: "2,999,000đ",
                      trend: "+15%",
                    },
                    { name: "AMD Ryzen 9 7950X3D", price: "3,499,000đ", trend: "+23%" },
                    {
                      name: "ASUS ROG Strix Z790-E Gaming",
                      price: "4,199,000đ",
                      trend: "+18%",
                    },
                  ].map((tour, idx) => (
                    <li key={idx} className="deal-item">
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
            <h2 class="newsletter-title">Stay home & get your daily needs from our shop</h2>
            <p class="newsletter-description">
              Start Your Daily Shopping with <span class="highlight">Nest Mart</span>
            </p>
            <div class="newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                class="newsletter-input"
              />
              <button class="newsletter-button">Subscribe</button>
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
