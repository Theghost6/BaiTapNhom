import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LinhKien from "./Linh_kien.json";
import { useCart } from "./useCart";
import { AuthContext } from "../funtion/AuthContext";
import ImageSlider from "../funtion/ImageSlider";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../style/chitietlinhkien.css";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { isAuthenticated, user } = useContext(AuthContext) || {};

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("Tổng quan");
  const tabs = ["Tổng quan", "Thông số kỹ thuật", "Đánh giá"];
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    so_sao: 5,
    binh_luan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyForms, setReplyForms] = useState({});
  const [isSubmittingReply, setIsSubmittingReply] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product data from API or use local data
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // Try to get from API first
        const response = await axios.get(
          `http://localhost/backend/san_pham.php?id_product=${id}`
        );
        
        if (response.data.success && response.data.data) {
          setProduct(response.data.data);
        } else {
          // Fallback to local data
          const localProduct = Object.values(LinhKien)
            .flat()
            .find((item) => item.id === id);
          
          if (localProduct) {
            setProduct(localProduct);
          } else {
            toast.error("Không tìm thấy thông tin sản phẩm");
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Fallback to local data
        const localProduct = Object.values(LinhKien)
          .flat()
          .find((item) => item.id === id);
        
        if (localProduct) {
          setProduct(localProduct);
        } else {
          toast.error("Không tìm thấy thông tin sản phẩm");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
      fetchReviews();
    }
  }, [id]);

  // Check if product is already in cart
  useEffect(() => {
    if (product && cartItems) {
      const existingItem = cartItems.find(item => item.id_product === product.id);
      setIsInCart(!!existingItem);
    }
  }, [product, cartItems]);

  // Fetch related products
  useEffect(() => {
    if (product) {
      // Get products from the same category
      const category = product.danh_muc;
      const similarProducts = Object.values(LinhKien)
        .flat()
        .filter(item => 
          item.danh_muc === category && 
          item.id !== product.id
        )
        .slice(0, 4); // Limit to 4 products
      
      setRelatedProducts(similarProducts);
    }
  }, [product]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost/backend/reviews.php?id_product=${id}`
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        setReviews(response.data.data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error.response?.data || error);
      setReviews([]);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Không tìm thấy sản phẩm</h2>
        <p>Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
        <button onClick={() => navigate("/products")} className="back-button">
          Quay lại trang sản phẩm
        </button>
      </div>
    );
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product.so_luong || 10)) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product.so_luong || 10)) {
      setQuantity(quantity + 1);
    } else {
      toast.warning("Đã đạt số lượng tối đa có thể mua");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/register", { state: { returnUrl: `/product/${id}` } });
      return;
    }

    try {
      // Check if product is in stock
      const stockResponse = await axios.get(
        `http://localhost/backend/san_pham.php?id_product=${product.id}`
      );
      
      const stockData = stockResponse.data.data;
      if (stockResponse.data.success && stockData && stockData.so_luong < quantity) {
        toast.error(`Chỉ còn ${stockData.so_luong} sản phẩm trong kho!`);
        return;
      }

      // Create product object with quantity
      const productToAdd = {
        ...product,
        so_luong: quantity
      };
      
      addToCart(productToAdd);
      setIsInCart(true);
      toast.success(`Đã thêm ${quantity} ${product.ten} vào giỏ hàng!`);
    } catch (error) {
      console.error("Error checking stock:", error);
      // Fallback to adding without stock check
      const productToAdd = {
        ...product,
        so_luong: quantity
      };
      
      addToCart(productToAdd);
      setIsInCart(true);
      toast.success(`Đã thêm ${quantity} ${product.ten} vào giỏ hàng!`);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để mua ngay!");
      navigate("/register", { state: { returnUrl: `/product/${id}` } });
      return;
    }

    if (product.so_luong < quantity) {
      toast.error(`Chỉ còn ${product.so_luong} sản phẩm trong kho!`);
      return;
    }

    // Create product object with quantity
    const productToCheckout = {
      ...product,
      so_luong: quantity
    };
    
    navigate("/checkout", { state: { product: productToCheckout } });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: name === "so_sao" ? parseInt(value) : value,
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đánh giá!");
      navigate("/register", { state: { returnUrl: `/product/${id}` } });
      return;
    }
    if (!newReview.binh_luan.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }
    setIsSubmitting(true);

    const formData = {
      id_product: id,
      ten_nguoi_dung: user?.username || "Khách",
      so_sao: newReview.so_sao,
      binh_luan: newReview.binh_luan,
      ngay: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(
        "http://localhost/backend/reviews.php",
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );
      if (response.data.success) {
        await fetchReviews();
        setNewReview({ so_sao: 5, binh_luan: "" });
        toast.success("Cảm ơn bạn đã đánh giá!");
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra khi gửi đánh giá");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        "Có lỗi xảy ra khi gửi đánh giá: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleReplyForm = (reviewId) => {
    setReplyForms((prev) => ({
      ...prev,
      [reviewId]: {
        noi_dung: prev[reviewId]?.noi_dung || "",
        isOpen: !prev[reviewId]?.isOpen,
      },
    }));
  };

  const handleReplyChange = (reviewId, value) => {
    setReplyForms((prev) => ({
      ...prev,
      [reviewId]: {
        ...prev[reviewId],
        noi_dung: value,
      },
    }));
  };

  const handleSubmitReply = async (e, reviewId) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để gửi phản hồi!");
      navigate("/register", { state: { returnUrl: `/product/${id}` } });
      return;
    }
    if (!replyForms[reviewId]?.noi_dung.trim()) {
      toast.error("Vui lòng nhập nội dung phản hồi");
      return;
    }

    setIsSubmittingReply((prev) => ({ ...prev, [reviewId]: true }));

    const formData = {
      id_danh_gia: reviewId,
      ten_nguoi_tra_loi: user?.username || "Khách",
      noi_dung: replyForms[reviewId].noi_dung,
      ngay: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(
        "http://localhost/backend/reply_review.php",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        await fetchReviews();
        setReplyForms((prev) => ({
          ...prev,
          [reviewId]: { noi_dung: "", isOpen: false },
        }));
        toast.success("Phản hồi đã được gửi!");
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra khi gửi phản hồi");
      }
    } catch (error) {
      console.error("Error submitting reply:", error.response?.data || error);
      toast.error(
        "Có lỗi xảy ra khi gửi phản hồi: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSubmittingReply((prev) => ({ ...prev, [reviewId]: false }));
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((total, review) => total + review.so_sao, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <motion.div 
      className="product-detail-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="product-hero">
        <img
          src="/photos/c.jpg"
          alt="Background"
          className="product-hero-image"
        />
        <div className="hero-text">
          <h1 className="hero-title">Chi tiết sản phẩm</h1>
          <nav className="breadcrumbs">
            <a href="/">Trang chủ</a> &gt;
            <a href="/products">Sản phẩm</a> &gt;
            <span>{product.ten || "Không xác định"}</span>
          </nav>
        </div>
      </div>

      <div className="product-main-content">
        <div className="product-left-column">
          <ImageSlider images={product.images} />
          
          <div className="product-actions">
            <div className="product-quantity">
              <span>Số lượng:</span>
              <div className="quantity-controls">
                <button onClick={decreaseQuantity}>-</button>
                <input 
                  type="number" 
                  min="1" 
                  max={product.so_luong || 10}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <button onClick={increaseQuantity}>+</button>
              </div>
              <span className="stock-info">
                {product.so_luong > 0 
                  ? `Còn ${product.so_luong} sản phẩm` 
                  : "Hết hàng"}
              </span>
            </div>
            
            <div className="product-buttons">
              <button 
                onClick={handleBuyNow} 
                className="buy-now-button"
                disabled={product.so_luong < 1}
              >
                Mua ngay
              </button>
              <button 
                onClick={handleAddToCart} 
                className={`add-to-cart-button ${isInCart ? "in-cart" : ""}`}
                disabled={product.so_luong < 1}
              >
                {isInCart ? "✅ Đã thêm vào giỏ hàng" : "🛒 Thêm vào giỏ hàng"}
              </button>
            </div>
          </div>
        </div>

        <div className="product-right-column">
          <div className="product-header">
            <h1 className="product-title">{product.ten || "Không xác định"}</h1>
            <div className="product-rating">
              <div className="stars">
                {"⭐".repeat(Math.round(averageRating))}
              </div>
              <span className="review-count">({reviews.length} đánh giá)</span>
            </div>
            <div className="product-price">
              {formatCurrency(product.gia || 0)}
            </div>
            <div className="product-availability">
              <span className={`status ${product.so_luong > 0 ? "in-stock" : "out-of-stock"}`}>
                {product.so_luong > 0 ? "Còn hàng" : "Hết hàng"}
              </span>
            </div>
          </div>

          <div className="product-details">
            <div className="custom-tab-menu">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${selectedTab === tab ? "active" : ""}`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {selectedTab === "Tổng quan" && (
                <div className="overview-tab">
                  <div className="product-info">
                    <div className="info-row">
                      <span className="info-label">Thương hiệu:</span>
                      <span className="info-value">{product.hang}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Bảo hành:</span>
                      <span className="info-value">{product.bao_hanh}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Ngày phát hành:</span>
                      <span className="info-value">{product.ngay_phat_hanh}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Thiết bị tương thích:</span>
                      <span className="info-value">
                        {Array.isArray(product.thiet_bi_tuong_thich) 
                          ? product.thiet_bi_tuong_thich.join(", ")
                          : product.thiet_bi_tuong_thich || "Không có thông tin"}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Tính năng nổi bật:</span>
                      <span className="info-value">
                        {Array.isArray(product.tinh_nang) 
                          ? product.tinh_nang.join(", ")
                          : product.tinh_nang || "Không có thông tin"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="product-description">
                    <h3>Mô tả sản phẩm</h3>
                    <p>{product.mo_ta || "Chưa có mô tả chi tiết cho sản phẩm này."}</p>
                  </div>
                </div>
              )}

              {selectedTab === "Thông số kỹ thuật" && (
                <div className="specs-tab">
                  <h3>Thông số kỹ thuật</h3>
                  <table className="specs-table">
                    <tbody>
                      {product.thong_so && Object.entries(product.thong_so).map(([key, value]) => (
                        <tr key={key}>
                          <td className="spec-name">{key}</td>
                          <td className="spec-value">{value}</td>
                        </tr>
                      ))}
                      {(!product.thong_so || Object.keys(product.thong_so).length === 0) && (
                        <tr>
                          <td colSpan="2" className="no-specs">
                            Không có thông số kỹ thuật nào được cung cấp.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedTab === "Đánh giá" && (
                <div className="review-tab">
                  <div className="review-summary">
                    <div className="rating-overview">
                      <div className="average-rating">
                        <span className="big-rating">{averageRating}</span>
                        <div className="stars">
                          {"⭐".repeat(Math.round(averageRating))}
                        </div>
                        <span className="total-reviews">Dựa trên {reviews.length} đánh giá</span>
                      </div>
                      
                      <div className="rating-bars">
                        {[5, 4, 3, 2, 1].map(stars => {
                          const count = reviews.filter(r => r.so_sao === stars).length;
                          const percentage = reviews.length > 0 
                            ? Math.round((count / reviews.length) * 100) 
                            : 0;
                          
                          return (
                            <div className="rating-bar-row" key={stars}>
                              <span className="star-label">{stars} sao</span>
                              <div className="bar-container">
                                <div 
                                  className="bar-fill"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="bar-percent">{percentage}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="add-review-section">
                    <h4>Thêm đánh giá của bạn</h4>
                    <form onSubmit={handleSubmitReview} className="review-form">
                      <div className="rating-input">
                        <label htmlFor="so_sao">Đánh giá của bạn:</label>
                        <select
                          id="so_sao"
                          name="so_sao"
                          value={newReview.so_sao}
                          onChange={handleReviewChange}
                        >
                          <option value="5">5 sao ⭐⭐⭐⭐⭐</option>
                          <option value="4">4 sao ⭐⭐⭐⭐</option>
                          <option value="3">3 sao ⭐⭐⭐</option>
                          <option value="2">2 sao ⭐⭐</option>
                          <option value="1">1 sao ⭐</option>
                        </select>
                      </div>
                      <div className="comment-input">
                        <label htmlFor="binh_luan">Nhận xét của bạn:</label>
                        <textarea
                          id="binh_luan"
                          name="binh_luan"
                          rows="4"
                          value={newReview.binh_luan}
                          onChange={handleReviewChange}
                          placeholder="Chia sẻ ý kiến của bạn về sản phẩm..."
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="submit-review-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                      </button>
                    </form>
                  </div>

                  <div className="review-list">
                    <h4>Đánh giá từ khách hàng ({reviews.length})</h4>
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <motion.div 
                          className="review-item" 
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="review-header">
                            <div className="reviewer-info">
                              <div className="avatar">
                                {review.ten_nguoi_dung.charAt(0).toUpperCase()}
                              </div>
                              <div className="name-date">
                                <strong>{review.ten_nguoi_dung}</strong>
                                <span className="review-date">{review.ngay}</span>
                              </div>
                            </div>
                            <div className="review-stars">
                              {"⭐".repeat(review.so_sao)}
                            </div>
                          </div>
                          
                          <div className="review-body">
                            <p className="review-comment">{review.binh_luan}</p>
                          </div>
                          
                          {review.replies && review.replies.length > 0 && (
                            <div className="review-replies">
                              <h5>Phản hồi:</h5>
                              {review.replies.map((reply) => (
                                <div className="reply-item" key={reply.id}>
                                  <div className="reply-header">
                                    <div className="avatar reply-avatar">
                                      {reply.ten_nguoi_tra_loi.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="name-date">
                                      <strong>{reply.ten_nguoi_tra_loi}</strong>
                                      <span className="reply-date">{reply.ngay}</span>
                                    </div>
                                  </div>
                                  <p className="reply-content">{reply.noi_dung}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="reply-action">
                            <button
                              className="reply-button"
                              onClick={() => toggleReplyForm(review.id)}
                            >
                              {replyForms[review.id]?.isOpen ? "Hủy" : "Phản hồi"}
                            </button>
                            
                            {replyForms[review.id]?.isOpen && (
                              <form
                                className="reply-form"
                                onSubmit={(e) => handleSubmitReply(e, review.id)}
                              >
                                <textarea
                                  value={replyForms[review.id]?.noi_dung || ""}
                                  onChange={(e) => handleReplyChange(review.id, e.target.value)}
                                  placeholder="Nhập phản hồi của bạn..."
                                  rows="3"
                                  required
                                />
                                <button
                                  type="submit"
                                  className="submit-reply-btn"
                                  disabled={isSubmittingReply[review.id]}
                                >
                                  {isSubmittingReply[review.id]
                                    ? "Đang gửi..."
                                    : "Gửi phản hồi"}
                                </button>
                              </form>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="no-reviews">
                        <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                        <p>Hãy là người đầu tiên đánh giá!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related products section */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2>Sản phẩm liên quan</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <motion.div 
                className="related-product-card" 
                key={relatedProduct.id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <a href={`/product/${relatedProduct.id}`} className="product-link">
                  <div className="product-image">
                    <img 
                      src={relatedProduct.images?.[0] || "/placeholder.jpg"} 
                      alt={relatedProduct.ten}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{relatedProduct.ten}</h3>
                    <div className="product-price">{formatCurrency(relatedProduct.gia)}</div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Recently viewed products - would be implemented based on user's browsing history */}
      
    </motion.div>
  );
};

export default ProductDetail;
