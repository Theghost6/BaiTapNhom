import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './useCart';
import '../../style/cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, totalQuantity, totalAmount, removeFromCart, clearCart } = useCart();
  
  
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };
  
  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá tất cả sản phẩm trong giỏ hàng?')) {
      clearCart();
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  const handleContinueShopping = () => {
    navigate('/AllDiaDiem');
  };
  
  // Fix: Changed condition to check if cart is empty (length === 0)
  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h3>Giỏ Hàng</h3>
        <div className="empty-cart-message">
          <i className="fa fa-shopping-cart"></i>
          <p>Giỏ hàng của bạn đang trống</p>
          <button onClick={handleContinueShopping} className="continue-shopping-btn">
            Tiếp tục đặt tour
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cart-page">
      <h3>Giỏ Hàng Của Bạn</h3>
      
      <div className="cart-summary-header">
        <p>Tổng sản phẩm: <strong>{totalQuantity}</strong></p>
        <p>Tổng giá trị: <strong>{ (totalAmount).toLocaleString('vi-VN') } VND
</strong></p>
      </div>
      <div className="cart-items-container">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id} className="cart-item">
                <td>
                  <div className="item-info">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="item-image" />
                    )}
                    <span className="item-name">{item.name}</span>
                  </div>
                </td>
                <td>{item.type || 'Dịch vụ'}</td>
                <td>{item.price || 0}</td>
                <td>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-button"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="cart-actions">
        <div className="cart-buttons">
          <button onClick={handleContinueShopping} className="continue-shopping-btn">
            Tiếp tục đặt tour
          </button>
          <button onClick={handleClearCart} className="clear-cart-btn">
            Xóa giỏ hàng
          </button>
        </div>
        <div className="cart-checkout">
          <div className="cart-total">
            <h4>Tổng cộng</h4>
            <div className="total-row">
              <span>Tổng tiền:</span>
              <span>{ (totalAmount).toLocaleString('vi-VN') } VND
               </span>
            </div>
          </div>
          <button onClick={handleCheckout} className="checkout-button">
            Tiến hành thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
