import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./useCart";
import "../../style/checkout.css";

const Checkout = () => {
  const cartContext = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu từ location state
  const destination = location.state?.destination || location.state?.sourceDestination;
  const hotel = location.state?.hotel;
  const room = location.state?.room;
  const checkInDateFromRoute = location.state?.checkInDate;
  const checkOutDateFromRoute = location.state?.checkOutDate;
  const guestsFromRoute = location.state?.guests;
  const cartItemsFromRoute = location.state?.cartItems;
  const fromDestination = location.state?.fromDestination;

  // Xác định nguồn booking
  const isDirectDestinationBooking = !!destination && !hotel && !room;
  const isHotelRoomBooking = !!hotel && !!room;
  const isCartBooking = !!cartItemsFromRoute && cartItemsFromRoute.length > 0;

  const { cartItems: contextCartItems = [], totalQuantity = 0, totalAmount = 0, clearCart } = cartContext || {};

  // State để lưu danh sách mục và tổng giá trị
  const [finalCartItems, setFinalCartItems] = useState([]);
  const [finalTotalAmount, setFinalTotalAmount] = useState(0);

  // Tính toán danh sách mục và tổng giá trị
  useEffect(() => {
    let calculatedCartItems = [];
    let calculatedTotal = 0;

    if (isDirectDestinationBooking) {
      // Trường hợp 1: Đặt trực tiếp từ DiaDiemDetail
      const price = destination?.price
        ? parseFloat(destination.price.replace(/[^\d]/g, ""))
        : 0;

      calculatedCartItems = [
        {
          id: destination.id,
          name: destination.name,
          description: destination.description,
          price: price,
          type: "Đặt tour trực tiếp",
          image: destination.image,
        },
      ];
      calculatedTotal = price;
    } else if (isHotelRoomBooking) {
      // Trường hợp 2: Đặt một phòng từ HotelDetail
      const days = calculateDays(checkInDateFromRoute, checkOutDateFromRoute);
      calculatedCartItems = [
        {
          id: room.id,
          name: room.name,
          hotelName: hotel.name,
          description: room.description,
          price: room.price,
          type: "Đặt phòng khách sạn",
          checkIn: checkInDateFromRoute,
          checkOut: checkOutDateFromRoute,
          guests: guestsFromRoute,
          days: days,
          image: room.image,
          quantity: 1,
        },
      ];
      calculatedTotal = room.price * days;
    } else if (isCartBooking) {
      // Trường hợp 3: Đặt từ giỏ hàng của HotelDetail
      calculatedCartItems = cartItemsFromRoute.map((item) => ({
        ...item,
        id: item.roomId,
        type: "Đặt phòng khách sạn",
      }));
      calculatedTotal = cartItemsFromRoute.reduce((total, item) => {
        return total + item.price * (item.quantity || 1) * (item.days || 1);
      }, 0);
    } else if (contextCartItems && contextCartItems.length > 0) {
      // Trường hợp 4: Sử dụng giỏ hàng từ useCart context
      calculatedCartItems = contextCartItems.map((item) => ({
        ...item,
        type: item.type || "Dịch vụ",
      }));
      calculatedTotal = totalAmount;
    }

    setFinalCartItems(calculatedCartItems);
    setFinalTotalAmount(calculatedTotal);
  }, [
    destination,
    hotel,
    room,
    contextCartItems,
    cartItemsFromRoute,
    isDirectDestinationBooking,
    isHotelRoomBooking,
    isCartBooking,
    totalAmount,
    checkInDateFromRoute,
    checkOutDateFromRoute,
    guestsFromRoute,
  ]);

  // Khởi tạo thông tin đặt phòng
  const [bookingInfo, setBookingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkInDate: checkInDateFromRoute || "",
    checkOutDate: checkOutDateFromRoute || "",
    numberOfPeople: guestsFromRoute || 1,
    specialRequests: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Hàm tính số ngày ở
  const calculateDays = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // Định dạng giá tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    try {
      // Tạo dữ liệu booking
      const bookingData = {
        cartItems: finalCartItems,
        bookingInfo,
        paymentMethod,
        totalAmount: finalTotalAmount,
        totalQuantity: finalCartItems.reduce((total, item) => total + (item.quantity || 1), 0),
        sourceInfo: {
          fromDestination,
          destinationId: destination?.id,
          hotelId: hotel?.id,
        },
      };

      console.log("Đang gửi bookingData:", bookingData);

      // Giả lập gửi request đến backend
      // Vì bạn yêu cầu không phụ thuộc backend, tôi sẽ giả lập phản hồi thành công
      const mockResponse = { status: "success" };

      if (mockResponse.status === "success") {
        // Xóa giỏ hàng nếu đặt từ context cart
        if (!isDirectDestinationBooking && !isHotelRoomBooking && !isCartBooking && clearCart) {
          clearCart();
        }

        alert("Đặt chỗ và thanh toán thành công!");
        navigate("/thankyou");
      } else {
        setError("Có lỗi xảy ra trong quá trình đặt chỗ hoặc thanh toán");
      }
    } catch (err) {
      console.error("Error occurred:", err);
      setError("Có lỗi xảy ra trong quá trình xử lý");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Thanh Toán & Đặt Chỗ</h2>

      {error && <div className="error">{error}</div>}

      {/* Hiển thị thông tin địa điểm nếu có */}
      {destination && (
        <div className="destination-info">
          <h3>Thông tin địa điểm</h3>
          {destination.image && (
            <div className="item-image">
              <img src={destination.image} alt={destination.name} />
            </div>
          )}
          <p><strong>Tên địa điểm:</strong> {destination.name}</p>
          <p><strong>Mô tả:</strong> {destination.description}</p>
          {destination.price && (
            <p><strong>Giá:</strong> {formatCurrency(parseFloat(destination.price.replace(/[^\d]/g, "")))}</p>
          )}
          {destination.location && (
            <p><strong>Địa chỉ:</strong> {destination.location.address}</p>
          )}
          {checkInDateFromRoute && (
            <p><strong>Check-in:</strong> {checkInDateFromRoute}</p>
          )}
          {checkOutDateFromRoute && (
            <p><strong>Check-out:</strong> {checkOutDateFromRoute}</p>
          )}
          {guestsFromRoute && (
            <p><strong>Số khách:</strong> {guestsFromRoute} người</p>
          )}
        </div>
      )}

      {/* Hiển thị thông tin phòng khách sạn nếu đặt từ trang khách sạn */}
      {isHotelRoomBooking && hotel && room && (
        <div className="hotel-room-info">
          <h3>Thông tin đặt phòng</h3>
          {room.image && (
            <div className="item-image">
              <img src={room.image} alt={room.name} />
            </div>
          )}
          <p><strong>Khách sạn:</strong> {hotel.name}</p>
          <p><strong>Phòng:</strong> {room.name}</p>
          <p><strong>Mô tả:</strong> {room.description}</p>
          <p><strong>Check-in:</strong> {checkInDateFromRoute}</p>
          <p><strong>Check-out:</strong> {checkOutDateFromRoute}</p>
          <p><strong>Số khách:</strong> {guestsFromRoute} người</p>
          <p><strong>Số đêm:</strong> {calculateDays(checkInDateFromRoute, checkOutDateFromRoute)}</p>
          <p><strong>Tổng giá:</strong> {formatCurrency(room.price * calculateDays(checkInDateFromRoute, checkOutDateFromRoute))}</p>
        </div>
      )}

      {/* Hiển thị các item trong giỏ hàng */}
      {(isCartBooking || (!isDirectDestinationBooking && !isHotelRoomBooking && finalCartItems.length > 0)) && (
        <div className="cart-summary">
          <h3>Tóm tắt giỏ hàng</h3>
          <p>Tổng số mục: {finalCartItems.length}</p>
          <p>Tổng số phòng: {finalCartItems.reduce((total, item) => total + (item.quantity || 1), 0)}</p>
          <p>Tổng giá trị: {formatCurrency(finalTotalAmount)}</p>

          <div className="cart-items-list">
            {finalCartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-item">
                {item.image && (
                  <div className="item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-room.jpg";
                      }}
                    />
                  </div>
                )}
                <div className="item-details">
                  <h4>{item.name}</h4>
                  {item.hotelName && <p><strong>Khách sạn:</strong> {item.hotelName}</p>}
                  <p><strong>Loại:</strong> {item.type}</p>
                  {item.checkIn && item.checkOut && (
                    <p>
                      <strong>Ngày:</strong> {new Date(item.checkIn).toLocaleDateString("vi-VN")} đến{" "}
                      {new Date(item.checkOut).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                  {item.days && <p><strong>Số đêm:</strong> {item.days}</p>}
                  {item.guestCount && <p><strong>Số khách:</strong> {item.guestCount}</p>}
                  {item.quantity && <p><strong>Số lượng phòng:</strong> {item.quantity}</p>}
                  <p className="item-price">
                    <strong>Giá:</strong> {formatCurrency(item.price)} × {item.quantity || 1}{" "}
                    {item.days ? `× ${item.days} đêm` : ""} ={" "}
                    {formatCurrency(item.price * (item.quantity || 1) * (item.days || 1))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form thông tin đặt chỗ */}
      <form onSubmit={handleSubmit} className="checkout-form">
        <h3>Thông tin đặt chỗ</h3>

        <div className="form-group">
          <label htmlFor="fullName">Họ và tên</label>
          <input
            id="fullName"
            type="text"
            placeholder="Họ và tên"
            value={bookingInfo.fullName}
            onChange={(e) => setBookingInfo({ ...bookingInfo, fullName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={bookingInfo.email}
            onChange={(e) => setBookingInfo({ ...bookingInfo, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            id="phone"
            type="tel"
            placeholder="Số điện thoại"
            value={bookingInfo.phone}
            onChange={(e) => setBookingInfo({ ...bookingInfo, phone: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="checkInDate">Ngày nhận dịch vụ</label>
          <input
            id="checkInDate"
            type="date"
            value={bookingInfo.checkInDate}
            onChange={(e) => setBookingInfo({ ...bookingInfo, checkInDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="checkOutDate">Ngày trả dịch vụ</label>
          <input
            id="checkOutDate"
            type="date"
            value={bookingInfo.checkOutDate}
            onChange={(e) => setBookingInfo({ ...bookingInfo, checkOutDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="numberOfPeople">Số lượng người</label>
          <input
            id="numberOfPeople"
            type="number"
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
        </div>

        <div className="form-group">
          <label htmlFor="specialRequests">Yêu cầu đặc biệt (nếu có)</label>
          <textarea
            id="specialRequests"
            placeholder="Yêu cầu đặc biệt (nếu có)"
            value={bookingInfo.specialRequests}
            onChange={(e) =>
              setBookingInfo({
                ...bookingInfo,
                specialRequests: e.target.value,
              })
            }
          />
        </div>

        <h3>Phương thức thanh toán</h3>
        <div className="payment-methods">
          <div className="payment-option">
            <input
              type="radio"
              id="credit-card"
              name="payment"
              value="credit-card"
              checked={paymentMethod === "credit-card"}
              onChange={() => setPaymentMethod("credit-card")}
            />
            <label htmlFor="credit-card">Thẻ tín dụng</label>
          </div>

          <div className="payment-option">
            <input
              type="radio"
              id="paypal"
              name="payment"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
            />
            <label htmlFor="paypal">PayPal</label>
          </div>

          <div className="payment-option">
            <input
              type="radio"
              id="cod"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            <label htmlFor="cod">Thanh toán khi nhận dịch vụ</label>
          </div>
        </div>

        {paymentMethod === "credit-card" && (
          <div className="credit-card-fields">
            <input type="text" placeholder="Tên chủ thẻ" required />
            <input type="text" placeholder="Số thẻ" required />
            <div className="card-expiry-cvv">
              <input type="text" placeholder="MM/YY" required />
              <input type="text" placeholder="CVV" required />
            </div>
          </div>
        )}

        <div className="checkout-total">
          <p>Tổng thanh toán:</p>
          <p className="total-amount">{formatCurrency(finalTotalAmount)}</p>
        </div>

        <button type="submit" className="checkout-button" disabled={isProcessing}>
          {isProcessing ? "Đang xử lý..." : "Hoàn tất đặt chỗ và thanh toán"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
