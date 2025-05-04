import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LinhKien from "./Linh_kien";
import { useCart } from "./useCart";
import { AuthContext } from "../funtion/AuthContext";
import ImageSlider from "../funtion/ImageSlider";
import axios from "axios";
import { toast } from "react-toastify";
import "../../style/chitietlinhkien.css";


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useContext(AuthContext) || {};

  const product = Object.values(LinhKien)
    .flat()
    .find((item) => item.id === id);

  const [isInCart, setIsInCart] = useState(false);
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

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

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

  if (!product) {
    return <div>Không tìm thấy sản phẩm này.</div>;
  }
  // const handleAddToCart = async () => {
  //   if (!isAuthenticated) {
  //     toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
  //     navigate("/register");
  //     return;
  //   }
  //   try {
  //     const response = await axios.get(`http://localhost/backend/san_pham.php?id_product=${product.id}`);
  //     if (response.data.success && response.data.data.so_luong < 1) {
  //       toast.error("Sản phẩm hiện đã hết hàng!");
  //       return;
  //     }
  //     addToCart(product);
  //     setIsInCart(true);
  //     toast.success(`${product.ten} đã được thêm vào giỏ hàng!`);
  //   } catch (error) {
  //     toast.error("Lỗi khi kiểm tra tồn kho!");
  //   }
  // };
  const handleAddToCart = () => {
    console.log("Adding product:", product);
    addToCart(product);
    setIsInCart(true);
  };
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để mua ngay!");
      navigate("/register");
      return;
    }
    if (product.so_luong < 1) {
      toast.error("Sản phẩm hiện đã hết hàng!");
      return;
    }
    navigate("/checkout", { state: { product } });
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
      navigate("/register");
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
      navigate("/register");
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

  return (
    <div className="product-detail-wrapper">
      <div className="product-hero">
        <img
          src="/photos/c.jpg"
          alt="Background"
          className="product-hero-image"
        />
        <div className="hero-text">
          <h1 className="hero-title">Chi tiết sản phẩm</h1>
          <p className="hero-subtitle">
            Home ?& Sản phẩm ?& {product.ten || "Không xác định"}
          </p>
        </div>
      </div>

      <div className="product-main-content">
        <div className="product-detail-container">
          <h1 className="product-title">{product.ten || "Không xác định"}</h1>

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

          {selectedTab === "Tổng quan" && (
            <>
              <ImageSlider images={product.images} />
              <div className="product-info">
                <p><strong>Thương hiệu:</strong> {product.hang}</p>
                <p>
                  <strong>Giá:</strong> {product.gia.toLocaleString("vi-VN")} VNĐ
                </p>
                <p><strong>Tồn kho:</strong> {product.so_luong} sản phẩm</p>
                <p><strong>Trạng thái:</strong> {product.trang_thai}</p>
                <p><strong>Bảo hành:</strong> {product.bao_hanh}</p>
                <p>
                  <strong>Ngày phát hành:</strong> {product.ngay_phat_hanh}
                </p>
                <p>
                  <strong>Thiết bị tương thích:</strong>{" "}
                  {product.thiet_bi_tuong_thich.join(", ")}
                </p>
                <p>
                  <strong>Tính năng nổi bật:</strong>{" "}
                  {product.tinh_nang.join(", ")}
                </p>
              </div>
            </>
          )}

          {selectedTab === "Thông số kỹ thuật" && (
            <div className="product-specs">
              <h3>Thông số kỹ thuật</h3>
              <ul>
                {Object.entries(product.thong_so).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedTab === "Đánh giá" && (
            <div className="product-review-section">
              <h3>Đánh Giá</h3>
              <div className="review-summary">
                <span><strong>{reviews.length || 0} Đánh giá</strong></span>
              </div>

              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div className="review-item" key={review.id}>
                    <div className="review-content">
                      <div className="review-header">
                        <strong>{review.ten_nguoi_dung}</strong>
                        <span className="review-date">{review.ngay}</span>
                      </div>
                      <p className="review-comment">{review.binh_luan}</p>
                      <div className="review-stars">
                        {"⭐".repeat(review.so_sao)}
                      </div>
                      {review.replies && review.replies.length > 0 ? (
                        <div className="review-replies">
                          <h5>Phản hồi:</h5>
                          {review.replies.map((reply) => (
                            <div className="reply-item" key={reply.id}>
                              <div className="reply-header">
                                <strong>{reply.ten_nguoi_tra_loi}</strong>
                                <span className="reply-date">{reply.ngay}</span>
                              </div>
                              <p className="reply-comment">{reply.noi_dung}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-replies">
                          Chưa có phản hồi cho đánh giá này.
                        </p>
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
                              onChange={(e) =>
                                handleReplyChange(review.id, e.target.value)
                              }
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
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có đánh giá nào cho sản phẩm này.</p>
              )}

              <div className="add-review-section">
                <h4>Thêm đánh giá của bạn về {product.ten || "sản phẩm"}</h4>
                <form onSubmit={handleSubmitReview}>
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
            </div>
          )}
        </div>

        <div className="product-book-box">
          <h3>Mua sản phẩm này</h3>
          <div className="product-buttons">
            <button onClick={handleBuyNow} className="buy-now-button">
              Mua ngay
            </button>
            <button onClick={handleAddToCart} className="add-to-cart-button">
              {isInCart ? "✅ Đã thêm vào giỏ hàng" : "🛒 Thêm vào giỏ hàng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
