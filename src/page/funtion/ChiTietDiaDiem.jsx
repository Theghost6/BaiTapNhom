import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DiaDiem from "./Dia_Diem";
import { useCart } from "./useCart";
import { AuthContext } from "../funtion/AuthContext";
import ImageSlider from "../funtion/ImageSlider";
import TabMenu from "../funtion/TabMenu";
import { hotelsList } from "./khach_San"; // Import hotel data
import "../../style/chitietdiadiem.css";
import axios from "axios";

const DiaDiemDetail = () => {
  const { id } = useParams();
  const destination = DiaDiem.find((dest) => dest.id === parseInt(id));
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false);
  const { addToCart } = useCart();
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user } = authContext || {};

  // State cho form đặt phòng
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);

  // Default tabs array
  const tabs = [
    "Tổng quan",
    "Kế hoạch",
    "Vị trí",
    "Reviews",
    "Nổi bật",
    "Hotel",
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  // Khách sạn với địa điểm
  const matchHotels = hotelsList.filter((h) => h.id === destination.id);
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

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost/backend/reviews.php?id_tour=${id}`,
      );
      if (response.data && Array.isArray(response.data)) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

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

    if (!checkInDate || !checkOutDate) {
      alert("Vui lòng chọn ngày nhận và trả phòng!");
      return;
    }
    if (!guests || guests < 1) {
      alert("Vui lòng chọn số khách!");
      return;
    }

    navigate("/hotels", {
      state: {
        destination: destination,
        checkInDate,
        checkOutDate,
        guests,
      },
    });
  };

  // Handle change in review form inputs
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: name === "so_sao" ? parseInt(value) : value,
    });
  };

  // Reply review
  const [replyOpenIndex, setReplyOpenIndex] = useState(null);
  const [replies, setReplies] = useState({});

  const toggleReply = (index) => {
    setReplyOpenIndex(replyOpenIndex === index ? null : index);
  };

  const handleReplyChange = (e, index) => {
    setReplies({ ...replies, [index]: e.target.value });
  };

  const handleReplySubmit = async (e, index) => {
    e.preventDefault();
    const replyText = replies[index];

    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để phản hồi!");
      navigate("/register");
      return;
    }

    if (!replyText) return;

    const formData = new FormData();
    formData.append("id_danh_gia", reviews[index].id); // Lưu ý phải có trường id trong danh_gia
    formData.append("ten_nguoi_tra_loi", user.username || "Khách");
    formData.append("noi_dung_phan_hoi", replyText);
    formData.append("ngay", new Date().toISOString().split("T")[0]);

    try {
      const response = await axios.post(
        "http://localhost/backend/reply_review.php",
        formData,
      );
      console.log(response.data);
      if (response.data.success) {
        // Gọi lại fetch để cập nhật review có reply mới
        fetchReviews();
        setReplies({ ...replies, [index]: "" });
        setReplyOpenIndex(null);
      } else {
        alert("Gửi phản hồi thất bại.");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Có lỗi khi gửi phản hồi.");
    }
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
    formData.append("ten_nguoi_dung", user.username || "Khách");
    formData.append("so_sao", newReview.danh_gia);
    formData.append("binh_luan", newReview.binh_luan);
    // Current date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    formData.append("ngay", today);

    try {
      // Send to your PHP backend
      const response = await axios.post(
        "http://localhost/backend/reviews.php",
        formData,
      );
      console.log(response);
      if (response.data.success) {
        // Add the new review to the existing reviews
        const newReviewItem = {
          id: response.data.id, // 💥 lấy ID thật từ server
          id_tour: parseInt(id),
          ten_nguoi_dung: user.username || "Khách",
          so_sao: newReview.danh_gia,
          binh_luan: newReview.binh_luan,
          ngay: today,
          replies: [], // khởi tạo rỗng
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

  // Handle tab selection
  const handleTabChange = (tab) => {
    console.log("Selected tab:", tab); // Debug log
    setSelectedTab(tab);
  };

  // Ngày hôm nay để giới hạn input date
  const today = new Date().toISOString().split("T")[0];

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

          {/* Custom TabMenu implementation */}
          <div className="custom-tab-menu">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab-button ${selectedTab === tab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Slider ảnh */}
          {selectedTab === "Tổng quan" && (
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
          {selectedTab === "Kế hoạch" && (
            <div className="destination-info-box">
              <div className="info-item">
                <span>Từ</span>
                <strong>{destination.price}</strong>
              </div>
              <div className="info-item">
                <span>Tag</span>
                <strong>{destination.tag.join(", ")}</strong>
              </div>
              <div className="info-item">
                <span>Khoảng thời gian</span>
                <strong>{destination.duration}</strong>
              </div>
              <div className="info-item">
                <span>Chú ý</span>
                <strong>
                  {destination.notes.map((note, index) => (
                    <div key={index}>• {note}</div>
                  ))}
                </strong>
              </div>
              <div className="info-item">
                <span>Điểm nổi bật</span>
                <strong>{destination.Highlights.join(", ")}</strong>
              </div>
              <div className="info-item">
                <span>Đánh giá</span>
                <strong>{destination.rating} ★</strong>
              </div>
            </div>
          )}

          {/* Location */}
          {selectedTab === "Vị trí" && (
            <div className="info-group">
              <h3>📍 Vị trí</h3>
              <p>{destination.location.address}</p>
              <div className="map-embed">
                <iframe
                  title="Bản đồ"
                  width="690px"
                  height="300"
                  style={{ border: "none", borderRadius: "12px" }}
                  src={destination.location.mapUrl + "&output=embed"}
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
                        <span className="review-date">{review.ngay}</span>
                      </div>
                      <p className="review-comment">{review.binh_luan}</p>
                      <div className="review-stars">
                        {"⭐".repeat(review.so_sao || review.danh_gia)}
                      </div>

                      {/* ✅ Hiển thị phản hồi nếu có */}
                      {review.replies && review.replies.length > 0 && (
                        <div className="reply-list">
                          {review.replies.map((reply, rIndex) => (
                            <div key={rIndex} className="review-reply">
                              <div className="reply-header">
                                <strong>{reply.ten_nguoi_tra_loi}</strong> —{" "}
                                <span className="reply-date">{reply.ngay}</span>
                              </div>
                              <p className="reply-content">
                                {reply.noi_dung_phan_hoi}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* ✅ Nút & Form phản hồi */}
                      <button
                        className="reply-button"
                        onClick={() => toggleReply(index)}
                      >
                        ↩️ Reply
                      </button>

                      {replyOpenIndex === index && (
                        <form
                          className="reply-form"
                          onSubmit={(e) => handleReplySubmit(e, index)}
                        >
                          <textarea
                            placeholder="Phản hồi đánh giá này..."
                            value={replies[index] || ""}
                            onChange={(e) => handleReplyChange(e, index)}
                            rows={3}
                            required
                          ></textarea>
                          <button type="submit" className="submit-reply-btn">
                            Gửi phản hồi
                          </button>
                        </form>
                      )}
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

          {/* Outstanding */}
          {selectedTab === "Nổi bật" && (
            <div className="info-group">
              <h3>🌟 Điểm nổi bật</h3>
              <ul>
                {destination.Highlights?.map((item, index) => (
                  <li key={index}>✅ {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Hotel Tab Section */}
          {selectedTab === "Hotel" && (
            <div className="hotel-info-section">
              <h3>🏨 Thông tin khách sạn</h3>

              {matchHotels.length > 0 ? (
                matchHotels.map((hotel, index) => (
                  <div className="hotel-details" key={index}>
                    <div className="hotel-header">
                      <h2>{hotel.name}</h2>
                      <div className="hotel-rating">
                        {"⭐".repeat(Math.floor(hotel.rating))}
                        <span className="rating-number"> {hotel.rating}/5</span>
                      </div>
                    </div>

                    <div className="hotel-images">
                      {hotel.images && hotel.images.length > 0 ? (
                        <ImageSlider
                          images={hotel.images}
                          address={hotel.address}
                        />
                      ) : (
                        <img
                          src={hotel.image || "/default-hotel.jpg"}
                          alt={hotel.name}
                          style={{ width: "100%", borderRadius: "8px" }}
                        />
                      )}
                    </div>

                    <div className="hotel-description">
                      <p>{hotel.description}</p>
                      <p>{hotel.fullDescription}</p>
                    </div>

                    <div className="hotel-address">
                      <h4>📍 Địa chỉ</h4>
                      <p>{hotel.address}</p>
                    </div>

                    <div className="hotel-amenities">
                      <h4>🛎️ Tiện nghi</h4>
                      <ul className="amenities-list">
                        {hotel.amenities &&
                          hotel.amenities.map((amenity, i) => (
                            <li key={i}>✅ {amenity}</li>
                          ))}
                      </ul>
                    </div>
                    <hr className="section-divider" />
                  </div>
                ))
              ) : (
                <p>Chưa có thông tin khách sạn cho địa điểm này.</p>
              )}
            </div>
          )}
        </div>

        {/* Right column_booking */}
        <div className="tour-book-box">
          <h3>Book This Tour</h3>
          {/* <label>Chọn ngày:</label>
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
          </select> */}

          <div className="tour-buttons">
            <button onClick={handleBookNow} className="book-now-button">
              Đặt ngay
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

export default DiaDiemDetail;
