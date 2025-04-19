import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Clock } from "lucide-react";
import "../style/footer.css";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { ArrowUp } from "lucide-react";


const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-column about-column">
            <div className="footer-logo">
              <h2 className="footer-logo-text">Nhom12 Travel</h2>
            </div>
            <p className="footer-description">
              -4th floor, Royal City, 666 Nguyen Trai District, Ho Chi Minh
            </p>
            <div className ="footer-phone-number" >
              <a href="tel:+ (+84) 394 02 1004">(+84) 394 02 1004</a>
            </div>
          </div>

          <div className="footer-column links-column">
            <h3 className="column-title">Liên kết nhanh</h3>
            <ul className="footer-links">
              <li>
                <Link to="/about">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/tours">Tour du lịch</Link>
              </li>
              <li>
                <Link to="/destinations">Điểm đến</Link>
              </li>
              <li>
                <Link to="/promotions">Khuyến mãi</Link>
              </li>
              <li>
                <Link to="/blog">Blog du lịch</Link>
              </li>
              <li>
                <Link to="/faq">Câu hỏi thường gặp</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column tours-column">
            <h3 className="column-title">Tour phổ biến</h3>
            <ul className="footer-links">
              <li>
                <Link to="/tours/ha-long">Vịnh Hạ Long</Link>
              </li>
              <li>
                <Link to="/tours/da-nang">Đà Nẵng - Hội An</Link>
              </li>
              <li>
                <Link to="/tours/phu-quoc">Phú Quốc</Link>
              </li>
              <li>
                <Link to="/tours/da-lat">Đà Lạt</Link>
              </li>
              <li>
                <Link to="/tours/sapa">Sa Pa</Link>
              </li>
              <li>
                <Link to="/tours/nha-trang">Nha Trang</Link>
              </li>
              <li>
                <Link to="/tours/trang-an">Tràng An</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column contact-column">
            <h3 className="column-title">Thông tin liên hệ</h3>
            <ul className="contact-info">
              <li className="contact-item">
                <Phone className="contact-icon" size={16} />
                <span>Hotline: 0123456789</span>
              </li>
              <li className="contact-item">
                <Mail className="contact-icon" size={16} />
                <span>Email: info@nhom12.com</span>
              </li>
              <li className="contact-item">
                <Clock className="contact-icon" size={16} />
                <span>Giờ làm việc: 8:00-18:00(Thứ 2-Chủ nhật)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <div className="terms-links">
            <Link to="/terms">Điều khoản sử dụng</Link>
            <span className="separator">|</span>
            <Link to="/privacy">Chính sách bảo mật</Link>
            <span className="separator">|</span>
            <Link to="/payment">Phương thức thanh toán</Link>
          </div>
        </div>
      </div>

      <div className="fixed-social-icons">
        <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
        <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
        <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
      </div>

      <button
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>

    </footer>

  );
};

export default Footer;
