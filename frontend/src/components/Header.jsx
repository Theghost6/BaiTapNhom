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
  Heart,
} from "lucide-react";
import { FiPackage } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { FaBars, FaBlogger } from "react-icons/fa";
import "../style/header.css";
import products from "../page/function/products_data.json";
import { useCart } from "../page/function/useCart";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChat } from '../page/chat/ChatContext';
import { useSocket } from '../page/chat/SocketContext';
import ChatPopup from '../page/chat/ChatPopup';
import { setCookie, getCookie, removeCookie } from "../helper/cookieHelper";

const allProducts = Object.values(products).flat();
const apiUrl = import.meta.env.VITE_HOST;
// Định nghĩa cấu trúc danh mục phân cấp
const menuCategories = {
  CPU: {
    items: allProducts.filter(item => item.loai === "CPU")
  },
  Mainboard: {
    items: allProducts.filter(item => item.loai === "Mainboard")
  },
  RAM: {
    items: allProducts.filter(item => item.loai === "RAM")
  },
  "Ổ cứng": {
    items: allProducts.filter(item => item.loai === "storage")
  },
  VGA: {
    items: allProducts.filter(item => item.loai === "GPU")
  },
  PSU: {
    items: allProducts.filter(item => item.loai === "PSU")
  },
  Case: {
    items: allProducts.filter(item => item.loai === "case")
  },
  "Tản nhiệt": {
    items: allProducts.filter(item => item.loai === "tan_nhiet")
  },
  "Phụ kiện khác": {
    items: allProducts.filter(item => item.loai === "Peripherals")
  }
};
console.log("Menu Categories:", menuCategories);
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Hà Nội");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistError, setWishlistError] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const headerRef = useRef(null);
  const userDropdownRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const popupRef = useRef(null);
  const { totalQuantity } = useCart();

  // Socket và Chat contexts
  const { openChat, unreadCount } = useChat();
  const { connectSocket, disconnectSocket, isConnected } = useSocket();

  const USER_KEY = "user";

  // Check auth status and fetch user profile
  useEffect(() => {
    const checkAuthStatus = async () => {
      // const userData = localStorage.getItem(USER_KEY);
      const userData = getCookie(USER_KEY);
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          parsedUser.role = parsedUser.role || "user";
          setIsLoggedIn(true);
          setUser(parsedUser);

          // Kết nối socket khi user đăng nhập
          connectSocket(parsedUser);

          // Fetch latest user data from server
          try {
            const response = await fetch(
              `${apiUrl}/get-profile.php?identifier=${encodeURIComponent(parsedUser.identifier)}&identifierType=${parsedUser.type}`,
              {
                method: "GET",
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}, body: ${await response.text()}`);
            }

            const result = await response.json();
            if (result.success) {
              const newUserData = {
                ...parsedUser,
                username: result.data.user,
                identifier: parsedUser.type === "phone" ? result.data.phone : result.data.email,
                type: parsedUser.type,
                avatar: result.data.avatarUrl,
              };

              setUser(newUserData);
              setCookie(USER_KEY, JSON.stringify(newUserData));
            } else {
              console.error("API error:", result.message);
              toast.error("Không thể tải thông tin người dùng '" + result.message + "'");
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Lỗi khi tải thông tin người dùng: " + error.message);
          }
        } catch {
          // localStorage.removeItem(USER_KEY);
          removeCookie(USER_KEY);
          setIsLoggedIn(false);
          setUser(null);
          disconnectSocket();
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        disconnectSocket();
      }
    };

    checkAuthStatus();
    const handleStorageChange = (event) => {
      if (event.key === USER_KEY) {
        checkAuthStatus();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location, connectSocket, disconnectSocket]);

  // Không fetch menu từ API nữa, chỉ dùng menu tĩnh hoặc bỏ menu động
  // const [menuItems, setMenuItems] = useState([]);
  // const [menuError, setMenuError] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);

  // Fetch wishlist items from API
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    const fetchWishlistItems = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/wishlist.php?ma_nguoi_dung=${user.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.items)) {
          const wishlistProducts = data.items.map(item => {
            const product = allProducts.find(p => p.id === item.id_product);
            return product ? { ...product, wishlistId: item.id } : null;
          }).filter(item => item !== null);
          setWishlistItems(wishlistProducts);
        } else {
          setWishlistError(data.message || 'Không thể tải danh sách yêu thích');
        }
      } catch (error) {
        setWishlistError('Lỗi khi tải danh sách yêu thích: ' + error.message);
      }
    };

    fetchWishlistItems();
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }

      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setSelectedCategory(null);
      }

      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowLocationPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);

  const handleLogout = () => {
    // localStorage.removeItem(USER_KEY);
    // localStorage.removeItem('guest_chat_id');
    removeCookie(USER_KEY);
    removeCookie('guest_chat_id');
    disconnectSocket(); // Ngắt kết nối socket khi đăng xuất
    setIsLoggedIn(false);
    setUser(null);
    setShowUserDropdown(false);
    setWishlistItems([]);
    navigate("/");
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleMenuItemClick = (item) => {
    if (item.ten.toLowerCase() === "tư vấn" || item.ten.toLowerCase() === "consult") {
      // Mở ChatPopup thông qua Socket.IO
      if (user) {
        openChat('general', user);
      } else {
        toast.info("Vui lòng đăng nhập để sử dụng tính năng tư vấn trực tuyến");
        navigate("/login");
      }
    } else if (item.ten.toLowerCase() === "liên hệ" || item.ten.toLowerCase() === "contact") {
      setShowLocationPopup(true);
    } else if (item.url && item.url !== '#') {
      navigate(item.url);
    }
  };

  const filteredProducts = allProducts.filter((item) =>
    item.ten_sp.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="mobile-header-bar" style={{ display: 'none' }}>
        <button className="mobile-menu-toggle" onClick={() => setShowMobileMenu(true)}>
          <FaBars size={28} />
        </button>
        <Link to="/" className="logo-link">
          <div className="logo-container">
            <img src="/photos/Logo.png" alt="Logo" className="logo-image" />
            <span className="logo-text">MRS</span>
          </div>
        </Link>
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
                      e.target.onerror = null;
                      e.target.src = "/photos/default-avatar.png";
                    }}
                  />
                ) : (
                  <div className="default-avatar">
                    <UserCircle size={24} color="#7f8c8d" />
                  </div>
                )}
              </button>
            </div>
          ) : (
            <div className="user-actions">
              <Link to="/register">
                <User size={24} />
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* Offcanvas Mobile Menu */}
      <div className={`mobile-offcanvas-menu${showMobileMenu ? ' active' : ''}`} onClick={() => setShowMobileMenu(false)}>
        <div className="mobile-offcanvas-content" onClick={e => e.stopPropagation()}>
          <button className="mobile-offcanvas-close" onClick={() => setShowMobileMenu(false)}>×</button>
          {/* Search bar trong menu mobile */}
          <div className="search-bar-container" style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Bạn cần tìm gì?"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              className="show-suggestions-btn"
              type="button"
              onClick={() => setShowSuggestions((v) => !v)}
            >
              <Search size={18} />
            </button>
          </div>
          {/* Danh mục sản phẩm */}
          <div className="category-menu" style={{ marginBottom: 16 }}>
            <div className="category-dropdown" style={{ display: 'block', position: 'static', boxShadow: 'none', background: 'none', border: 'none' }}>
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
                    <div className="subcategory-panel" style={{ position: 'static', boxShadow: 'none', background: 'none', border: 'none' }}>
                      <h4 className="subcategory-title">{category}</h4>
                      <div className="subcategory-items">
                        {menuCategories[category].items.map((item) => (
                          <Link
                            key={item.id}
                            to={`/linh-kien/${item.id}`}
                            className="subcategory-item"
                            onClick={() => {
                              setSelectedCategory(null);
                              setShowMobileMenu(false);
                            }}
                          >
                            {item.ten_sp}
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
          {/* Các menu tĩnh */}
          <div className="static-menu-buttons" style={{ flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <button className="menu-button" onClick={() => {navigate("/blog"); setShowMobileMenu(false);}}>
              <FaBlogger size={18} style={{ marginRight: 6 }} /> Tin tức
            </button>
            <button className="menu-button" onClick={() => {openChat('general', user); setShowMobileMenu(false);}} disabled={!isLoggedIn || !user}>
              <MessageCircle size={18} style={{ marginRight: 6 }} /> Chat cộng đồng
              {unreadCount > 0 && (
                <span className="chat-notification-badge">{unreadCount}</span>
              )}
              <span className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>●</span>
            </button>
            <button className="menu-button" onClick={() => {navigate("/alllinhkien"); setShowMobileMenu(false);}}>
              <FiPackage size={18} style={{ marginRight: 6 }} /> Sản phẩm
            </button>
          </div>
        </div>
      </div>
      {/* Header cũ chỉ hiện trên desktop */}
      <header className="main-header" ref={headerRef}>
        <div className="main-header-container">
          <div className="header-items">
            <Link to="/" className="logo-link">
              <div className="logo-container">
                <img src="/photos/Logo.png" alt="Logo" className="logo-image" />
                <span className="logo-text">MRS</span>
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
                              {item.ten_sp}
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
                onFocus={() => setShowSuggestions(false)}
              />
              <button
                className="show-suggestions-btn"
                type="button"
                onClick={() => setShowSuggestions((v) => !v)}
                style={{ marginLeft: 6, padding: '7px 12px', borderRadius: 6, border: '1px solid #0D92F4', background: '#fff', cursor: 'pointer' }}
              >
                <Search size={18} />
              </button>
              {showSuggestions && searchInput && (
                <div className="search-suggestions">
                  {filteredProducts.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="search-suggestion-item"
                      onClick={() => {
                        navigate(`/linh-kien/${item.id}`);
                        setSearchInput("");
                        setShowSuggestions(false);
                      }}
                      dangerouslySetInnerHTML={{ __html: item.ten_sp }}
                    />
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="search-suggestion-item">
                      Không tìm thấy kết quả
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Menu tĩnh: Tin tức, Chat cộng đồng, Sản phẩm */}
            <div className="static-menu-buttons" style={{ display: 'flex', gap: 12, alignItems: 'center', marginLeft: 24 }}>
              <button
                className="menu-button"
                onClick={() => navigate("/blog")}
              >
                <FaBlogger size={18} style={{ marginRight: 6 }} />
                Tin tức
              </button>
              <button
                className="menu-button"
                onClick={() => openChat('general', user)}
                disabled={!isLoggedIn || !user}
                title={!isLoggedIn ? "Vui lòng đăng nhập để sử dụng chat cộng đồng" : "Chat cộng đồng"}
              >
                <MessageCircle size={18} style={{ marginRight: 6 }} />
                Chat cộng đồng
                {/* Hiển thị số tin nhắn chưa đọc */}
                {unreadCount > 0 && (
                  <span className="chat-notification-badge">{unreadCount}</span>
                )}
                {/* Hiển thị trạng thái kết nối */}
                <span className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>●</span>
              </button>
              <button
                className="menu-button"
                onClick={() => navigate("/alllinhkien")}
              >
                <FiPackage size={18} style={{ marginRight: 6 }} />
                Sản phẩm
              </button>
            </div>

            {filteredProducts.length === 0 && (
              <div className="search-suggestion-item">
                Không tìm thấy kết quả
              </div>
            )}

            {showLocationPopup && (
              <div className="consult-popup" ref={popupRef}>
                <div className="popup-header flex justify-between items-start">
                  <div className="consult-info space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <PhoneCall size={20} strokeWidth={2} />
                      <span>0123 456 789</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook size={20} strokeWidth={2} />
                      <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
                        Facebook
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram size={20} strokeWidth={2} />
                      <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin size={20} strokeWidth={2} />
                      <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer">
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
                      <Link to="/Profile" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                        <UserCircle size={16} />
                        <span>Thông tin cá nhân</span>
                      </Link>
                      <Link to="/cart" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <ShoppingBag size={16} />
                          {totalQuantity > 0 && (
                            <span className="badge">
                              {totalQuantity}
                            </span>
                          )}
                        </div>
                        <span>Đơn hàng của tôi</span>
                      </Link>
                      <Link to="/lich_su_don_hang" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                        <History size={16} />
                        <span>Lịch sử đơn hàng</span>
                      </Link>
                      <Link to="/wishlist" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <Heart size={16} />
                          {wishlistItems.length > 0 && (
                            <span className="badge">
                              {wishlistItems.length}
                            </span>
                          )}
                        </div>
                        <span>Yêu thích</span>
                      </Link>
                      {user?.role === "admin" && (
                        <>
                          <Link to="/admin" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                            <User size={16} />
                            <span>Quản trị viên</span>
                          </Link>
                          <Link to="/tracuu" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                            <FiPackage size={16} />
                            <span>Tra cứu đơn hàng</span>
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="dropdown-item logout-button"
                      >
                        <LogOut size={16} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="user-actions">
                  <span className="Separator">|</span>
                  <Link to="/register">
                    <User size={24} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Chat Popup Component */}
      {isLoggedIn && user && (
        <ChatPopup user={user} />
      )}
    </>
  );
};

export default Header;
