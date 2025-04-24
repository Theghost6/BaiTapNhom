import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { hotelsList } from "./khach_San"; // Danh sách khách sạn mẫu
import "../../style/chitiethotel.css"; // File CSS riêng cho giao diện

// Danh sách các phòng mẫu
const demoRooms = [
  {
    id: 1,
    name: "Phòng Standard",
    price: 800000,
    description:
      "Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản, phù hợp cho 2 người.",
    capacity: 2,
    amenities: ["TV LCD", "Điều hòa", "Wifi miễn phí", "Minibar"],
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/256430583.jpg?...",
    totalRooms: 2,
    bookedCount: 0,
  },
  {
    id: 2,
    name: "Phòng Deluxe",
    price: 1200000,
    description: "Phòng cao cấp rộng rãi với view đẹp, thích hợp cho gia đình.",
    capacity: 4,
    amenities: [
      "TV LCD",
      "Điều hòa",
      "Wifi miễn phí",
      "Minibar",
      "Bồn tắm",
      "Ban công",
    ],
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/210286629.jpg?...",
    totalRooms: 2,
    bookedCount: 0,
  },
  {
    id: 3,
    name: "Phòng Suite",
    price: 2000000,
    description: "Phòng hạng sang với không gian riêng biệt, dịch vụ VIP.",
    capacity: 2,
    amenities: [
      "TV LCD",
      "Điều hòa",
      "Wifi miễn phí",
      "Minibar",
      "Bồn tắm",
      "Phòng khách riêng",
      "Dịch vụ phòng 24h",
    ],
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/350568782.jpg?...",
    rzecz: 2,
    bookedCount: 0,
  },
];

const HotelDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Các state
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [bookingSuccessful, setBookingSuccessful] = useState(false);
  const [lastBookedRoom, setLastBookedRoom] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [sourceDestination, setSourceDestination] = useState(null);

  // Lấy thông tin khách sạn và dữ liệu từ ChiTietDiaDiem
  const hotel =
    location.state?.hotel || hotelsList.find((h) => h.id === parseInt(id));
  const destinationInfo = location.state?.destinationInfo;
  const fromDestination = location.state?.fromDestination || false;

  // Dữ liệu từ ChiTietDiaDiem (nếu có)
  const checkInDateFromDiaDiem = location.state?.checkInDate;
  const checkOutDateFromDiaDiem = location.state?.checkOutDate;
  const guestsFromDiaDiem = location.state?.guests;

  // Khởi tạo sourceDestination, danh sách phòng, và điền dữ liệu từ ChiTietDiaDiem
  useEffect(() => {
    if (destinationInfo) {
      setSourceDestination(destinationInfo);
    }
    setAvailableRooms(demoRooms);

    // Điền dữ liệu từ ChiTietDiaDiem vào form nếu có
    if (checkInDateFromDiaDiem) {
      setCheckInDate(checkInDateFromDiaDiem);
    }
    if (checkOutDateFromDiaDiem) {
      setCheckOutDate(checkOutDateFromDiaDiem);
    }
    if (guestsFromDiaDiem) {
      setGuests(guestsFromDiaDiem);
    }

    // Khôi phục giỏ hàng từ localStorage
    const savedCart = localStorage.getItem("hotelBookingCart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Lỗi khi đọc giỏ hàng từ localStorage:", error);
      }
    }
  }, [
    destinationInfo,
    checkInDateFromDiaDiem,
    checkOutDateFromDiaDiem,
    guestsFromDiaDiem,
  ]);

  // Lưu giỏ hàng vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("hotelBookingCart", JSON.stringify(cart));
  }, [cart]);

  // Định dạng giá tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Xử lý đặt phòng
  const handleBookRoom = (room) => {
    if (!checkInDate || !checkOutDate) {
      alert("Vui lòng chọn ngày nhận và trả phòng!");
      return;
    }

    if (room.bookedCount >= room.totalRooms) {
      alert("Phòng đã hết. Vui lòng chọn phòng khác!");
      return;
    }

    // Cập nhật số lượng phòng đã đặt (giả lập, không cần backend)
    const updatedRooms = availableRooms.map((r) =>
      r.id === room.id ? { ...r, bookedCount: r.bookedCount + 1 } : r,
    );
    setAvailableRooms(updatedRooms);
    setBookingSuccessful(true);
    setLastBookedRoom(room);

    // Xóa phòng khỏi giỏ hàng
    removeFromCart(room.id);

    // Chuyển hướng đến trang checkout
    setTimeout(() => {
      navigate("/checkout", {
        state: {
          hotel,
          room,
          checkInDate,
          checkOutDate,
          guests,
          sourceDestination,
          fromDestination,
          bookingId: Math.random().toString(36), // Giả lập bookingId
        },
      });
    }, 500);
  };

  // Thêm phòng vào giỏ hàng
  const addToCart = (room) => {
    if (!checkInDate || !checkOutDate) {
      alert(
        "Vui lòng chọn ngày nhận và trả phòng trước khi thêm vào giỏ hàng!",
      );
      return;
    }

    if (room.bookedCount >= room.totalRooms) {
      alert("Phòng đã hết. Vui lòng chọn phòng khác!");
      return;
    }

    const existingItemIndex = cart.findIndex(
      (item) =>
        item.roomId === room.id &&
        item.hotelId === hotel.id &&
        item.checkInDate === checkInDate &&
        item.checkOutDate === checkOutDate,
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      const currentItem = updatedCart[existingItemIndex];

      if (currentItem.quantity < room.totalRooms - room.bookedCount) {
        currentItem.quantity += 1;
        setCart(updatedCart);
        alert(`Đã thêm 1 ${room.name} vào giỏ hàng!`);
      } else {
        alert(
          `Không thể thêm nữa. Chỉ còn ${room.totalRooms - room.bookedCount} phòng loại này!`,
        );
      }
    } else {
      const newCartItem = {
        roomId: room.id,
        roomName: room.name,
        roomImage: room.image,
        price: room.price,
        quantity: 1,
        days: calculateDays(),
        guestCount: guests,
        checkInDate,
        checkOutDate,

        // Thông tin khách sạn đầy đủ
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelAddress: hotel.address,
        hotelRating: hotel.rating,
        hotelImage: hotel.image || hotel.images?.[0],

        // Nếu đến từ trang ChiTietDiaDiem
        sourceDestination: sourceDestination || null,
        fromDestination: fromDestination || false,
      };
      setCart([...cart, newCartItem]);
      alert(`Đã thêm ${room.name} vào giỏ hàng!`);
    }
    setShowCart(true);
  };

  // Xóa phòng khỏi giỏ hàng
  const removeFromCart = (roomId, checkIn = null, checkOut = null) => {
    const updatedCart =
      checkIn && checkOut
        ? cart.filter(
            (item) =>
              !(
                item.roomId === roomId &&
                item.checkInDate === checkIn &&
                item.checkOutDate === checkOut
              ),
          )
        : cart.filter((item) => item.roomId !== roomId);
    setCart(updatedCart);
  };

  // Cập nhật số lượng phòng trong giỏ hàng
  const updateCartItemQuantity = (index, newQuantity) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];
    const room = availableRooms.find((r) => r.id === item.roomId);

    if (
      room &&
      newQuantity > 0 &&
      newQuantity <= room.totalRooms - room.bookedCount
    ) {
      item.quantity = newQuantity;
      setCart(updatedCart);
    } else if (newQuantity <= 0) {
      removeFromCart(item.roomId, item.checkInDate, item.checkOutDate);
    } else {
      alert(
        `Không thể đặt nhiều hơn ${room.totalRooms - room.bookedCount} phòng loại này!`,
      );
    }
  };

  // Tính tổng tiền giỏ hàng
  const calculateCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity * item.days,
      0,
    );
  };

  // Đặt tất cả phòng trong giỏ hàng
  const bookAllInCart = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    // Cập nhật số lượng phòng đã đặt (giả lập)
    const updatedRooms = availableRooms.map((room) => {
      const bookedItem = cart.find((item) => item.roomId === room.id);
      return bookedItem
        ? { ...room, bookedCount: room.bookedCount + bookedItem.quantity }
        : room;
    });
    setAvailableRooms(updatedRooms);

    // Xóa giỏ hàng
    setCart([]);

    // Chuyển đến trang thanh toán
    navigate("/checkout", {
      state: {
        cartItems: [...cart],
        totalAmount: calculateCartTotal(),
        hotel,
        sourceDestination,
        fromDestination,
      },
    });

    alert(`Đặt thành công ${cart.length} loại phòng!`);
  };

  // Kiểm tra nếu không tìm thấy khách sạn
  if (!hotel) {
    return <div className="not-found">Không tìm thấy khách sạn này.</div>;
  }

  // Tính số ngày ở
  const calculateDays = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="hotel-detail">
      {bookingSuccessful && lastBookedRoom && (
        <div className="booking-success">
          <p className="success-title">🎉 Đặt phòng thành công!</p>
          <p>
            Bạn đã đặt {lastBookedRoom.name}. Còn{" "}
            {lastBookedRoom.totalRooms - lastBookedRoom.bookedCount} phòng loại
            này.
          </p>
        </div>
      )}

      <div className="cart-button-container">
        <button className="cart-button" onClick={() => setShowCart(!showCart)}>
          🛒 Giỏ hàng ({cart.reduce((total, item) => total + item.quantity, 0)})
        </button>
      </div>

      {showCart && (
        <div className="shopping-cart">
          <div className="cart-header">
            <h3>Giỏ hàng của bạn</h3>
            <button className="close-cart" onClick={() => setShowCart(false)}>
              ✖
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Giỏ hàng của bạn đang trống</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item, index) => (
                  <div
                    key={`${item.roomId}-${item.checkInDate}-${index}`}
                    className="cart-item"
                  >
                    <div className="cart-item-image">
                      <img
                        src={item.roomImage || "/default-room.jpg"}
                        alt={item.roomName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-room.jpg";
                        }}
                      />
                    </div>
                    <div className="cart-item-info">
                      <h4>{item.roomName}</h4>
                      <p>{item.hotelName}</p>
                      <p className="booking-dates">
                        {new Date(item.checkInDate).toLocaleDateString("vi-VN")}{" "}
                        -{" "}
                        {new Date(item.checkOutDate).toLocaleDateString(
                          "vi-VN",
                        )}
                      </p>
                      <p>
                        {item.days} đêm • {item.guestCount} khách
                      </p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            updateCartItemQuantity(index, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateCartItemQuantity(index, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="item-price">
                        {formatCurrency(item.price * item.quantity * item.days)}
                      </p>
                      <button
                        className="remove-item"
                        onClick={() =>
                          removeFromCart(
                            item.roomId,
                            item.checkInDate,
                            item.checkOutDate,
                          )
                        }
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <p>Tổng cộng:</p>
                  <p className="total-amount">
                    {formatCurrency(calculateCartTotal())}
                  </p>
                </div>
                <button className="checkout-button" onClick={bookAllInCart}>
                  Đặt tất cả
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="hotel-content">
        <div className="booking-form">
          <h3>Thông tin đặt phòng</h3>
          <div className="form-group">
            <label>Ngày nhận phòng</label>
            <input
              type="date"
              min={today}
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Ngày trả phòng</label>
            <input
              type="date"
              min={checkInDate || today}
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Số khách</label>
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} người
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="room-list">
        <h2>Danh sách phòng</h2>
        {availableRooms.map((room) => {
          const isAvailable = room.bookedCount < room.totalRooms;
          const remainingRooms = room.totalRooms - room.bookedCount;

          return (
            <div
              key={room.id}
              className={`room-card ${!isAvailable ? "unavailable" : ""}`}
            >
              <div className="room-image">
                <img
                  src={room.image || "/default-room.jpg"}
                  alt={room.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-room.jpg";
                  }}
                />
              </div>

              <div className="room-info">
                <div className="room-header">
                  <h3>{room.name}</h3>
                  <div className="room-price">
                    <p>{formatCurrency(room.price)}</p>
                    <span>1 đêm</span>
                  </div>
                </div>

                <p className="room-desc">{room.description}</p>
                <p className="room-capacity">👤 Tối đa {room.capacity} người</p>

                <div className="room-amenities">
                  <h4>Tiện nghi:</h4>
                  <div className="amenities-list">
                    {room.amenities.map((amenity, idx) => (
                      <span key={idx}>{amenity}</span>
                    ))}
                  </div>
                </div>

                <div className="room-footer">
                  <span
                    className={`availability ${isAvailable ? "available" : "full"}`}
                  >
                    {isAvailable ? `Còn ${remainingRooms} phòng` : "Hết phòng"}
                  </span>

                  {calculateDays() > 0 && (
                    <div className="total-price">
                      <p>
                        Tổng: {formatCurrency(room.price * calculateDays())}
                      </p>
                      <small>cho {calculateDays()} đêm</small>
                    </div>
                  )}

                  <div className="button-group">
                    <button
                      onClick={() => handleBookRoom(room)}
                      disabled={!isAvailable}
                      className="book-button"
                    >
                      {isAvailable ? "Đặt ngay" : "Hết phòng"}
                    </button>

                    <button
                      onClick={() => addToCart(room)}
                      disabled={!isAvailable}
                      className="add-to-cart-button"
                    >
                      {isAvailable ? "+ Giỏ hàng" : "Hết phòng"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotelDetail;
