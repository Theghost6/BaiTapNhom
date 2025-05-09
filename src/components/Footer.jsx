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
              <div className="footer-logo-container">
                <img src="/photos/logo.jpg" alt="Logo" className="footer-logo-image" />
                <span className="footer-logo-text">Component</span>
              </div>
            </div>
            <p className="footer-description">
              -4th floor, Royal City, 666 Nguyen Trai District, Ho Chi Minh
            </p>
            {/* <div className ="footer-phone-number" >
              <a href="tel:+ (+84) 394 02 1004">(+84) 394 02 1004</a>
            </div> */}
          </div>

          <div className="footer-column links-column">
            <h3 className="column-title">Thông tin và chính sách</h3>
            <ul className="footer-links">
              <li>
                <Link to="/online">Mua hàng và thanh toán online</Link>
              </li>
              <li>
                <Link to="/installment">Mua hàng trả góp online</Link>
              </li>
              <li>
                <Link to="/policy">Chính sách đổi trả</Link>
              </li>
              <li>
                <Link to="/member">Xem ưu đãi hội viên</Link>
              </li>
              <li>
                <Link to="/center">Trung tâm bảo hành chĩnh hãng</Link>
              </li>
              <li>
                <Link to="/search">Tra cứu hóa đơn điện tử</Link>
              </li>
              <li>
                <Link to="/offline">Mua hàng trực tiếp</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column tours-column">
            <h3 className="column-title">Dịch vụ và thông tin khác</h3>
            <ul className="footer-links">
              <li>
                <Link to="/customers">Khách hàng doanh nghiệp</Link>
              </li>
              <li>
                <Link to="/discount bill">Ưu đãi thanh toán</Link>
              </li>
              <li>
                <Link to="/active">Quy chế hoạt động</Link>
              </li>
              <li>
                <Link to="/indentification">Chính sách bảo mật thông tin cá nhân</Link>
              </li>
              <li>
                <Link to="/#">Chính sách bảo hành</Link>
              </li>
              <li>
                <Link to="/#">Liên hệ hợp tác kinh doanh</Link>
              </li>
              <li>
                <Link to="/#">Tuyển dụng</Link>
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
