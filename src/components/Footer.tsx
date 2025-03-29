import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";
// import "./footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-column about-column">
            <div className="footer-logo">
              <h2 className="footer-logo-text">VietnamTour</h2>
            </div>
            <p className="footer-description">
              Với hơn 10 năm kinh nghiệm trong ngành du lịch, VietnamTour tự hào 
              là đơn vị cung cấp dịch vụ du lịch chất lượng cao, mang đến cho khách hàng 
              những trải nghiệm tuyệt vời và đáng nhớ.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Youtube size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="footer-column links-column">
            <h3 className="column-title">Liên kết nhanh</h3>
            <ul className="footer-links">
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/tours">Tour du lịch</Link></li>
              <li><Link to="/destinations">Điểm đến</Link></li>
              <li><Link to="/promotions">Khuyến mãi</Link></li>
              <li><Link to="/blog">Blog du lịch</Link></li>
              <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          <div className="footer-column tours-column">
            <h3 className="column-title">Tour phổ biến</h3>
            <ul className="footer-links">
              <li><Link to="/tours/ha-long">Vịnh Hạ Long</Link></li>
              <li><Link to="/tours/da-nang">Đà Nẵng - Hội An</Link></li>
              <li><Link to="/tours/phu-quoc">Phú Quốc</Link></li>
              <li><Link to="/tours/da-lat">Đà Lạt</Link></li>
              <li><Link to="/tours/sapa">Sa Pa</Link></li>
              <li><Link to="/tours/nha-trang">Nha Trang</Link></li>
            </ul>
          </div>

          <div className="footer-column contact-column">
            <h3 className="column-title">Thông tin liên hệ</h3>
            <ul className="contact-info">
              <li className="contact-item">
                <MapPin className="contact-icon" size={16} />
                <span>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="contact-item">
                <Phone className="contact-icon" size={16} />
                <span>Hotline: 1900 1234</span>
              </li>
              <li className="contact-item">
                <Mail className="contact-icon" size={16} />
                <span>Email: info@vietnamtour.com</span>
              </li>
              <li className="contact-item">
                <Clock className="contact-icon" size={16} />
                <span>Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Chủ nhật)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <div className="copyright">
            <p>&copy; 2025 VietnamTour. Tất cả các quyền được bảo lưu.</p>
          </div>
          <div className="terms-links">
            <Link to="/terms">Điều khoản sử dụng</Link>
            <span className="separator">|</span>
            <Link to="/privacy">Chính sách bảo mật</Link>
            <span className="separator">|</span>
            <Link to="/payment">Phương thức thanh toán</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
