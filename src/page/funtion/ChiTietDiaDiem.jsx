import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dia_Diem from "./Dia_Diem";
import { useCart } from "./useCart";
import { AuthContext } from "../funtion/AuthContext";
import "../../style/chitietdiadiem.css";

const DiaDiemDetail = () => {
  const { id } = useParams();
  const destination = Dia_Diem.find((dest) => dest.id === parseInt(id));
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useContext(AuthContext);
  const [showFull, setShowFull] = useState(false);

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
          {/*  */}
          {/* <div
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
            <p>{destination.location.address}</p>
          </div> */}

          {/* Slider ảnh */}
          <div className="image-slider">
            <h3>🖼️ Hình ảnh nổi bật</h3>
            <div className="slider-container">
              {destination.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Ảnh ${index + 1}`}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    marginBottom: "1rem",
                    borderRadius: "12px",
                  }}
                />
              ))}
              {/* <h1>{destination.name}</h1> */}
              <p>{destination.location.address}</p>
            </div>
          </div>
          <div className="destination-info">
            <p className="short-description">{destination.description}</p>
            {showFull && (
              <p className="full-description">{destination.fulldescription}</p>
            )}
            <span className="toggle-description" onClick={toggleDescription}>
              {showFull ? "View Less ↩" : "View More →"}
            </span>
          </div>

          {/* Specific */}
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

      {/* Location */}
      <div className="info-group">
        <h3>📍 Vị trí</h3>
        <p>{destination.location.address}</p>
        <div className="map-embed">
          <iframe
            title="Bản đồ"
            width="100%"
            height="300"
            style={{ border: "none", borderRadius: "12px" }}
            src={`https://www.google.com/maps?q=${destination.location.latitude},${destination.location.longitude}&hl=vi&z=14&output=embed`}
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Outstanding */}
      <div className="info-group">
        <h3>🌟 Điểm nổi bật</h3>
        <ul>
          {destination.Highlights?.map((item, index) => (
            <li key={index}>✅ {item}</li>
          ))}
        </ul>
      </div>

      {/* Review */}
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
