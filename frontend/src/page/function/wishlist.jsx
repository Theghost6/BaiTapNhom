import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { Trash2, Heart } from "lucide-react";
import { getCookie } from "../../helper/cookieHelper";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const apiUrl = import.meta.env.VITE_HOST;
  // Check authentication status
  useEffect(() => {
    // const userData = localStorage.getItem("user");
    const userCookie = getCookie("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        if (parsedUser?.id) {
          setUser(parsedUser);
        } else {
          console.warn("User data missing id:", parsedUser);
          // localStorage.removeItem("user");
          setUser(null);
        }
      } catch (err) {
        console.error("Invalid user data in cookie:", err);
        // localStorage.removeItem("user");
        setUser(null);
      }
    } else {
      console.log("No user data in cookie");
    }
    setAuthChecked(true);
  }, []);


  // Fetch wishlist items from API
  useEffect(() => {
    if (!authChecked) return;

    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để xem danh sách yêu thích!");
      navigate("/register", { state: { returnUrl: "/wishlist" } });
      return;
    }

    const fetchWishlistItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/wishlist.php?ma_nguoi_dung=${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.items)) {
          // Lấy chi tiết sản phẩm từ API cho từng item
          const productPromises = data.items.map(async (item) => {
            try {
              const productRes = await fetch(`${apiUrl}/products.php?id=${item.ma_sp}`);
              if (!productRes.ok) throw new Error();
              const productData = await productRes.json();
              if (productData.success && productData.data) {
                return {
                  ...productData.data,
                  wishlistId: item.id,
                  wishlistMaSp: item.ma_sp,
                };
              } else {
                // Không tìm thấy sản phẩm
                return {
                  wishlistId: item.id,
                  wishlistMaSp: item.ma_sp,
                  ten: item.ten_san_pham || `Mã: ${item.ma_sp}`,
                  gia: null,
                  images: [],
                  notFound: true,
                };
              }
            } catch {
              return {
                wishlistId: item.id,
                wishlistMaSp: item.ma_sp,
                ten: item.ten_san_pham || `Mã: ${item.ma_sp}`,
                gia: null,
                images: [],
                notFound: true,
              };
            }
          });
          const wishlistWithProducts = await Promise.all(productPromises);
          setWishlistItems(wishlistWithProducts);
        } else {
          setError(data.message || "Không thể tải danh sách yêu thích");
        }
      } catch (error) {
        setError("Lỗi khi tải danh sách yêu thích: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistItems();
  }, [user?.id, authChecked, navigate]);

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (wishlistId, productId) => {
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để xóa sản phẩm yêu thích!");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/wishlist.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ma_nguoi_dung: user.id,
          ma_sp: productId, // SỬA key này cho đúng backend
          action: "remove",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.wishlistId !== wishlistId)
        );
        toast.success("Đã xóa sản phẩm khỏi danh sách yêu thích!");
      } else {
        toast.error(data.message || "Không thể xóa sản phẩm yêu thích!");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm yêu thích: " + error.message);
    }
  };

  // Format price
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (!authChecked || isLoading) {
    return (
      <div className="wishlist-loading">
        <div className="spinner"></div>
        <p>Đang kiểm tra trạng thái đăng nhập...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-error">
        <h2>Lỗi</h2>
        <p>{error}</p>
        <Link to="/" className="back-home">Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <motion.div
      className="wishlist-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="wishlist-hero">
        <img src="/photos/c.jpg" alt="Background" className="wishlist-hero-image" />
        <div className="hero-text">
          <h1 className="hero-title">Danh sách yêu thích</h1>
          <nav className="breadcrumbs">
            <Link to="/">Trang chủ</Link> » <span>Yêu thích</span>
          </nav>
        </div>
      </div>

      <div className="wishlist-container">
        {wishlistItems.length > 0 ? (
          <div className="wishlist-grid">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.wishlistId}
                className={`wishlist-item${item.notFound ? ' wishlist-item-notfound' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item.notFound ? (
                  <div className="wishlist-link wishlist-link-notfound">
                    <img
                      src="/placeholder.jpg"
                      alt={item.ten || item.ten_sp}
                      className="wishlist-item-image"
                    />
                    <div className="wishlist-item-info">
                      <h3 className="wishlist-name">{item.ten || item.ten_sp}</h3>
                      <p className="wishlist-price">Không tìm thấy sản phẩm</p>
                    </div>
                  </div>
                ) : (
                  <Link to={`/linh-kien/${item.id}`} className="wishlist-link">
                    <img
                      src={item.images?.[0] || item.anh || "/placeholder.jpg"}
                      alt={item.ten_sp || item.ten}
                      className="wishlist-item-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                    <div className="wishlist-item-info">
                      <h3 className="wishlist-name">{item.ten_sp || item.ten}</h3>
                      <p className="wishlist-price">{item.gia_sau ? formatPrice(item.gia_sau) : (item.gia ? formatPrice(item.gia) : '--')}</p>
                    </div>
                  </Link>
                )}
                <button
                  onClick={() => handleRemoveFromWishlist(item.wishlistId, item.wishlistMaSp)}
                  className="wishlist-button"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="wishlist-empty">
            <Heart size={50} color="#888" />
            <p>Chưa có sản phẩm nào trong danh sách yêu thích của bạn!</p>
            <Link to="/AllLinhKien" className="explore-btn">
              Khám phá sản phẩm
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Wishlist;
