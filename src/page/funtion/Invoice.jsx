import React from "react";
import { useLocation, Link } from "react-router-dom";
import "../../style/invoice.css";

const Invoice = () => {
  const location = useLocation();
  const orderData = location.state?.orderData || {};
  const { customerInfo, cartItems, totalAmount, shippingCost, paymentMethod, shippingMethod, orderDate } = orderData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="invoice-page">
      <div className="invoice-container">
        <div className="invoice-header">
          <h1>HÓA ĐƠN THANH TOÁN</h1>
          <div className="invoice-meta">
            <p>Ngày: {formatDate(orderDate)}</p>
            <p>Mã đơn hàng: #{orderData.orderId || 'N/A'}</p>
          </div>
        </div>

        <div className="invoice-section">
          <h2>Thông tin khách hàng</h2>
          <div className="customer-info">
            <p><strong>Họ tên:</strong> {customerInfo?.fullName || 'N/A'}</p>
            <p><strong>Email:</strong> {customerInfo?.email || 'N/A'}</p>
            <p><strong>Số điện thoại:</strong> {customerInfo?.phone || 'N/A'}</p>
            
            {shippingMethod === 'ship' && (
              <>
                <p><strong>Địa chỉ:</strong> {customerInfo?.address || 'N/A'}</p>
                <p><strong>Tỉnh/TP:</strong> {customerInfo?.city || 'N/A'}</p>
                <p><strong>Quận/Huyện:</strong> {customerInfo?.district || 'N/A'}</p>
                <p><strong>Phường/Xã:</strong> {customerInfo?.ward || 'N/A'}</p>
              </>
            )}
            
            {shippingMethod === 'pickup' && (
              <p><strong>Nhận hàng tại cửa hàng</strong></p>
            )}
          </div>
        </div>

        <div className="invoice-section">
          <h2>Chi tiết đơn hàng</h2>
          <table className="invoice-items">
            <thead>
              <tr>
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {cartItems?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.ten}</td>
                  <td>{formatCurrency(item.gia)}</td>
                  <td>{item.so_luong}</td>
                  <td>{formatCurrency(item.gia * item.so_luong)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-totals">
          <div className="totals-row">
            <span>Tạm tính:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <div className="totals-row">
            <span>Phí vận chuyển:</span>
            <span>{shippingCost === 0 ? "Miễn phí" : formatCurrency(shippingCost)}</span>
          </div>
          <div className="totals-row grand-total">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(totalAmount + shippingCost)}</span>
          </div>
        </div>

        <div className="invoice-section">
          <h2>Phương thức thanh toán</h2>
          <p>
            {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : ''}
            {paymentMethod === 'vnpay' ? 'Thanh toán qua VNPay' : ''}
          </p>
        </div>

        <div className="invoice-footer">
          <div className="thank-you">
            <p>Cảm ơn quý khách đã mua hàng!</p>
          </div>
        </div>

        <div className="invoice-actions">
          <button onClick={() => window.print()} className="print-button">
            In hóa đơn
          </button>
          <Link to="/thankyou">
            <button className="invoice-thanks">
              Tiếp theo
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Invoice;