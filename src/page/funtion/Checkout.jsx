import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./useCart";
import "../../style/checkout.css";

const Checkout = () => {
  const cartContext = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu từ location state
  const destination =
    location.state?.destination || location.state?.sourceDestination;
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

  const {
    cartItems: contextCartItems = [],
    clearCart,
  } = cartContext || {};

  // State để lưu danh sách mục và tổng giá trị
  const [finalCartItems, setFinalCartItems] = useState([]);
  const [finalTotalAmount, setFinalTotalAmount] = useState(0);
  
  // Chuyển giá tiền từ String sang num trong địa điểm
  const destPrice = destination?.price
    ? parseFloat(destination.price.replace(/[^\d]/g, ""))
    : 0;
    
  // Định dạng giá tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Tính toán danh sách mục và tổng giá trị
  useEffect(() => {
    let calculatedCartItems = [];
    let calculatedTotal = 0;

    if (isDirectDestinationBooking) {
      calculatedCartItems.push({
        id: destination.id,
        name: destination.name,
        description: destination.description,
        price: destPrice,
        type: "Đặt tour trực tiếp",
        image: destination.image,
      });
      calculatedTotal = destPrice;
    } else if (isHotelRoomBooking) {
      const days = calculateDays(checkInDateFromRoute, checkOutDateFromRoute);
      calculatedCartItems.push({
        id: room.id,
        name: room.name,
        hotelName: hotel.name,
        description: room.description,
        price: parseFloat(room.price),
        type: "Đặt phòng khách sạn",
        checkIn: checkInDateFromRoute,
        checkOut: checkOutDateFromRoute,
        guests: guestsFromRoute,
        days: days,
        image: room.image,
        quantity: 1,
      });
      calculatedTotal += parseFloat(room.price) * days + destPrice;
    } else if (isCartBooking) {
      calculatedCartItems = cartItemsFromRoute.map((item) => ({
        ...item,
        id: item.roomId,
        price: parseFloat(item.price),
        type: "Đặt phòng khách sạn",
      }));
      calculatedTotal =
        cartItemsFromRoute.reduce((total, item) => {
          return total + item.price * (item.quantity || 1) * (item.days || 1);
        }, 0) + destPrice;
    } else if (
      contextCartItems &&
      contextCartItems.length > 0 &&
      !destination &&
      !hotel &&
      !room
    ) {
      calculatedCartItems = contextCartItems.map((item) => ({
        ...item,
        price: parseFloat(item.price),
        type: item.type || "Dịch vụ",
      }));
      calculatedTotal =
        contextCartItems.reduce((total, item) => {
          return (
            total +
            parseFloat(item.price) * (item.quantity || 1) * (item.days || 1)
          );
        }, 0) + destPrice;
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
    checkInDateFromRoute,
    checkOutDateFromRoute,
    guestsFromRoute,
    destPrice,
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

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Validation states
  const [formErrors, setFormErrors] = useState({});

  // Hàm tính số ngày ở
  const calculateDays = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    if (!bookingInfo.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ và tên";
    }
    
    if (!bookingInfo.email.trim()) {
      errors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingInfo.email)) {
      errors.email = "Email không hợp lệ";
    }
    
    if (!bookingInfo.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10,11}$/.test(bookingInfo.phone.replace(/[^0-9]/g, ""))) {
      errors.phone = "Số điện thoại không hợp lệ";
    }
    
    if (!bookingInfo.checkInDate) {
      errors.checkInDate = "Vui lòng chọn ngày nhận phòng";
    }
    
    if (!bookingInfo.checkOutDate) {
      errors.checkOutDate = "Vui lòng chọn ngày trả phòng";
    } else if (new Date(bookingInfo.checkOutDate) <= new Date(bookingInfo.checkInDate)) {
      errors.checkOutDate = "Ngày trả phòng phải sau ngày nhận phòng";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError("");
    try {
      const bookingData = {
        cartItems: finalCartItems.map((item) => ({
          id: item.id,
          name: item.name || "Unknown",
          description: item.description || "",
          price: parseFloat(item.price),
          type: item.type || "Dịch vụ",
          quantity: item.quantity || 1,
          checkIn: item.checkIn || bookingInfo.checkInDate,
          checkOut: item.checkOut || bookingInfo.checkOutDate,
          days: item.days || calculateDays(bookingInfo.checkInDate, bookingInfo.checkOutDate),
        })),
        bookingInfo,
        paymentMethod,
        totalAmount: finalTotalAmount,
        totalQuantity: finalCartItems.reduce((total, item) => total + (item.quantity || 1), 0),
        hotelInfo: hotel ? { id: hotel.id, name: hotel.name, address: hotel.address || "" } : null,
        roomInfo: room ? { id: room.id, name: room.name, price: parseFloat(room.price), capacity: guestsFromRoute || 1 } : null,
        destinationInfo: destination ? { id: destination.id, name: destination.name, description: destination.description || "", price: destPrice, address: destination.location?.address || "" } : null,
        sourceInfo: { fromDestination, destinationId: destination?.id, hotelId: hotel?.id, roomId: room?.id },
        bookingDate: new Date().toISOString(),
      };

      const response = await fetch("http://localhost/backend/payments.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        if (paymentMethod === "vnpay" && result.payUrl) {
          window.location.href = result.payUrl; // Redirect to VNPay payment page
        } else {
          if (!isDirectDestinationBooking && !isHotelRoomBooking && !isCartBooking && clearCart) {
            clearCart();
          }
          navigate("/thankyou", { state: { bookingId: result.bookingId } });
        }
      } else {
        setError(result.message || "Có lỗi xảy ra trong quá trình xử lý");
        setIsProcessing(false);
      }
    } catch (err) {
      setError("Có lỗi xảy ra: " + err.message);
      setIsProcessing(false);
    }
  };

  // Get today's date for date input min value
  const today = new Date().toISOString().split("T")[0];
  
  return (
    <div className="checkout-page">
      <h2>Thanh Toán & Đặt Chỗ</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Hiển thị thông tin địa điểm nếu có */}
      {destination && (
        <div className="destination-info">
          <h3>Thông tin địa điểm</h3>
          {destination.image && (
            <div className="item-image">
              <img 
                src={destination.image} 
                alt={destination.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-destination.jpg";
                }}
              />
            </div>
          )}
          <p>
            <strong>Tên địa điểm:</strong> {destination.name}
          </p>
          <p>
            <strong>Mô tả:</strong> {destination.description}
          </p>
          {destination.price && (
            <p>
              <strong>Giá:</strong>{" "}
              {formatCurrency(destPrice)}
            </p>
          )}
          {destination.location && (
            <p>
              <strong>Địa chỉ:</strong> {destination.location.address}
            </p>
          )}
          {checkInDateFromRoute && (
            <p>
              <strong>Ngày đến:</strong> {new Date(checkInDateFromRoute).toLocaleDateString("vi-VN")}
            </p>
          )}
          {checkOutDateFromRoute && (
            <p>
              <strong>Ngày đi:</strong> {new Date(checkOutDateFromRoute).toLocaleDateString("vi-VN")}
            </p>
          )}
          {guestsFromRoute && (
            <p>
              <strong>Số khách:</strong> {guestsFromRoute} người
            </p>
          )}
        </div>
      )}

      {/* Hiển thị thông tin phòng khách sạn nếu đặt từ trang khách sạn */}
      {isHotelRoomBooking && hotel && room && (
        <div className="hotel-room-info">
          <h3>Thông tin đặt phòng</h3>
          {room.image && (
            <div className="item-image">
              <img 
                src={room.image} 
                alt={room.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-room.jpg";
                }}
              />
            </div>
          )}
          <p>
            <strong>Khách sạn:</strong> {hotel.name}
          </p>
          <p>
            <strong>Phòng:</strong> {room.name}
          </p>
          <p>
            <strong>Mô tả:</strong> {room.description}
          </p>
          <p>
            <strong>Ngày nhận phòng:</strong> {new Date(checkInDateFromRoute).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <strong>Ngày trả phòng:</strong> {new Date(checkOutDateFromRoute).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <strong>Số khách:</strong> {guestsFromRoute} người
          </p>
          <p>
            <strong>Số đêm:</strong>{" "}
            {calculateDays(checkInDateFromRoute, checkOutDateFromRoute)}
          </p>
          <p>
            <strong>Tổng giá:</strong>{" "}
            {formatCurrency(
              room.price *
                calculateDays(checkInDateFromRoute, checkOutDateFromRoute)
            )}
          </p>
        </div>
      )}

      {/* Hiển thị các item trong giỏ hàng */}
      {(isCartBooking ||
        (!isDirectDestinationBooking &&
          !isHotelRoomBooking &&
          finalCartItems.length > 0)) && (
        <div className="cart-summary">
          <h3>Tóm tắt giỏ hàng</h3>
          <p>Tổng số mục: {finalCartItems.length}</p>
          <p>
            Tổng số phòng:{" "}
            {finalCartItems.reduce(
              (total, item) => total + (item.quantity || 1),
              0,
            )}
          </p>
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
                  {item.hotelName && (
                    <p>
                      <strong>Khách sạn:</strong> {item.hotelName}
                    </p>
                  )}
                  <p>
                    <strong>Loại:</strong> {item.type}
                  </p>
                  {item.checkIn && item.checkOut && (
                    <p>
                      <strong>Ngày:</strong>{" "}
                      {new Date(item.checkIn).toLocaleDateString("vi-VN")} đến{" "}
                      {new Date(item.checkOut).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                  {item.days && (
                    <p>
                      <strong>Số đêm:</strong> {item.days}
                    </p>
                  )}
                  {item.guestCount && (
                    <p>
                      <strong>Số khách:</strong> {item.guestCount}
                    </p>
                  )}
                  {item.quantity && (
                    <p>
                      <strong>Số lượng phòng:</strong> {item.quantity}
                    </p>
                  )}
                  <p className="item-price">
                    <strong>Giá:</strong> {formatCurrency(item.price)} ×{" "}
                    {item.quantity || 1} {item.days ? `× ${item.days} đêm` : ""}{" "}
                    ={" "}
                    {formatCurrency(
                      item.price * (item.quantity || 1) * (item.days || 1),
                    )}
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

        <div className={`form-group ${formErrors.fullName ? "error" : ""}`}>
          <label htmlFor="fullName">Họ và tên</label>
          <input
            id="fullName"
            type="text"
            placeholder="Họ và tên"
            value={bookingInfo.fullName}
            onChange={(e) =>
              setBookingInfo({ ...bookingInfo, fullName: e.target.value })
            }
            required
          />
          {formErrors.fullName && <div className="error-text">{formErrors.fullName}</div>}
        </div>

        <div className={`form-group ${formErrors.email ? "error" : ""}`}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={bookingInfo.email}
            onChange={(e) =>
              setBookingInfo({ ...bookingInfo, email: e.target.value })
            }
            required
          />
          {formErrors.email && <div className="error-text">{formErrors.email}</div>}
        </div>

        <div className={`form-group ${formErrors.phone ? "error" : ""}`}>
          <label htmlFor="phone">Số điện thoại</label>
          <input
            id="phone"
            type="tel"
            placeholder="Số điện thoại"
            value={bookingInfo.phone}
            onChange={(e) =>
              setBookingInfo({ ...bookingInfo, phone: e.target.value })
            }
            required
          />
          {formErrors.phone && <div className="error-text">{formErrors.phone}</div>}
        </div>

        <div className={`form-group ${formErrors.checkInDate ? "error" : ""}`}>
          <label htmlFor="checkInDate">Ngày nhận dịch vụ</label>
          <input
            id="checkInDate"
            type="date"
            min={today}
            value={bookingInfo.checkInDate}
            onChange={(e) =>
              setBookingInfo({ ...bookingInfo, checkInDate: e.target.value })
            }
            required
          />
          {formErrors.checkInDate && <div className="error-text">{formErrors.checkInDate}</div>}
        </div>

        <div className={`form-group ${formErrors.checkOutDate ? "error" : ""}`}>
          <label htmlFor="checkOutDate">Ngày trả dịch vụ</label>
          <input
            id="checkOutDate"
            type="date"
            min={bookingInfo.checkInDate || today}
            value={bookingInfo.checkOutDate}
            onChange={(e) =>
              setBookingInfo({ ...bookingInfo, checkOutDate: e.target.value })
            }
            required
          />
          {formErrors.checkOutDate && <div className="error-text">{formErrors.checkOutDate}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="numberOfPeople">Số lượng người</label>
          <select
            id="numberOfPeople"
            value={bookingInfo.numberOfPeople}
            onChange={(e) =>
              setBookingInfo({
                ...bookingInfo,
                numberOfPeople: parseInt(e.target.value) || 1,
              })
            }
            required
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} người
              </option>
            ))}
          </select>
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
              id="cod"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            <label htmlFor="cod">Thanh toán khi nhận dịch vụ</label>
          </div>
          <div className="payment-option">
            <input
              type="radio"
              id="vnpay"
              name="payment"
              value="vnpay"
              checked={paymentMethod === "vnpay"}
              onChange={() => setPaymentMethod("vnpay")}
            />
            <label htmlFor="vnpay">Thanh toán qua VNPay</label>
          </div>
        </div>

        <div className="checkout-total">
          <p>Tổng thanh toán:</p>
          <p className="total-amount">{formatCurrency(finalTotalAmount)}</p>
        </div>

        <button
          type="submit"
          className="checkout-button"
          disabled={isProcessing}
        >
          {isProcessing ? "Đang xử lý..." : "Hoàn tất đặt chỗ và thanh toán"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
