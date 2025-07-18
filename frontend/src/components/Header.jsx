import React, { useState, useEffect, useRef, useMemo } from "react";
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
import { FaBars, FaBlogger, FaSearch } from "react-icons/fa";
import "../style/header.css";
import { useCart } from "../hooks/cart/useCart"; // Giả sử bạn đã tạo hook useCart
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useChat } from '../page/chat/ChatContext';
import { useSocket } from '../page/chat/SocketContext';
import ChatPopup from '../page/chat/ChatPopup';
import { setCookie, getCookie, removeCookie } from "../helper/cookieHelper";

const apiUrl = import.meta.env.VITE_HOST;

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
  const [allProducts, setAllProducts] = useState([]);

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
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            const response = await fetch(
              `${apiUrl}/get-profile.php?identifier=${encodeURIComponent(parsedUser.identifier)}&identifierType=${parsedUser.type}`,
              {
                method: "GET",
                signal: controller.signal,
              }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new Error(`Server responded with ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
              throw new Error("Server returned non-JSON response");
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
              // Don't spam console with auth errors
              console.debug("Auth validation failed:", result.message);
            }
          } catch (error) {
            // Only log significant errors, not network issues
            if (error.name === 'AbortError') {
              console.debug("Profile fetch timed out");
            } else if (!error.message.includes("Failed to fetch")) {
              console.debug("Profile fetch error:", error.message);
            }
          }
        } catch (cookieError) {
          console.warn("Error parsing user cookie:", cookieError);
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

  // Lấy dữ liệu sản phẩm từ API PHP
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/products.php`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setAllProducts(data.data);
        }
      } catch (error) {
        console.warn('Could not fetch products:', error.message);
        // Don't show error to user, just log it
      }
    };

    fetchProducts();
  }, [apiUrl]);

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
          setWishlistError(null);
        } else {
          setWishlistError(data.message || 'Không thể tải danh sách yêu thích');
        }
      } catch (error) {
        console.warn('Could not fetch wishlist:', error.message);
        setWishlistError(null); // Don't show error to user
      }
    };

    fetchWishlistItems();
  }, [isLoggedIn, user?.id, allProducts]);

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

      // Auto-adjust subcategory panel position to prevent cutoff
      setTimeout(() => {
        const categoryDropdown = document.querySelector('.category-dropdown');
        const subcategoryPanel = document.querySelector('.subcategory-panel');

        if (categoryDropdown && subcategoryPanel) {
          const dropdownRect = categoryDropdown.getBoundingClientRect();
          const panelRect = subcategoryPanel.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          // If panel extends beyond viewport, adjust position
          if (panelRect.bottom > viewportHeight) {
            const overflow = panelRect.bottom - viewportHeight + 20; // 20px padding
            subcategoryPanel.style.top = `${Math.max(-overflow, -200)}px`;
          }
        }
      }, 50);
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

  // Hàm normalizeText giống AllLinhKien
  const normalizeText = (str) => {
    return str
      ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D")
      : "";
  };

  // Hàm matchesSearchTerm giống AllLinhKien
  const matchesSearchTerm = (product) => {
    if (!searchInput) return true;
    const normalizedSearchTerm = normalizeText(searchInput);
    const normalizedProductName = normalizeText(product.ten_sp || product.ten || "");
    const normalizedBrand = product.ten_nha_san_xuat ? normalizeText(product.ten_nha_san_xuat) : (product.hang ? normalizeText(product.hang) : "");
    const normalizedCategory = product.danh_muc ? normalizeText(product.danh_muc) : (product.loai ? normalizeText(product.loai) : "");
    // Nếu tìm kiếm là 'màn hình' thì chỉ khớp với sản phẩm có danh mục là màn hình
    if (normalizedSearchTerm.includes('man hinh') || normalizedSearchTerm.includes('monitor')) {
      return (
        normalizedProductName.includes(normalizedSearchTerm) ||
        normalizedCategory === 'man hinh'
      );
    }
    let matches =
      normalizedProductName.includes(normalizedSearchTerm) ||
      normalizedBrand.includes(normalizedSearchTerm) ||
      normalizedCategory.includes(normalizedSearchTerm);
    if (normalizedSearchTerm.includes('chuot') || normalizedSearchTerm.includes('mouse')) {
      matches = matches || normalizedCategory === 'chuot';
    }
    if (normalizedSearchTerm.includes('ban phim') || normalizedSearchTerm.includes('keyboard')) {
      matches = matches || normalizedCategory === 'ban phim';
    }
    return matches;
  };

  // Lọc sản phẩm theo searchInput
  const filteredProducts = allProducts.filter(matchesSearchTerm);

  // Tạo menuCategories động từ allProducts
  const menuCategories = useMemo(() => {
    const norm = s => s ? s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D") : "";
    return {
      CPU: {
        items: allProducts.filter(item =>
          item.loai === "CPU" ||
          (item.loai && norm(item.loai).includes("cpu")) ||
          (item.ten_sp && norm(item.ten_sp).includes("cpu"))
        )
      },
      Mainboard: {
        items: allProducts.filter(item =>
          item.loai === "Mainboard" ||
          item.loai === "mainboard" ||
          (item.loai && norm(item.loai).includes("mainboard")) ||
          (item.ten_sp && norm(item.ten_sp).includes("mainboard"))
        )
      },
      RAM: {
        items: allProducts.filter(item =>
          item.loai === "RAM" ||
          (item.loai && norm(item.loai).includes("ram")) ||
          (item.ten_sp && norm(item.ten_sp).includes("ram"))
        )
      },
      "Ổ cứng": {
        items: allProducts.filter(item =>
          item.loai === "storage" ||
          (item.loai && norm(item.loai).includes("storage")) ||
          (item.loai && norm(item.loai).includes("o cung")) ||
          (item.ten_sp && norm(item.ten_sp).includes("o cung"))
        )
      },
      VGA: {
        items: allProducts.filter(item =>
          item.loai === "GPU" ||
          item.loai === "VGA" ||
          (item.loai && norm(item.loai).includes("gpu")) ||
          (item.loai && norm(item.loai).includes("vga")) ||
          (item.ten_sp && norm(item.ten_sp).includes("vga")) ||
          (item.ten_sp && norm(item.ten_sp).includes("gpu"))
        )
      },
      PSU: {
        items: allProducts.filter(item =>
          item.loai === "PSU" ||
          (item.loai && norm(item.loai).includes("psu")) ||
          (item.loai && norm(item.loai).includes("nguon")) ||
          (item.ten_sp && norm(item.ten_sp).includes("nguon")) ||
          (item.ten_sp && norm(item.ten_sp).includes("psu"))
        )
      },
      Case: {
        items: allProducts.filter(item =>
          item.loai === "case" ||
          item.loai === "Case" ||
          (item.loai && norm(item.loai).includes("case")) ||
          (item.loai && norm(item.loai).includes("vo may")) ||
          (item.ten_sp && norm(item.ten_sp).includes("case")) ||
          (item.ten_sp && norm(item.ten_sp).includes("vo may"))
        )
      },
      "Tản nhiệt": {
        items: allProducts.filter(item =>
          item.loai === "tan_nhiet" ||
          (item.loai && norm(item.loai).includes("tan nhiet")) ||
          (item.loai && norm(item.loai).includes("cooler")) ||
          (item.ten_sp && norm(item.ten_sp).includes("tan nhiet")) ||
          (item.ten_sp && norm(item.ten_sp).includes("cooler"))
        )
      },
      "Chuột": {
        items: allProducts.filter(item =>
          (item.loai && (
            norm(item.loai).includes("chuot") ||
            norm(item.loai).includes("mouse")
          )) ||
          (item.ten_sp && (
            norm(item.ten_sp).includes("chuot") ||
            norm(item.ten_sp).includes("mouse")
          ))
        )
      },
      "Bàn phím": {
        items: allProducts.filter(item =>
          (item.loai && (
            norm(item.loai).includes("ban phim") ||
            norm(item.loai).includes("keyboard")
          )) ||
          (item.ten_sp && (
            norm(item.ten_sp).includes("ban phim") ||
            norm(item.ten_sp).includes("keyboard")
          ))
        )
      },
      "Màn hình": {
        items: allProducts.filter(item => {
          const name = item.ten_sp ? norm(item.ten_sp) : "";
          const type = item.loai ? norm(item.loai) : "";
          // Lấy sản phẩm có tên hoặc loại chứa 'man hinh', 'monitor', loại trừ vga/card/gpu
          return (
            (name.includes("man hinh") || name.includes("monitor") || type.includes("man hinh") || type.includes("monitor")) &&
            !name.includes("vga") && !name.includes("card") && !name.includes("gpu") &&
            !type.includes("vga") && !type.includes("card") && !type.includes("gpu")
          );
        })
      },
    };
  }, [allProducts]);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="mobile-header-bar">
        <button className="mobile-menu-toggle" onClick={() => setShowMobileMenu(true)}>
          <FaBars size={24} />
        </button>
        <Link to="/" className="logo-link">
          <div className="logo-container">
            <img src="/photos/Logo.png" alt="Logo" className="logo-image" />
            <span className="logo-text">SH3</span>
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
              {showUserDropdown && (
                <div className="user-dropdown">
                  {user?.role === "admin" ? (
                    <>
                      <Link to="/Profile" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                        <UserCircle size={16} />
                        <span>Thông tin cá nhân</span>
                      </Link>
                      <Link to="/admin" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                        <User size={16} />
                        <span>Quản trị viên</span>
                      </Link>
                      <Link to="/tracuu" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                        <FiPackage size={16} />
                        <span>Tra cứu đơn hàng</span>
                      </Link>
                    </>
                  ) : (
                    <>
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
          <div className="search-wrapper" style={{ marginBottom: 16 }}>
            <input
              type="text"
              className="search-bar"
              placeholder="Bạn cần tìm gì?"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              className="show-suggestions-btn"
              type="button"
              onClick={() => setShowSuggestions((v) => !v)}
            >
              <FaSearch size={18} />
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
            <button className="menu-button" onClick={() => { navigate("/blog"); setShowMobileMenu(false); }}>
              <FaBlogger size={18} style={{ marginRight: 6 }} /> Tin tức
            </button>
            <button className="menu-button" onClick={() => { openChat('general', user); setShowMobileMenu(false); }} disabled={!isLoggedIn || !user}>
              <MessageCircle size={18} style={{ marginRight: 6 }} /> Chat cộng đồng
              {unreadCount > 0 && (
                <span className="chat-notification-badge">{unreadCount}</span>
              )}
              <span className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>●</span>
            </button>
            <button className="menu-button" onClick={() => { navigate("/alllinhkien"); setShowMobileMenu(false); }}>
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
                <span className="logo-text">SH3</span>
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

            <div className="search-wrapper">
              <input
                type="text"
                className="search-bar"
                placeholder="Bạn cần tìm gì?"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setShowSuggestions(false)}
              />
              <button
                className="show-suggestions-btn"
                type="button"
                onClick={() => setShowSuggestions((v) => !v)}
              >
                <FaSearch size={18} />
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
                onClick={() => navigate("/contact")}
              >
                <PhoneCall size={18} style={{ marginRight: 6 }} />
                Liên hệ
              </button> <button
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
                      {user?.role === "admin" ? (
                        // Menu cho Admin - chỉ hiển thị Quản trị viên và Tra cứu đơn hàng
                        <>
                          <Link to="/Profile" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                            <UserCircle size={16} />
                            <span>Thông tin cá nhân</span>
                          </Link>
                          <Link to="/admin" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                            <User size={16} />
                            <span>Quản trị viên</span>
                          </Link>
                          <Link to="/tracuu" className="dropdown-item" onClick={() => setShowUserDropdown(false)}>
                            <FiPackage size={16} />
                            <span>Tra cứu đơn hàng</span>
                          </Link>
                        </>
                      ) : (
                        // Menu cho User - hiển thị các tùy chọn khác
                        <>
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
