import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Clock } from "lucide-react";
import "../style/footer.css";
import { Facebook, Twitter, Instagram, YoutubeIcon, Linkedin } from "lucide-react";
import { ArrowUp } from "lucide-react";
import {
  SiPaypal,
  SiApplepay,
  SiVisa,
  SiDiscover,
  SiJcb,
  SiAmazonpay,
  SiAmericanexpress,
} from "react-icons/si";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [footerError, setFooterError] = useState(null);


  // Fetch footer data from API
  useEffect(() => {
    const fetchFooterData = async () => {
      setIsLoading(true);
      setFooterError(null);

      try {
        console.log('Fetching footer data...');
        const response = await fetch('http://localhost/BaiTapNhom/backend/tt_home.php?path=footer', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Get the most recent active footer record (trang_thai = 1)
          const activeFooter = data.data
            .filter(item => item.trang_thai == 1) // Use == for loose comparison
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

          if (activeFooter) {
            console.log('Active footer:', activeFooter);
            setFooterData(activeFooter);
          } else {
            console.error('No active footer found');
            setFooterError('No active footer data available');
          }
        } else {
          console.error('API returned error:', data);
          setFooterError(data.error || 'Failed to load footer data');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setFooterError('Error fetching footer data: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-column about-column">
            <div className="footer-logo">
              <div className="footer-logo-container">
                <img src="/photos/Logo(2).png" alt="Logo" className="footer-logo-image" />
                <span className="footer-logo-text">NANOCORE4</span>
              </div>
            </div>
            {isLoading ? (
              <p className="footer-description">Đang tải thông tin...</p>
            ) : footerError ? (
              <p className="footer-description" style={{ color: 'red' }}>
                {footerError}
              </p>
            ) : (
              <p className="footer-description">
                <span>• {footerData.noi_dung}</span><br />
                <span>• Trường: {footerData.ten_truong}</span><br />
                <span>• Lớp: {footerData.ten_lop}</span><br />
                <span>• Thiết kế bởi: {footerData.tac_gia}</span><br />
                <span>• Địa điểm: {footerData.dia_diem}</span><br />
              </p>
            )}
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
                <Link to="#">Trung tâm bảo hành chính hãng</Link>
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
                <span>Email: info@nhom11.com</span>
              </li>
              <li className="contact-item">
                <Clock className="contact-icon" size={16} />
                <span>Giờ làm việc: 8:00-18:00(Thứ 2-Chủ nhật)</span>
              </li>
            </ul>

            <div className="social-icons">
              <h4 className="social-title">Follow us</h4>
              <div className="social-links-vertical">
                <a href="#" className="social-link" aria-label="Facebook"><Facebook size={20} /></a>
                <a href="#" className="social-link" aria-label="Twitter"><Twitter size={20} /></a>
                <a href="#" className="social-link" aria-label="Instagram"><Instagram size={20} /></a>
                <a href="#" className="social-link" aria-label="LinkedIn"><Linkedin size={20} /></a>
                <a href="#" className="social-link" aria-label="YouTube"><YoutubeIcon size={20} /></a>
              </div>
            </div>
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

          <div className="payment-icons">
            <SiPaypal size={28} />
            <SiApplepay size={28} />
            <SiVisa size={28} />
            <SiDiscover size={28} />
            <SiJcb size={28} />
            <SiAmazonpay size={28} />
            <SiAmericanexpress size={28} />
          </div>
        </div>
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
