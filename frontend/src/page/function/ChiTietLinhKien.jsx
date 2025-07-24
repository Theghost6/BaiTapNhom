import React from "react";
import { useProductDetail } from "../../hooks/LinhKien/useProductDetail";
import ProductOverview from "../../components/LinhKien/ProductOverview";
import ProductSpecs from "../../components/LinhKien/ProductSpecs";
import ProductReviews from "../../components/LinhKien/ProductReviews";
import RelatedProducts from "../../components/LinhKien/RelatedProducts";
import { useCart } from "../../hooks/cart/useCart";
import { AuthContext } from "../function/AuthContext";
import ImageSlider from "../function/ImageSlider";
import "react-toastify/dist/ReactToastify.css";
import "../../style/chitietlinhkien.css";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const detail = useProductDetail();
  const {
    product,
    loading,
    isInCart,
    quantity,
    setQuantity,
    selectedTab,
    setSelectedTab,
    reviews,
    setReviews,
    newReview,
    setNewReview,
    isSubmitting,
    setIsSubmitting,
    replyForms,
    setReplyForms,
    isSubmittingReply,
    setIsSubmittingReply,
    relatedProducts,
    isInWishlist,
    wishlistLoading,
    showFullDescription,
    setShowFullDescription,
    canReview,
    purchaseDebug,
    addToCart,
    cartItems,
    isAuthenticated,
    user,
    navigate,
    location,
  } = detail;

  // Check if product is truly in stock (sufficient quantity and valid price)
  const isOutOfStockByPrice = !product?.gia_sau || Number(product?.gia_sau) <= 0;
  const isTrulyInStock = (product?.so_luong > 0) && !isOutOfStockByPrice;

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Calculate average rating for the product
  const averageRating =
    reviews.length > 0
      ? (
        reviews.reduce((total, review) => total + review.so_sao, 0) /
        reviews.length
      ).toFixed(1)
      : 0;

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

  return (
    <motion.div
      className="product-detail-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="product-hero">
        <img
          src="/photos/c.jpg"
          alt="Background"
          className="product-hero-image"
        />
        <div className="hero-text">
          <h1 className="hero-title">Chi tiết sản phẩm</h1>
          <nav className="breadcrumbs">
            <a href="/">Trang chủ</a> &gt; <a href="/alllinhkien">Sản phẩm</a> &gt;{" "}
            <span>{product.ten_sp || "Không xác định"}</span>
          </nav>
        </div>
      </div>
      <div className="product-main-content">
        <div className="product-left-column">
          <ImageSlider images={product.images} />
          <div className="product-actions">
            {isOutOfStockByPrice ? (
              <div className="out-of-stock-message" style={{ color: 'red', fontWeight: 'bold', margin: '16px 0' }}>
                Tạm hết hàng
              </div>
            ) : (
              <>
                <div className="product-quantity">
                  <span>Số lượng:</span>
                  <div className="quantity-controls">
                    <button className="quantity-btn" onClick={detail.decreaseQuantity}>-</button>
                    <input
                      type="number"
                      min="1"
                      max={product.so_luong || 0}
                      value={quantity}
                      onChange={detail.handleQuantityChange}
                    />
                    <button className="quantity-btn" onClick={detail.increaseQuantity}>+</button>
                  </div>
                  <span
                    className={`stock-info ${product.so_luong <= 5 ? "low-stock" : ""}`}
                  >
                    {product.so_luong > 0
                      ? product.so_luong <= 5
                        ? `Chỉ còn ${product.so_luong} sản phẩm!`
                        : `Còn ${product.so_luong} sản phẩm`
                      : "Hết hàng"}
                  </span>
                </div>
                <div className="product-buttons">
                  <button
                    onClick={detail.handleBuyNow}
                    className="buy-now-button"
                    disabled={product.so_luong < 1}
                  >
                    {product.so_luong < 1 ? "Hết hàng" : "Mua ngay"}
                  </button>
                  <button
                    onClick={detail.handleAddToCart}
                    className={`add-to-cart-button ${isInCart ? "in-cart" : ""}`}
                    disabled={product.so_luong < 1}
                  >
                    {product.so_luong < 1 && "Hết hàng"}
                    {product.so_luong >= 1 && (isInCart ? "✅ Đã thêm vào giỏ hàng" : "🛒 Thêm vào giỏ hàng")}
                  </button>
                  <button
                    onClick={detail.handleToggleWishlist}
                    className={`wishlist-button ${isInWishlist ? "in-wishlist" : ""}`}
                    disabled={wishlistLoading}
                  >
                    {wishlistLoading
                      ? "Đang tải..."
                      : isInWishlist
                        ? "❤️ Đã yêu thích"
                        : "♡ Yêu thích"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="product-right-column">
          <div className="product-header">
            <h1 className="product-title">{product.ten_sp || "Không xác định"}</h1>
            <div className="product-rating">
              <div className="stars">{"⭐".repeat(Math.round(averageRating))}</div>
              <span className="review-count">({reviews.length} đánh giá)</span>
            </div>
            <div className="product-price">
              {isOutOfStockByPrice ? (
                <span style={{ color: '#888', fontStyle: 'italic' }}>Liên hệ</span>
              ) : (
                <>
                  {formatCurrency(product.gia_sau || 0)}
                  {product.gia_truoc && product.gia_truoc > product.gia_sau && (
                    <span className="product-old-price">
                      {formatCurrency(product.gia_truoc)}
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="product-availability">
              <span
                className={`status ${isTrulyInStock ? "in-stock" : "out-of-stock"}`}
              >
                {isTrulyInStock ? "Còn hàng" : (isOutOfStockByPrice ? "Tạm hết hàng" : "Hết hàng")}
              </span>
            </div>
          </div>
          <div className="product-details-spec">
            <div className="custom-tab-menu">
              {detail.tabs.map((tab) => (
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
                <ProductOverview
                  product={product}
                  showFullDescription={showFullDescription}
                  setShowFullDescription={setShowFullDescription}
                />
              )}
              {selectedTab === "Thông số kỹ thuật" && (
                <ProductSpecs product={product} />
              )}
              {selectedTab === "Đánh giá" && (
                <ProductReviews
                  reviews={reviews}
                  product={product}
                  newReview={newReview}
                  setNewReview={setNewReview}
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  replyForms={replyForms}
                  setReplyForms={setReplyForms}
                  isSubmittingReply={isSubmittingReply}
                  setIsSubmittingReply={setIsSubmittingReply}
                  canReview={canReview}
                  purchaseDebug={purchaseDebug}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  navigate={navigate}
                  toast={toast}
                  handleReviewChange={detail.handleReviewChange}
                  handleSubmitReview={detail.handleSubmitReview}
                  toggleReplyForm={detail.toggleReplyForm}
                  handleReplyChange={detail.handleReplyChange}
                  handleSubmitReply={detail.handleSubmitReply}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <RelatedProducts relatedProducts={relatedProducts} />
    </motion.div>
  );
};

export default ProductDetail;
