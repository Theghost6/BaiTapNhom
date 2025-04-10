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
    <div className="destination-detail-container">
      <h1 className="destination-title">{destination.name}</h1>
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
        </div>
      </div>
      <div className="destination-info">
        <p className="short-description">{destination.description}</p>
        <p className="full-description">{destination.fulldescription}</p>

        <div className="info-group">
          <p>
            <strong>Giá:</strong> {destination.price}
          </p>
          <p>
            <strong>Đánh giá:</strong> ⭐ {destination.rating}
          </p>
          <p>
            <strong>Thời gian:</strong> {destination.duration}
          </p>
          <p>
            <strong>Thời điểm lý tưởng:</strong> {destination.bestTimeToVisit}
          </p>
        </div>

        <div className="info-group">
          <h3>📍 Vị trí</h3>
          <p>{destination.location.address}</p>
          <div className="map-embed">
            <iframe
              title="Bản đồ"
              width="100%"
              height="300"
              frameBorder="0"
              style={{ border: 0, borderRadius: "12px" }}
              src={`https://www.google.com/maps?q=${destination.location?.latitude},${destination.location?.longitude}&hl=vi&z=14&output=embed`}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="info-group">
          <h3>🌟 Điểm nổi bật</h3>
          <ul>
            {destination.Highlights?.map((item, index) => (
              <li key={index}>✅ {item}</li>
            ))}
          </ul>
        </div>

        <div className="info-group">
          <h3>🗣️ Đánh giá khách hàng</h3>
          {destination.reviews.map((review, index) => (
            <div key={index} className="review">
              <p>
                <strong>{review.user}:</strong> "{review.comment}" (
                {review.rating}⭐)
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="booking-actions">
        <button onClick={handleBookNow} className="book-now-button">
          Đặt ngay
        </button>
        <button onClick={handleAddToCart} className="add-to-cart-button">
          {isInCart ? "✅ Đã thêm vào giỏ" : "🛒 Thêm vào giỏ hàng"}
        </button>
      </div>
    </div>
  );
};

export default DiaDiemDetail;
