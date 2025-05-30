
import React, { useState, useEffect, useRef } from "react";
import {
  UserCircle,
  ShoppingBag,
  LogOut,
  User,
  MapPin,
  Code,
  History,
  MessageCircle,
  Facebook,
  Instagram,
  Linkedin,
  PhoneCall,
} from "lucide-react";
import { FiPackage } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { FaBars, FaBlogger } from "react-icons/fa";
import "../style/header.css";
import products from "../page/funtion/Linh_kien.json";
import { useCart } from "../page/funtion/useCart";

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

// Định nghĩa cấu trúc danh mục phân cấp
const menuCategories = {
  "CPU": {
    items: allProducts.filter(item => item.danh_muc === "CPU")
  },
  "Mainboard": {
    items: allProducts.filter(item => item.danh_muc === "Mainboard")
  },
  "RAM": {
    items: allProducts.filter(item => item.danh_muc === "RAM")
  },
  "Ổ cứng": {
    items: allProducts.filter(item => item.danh_muc === "Storage")
  },
  "VGA": {
    items: allProducts.filter(item => item.danh_muc === "GPU")
  },
  "PSU": {
    items: allProducts.filter(item => item.danh_muc === "PSU")
  },
  "Case": {
    items: allProducts.filter(item => item.danh_muc === "Case")
  },
  "Tản nhiệt": {
    items: allProducts.filter(item => item.danh_muc === "Cooling")
  },
  "Phụ kiện khác": {
    items: allProducts.filter(item => item.danh_muc === "Peripherals")
  }
};

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Hà Nội");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const headerRef = useRef(null);
  const userDropdownRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { totalQuantity } = useCart();

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

      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(e.target)
      ) {
        setSelectedCategory(null);
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

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const filteredProducts = allProducts.filter((item) =>
    item.ten.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <header className="main-header" ref={headerRef}>
      <div className="main-header-container">
        <div className="header-items">
          <Link to="/" className="logo-link">
            <div className="logo-container" >
              <img src="/photos/Logo.png" alt="Logo" className="logo-image" />
              <span className="logo-text">NANOCORE4</span>
            </div>
          </Link>

          <div className="category-menu" ref={categoryMenuRef}>
            <button className="category-button">
              <FaBars size={21} className="menu-icon" />
              Danh mục
            </button>
            <div className="category-dropdown">
              {Object.keys(menuCategories).map((category) => (
                <div key={category} className="category-item-wrapper">
                  <div
                    className="category-item"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                    <span className="category-arrow">›</span>
                  </div>

                  {selectedCategory === category && (
                    <div className="subcategory-panel">
                      <h4 className="subcategory-title">{category}</h4>
                      <div className="subcategory-items">
                        {menuCategories[category].items.map((item) => (
                          <Link
                            key={item.id}
                            to={`/linh-kien/${item.id}`}
                            className="subcategory-item"
                            onClick={() => setSelectedCategory(null)}
                          >
                            {item.ten}
                          </Link>
                        ))}
                        {menuCategories[category].items.length === 0 && (
                          <div className="no-items">Không có sản phẩm</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="search-bar-container">
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
            <span>Tin tức</span>
          </Link>

          <div className="consult-selector">
            <button onClick={() => setShowLocationPopup(!showLocationPopup)}>
              <MessageCircle size={24} /> Tư vấn
            </button>
            {showLocationPopup && (
              <div className="consult-popup">
                <div className="popup-header flex justify-between items-start">
                  <div className="consult-info space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <PhoneCall size={20} strokeWidth={2} />
                      <span>0123 456 789</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook size={20} strokeWidth={2} />
                      <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
                        Facebook
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram size={20} strokeWidth={2} />
                      <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin size={20} strokeWidth={2} />
                      <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    </div>
                  </div>
                  <span
                    className="close-btn cursor-pointer text-lg font-bold"
                    onClick={() => setShowLocationPopup(false)}
                  >
                    ×
                  </span>
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
                      onError={(e) => {
                        // Fallback khi ảnh lỗi
                        e.target.onerror = null;
                        e.target.src = "/photos/default-avatar.png";
                      }}
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
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <ShoppingBag size={16} />
                        {totalQuantity > 0 && (
                          <span
                            style={{
                              position: "absolute",
                              top: "-8px",
                              right: "-10px",
                              backgroundColor: "red",
                              color: "white",
                              borderRadius: "50%",
                              padding: "1px 5px",
                              fontSize: "9px",
                              fontWeight: "bold",
                            }}
                          >
                            {totalQuantity}
                          </span>
                        )}
                      </div>
                      Đơn hàng của tôi
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
      </div>
    </header>
  );
};
export default Header;
