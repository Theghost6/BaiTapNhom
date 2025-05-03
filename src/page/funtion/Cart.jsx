import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './useCart';
import '../../style/cart.css';
import LinhKien from './Linh_kien';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';


const Cart = () => {
  
  const navigate = useNavigate();
  const { cartItems, totalQuantity, totalAmount, removeFromCart, clearCart, updateQuantity } = useCart();
  const { isAuthenticated } = useContext(AuthContext) || {};
  // Create a lookup for product details
  const Products = Object.values(LinhKien).flat();
  const getProductDetails = cartItems
    .filter(item => item.id_product)
    .map(item => {
      const productDetail = Products.find(lk => lk.id === item.id_product);
      return {
        ...item,
        ten: productDetail?.ten || "Sản phẩm không xác định",
        gia: productDetail?.gia || 0,
        images: productDetail?.images?.[0] || "/placeholder.jpg",
        danh_muc: productDetail?.danh_muc || "Linh kiện",
      };
    });

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá tất cả sản phẩm trong giỏ hàng?')) {
      clearCart();
    }
  };

  
  const handleCheckout = () => {
    navigate('/checkout', { state: { products: getProductDetails } });
  };

  const handleContinueShopping = () => {
    navigate('/AllLinhKien');
  };

  const handleLoginRedirect = () => {
    navigate('/register');
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  // Format price
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' VND';
  };

  // Debug cartItems and getProductDetails
  console.log('cartItems:', cartItems);
  console.log('getProductDetails:', getProductDetails);

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

  if (cartItems.length === 0) {
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

  return (
    <div className="cart-page">
      <h3>Giỏ Hàng Của Bạn</h3>

      <div className="cart-summary-header">
        <p>Tổng sản phẩm: <strong>{totalQuantity}</strong></p>
        <p>Tổng giá trị: <strong>{formatPrice(totalAmount)}</strong></p>
      </div>

      <div className="cart-items-container">
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
              {getProductDetails.map((item) => (
                <tr key={item.id_product} className="cart-item">
                  <td>
                    <div className="item-info">
                      <img src={item.images} alt={item.ten} className="item-image" />
                      <span className="item-name">{item.ten}</span>
                    </div>
                  </td>
                  <td>{item.danh_muc}</td>
                  <td>{formatPrice(item.gia)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.so_luong || 1}
                      onChange={(e) => handleQuantityChange(item.id_product, parseInt(e.target.value))}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleRemoveItem(item.id_product)}
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
