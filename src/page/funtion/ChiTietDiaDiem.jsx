import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dia_Diem from "./Dia_Diem";
import { useCart } from "./useCart";
import { AuthContext } from "../funtion/AuthContext";
import axios from "axios";
import ImageSlider from "../funtion/ImageSlider";
import TabMenu from "../funtion/TabMenu";

import "../../style/chitietdiadiem.css";

const DiaDiemDetail = () => {
  const { id } = useParams();
  const destination = Dia_Diem.find((dest) => dest.id === parseInt(id));
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false);
  const { addToCart } = useCart();
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user } = authContext || {};
  const [selectedTab, setSelectedTab] = useState("Overview");

  // const { isAuthenticated, user } = useContext(AuthContext);
  const [showFull, setShowFull] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    danh_gia: 5,
    binh_luan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews for this specific destination when component mounts
  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  // Change these lines in your DiaDiemDetail.jsx file
  const fetchReviews = async () => {
    try {
      // Update this URL to point to your combined PHP script
      const response = await axios.get(
        `http://localhost/backend/reviews.php?id_tour=${id}`
      );
      if (response.data && Array.isArray(response.data)) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // And update this line in handleSubmitReview function:
  const toggleDescription = () => {
    setShowFull(!showFull);
  };

  if (!destination) {
    return <div>Không tìm thấy địa điểm này.</div>;
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/register");
      return;
    }
    addToCart(destination);
    setIsInCart(true);
    alert(`${destination.name} đã được thêm vào giỏ hàng!`);
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để đặt ngay!");
      navigate("/register");
      return;
    }
    navigate("/checkout", { state: { destination } });
  };

  // Handle change in review form inputs
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: name === "danh_gia" ? parseInt(value) : value,
    });
  };

  // Submit review to database
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để đánh giá!");
      navigate("/register");
      return;
    }

    if (!newReview.binh_luan.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }
    setIsSubmitting(true);

    // Create form data for PHP
    const formData = new FormData();
    formData.append("id_tour", id);
    formData.append("ten_nguoi_dung", user.username || "Khách"); // Use user.user based on your register table
    formData.append("danh_gia", newReview.danh_gia);
    formData.append("binh_luan", newReview.binh_luan);
    // Current date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    formData.append("ngay", today);

    try {
      // Send to your PHP backend
      const response = await axios.post(
        "http://localhost/backend/reviews.php",
        formData
      );

      if (response.data.success) {
        // Add the new review to the existing reviews
        const newReviewItem = {
          id: response.data.id || Math.random(), // Use the ID from response or generate temporary one
          id_tour: parseInt(id),
          ten_nguoi_dung: user.username || "Khách",
          danh_gia: newReview.danh_gia,
          binh_luan: newReview.binh_luan,
          ngay: today,
        };

        setReviews([...reviews, newReviewItem]);

        // Reset the form
        setNewReview({
          danh_gia: 5,
          binh_luan: "",
        });

        alert("Cảm ơn bạn đã đánh giá!");
      } else {
        alert(response.data.message || "Có lỗi xảy ra khi gửi đánh giá");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tour-detail-wrapper">
      <div
        className="tour-hero"
        style={{ backgroundImage: `url(${destination.image})` }}
      >
        <div className="tour-hero-overlay">
          <h1>Tour Details</h1>
          <p>Home &gt; Tour List &gt; {destination.name}</p>
        </div>
      </div>
      <div className="tour-main-content">
        <div className="destination-detail-container">
          <h1 className="destination-title">{destination.name}</h1>

          <TabMenu onChange={(tab) => setSelectedTab(tab)} />
          {/* Slider ảnh */}
          {selectedTab === "Overview" && (
            <>
              <ImageSlider
                images={destination.images}
                address={destination.location.address}
              />

              <hr className="section-divider" />

              <div className="destination-info">
                <p className="short-description">{destination.description}</p>
                {showFull && (
                  <p className="full-description">
                    {destination.fulldescription}
                  </p>
                )}
                <span
                  className="toggle-description"
                  onClick={toggleDescription}
                >
                  {showFull ? "View Less ↩" : "View More →"}
                </span>
              </div>
            </>
          )}

          {/* Specific */}
          {selectedTab === "Tour plan" && (
            <div className="destination-info-box">
              <div className="info-item">
                <span>From</span>
                <strong>${destination.price}</strong>
              </div>
              <div className="info-item">
                <span>Tag</span>
                <strong>{destination.tag.join(", ")}</strong>
              </div>
              <div className="info-item">
                <span>Duration</span>
                <strong>{destination.duration}</strong>
              </div>
              <div className="info-item">
                <span>Notes</span>
                <strong>
                  {destination.notes.map((note, index) => (
                    <div key={index}>• {note}</div>
                  ))}
                </strong>
              </div>
              <div className="info-item">
                <span>HighLights</span>
                <strong>{destination.Highlights.join(", ")}</strong>
              </div>
              <div className="info-item">
                <span>Rating</span>
                <strong>{destination.rating} ★</strong>
              </div>
            </div>
          )}

          {/* Location */}
          {selectedTab === "Location" && (
            <div className="info-group">
              <h3>📍 Vị trí</h3>
              <p>{destination.location.address}</p>
              <div className="map-embed">
                <iframe
                  title="Bản đồ"
                  width="690px"
                  height="300"
                  style={{ border: "none", borderRadius: "12px" }}
                  src={`https://www.google.com/maps?q=${destination.location.latitude},${destination.location.longitude}&hl=vi&z=14&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Review Section */}
          {selectedTab === "Reviews" && (
            <div className="tour-review-section">
              <h3>Đánh Giá</h3>
              <div className="review-summary">
                <span>
                  <strong>{reviews.length || 0} Đánh giá</strong>
                </span>
                <span className="star-display">⭐⭐⭐⭐⭐</span>
                <span>
                  Sắp xếp theo:
                  <select>
                    <option value="rating">Đánh giá</option>
                    <option value="date">Ngày</option>
                  </select>
                </span>
              </div>

              {/* Existing reviews */}
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div className="review-item" key={index}>
                    <div className="review-avatar">
                      <img
                        src="/default-avatar.png"
                        alt={review.ten_nguoi_dung}
                      />
                    </div>
                    <div className="review-content">
                      <div className="review-header">
                        <strong>{review.ten_nguoi_dung}</strong>
                      </div>
                      <p className="review-comment">{review.binh_luan}</p>
                      <div className="review-stars">
                        {"⭐".repeat(review.danh_gia)}
                      </div>
                      <div className="review-date">{review.ngay}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p>
                  Chưa có đánh giá nào cho địa điểm này. Hãy là người đầu tiên
                  đánh giá!
                </p>
              )}

              {/* Add new review form */}
              <div className="add-review-section">
                <h4>Thêm đánh giá của bạn về {destination.name}</h4>
                <form onSubmit={handleSubmitReview}>
                  <div className="rating-input">
                    <label htmlFor="danh_gia">Đánh giá của bạn:</label>
                    <select
                      id="danh_gia"
                      name="danh_gia"
                      value={newReview.danh_gia}
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
                      placeholder="Chia sẻ trải nghiệm của bạn về địa điểm này..."
                      required
                    ></textarea>
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

        {/* Right column_booking */}
        <div className="tour-book-box">
          <h3>Book This Tour</h3>
          <label>Chọn ngày:</label>
          <input type="date" />
          <label>Chọn giờ:</label>
          <div className="tour-time-options">
            <button>12:00</button>
            <button>17:00</button>
          </div>

          <label>Số lượng:</label>
          <select>
            <option value="1">1 người</option>
            <option value="2">2 người</option>
            <option value="3">3 người</option>
          </select>

          <div className="tour-buttons">
            <button onClick={handleBookNow} className="book-now-button">
              Đặt ngay
            </button>
            <button onClick={handleAddToCart} className="add-to-cart-button">
              {isInCart ? "✅Đã thêm vào giỏ hàng" : "🛒Thêm vào giỏ hàng"}
            </button>
          </div>
        </div>
      </div>

      {/* Outstanding */}
      {selectedTab === "Outstanding" && (
        <div className="info-group">
          <h3>🌟 Điểm nổi bật</h3>
          <ul>
            {destination.Highlights?.map((item, index) => (
              <li key={index}>✅ {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiaDiemDetail;
