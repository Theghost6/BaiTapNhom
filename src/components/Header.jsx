import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ShoppingBag,
  UserCircle,
  LogOut,
  User,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../style/header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const headerRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const USER_KEY = "user";

  const checkAuthStatus = () => {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        parsedUser.role = parsedUser.role || "user";
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem(USER_KEY);
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    const handleStorageChange = (event) => {
      if (event.key === USER_KEY) {
        checkAuthStatus();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location]);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

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

  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);

  const handleLogout = async () => {
    try {
      localStorage.removeItem(USER_KEY);
      setIsLoggedIn(false);
      setUser(null);
      setShowUserDropdown(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Đăng xuất thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <header ref={headerRef} className="main-header">
      <div className="main-header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <h1 className="logo">Group 12 Travel</h1>
          </Link>
        </div>

        <nav className="main-navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link active">Trang chủ</Link>
            </li>
            <li className="nav-item dropdown">
              <Link to="/tours" className="nav-link">
                Tour du lịch <ChevronDown size={16} className="dropdown-icon" />
              </Link>
              <ul className="dropdown-menu">
                <li><Link to="/tours/MienBac">Tour Miền Bắc</Link></li>
                <li><Link to="/tours/MienTrung">Tour Miền Trung</Link></li>
                <li><Link to="/tours/MienNam">Tour Miền Nam</Link></li>
                <li><Link to="/tours/VIP">Tour Vip 3 Miền</Link></li>
              </ul>
            </li>
            <li className="nav-item"><Link to="/AllDiaDiem" className="nav-link">Điểm đến</Link></li>
            <li className="nav-item"><Link to="/hotels" className="nav-link">Khách sạn</Link></li>
            <li className="nav-item"><Link to="/contact" className="nav-link">Liên hệ</Link></li>
          </ul>
        </nav>

        <div className="header-actions">
          {isLoggedIn ? (
            <div className="user-profile" ref={userDropdownRef}>
              <button className="user-profile-button" onClick={toggleUserDropdown}>
                <UserCircle size={24} className="user-icon" />
                <span className="username">{user?.username || user?.identifier || "Người dùng"}</span>
              </button>
              {showUserDropdown && (
                <div className="user-dropdown">
                  <Link to="/Profile" className="dropdown-item">
                    <UserCircle size={16} /> Thông tin cá nhân
                  </Link>
                  <Link to="/cart" className="dropdown-item">
                    <ShoppingBag size={16} /> Đơn hàng của tôi
                  </Link>
                  {user?.role === "admin" && (
                    <Link to="/admin" className="dropdown-item">
                      <User size={16} /> Quản trị viên
                    </Link>
                  )}
                  <button className="dropdown-item logout-button" onClick={handleLogout}>
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="user-actions">
              <span className="separator">|</span>
              <Link to="/register" className="user-action-link">
                <User size={24} strokeWidth={1.5} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
