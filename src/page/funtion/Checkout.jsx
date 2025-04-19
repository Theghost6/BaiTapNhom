import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./useCart";
import "../../style/checkout.css";

const Checkout = () => {
  const cartContext = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  if (!cartContext) {
    return <div>Đang tải giỏ hàng...</div>;
  }

  const { cartItems, totalQuantity, totalAmount, clearCart } = cartContext;

  const destination = location.state?.destination;
  const isSingleBooking = !!destination;

  const [bookingInfo, setBookingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfPeople: 1,
    specialRequests: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      // Xử lý dữ liệu cart cho đặt ngay
      let finalCartItems = cartItems;
      const price = destination?.price
        ? parseFloat(destination.price.replace(/[^\d]/g, ""))
        : 0;

      if (isSingleBooking && (!cartItems || cartItems.length === 0)) {
        finalCartItems = [
          {
            id: destination.id,
            name: destination.name,
            description: destination.description,
            price: price,
            type: "Đặt ngay",
          },
        ];
      }

      const bookingData = {
        cartItems: finalCartItems,
        bookingInfo,
        paymentMethod,
        totalAmount: isSingleBooking ? destination.price : totalAmount,
        totalQuantity: isSingleBooking ? 1 : totalQuantity,
      };
      console.log("Đang gửi bookingData:", bookingData);
      const response = await fetch("http://localhost/backend/payments.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      const rawText = await response.text();
      try {
        const result = JSON.parse(rawText);

        if (result.status === "success") {
          if (!isSingleBooking && clearCart) {
            clearCart();
          }
          alert("Đặt chỗ và thanh toán thành công!");
          navigate("/thankyou");
        } else {
          setError(
            result.message ||
              "Có lỗi xảy ra trong quá trình đặt chỗ hoặc thanh toán",
          );
        }
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        setError("Server returned invalid format");
      }
    } catch (err) {
      console.error("Error occurred:", err);
      setError("Có lỗi xảy ra trong quá trình kết nối với server");
    } finally {
      setIsProcessing(false);
    }
  };
  console.log("Destination gửi đi:", destination); // Kiểm tra destination.price ở đây
  return (
    <div className="checkout-page">
      <h2>Thanh Toán & Đặt Chỗ</h2>

      {error && <div className="error">{error}</div>}

      {destination && (
        <div className="destination-info">
          <h3>Thông tin địa điểm (Đặt ngay)</h3>
          <p>
            <strong>Tên địa điểm:</strong> {destination.name}
          </p>
          <p>
            <strong>Mô tả:</strong> {destination.description}
          </p>
          <p>
            <strong>Giá:</strong>{" "}
            {parseInt(destination.price.replace(/[^\d]/g, "")).toLocaleString(
              "vi-VN",
            )}{" "}
            đ
          </p>
        </div>
      )}

      {!isSingleBooking && (
        <div className="cart-summary">
          <h3>Tóm tắt giỏ hàng</h3>
          <p>Tổng số sản phẩm: {totalQuantity}</p>
          <p>Tổng giá trị: {parseFloat(totalAmount).toLocaleString("vi-VN")}</p>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <span>
                  {item.name} - {item.type || "Dịch vụ"}
                </span>
                <span>{parseInt(item.price).toLocaleString("vi-VN")}</span>
              </div>
            ))
          ) : (
            <div>Giỏ hàng trống</div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="checkout-form">
        <h3>Thông tin đặt chỗ</h3>

        <input
          type="text"
          placeholder="Họ và tên"
          value={bookingInfo.fullName}
          onChange={(e) =>
            setBookingInfo({ ...bookingInfo, fullName: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={bookingInfo.email}
          onChange={(e) =>
            setBookingInfo({ ...bookingInfo, email: e.target.value })
          }
          required
        />
        <input
          type="tel"
          placeholder="Số điện thoại"
          value={bookingInfo.phone}
          onChange={(e) =>
            setBookingInfo({ ...bookingInfo, phone: e.target.value })
          }
          required
        />
        <input
          type="date"
          placeholder="Ngày nhận dịch vụ"
          value={bookingInfo.checkInDate}
          onChange={(e) =>
            setBookingInfo({ ...bookingInfo, checkInDate: e.target.value })
          }
          required
        />
        <input
          type="date"
          placeholder="Ngày trả dịch vụ"
          value={bookingInfo.checkOutDate}
          onChange={(e) =>
            setBookingInfo({ ...bookingInfo, checkOutDate: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Số lượng người"
          value={bookingInfo.numberOfPeople}
          onChange={(e) =>
            setBookingInfo({
              ...bookingInfo,
              numberOfPeople: parseInt(e.target.value) || 1,
            })
          }
          min="1"
          required
        />
        <textarea
          placeholder="Yêu cầu đặc biệt (nếu có)"
          value={bookingInfo.specialRequests}
          onChange={(e) =>
            setBookingInfo({
              ...bookingInfo,
              specialRequests: e.target.value,
            })
          }
        />

        <h3>Phương thức thanh toán</h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="credit-card">Thẻ tín dụng</option>
          <option value="paypal">PayPal</option>
          <option value="cod">Thanh toán khi nhận dịch vụ</option>
        </select>

        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Đang xử lý..." : "Hoàn tất đặt chỗ và thanh toán"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
