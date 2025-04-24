import React, { useState, useEffect } from "react";
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
import FlySearch from "../page/funtion/FlySearch"; // Import file chức năng đặt vé máy bay
import HotelSearch from "../page/funtion/HotelSearch"; // Import file chức năng đặt vé máy bay
import ComboSearch from "../page/funtion/ComboSearch";

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("khachsan");
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const slides = [
    {
      id: 8,
      image:
        "https://mia.vn/media/uploads/blog-du-lich/an-tuong-ve-dep-hung-vi-noi-quan-the-danh-thang-trang-an-1-1640247493.jpg",
      title: "Tràng An",
      description: "Khu du lịch sinh thái Tràng An",
    },
    {
      id: 7,
      image:
        "https://cdn.pixabay.com/photo/2016/10/16/17/03/vietnam-1745819_1280.jpg",
      title: "Vịnh Hạ Long",
      description: "Kỳ quan thiên nhiên thế giới tại Việt Nam",
    },
    {
      id: 25,
      image: "https://cdn.xanhsm.com/2025/02/f69feca7-canh-dep-phu-quoc-7.jpg",
      title: "Phú Quốc",
      description: "Thiên đường biển đảo của miền Nam",
    },
  ];
  const Dia_Diem = [
    {
      id: 11,
      name: "Đà Nẵng",
      image:
        "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20%C4%91%C3%A0%20n%E1%BA%B5ng/anh-dep-da-nang-2.jpg",
      description: "Thành phố đáng sống với bãi biển tuyệt đẹp và cầu Rồng.",
      rating: 4.8,
      price: "3,500,000đ",
    },
    {
      id: 12,
      name: "Hội An",
      image:
        "https://hoianpark.com/userfiles/image/du-lich/net-dep-ha/ky-uc-hoi-an-ve-dem/ky-uc-hoi-an-ve-dem-1.jpg",
      description: "Phố cổ lãng mạn với những chiếc đèn lồng đầy màu sắc.",
      rating: 4.9,
      price: "2,800,000đ",
    },
    {
      id: 13,
      name: "Nha Trang",
      image:
        "https://media.istockphoto.com/id/827359312/vi/anh/to%C3%A0n-c%E1%BA%A3nh-th%C3%A0nh-ph%E1%BB%91-nha-trang-%E1%BB%9F-vi%E1%BB%87t-nam-t%E1%BB%AB-quan-%C4%91i%E1%BB%83m-m%C3%A1y-bay-kh%C3%B4ng-ng%C6%B0%E1%BB%9Di-l%C3%A1i.jpg?s=612x612&w=0&k=20&c=coljvNU4PTpoKVPfTfuNsHh6u9Xs36BI-o6Pmnhq55I=",
      description:
        "Thiên đường biển với các resort sang trọng và ẩm thực hải sản.",
      rating: 4.7,
      price: "4,200,000đ",
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
      <button className="menu-toggle-button" onClick={() => setMenuVisible(!menuVisible)}>
        ☰ 
      </button>

      {/* Left Box Menu */}
      {menuVisible && (
        <div className="left-box-menu">
          <ul>
            <li><button onClick={() => document.getElementById('hero-slider').scrollIntoView({ behavior: 'smooth' })}>🏠 Trang chủ</button></li>
            <li><button onClick={() => document.getElementById('diem-den').scrollIntoView({ behavior: 'smooth' })}>📍 Điểm đến</button></li>
            <li><button onClick={() => document.getElementById('discount').scrollIntoView({ behavior: 'smooth' })}>🛎️ Ưu đãi nổi bật</button></li>
            <li><button onClick={() => document.getElementById('dang-ki').scrollIntoView({ behavior: 'smooth' })}>📞 Đăng kí ưu đãi</button></li>
          </ul>
        </div>
      )}

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
                  Đặt tour ngay <ArrowRight className="button-icon" />
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


      {/* Travel Navigation Bar - added here as requested */}
      <div className="travel-container">
        {/* Navigation Tabs */}
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

          <div
            className={`tab-item nav-item dropdown ${activeTab === "services" ? "active" : ""
              }`}
            onClick={() => setActiveTab("services")}
          >
            <div className="tab-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M4,8h4V4H4V8z M10,20h4v-4h-4V20z M4,20h4v-4H4V20z M4,14h4v-4H4V14z M10,14h4v-4h-4V14z M16,4v4h4V4H16z M10,8h4V4h-4V8z M16,14h4v-4h-4V14z M16,20h4v-4h-4V20z" />
              </svg>
            </div>
            <span>Dịch vụ</span>
            <Link to="/services" className="nav-link-arrow">
              <ChevronDown size={16} className="dropdown-icon" />
            </Link>
            <ul className="dropdown-menu">
              <li>
                <Link to="/services/Xe dua don">Xe đưa đón</Link>
              </li>
              <li>
                <Link to="/services/Du thuyền">Thuê du thuyền</Link>
              </li>
              <li>
                <Link to="/services/Party">Tổ chức tiệc</Link>
              </li>
            </ul>
          </div>
        </div>
        {activeTab === "khachsan" && <HotelSearch />}
        {activeTab === "maybay" && <FlySearch />}
        {activeTab === "combo" && <ComboSearch />}
        {/* Search Panel */}
        {/* <div className="search-panel">
          <div className="search-row">
            <button className="search-button">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M15.5,14h-0.79l-0.28-0.27C15.41,12.59,16,11.11,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5S5.91,16,9.5,16 c1.61,0,3.09-0.59,4.23-1.57L14,14.71v0.79l5,4.99L20.49,19L15.5,14z M9.5,14C7.01,14,5,11.99,5,9.5S7.01,5,9.5,5S14,7.01,14,9.5 S11.99,14,9.5,14z" />
              </svg>
            </button>
          </div>
        </div> */}
      </div>
      <div className="section destinations-section">
        <div className="section-header">
          <div>
            <h2 className="section-title" id="diem-den">Điểm đến nổi bật</h2>
            <p className="section-subtitle">
              Những địa điểm được yêu thích nhất năm 2025
            </p>
          </div>
          <button
            className="view-all-button"
            onClick={() => navigate("/AllDiaDiem")}
          >
            Xem tất cả <ArrowRight className="button-icon-small" />
          </button>{" "}
        </div>

        <div className="destinations-grid">
          {Dia_Diem.map((dest, idx) => (
            <div key={idx} className="destination-card">
              <div className="destination-image-container">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="destination-image"
                />
                <div className="destination-rating">
                  <Star className="star-icon" />
                  <span className="rating-value">{dest.rating}</span>
                </div>
              </div>
              <div className="destination-details">
                <div className="destination-header">
                  <MapPin className="location-icon" />
                  <h3 className="destination-name">{dest.name}</h3>
                </div>
                <p className="destination-description">{dest.description}</p>
                <div className="destination-footer">
                  <span className="destination-price">Từ {dest.price}</span>
                  <button
                    className="details-button"
                    onClick={() => navigate(`/dia-diem/${dest.id}`)}
                  >
                    Xem chi tiết
                  </button>{" "}
                </div>
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
              <h2 className="promotion-title" id="discount">Ưu đãi mùa hè 2025</h2>
              <p className="promotion-description">
                Giảm đến 30% cho các tour du lịch biển đảo. Đặt ngay hôm nay để
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
                  <h3 className="deals-title">Tour hot trong tháng</h3>
                </div>
                <ul className="deals-list">
                  {[
                    {
                      name: "Phú Quốc 3N2Đ",
                      price: "2,999,000đ",
                      trend: "+15%",
                    },
                    { name: "Đà Lạt 4N3Đ", price: "3,499,000đ", trend: "+23%" },
                    {
                      name: "Hà Giang 5N4Đ",
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
      <div className="section services-section">
        <h2 className="section-title center">Dịch vụ của chúng tôi</h2>
        <div className="services-grid">
          {[
            {
              icon: "🏨",
              title: "Khách sạn cao cấp",
              desc: "Đa dạng lựa chọn từ bình dân đến 5 sao với giá tốt nhất thị trường.",
            },
            {
              icon: "🚗",
              title: "Đưa đón tận nơi",
              desc: "Dịch vụ xe riêng đưa đón sân bay và di chuyển trong suốt hành trình.",
            },
            {
              icon: "🍽️",
              title: "Ẩm thực đặc sắc",
              desc: "Trải nghiệm ẩm thực địa phương với những món ăn đặc sản nổi tiếng.",
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
      <div className="newsletter-section" id="dang-ki">
        <div className="newsletter-container">
          <h2 className="newsletter-title">Đăng ký nhận thông tin ưu đãi</h2>
          <p className="newsletter-description">
            Hãy đăng ký để nhận thông tin về các ưu đãi và điểm đến mới nhất từ
            chúng tôi. Chúng tôi hứa sẽ không gửi spam!
          </p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Email của bạn"
              className="newsletter-input"
            />
            <button className="newsletter-button">Đăng ký ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
