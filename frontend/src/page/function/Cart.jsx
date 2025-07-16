import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/cart/useCart';
import '../../style/cart.css';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';


const Cart = () => {
  const navigate = useNavigate();
  // Lấy cartItems từ useCart (dữ liệu localStorage)
  const { cartItems, totalQuantity, totalAmount, removeFromCart, clearCart, updateQuantity } = useCart();
  const { isAuthenticated, user } = useContext(AuthContext) || {};

  // Kiểm tra role admin
  if (isAuthenticated && user?.role === 'admin') {
    return (
      <div className="cart-page empty-cart">
        <h3>Giỏ Hàng</h3>
        <div className="empty-cart-message">
          <i className="fa fa-shopping-cart"></i>
          <p>Tài khoản admin không được phép truy cập giỏ hàng</p>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá tất cả sản phẩm trong giỏ hàng?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { products: cartItems } });
  };

  const handleContinueShopping = () => {
    navigate('/AllLinhKien');
  };

  const handleLoginRedirect = () => {
    navigate('/register');
  };

  // Kiểm tra tồn kho từ API products.php
  const checkStock = async (itemId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_HOST}/products.php?id=${itemId}`);
      const data = await response.json();

      if (data.success && data.data) {
        return data.data.so_luong || 0;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    // Kiểm tra tồn kho
    const stockQuantity = await checkStock(itemId);

    if (stockQuantity === null) {
      toast.error('Không thể kiểm tra tồn kho sản phẩm này!');
      return;
    }

    if (newQuantity > stockQuantity) {
      toast.warn(`Số lượng vượt quá tồn kho! Chỉ còn ${stockQuantity} sản phẩm.`);
      // Tự động điều chỉnh về số lượng tồn kho tối đa
      updateQuantity(itemId, stockQuantity);
      return;
    }

    updateQuantity(itemId, newQuantity);
  };

  // Format price
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' VND';
  }

  if (!isAuthenticated) {
    return (
      <div className="cart-page empty-cart">
        <h3>Giỏ Hàng</h3>
        <div className="empty-cart-message">
          <i className="fa fa-shopping-cart"></i>
          <p>Vui lòng đăng nhập để xem giỏ hàng</p>
          <button onClick={handleLoginRedirect} className="continue-shopping-btn">
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="cart-page empty-cart">
        <h3>Giỏ Hàng</h3>
        <div className="empty-cart-message">
          <i className="fa fa-shopping-cart"></i>
          <p>Giỏ hàng của bạn đang trống</p>
          <button onClick={handleContinueShopping} className="continue-shopping-btn">
            Tiếp tục mua hàng
          </button>
        </div>
      </div>
    );
  }

  // Nếu có cartItems nhưng không có trường ten_sp, images, gia_sau... thì hiển thị debug
  const hasProductInfo = cartItems.some(item => item.ten_sp || item.gia_sau || (item.images && item.images.length));
  if (!hasProductInfo) {
    return (
      <div className="cart-page empty-cart">
        <h3>Giỏ Hàng</h3>
        <div className="empty-cart-message">
          <i className="fa fa-shopping-cart"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items-container">
        <div className="cart-summary-header">
          <p>Tổng sản phẩm: <strong>{totalQuantity}</strong></p>
          <p>Tổng giá trị: <strong>{formatPrice(totalAmount)}</strong></p>
        </div>
        <div className="cart-table-responsive">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Loại</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="cart-item">
                  <td>
                    <div className="item-info">
                      <img src={item.images?.[0] || "/placeholder.jpg"} alt={item.ten_sp} className="item-image" />
                      <span className="item-name">{item.ten_sp}</span>
                    </div>
                  </td>
                  <td>{item.loai || item.danh_muc || "Linh kiện"}</td>
                  <td>{formatPrice(item.gia_sau)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.so_luong || 1}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-button"
                      aria-label="Xóa sản phẩm"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="cart-actions">
        <div className="cart-buttons">
          <button onClick={handleContinueShopping} className="continue-shopping-btn">
            Tiếp tục mua sắm
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
              <span>{formatPrice(totalAmount)}</span>
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
