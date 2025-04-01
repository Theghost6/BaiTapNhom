import React, { useState, useEffect, useRef } from "react";
import { Search, Menu, X, ChevronDown, Heart, ShoppingBag, UserCircle, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../style/header.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const headerRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Add this to detect route changes

  // Function to check authentication status
  const checkAuthStatus = () => {
    const userData = localStorage.setItem("user", JSON.stringify({ username: "Tên người dùng" }));    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Lỗi phân tích dữ liệu người dùng:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // Initial check on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check again when location changes (user navigates)
  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  // Add event listener for storage events to detect changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'user') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--header-height",
          `${headerHeight}px`,
        );
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    // Thêm sự kiện click outside để đóng dropdown
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleLogout = () => {
    // Xóa token và thông tin user khỏi localStorage
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowUserDropdown(false);
    // Chuyển hướng về trang chủ
    navigate('/');
  };

  return (
    <header ref={headerRef}>
      <div className="main-header">
        <div className="main-header-container">
          <div className="logo-container">
            <Link to="/" className="logo-link">
              <h1 className="logo">Nhom12 Travel</h1>
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
              <span className="badge">0</span>
            </Link>
            <Link to="/cart" className="action-button cart-button">
              <ShoppingBag size={20} />
              <span className="badge">0</span>
            </Link>

            {isLoggedIn ? (
              <div className="user-profile" ref={userDropdownRef}>
                <button className="user-profile-button" onClick={toggleUserDropdown}>
                  <UserCircle size={24} className="user-icon" />
                  <span className="username">{user?.username}</span>
                </button>
                
                {showUserDropdown && (
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item">
                      <UserCircle size={16} />
                      <span>Thông tin cá nhân</span>
                    </Link>
                    <Link to="/my-bookings" className="dropdown-item">
                      <ShoppingBag size={16} />
                      <span>Đơn hàng của tôi</span>
                    </Link>
                    <button className="dropdown-item logout-button" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="user-actions">
                <Link to="/account" className="user-action-link">
                  Đăng nhập
                </Link>
                <span className="separator">|</span>
                <Link to="/register" className="user-action-link">
                  Đăng ký
                </Link>
              </div>
            )}

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
