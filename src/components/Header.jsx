import React, { useState, useEffect, useRef } from "react";
import { Search, Menu, X, ChevronDown, Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import "../style/header.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--header-height",
          `${headerHeight}px`
        );
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header ref={headerRef}>
      <div className="main-header">
        <div className="main-header-container">
          <div className="logo-container">
            <Link to="/" className="logo-link">
              <h1 className="logo">Group 12 Travel</h1>
            </Link>
          </div>

          <nav
            className={`main-navigation ${mobileMenuOpen ? "menu-open" : ""}`}
          >
            <button className="close-menu" onClick={toggleMobileMenu}>
              <X size={24} />
            </button>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link active">
                  Trang chủ
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link to="/tours" className="nav-link">
                  Tour du lịch{" "}
                  <ChevronDown size={16} className="dropdown-icon" />
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/tours/MienBac">Tour Miền Bắc</Link>
                  </li>
                  <li>
                    <Link to="/tours/MienTrung">Tour Miền Trung</Link>
                  </li>
                  <li>
                    <Link to="/tours/MienNam">Tour Miền Nam</Link>
                  </li>
                  <li>
                    <Link to="/tours/VIP">Tour Vip 3 Miền</Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link to="/destinations" className="nav-link">
                  Điểm đến
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/hotels" className="nav-link">
                  Khách sạn
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <button className="action-button search-button">
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="action-button wishlist-button">
              <Heart size={20} />
              <span className="badge">2</span>
            </Link>
            <Link to="/cart" className="action-button cart-button">
              <ShoppingBag size={20} />
              <span className="badge">0</span>
            </Link>

            <div className="user-actions">
              <Link to="/account" className="user-action-link">
                Đăng nhập
              </Link>
              <span className="separator">|</span>
              <Link to="/register" className="user-action-link">
                Đăng ký
              </Link>
            </div>

            <button className="mobile-menu-button" onClick={toggleMobileMenu}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
