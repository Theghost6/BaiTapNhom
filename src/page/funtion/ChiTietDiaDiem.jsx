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
    <div className="destination-detail-container">
      <h1>{destination.name}</h1>
      <img src={destination.image} alt={destination.name} />
      <p>{destination.description}</p>
      <span>Giá: {destination.price}</span>
      <div>
        <span>Đánh giá: {destination.rating}</span>
      </div>

      {/* Nút "Đặt ngay" và "Thêm vào giỏ hàng" */}
      <div className="booking-actions">
        <button onClick={handleBookNow} className="book-now-button">
          Đặt ngay
        </button>
        <button onClick={handleAddToCart} className="add-to-cart-button">
          {isInCart ? "Đã thêm vào giỏ hàng" : "Thêm vào giỏ hàng"}
        </button>
      </div>
    </div>
  );
};

export default DiaDiemDetail;
