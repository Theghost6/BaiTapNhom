import React, { useState, useEffect, useRef } from "react";
import {
  UserCircle,
  ShoppingBag,
  LogOut,
  User,
  MapPin,
  Code,
  History,
} from "lucide-react";
import { FiPackage } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { FaBars, FaBlogger } from "react-icons/fa";
import "../style/header.css";
import products from "../page/funtion/Linh_kien.json";

const allProducts = Object.values(products).flat();

const cities = [
  "Hồ Chí Minh",
  "Hà Nội",
  "Ninh bình",
  "Bắc Ninh",
  "Nam Định",
  "Thái Bình",
  "Hà Nam",
];

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
    "Hãng máy tính": ["Samsung", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI"],
    CPU: [
      "Intel Core i9 14900K",
      "Intel Core i7 13700K",
      "AMD Ryzen 9 7950X",
      "AMD Ryzen 7 7700X",
      "Apple M2 Pro",
      "Apple M2 Max",
      "Apple M1 Pro",
      "Apple M1 Max",
    ],
    Mainboard: [
      "ASUS ROG Strix Z790-E Gaming WiFi",
      "MSI MPG B650 Carbon WiFi",
      "Gigabyte AORUS X670E Master",
    ],
    GPU: [
      "NVIDIA GeForce RTX 4090",
      "NVIDIA GeForce RTX 4080",
      "NVIDIA GeForce RTX 4070",
      "NVIDIA GeForce RTX 4060",
      "AMD Radeon RX 7900 XTX",
      "AMD Radeon RX 7900 XT",
      "AMD Radeon RX 7800 XT",
      "AMD Radeon RX 7700 XT",
    ],
    PSU: [
      "Cooler Master V850 SFX Gold",
      "Corsair SF750 Platinum",
      "Seasonic Focus SGX-650",
      "EVGA SuperNOVA 650 GM",
      "FSP Dagger Pro 850W",
      "Thermaltake Toughpower SFX 600W",
      "be quiet! SFX L Power 500W",
      "SilverStone SX700-G",
    ],
    Cooling: [
      "Cooler Master Hyper 212 Black Edition",
      "Noctua NH-D15",
      "be quiet! Dark Rock Pro 4",
      "Corsair H100i RGB Platinum",
      "NZXT Kraken X63",],

    "Case": [
      "Cooler Master MasterBox Q300L",
      "NZXT H510",
      "Fractal Design Meshify C",
      "Corsair 4000D Airflow",
      "be quiet! Pure Base 500DX",
    ],
    Storage: [
      "Samsung 970 EVO Plus 1TB",
      "Western Digital Blue SN550 1TB",
      "Crucial P3 1TB",
      "Kingston A2000 1TB",
      "ADATA XPG SX8200 Pro 1TB",
    ],
    Peripherals: [
      "Logitech G Pro X Superlight",
      "Razer DeathAdder V2",
      "Corsair K70 RGB MK.2",
      "SteelSeries Apex Pro TKL",
      "HyperX Cloud II",
    ],
    RAM: [
      "Corsair Vengeance LPX 16GB (2x8GB) DDR4-3200",
      "G.Skill Ripjaws V 16GB (2x8GB) DDR4-3600",
      "Kingston HyperX Fury 16GB (2x8GB) DDR4-3200",
      "Crucial Ballistix 16GB (2x8GB) DDR4-3600",
      "Patriot Viper Steel 16GB (2x8GB) DDR4-3200",
    ],
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
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
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
  const filteredProducts = allProducts.filter((item) =>
    item.ten.toLowerCase().includes(searchInput.toLowerCase())
  );
 
  return (
    <header className="main-header" ref={headerRef}>
      <div className="main-header-container">
        <Link to="/" className="logo-link">
          <div className="logo-container" >
            <img src="/photos/logo.jpg" alt="Logo" className="logo-image" />
            <span className="logo-text">Component</span>
          </div>
        </Link>

        <div className="category-menu">
          <button className="category-button">
            <FaBars size={21} className="menu-icon" />
            Danh mục
          </button>
          <div className="mega-menu">
            {Object.entries(categories).map(([title, items], idx) => (
              <div className="mega-menu-column" key={idx}>
                <h4 className="mega-menu-title">{title}</h4>
                <ul className="mega-menu-list">
                  {items.map((item, i) => (
                    <li key={i} className="mega-menu-item">
                      {item}
                    </li>
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

          {searchInput && (
            <div className="search-suggestions">
              {filteredProducts.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="search-suggestion-item"
                  onClick={() => {
                    navigate(`/linh-kien/${item.id}`);
                    setSearchInput("");
                  }}
                >
                  {item.ten}
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="search-suggestion-item">
                  Không tìm thấy kết quả
                </div>
              )}
            </div>
          )}
        </div>

        <Link to="/contact" className="contact-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .56 2.57 2 2 0 0 1-.45 2.11L9 10a16 16 0 0 0 5 5l.6-.6a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.57.56A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span>Liên hệ</span>
        </Link>

        <Link to="/developer" className="developer-button">
          <Code size={24} />
          <span>Nhà phát triển</span>
        </Link>

        <Link to="/blog" className="discount-button">
          <FaBlogger size={24} />
          <span>Blog</span>
        </Link>

        <div className="location-selector">
          <button onClick={() => setShowLocationPopup(!showLocationPopup)}>
            <MapPin size={24} /> {selectedCity}
          </button>
          {showLocationPopup && (
            <div className="location-popup">
              <div className="popup-header">
                <span>Chọn tỉnh/thành phố</span>
                <span
                  className="close-btn"
                  onClick={() => setShowLocationPopup(false)}
                >
                  ×
                </span>
              </div>
              <input
                type="text"
                placeholder="Nhập tên tỉnh thành"
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <div className="location-list">
                {cities
                  .filter((city) =>
                    city.toLowerCase().includes(searchInput.toLowerCase())
                  )
                  .map((city, index) => (
                    <div
                      key={index}
                      className={`location-item ${
                        selectedCity === city ? "selected" : ""
                      }`}
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
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="header-avatar"
                  />
                ) : (
                  <div className="default-avatar">
                    <UserCircle size={24} color="#7f8c8d" />
                  </div>
                )}
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
                  <Link to="/lich_su_don_hang" className="dropdown-item">
                    <History size={16} /> Lịch sử đơn hàng
                  </Link>
                  {user?.role === "admin" && (
                    <>
                      <Link to="/admin" className="dropdown-item">
                        <User size={16} /> Quản trị viên
                      </Link>
                      <Link to="/tracuu" className="dropdown-item">
                        <FiPackage size={16} /> Tra cứu đơn hàng
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="dropdown-item logout-button"
                  >
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
