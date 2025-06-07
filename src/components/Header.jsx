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
import products from "../page/funtion/Linh_kien.json";
import { useCart } from "../page/funtion/useCart";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChatContext } from '../page/chat/ChatProvider';
const allProducts = Object.values(products).flat();

// Định nghĩa cấu trúc danh mục phân cấp
const menuCategories = {
  CPU: {
    items: allProducts.filter(item => item.danh_muc === "CPU")
  },
  Mainboard: {
    items: allProducts.filter(item => item.danh_muc === "Mainboard")
  },
  RAM: {
    items: allProducts.filter(item => item.danh_muc === "RAM")
  },
  "Ổ cứng": {
    items: allProducts.filter(item => item.danh_muc === "Storage")
  },
  VGA: {
    items: allProducts.filter(item => item.danh_muc === "GPU")
  },
  PSU: {
    items: allProducts.filter(item => item.danh_muc === "PSU")
  },
  Case: {
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
  const [menuItems, setMenuItems] = useState([]);
  const [menuError, setMenuError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistError, setWishlistError] = useState(null);

  const headerRef = useRef(null);
  const userDropdownRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const popupRef = useRef(null);
  const { totalQuantity } = useCart();
  const { setShowChat } = useChatContext();
  const USER_KEY = "user";

  // Check auth status and fetch user profile
// Check auth status and fetch user profile
useEffect(() => {
  const checkAuthStatus = async () => {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        parsedUser.role = parsedUser.role || "user";
        setIsLoggedIn(true);
        setUser(parsedUser);

        // Fetch latest user data from server
        try {
          const response = await fetch(
            `http://localhost/BaiTapNhom/backend/get-profile.php?identifier=${encodeURIComponent(parsedUser.identifier)}&identifierType=${parsedUser.type}`,
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
            localStorage.setItem(USER_KEY, JSON.stringify(newUserData));
          } else {
            console.error("API error:", result.message);
            toast.error("Không thể tải thông tin người dùng '" + result.message + "'");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast.error("Lỗi khi tải thông tin người dùng: " + error.message);
        }
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

  checkAuthStatus();
  const handleStorageChange = (event) => {
    if (event.key === USER_KEY) {
      checkAuthStatus();
    }
  };
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, [location]);





  // Fetch top_menu items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      setMenuError(null);
      
      try {
        const response = await fetch('http://localhost/BaiTapNhom/backend/tt_home.php?path=top_menu', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          const activeItems = data.data
            .filter(item => item.trang_thai == 1)
            .sort((a, b) => parseInt(a.thu_tu) - parseInt(b.thu_tu));
          
          setMenuItems(activeItems);
        } else {
          setMenuError(data.error || 'Failed to load menu items');
        }
      } catch (error) {
        setMenuError('Error fetching menu items: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);

  // Fetch wishlist items from API
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    const fetchWishlistItems = async () => {
      try {
        const response = await fetch(
          `http://localhost/BaiTapNhom/backend/wishlist.php?ma_nguoi_dung=${user.id}`,
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
    localStorage.removeItem(USER_KEY);
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
      setShowLocationPopup(!showLocationPopup);
            setShowChat(true);
    } else if (item.url && item.url !== '#') {
      navigate(item.url);
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
            <div className="logo-container">
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

          {isLoading && (
            <div className="menu-loading" style={{ color: '#666', marginLeft: '10px' }}>
              Đang tải menu...
            </div>
          )}

          {menuError && (
            <div className="menu-error" style={{ color: 'red', marginLeft: '10px', fontSize: '12px' }}>
              {menuError}
            </div>
          )}

          {!isLoading && menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
              className={
                item.ten.toLowerCase() === "tư vấn" || item.ten.toLowerCase() === "consult"
                  ? "consult-selector-btn"
                  : item.ten.toLowerCase() === "nhà phát triển" || item.ten.toLowerCase() === "developer"
                  ? "developer-button"
                  : item.ten.toLowerCase() === "liên hệ" || item.ten.toLowerCase() === "contact"
                  ? "contact-button"
                  : "menu-button"
              }
            >
              {item.ten.toLowerCase() === "liên hệ" || item.ten.toLowerCase() === "contact" ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.62A2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 11.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{item.ten}</span>
                </>
              ) : item.ten.toLowerCase() === "nhà phát triển" || item.ten.toLowerCase() === "developer" ? (
                <>
                  <Code size={24} />
                  <span>{item.ten}</span>
                </>
              ) : item.ten.toLowerCase() === "tin tức" || item.ten.toLowerCase() === "blog" ? (
                <>
                  <FaBlogger size={24} />
                  <span>{item.ten}</span>
                </>
              ) : item.ten.toLowerCase() === "tư vấn" || item.ten.toLowerCase() === "consult" ? (
 <>
      <MessageCircle size={24} />
      <span>{item.ten}</span>
    </>
              ) : (
                <span>{item.ten}</span>
              )}
            </button>
          ))}

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
      <ToastContainer />
    </header>
  );
};

export default Header;
