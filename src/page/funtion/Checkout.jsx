import React, { useState } from 'react';
import { useCart } from './useCart'; // Make sure to use the correct path to CartContext
import "../../style/checkout.css";

const Checkout = () => {
  const cartContext = useCart();

  if (!cartContext) {
    return <div>Đang tải giỏ hàng...</div>;
  }

  const { cartItems, totalQuantity, totalAmount, clearCart } = cartContext;

  const [bookingInfo, setBookingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfPeople: 1,
    specialRequests: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const bookingData = {
        cartItems: cartItems || [],
        bookingInfo,
        paymentMethod,
        totalAmount,
        totalQuantity
      };

      console.log('Booking and payment data:', bookingData);

      if (clearCart) {
        clearCart();
      }

      alert('Đặt chỗ và thanh toán thành công! Vui lòng kiểm tra email để xác nhận.');

    } catch (err) {
      setError('Có lỗi xảy ra trong quá trình đặt chỗ hoặc thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Thanh Toán & Đặt Chỗ</h2>

      {error && <div className="error">{error}</div>}

      <div className="cart-summary">
        <h3>Tóm tắt giỏ hàng</h3>
        <p>Tổng số sản phẩm: {totalQuantity}</p>
        <p>Tổng giá trị: ${totalAmount}</p>
        {cartItems && cartItems.length > 0 ? (
          cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <span>{item.name} - {item.type || 'Dịch vụ'}</span>
              <span>${item.price || 0}</span>
            </div>
          ))
        ) : (
          <div>Giỏ hàng trống</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <h3>Thông tin đặt chỗ</h3>

        <input
          type="text"
          placeholder="Họ và tên"
          value={bookingInfo.fullName}
          onChange={(e) => setBookingInfo({ ...bookingInfo, fullName: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={bookingInfo.email}
          onChange={(e) => setBookingInfo({ ...bookingInfo, email: e.target.value })}
          required
        />

        <input
          type="tel"
          placeholder="Số điện thoại"
          value={bookingInfo.phone}
          onChange={(e) => setBookingInfo({ ...bookingInfo, phone: e.target.value })}
          required
        />

        <input
          type="date"
          placeholder="Ngày nhận dịch vụ"
          value={bookingInfo.checkInDate}
          onChange={(e) => setBookingInfo({ ...bookingInfo, checkInDate: e.target.value })}
          required
        />

        <input
          type="date"
          placeholder="Ngày trả dịch vụ"
          value={bookingInfo.checkOutDate}
          onChange={(e) => setBookingInfo({ ...bookingInfo, checkOutDate: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Số lượng người"
          value={bookingInfo.numberOfPeople}
          onChange={(e) => setBookingInfo({ ...bookingInfo, numberOfPeople: parseInt(e.target.value) || 1 })}
          min="1"
          required
        />

        <textarea
          placeholder="Yêu cầu đặc biệt (nếu có)"
          value={bookingInfo.specialRequests}
          onChange={(e) => setBookingInfo({ ...bookingInfo, specialRequests: e.target.value })}
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
          {isProcessing ? 'Đang xử lý...' : 'Hoàn tất đặt chỗ và thanh toán'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
