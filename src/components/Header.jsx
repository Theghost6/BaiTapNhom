import React, { useState, useEffect, useRef } from "react";
import { UserCircle, ShoppingBag, LogOut, User, MapPin, Code, Gift } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { Menu } from "lucide-react";
import "../style/header.css";

const cities = ["Hồ Chí Minh", "Hà Nội", "An Giang", "Bắc Giang", "Bắc Ninh", "Bến Tre", "Bình Dương", "Bình Phước", "Cà Mau"];

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Hà Nội");
  const [searchInput, setSearchInput] = useState("");

  const headerRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = {
    "Hãng máy tính": ["Macbook", "Lenovo", "Asus", "Acer", "Razer", "Dell", "Microsoft", "HP", "Nokia"],
    "Bàn phím": ["Dưới 2 triệu", "Từ 2 - 4 triệu", "Từ 4 - 7 triệu", "Từ 7 - 13 triệu", "Từ 13 - 20 triệu", "Trên 20 triệu"],
    "CPU HOT ⚡": ["Apple M4 MAX", "Apple M4 Pro (14 core)", "Apple M4 Pro (12 core)", "Intel Core Ultra 9 285HX", "Ryzen AI Max+ 395", "Ryzen 9 7945HX3D", "Intel Core i9 14900HX", " Intel Core i7 14700HX", "Ryzen AI 9 365"],
    "Chuột": ["Không dây", "Có dây", "Bluetooth", "Đồng", "Cống", "Ratatoulie"],
    "RAM HOT ⚡": ["HP", "Corsair", "GigaByte", "Geil", "Crucial", "Kingston", "G.Skill", "Adata", "Apacer"]
  };


  const USER_KEY = "user";

  const checkAuthStatus = () => {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        parsedUser.role = parsedUser.role || "user";
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch {
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
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);
  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    setIsLoggedIn(false);
    setUser(null);
    setShowUserDropdown(false);
    navigate("/");
  };

  return (
    <header className="main-header" ref={headerRef}>
      <div className="main-header-container">
        <Link to="/" className="logo-link">
          <h1 className="logo">12 COMPONENTS</h1>
        </Link>

        <div className="category-menu">
          <button className="category-button">
            <Menu size={24} className="menu-icon" />
            Danh mục
          </button>
          <div className="mega-menu">
            {Object.entries(categories).map(([title, items], idx) => (
              <div className="mega-menu-column" key={idx}>
                <h4 className="mega-menu-title">{title}</h4>
                <ul className="mega-menu-list">
                  {items.map((item, i) => (
                    <li key={i} className="mega-menu-item">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="search-bar">
          <Search className="search-icon" size={24} />
          <input
            type="text"
            placeholder="Bạn cần tìm gì?"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <Link to="/contact" className="contact-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .56 2.57 2 2 0 0 1-.45 2.11L9 10a16 16 0 0 0 5 5l.6-.6a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.57.56A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span>Liên hệ</span>
        </Link>

        <Link to="/developer" className="developer-button">
          <Code size={24} />
          <span>Nhà phát triển</span>
        </Link>

        <Link to="/discount" className="discount-button">
          <Gift size={24} />
          <span>Ưu đãi</span>
        </Link>


        <div className="location-selector">
          <button onClick={() => setShowLocationPopup(!showLocationPopup)}>
            <MapPin size={24} /> {selectedCity}
          </button>
          {showLocationPopup && (
            <div className="location-popup">
              <div className="popup-header">
                <span>Chọn tỉnh/thành phố</span>
                <span className="close-btn" onClick={() => setShowLocationPopup(false)}>×</span>
              </div>
              <input
                type="text"
                placeholder="Nhập tên tỉnh thành"
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <div className="location-list">
                {cities
                  .filter((city) => city.toLowerCase().includes(searchInput.toLowerCase()))
                  .map((city, index) => (
                    <div
                      key={index}
                      className={`location-item ${selectedCity === city ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowLocationPopup(false);
                      }}
                    >
                      {city}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="header-actions">
          {isLoggedIn ? (
            <div className="user-profile" ref={userDropdownRef}>
              <button onClick={toggleUserDropdown}>
                <UserCircle size={24} />
                <span>{user?.username || "Người dùng"}</span>
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
                  <button onClick={handleLogout} className="dropdown-item logout-button">
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="user-actions">
              <span className="separator">|</span>
              <Link to="/register">
                <User size={24} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
