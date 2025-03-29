import React, { useState, useEffect } from "react";
import { ArrowRight, Star, MapPin, Calendar, TrendingUp } from "lucide-react";
import "./home.css"; // Import CSS từ file riêng

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      image: "https://cdn.pixabay.com/photo/2019/05/29/00/08/vietnam-4236430_1280.jpg",
      title: "Vịnh Hạ Long",
      description: "Kỳ quan thiên nhiên thế giới tại Việt Nam",
    },
    {
      image: "https://cdn.xanhsm.com/2025/02/f69feca7-canh-dep-phu-quoc-7.jpg",
      title: "Phú Quốc",
      description: "Thiên đường biển đảo của miền Nam",
    },
    {
      image: "https://mia.vn/media/uploads/blog-du-lich/an-tuong-ve-dep-hung-vi-noi-quan-the-danh-thang-trang-an-1-1640247493.jpg",
      title: "Tràng An",
      description: "Khu du lịch sinh thái Tràng An",
    },
  ];

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Destinations data
  const destinations = [
    {
      name: "Đà Nẵng",
      image: "https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20%C4%91%C3%A0%20n%E1%BA%B5ng/anh-dep-da-nang-2.jpg",
      description: "Thành phố đáng sống với bãi biển tuyệt đẹp và cầu Rồng.",
      rating: 4.8,
      price: "3,500,000đ",
    },
    {
      name: "Hội An",
      image: "https://hoianpark.com/userfiles/image/du-lich/net-dep-ha/ky-uc-hoi-an-ve-dem/ky-uc-hoi-an-ve-dem-1.jpg",
      description: "Phố cổ lãng mạn với những chiếc đèn lồng đầy màu sắc.",
      rating: 4.9,
      price: "2,800,000đ",
    },
    {
      name: "Nha Trang",
      image: "https://media.istockphoto.com/id/827359312/vi/anh/to%C3%A0n-c%E1%BA%A3nh-th%C3%A0nh-ph%E1%BB%91-nha-trang-%E1%BB%9F-vi%E1%BB%87t-nam-t%E1%BB%AB-quan-%C4%91i%E1%BB%83m-m%C3%A1y-bay-kh%C3%B4ng-ng%C6%B0%E1%BB%9Di-l%C3%A1i.jpg?s=612x612&w=0&k=20&c=coljvNU4PTpoKVPfTfuNsHh6u9Xs36BI-o6Pmnhq55I=",
      description:
        "Thiên đường biển với các resort sang trọng và ẩm thực hải sản.",
      rating: 4.7,
      price: "4,200,000đ",
    },
  ];

  return (
    <div className="home-container">
      {/* Hero Slider */}
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === activeSlide ? "active-slide" : ""}`}
          >
            <div
              className="slide-background"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              <div className="slide-overlay"></div>
            </div>
            <div className="slide-content">
              <div className="slide-text">
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-description">{slide.description}</p>
                <div className="slide-buttons">
                  <button className="primary-button">
                    Đặt tour ngay <ArrowRight className="button-icon" />
                  </button>
                  <button className="secondary-button">Tìm hiểu thêm</button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide indicators */}
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`slide-indicator ${index === activeSlide ? "active-indicator" : ""}`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trending Destinations */}
      <div className="section destinations-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Điểm đến nổi bật</h2>
            <p className="section-subtitle">
              Những địa điểm được yêu thích nhất năm 2025
            </p>
          </div>
          <button className="view-all-button">
            Xem tất cả <ArrowRight className="button-icon-small" />
          </button>
        </div>

        <div className="destinations-grid">
          {destinations.map((dest, idx) => (
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
                  <button className="details-button">Xem chi tiết</button>
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
              <h2 className="promotion-title">Ưu đãi mùa hè 2025</h2>
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
      <div className="newsletter-section">
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
