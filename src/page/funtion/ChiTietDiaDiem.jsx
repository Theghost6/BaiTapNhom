import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dia_Diem from "./Dia_Diem";
import { useCart } from "./useCart";
import { AuthContext } from "../funtion/AuthContext"; // Sửa đường dẫn nếu cần
import "../../style/chitietdiadiem.css";

const DiaDiemDetail = () => {
  // Lấy id từ URL
  const { id } = useParams();

  // Tìm địa điểm tương ứng với<BS> id trong mảng Dia_Diem
  const destination = Dia_Diem.find((dest) => dest.id === parseInt(id));

  // Nếu không tìm thấy địa điểm, hiển thị thông báo lỗi
  if (!destination) {
    return <div>Không tìm thấy địa điểm này.</div>;
  }

  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false); // State để kiểm tra xem sản phẩm đã trong giỏ hàng chưa
  const { cartItems, addToCart } = useCart(); // Lấy hàm addToCart từ CartContext
  // Sử dụng AuthContext để kiểm tra đăng nhập
  const { isAuthenticated } = useContext(AuthContext);

  // Hàm xử lý khi nhấn "Thêm vào giỏ hàng"
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/register"); // Chuyển hướng đến trang đăng nhập
      return;
    }

    addToCart(destination); // Gọi hàm addToCart từ CartContext
    setIsInCart(true); // Cập nhật trạng thái
    alert(`${destination.name} đã được thêm vào giỏ hàng!`);
  };

  // Hàm xử lý khi nhấn "Đặt ngay"
  const handleBookNow = () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để đặt ngay!");
      navigate("/register"); // Chuyển hướng đến trang đăng nhập
      return;
    }

    console.log(`Đặt ngay ${destination.name}!`);
    // addToCart(destination); // Gọi hàm addToCart từ CartContext
    navigate("/checkout", { state: { destination } }); // Chuyển đến trang thanh toán
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
        {/* Left column - Tour info */}
        <div className="destination-detail-container">
          <div
            className="destination-header"
            style={{
              backgroundImage: `url(${destination.image}), url(${destination.images[0]})`,
              backgroundrepeat: "no-repeat, repeat",
              backgroundSize: "cover, contain",
              backgroundPosition: "center, top right",
              height: "400px",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textShadow: "0px 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            <h1>{destination.name}</h1>
            <p>{destination.location}</p>
          </div>

          <div className="destination-info-box">
            <div className="info-item">
              <span>From</span>
              <strong>${destination.price}</strong>
            </div>
            <div className="info-item">
              <span>Tag</span>
              <strong>{destination.tag}</strong>
            </div>
            <div className="info-item">
              <span>Duration</span>
              <strong>{destination.duration}</strong>
            </div>
            <div className="info-item">
              <span>Description</span>
              <strong>{destination.description}</strong>
            </div>
            <div className="info-item">
              <span>Full Description</span>
              <strong>{destination.fulldescription}</strong>
            </div>
            <div className="info-item">
              <span>Notes</span>
              <strong>{destination.notes}+</strong>
            </div>
            <div className="info-item">
              <span>HighLights</span>
              <strong>{destination.Highlights}</strong>
            </div>
            <div className="info-item">
              <span>Rating</span>
              <strong>{destination.rating} ★</strong>
            </div>
          </div>
        </div>

        {/* Right column - Booking box */}
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
              {isInCart ? "Đã thêm vào giỏ hàng" : "Thêm vào giỏ hàng"}
            </button>
          </div>
        </div>
      </div>

      {/* review */}
      <div className="tour-review-section">
        <h3>Reviews</h3>
        <div className="review-summary">
          <span>
            <strong>{destination.reviews?.length || 0} Review</strong>
          </span>
          <span className="star-display">⭐⭐⭐⭐⭐</span>
          <span>
            Sort By:
            <select>
              <option value="rating">Rating</option>
              <option value="date">Date</option>
            </select>
          </span>
        </div>

        <hr />

        {destination.reviews?.map((review, index) => (
          <div className="review-item" key={index}>
            <div className="review-avatar">
              <img src={review.avatar} alt={review.name} />
            </div>
            <div className="review-content">
              <div className="review-header">
                <strong>{review.name}</strong>{" "}
                <span className="role">{review.role}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
              <div className="review-stars">{"⭐".repeat(review.rating)}</div>
              <div className="review-date">{review.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiaDiemDetail;
