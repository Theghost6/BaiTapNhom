import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './useCart';
import '../../style/cart.css';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';


const Cart = () => {
  const navigate = useNavigate();
  // Lấy cartProducts từ useCart (dữ liệu đã fetch từ backend)
  const { cartProducts, totalQuantity, totalAmount, removeFromCart, clearCart, updateQuantity } = useCart();
  const { isAuthenticated } = useContext(AuthContext) || {};

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá tất cả sản phẩm trong giỏ hàng?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { products: cartProducts } });
  };

  const handleContinueShopping = () => {
    navigate('/AllLinhKien');
  };

  const handleLoginRedirect = () => {
    navigate('/register');
  };

  // Helper: kiểm tra tồn kho qua stock_json.php giống ChiTietLinhKien
  const checkStock = async (item) => {
    const ma_sp = item.ma_sp || item.id || item.id_product;
    if (!ma_sp) {
      console.warn('Không có ma_sp hợp lệ:', item);
      return null;
    }
    const apiUrl = `${import.meta.env.VITE_HOST}/stock_json.php`;
    try {
      console.log('Gửi kiểm tra tồn kho:', { ma_sp, apiUrl });
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check',
          items: [{ ma_sp, id: ma_sp, id_product: ma_sp }]
        })
      });
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        console.log('Kết quả trả về từ stock_json.php:', data);
        if ((data.status === 'success' || data.success === true) && data.updated_items && data.updated_items.length > 0) {
          return data.updated_items[0].so_luong_cu;
        }
        if (data.error || data.message) {
          toast.error(data.error || data.message);
        }
        return null;
      } catch (jsonErr) {
        console.error('Lỗi parse JSON tồn kho:', text);
        toast.error('Lỗi dữ liệu tồn kho: ' + text);
        return null;
      }
    } catch (err) {
      console.error('Lỗi khi gọi API tồn kho:', err);
      toast.error('Không kết nối được API tồn kho!');
      return null;
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    // Tìm đúng item trong cartProducts để lấy ma_sp chuẩn
    const item = cartProducts.find(i => i.id === itemId || i.ma_sp === itemId || i.id_product === itemId);
    if (!item) {
      toast.error('Không tìm thấy sản phẩm trong giỏ hàng!');
      return;
    }
    const maxStock = await checkStock(item);
    if (maxStock === null) {
      toast.error('Không kiểm tra được tồn kho sản phẩm này!');
      return;
    }
    if (newQuantity > maxStock) {
      toast.warn(`Số lượng vượt quá tồn kho! Chỉ còn ${maxStock} sản phẩm.`);
      updateQuantity(itemId, maxStock);
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

  if (!cartProducts.length) {
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

  // Nếu có cartProducts nhưng không có trường ten_sp, images, gia_sau... thì hiển thị debug
  const hasProductInfo = cartProducts.some(item => item.ten_sp || item.gia_sau || (item.images && item.images.length));
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
              {cartProducts.map((item) => (
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
