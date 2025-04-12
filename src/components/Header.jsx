import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Heart,
  ShoppingBag,
  UserCircle,
  LogOut,
  User,
} from "lucide-react";
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
  const location = useLocation();

  const USER_KEY = "user";

  // Function to check authentication status with detailed logging
  const checkAuthStatus = () => {
    const userData = localStorage.getItem(USER_KEY);
    console.log("Checking auth status, userData from localStorage:", userData);

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
        console.log("Parsed user data:", parsedUser);
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

  // Sync with Register component's backend and handle storage changes
  useEffect(() => {
    checkAuthStatus();

    const handleStorageChange = (event) => {
      if (event.key === USER_KEY) {
        console.log("Storage changed, key:", event.key, "new value:", event.newValue);
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location]);

  // Handle header height and dropdown click outside
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

    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);

  // Enhanced logout function to sync with backend if needed
  const handleLogout = async () => {
      try {
        // Call backend logout endpoint if it exists (optional)
        await fetch("http://localhost/backend/logout.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }).catch(error => console.warn("No logout endpoint or error:", error));

        // Clear all user data from localStorage
        localStorage.removeItem(USER_KEY);

        // Update state
        setIsLoggedIn(false);
        setUser(null);
        setShowUserDropdown(false);


        // Redirect to login or home page
        navigate("/");

        // Optional: Reload to ensure clean state
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

        <nav className={`main-navigation ${mobileMenuOpen ? "menu-open" : ""}`}>
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
                Tour du lịch <ChevronDown size={16} className="dropdown-icon" />
              </Link>
              <ul className="dropdown-menu">
                <li><Link to="/tours/MienBac">Tour Miền Bắc</Link></li>
                <li><Link to="/tours/MienTrung">Tour Miền Trung</Link></li>
                <li><Link to="/tours/MienNam">Tour Miền Nam</Link></li>
                <li><Link to="/tours/VIP">Tour Vip 3 Miền</Link></li>
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

          {isLoggedIn ? (
            <div className="user-profile" ref={userDropdownRef}>
              <button
                className="user-profile-button"
                onClick={toggleUserDropdown}
              >
                <UserCircle size={24} className="user-icon" />
                <span className="username">
                  {user?.username || user?.identifier || "Người dùng"}
                </span>
              </button>

              {showUserDropdown && (
                <div className="user-dropdown">
                  <Link to="/Profile" className="dropdown-item">
                    <UserCircle size={16} /> Thông tin cá nhân
                  </Link>
                  <Link to="/cart" className="dropdown-item">
                    <ShoppingBag size={16} /> Đơn hàng của tôi
                  </Link>
                  <button
                    className="dropdown-item logout-button"
                    onClick={handleLogout}
                  >
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

          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
