import React, { useState } from "react";
import axios from "axios";
import "../../style/tracuudonhang.css";

function TrackModal({ isOpen, onClose, message, order }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {message ? (
          <>
            <div className="modal-icon">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h2>Thông báo</h2>
            <p>{message}</p>
          </>
        ) : (
          <>
            <div className="modal-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Đơn hàng ID: {order.ma_don_hang}</h2>
            <p><strong>Trạng thái:</strong> {order.trang_thai}</p>
            <p><strong>Tổng tiền:</strong> {Number(order.tong_tien).toLocaleString("vi-VN")} đ</p>
            <p><strong>Người đặt:</strong> {order.ten_nguoi_dung} ({order.email})</p>
            {order.address && (
              <p>
                <strong>Địa chỉ giao:</strong> {order.address.nguoi_nhan}, {order.address.dia_chi}, {order.address.phuong_xa}, {order.address.quan_huyen}, {order.address.tinh_thanh}
              </p>
            )}
          </>
        )}
        <button className="modal-btn" onClick={onClose}>
          <i className="fas fa-times"></i> Đóng
        </button>
      </div>
    </div>
  );
}

function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, message: "", order: null });
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_HOST;
  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId && !phone) {
      setError("Vui lòng nhập mã đơn hàng hoặc số điện thoại");
      setModal({
        isOpen: true,
        message: "Vui lòng nhập mã đơn hàng hoặc số điện thoại",
        order: null
      });
      return;
    }
    setError("");
    console.log("Tracking order:", { orderId, phone });
    setModal({ isOpen: false, message: "", order: null });
    setOrders([]);
    setExpandedOrder(null);
    setLoading(true);

    try {
      // Build query params dynamically
      const params = [];
      if (orderId) params.push(`order_id=${encodeURIComponent(orderId)}`);
      if (phone) params.push(`phone=${encodeURIComponent(phone)}`);
      const queryString = params.length > 0 ? "&" + params.join("&") : "";
      const response = await axios.get(
        `${apiUrl}/tracuudh.php?action=track_order${queryString}`
      );
      console.log("API response:", response.data);
      if (response.data.success) {
        const fetchedOrders = Array.isArray(response.data.orders) ? response.data.orders : [];
        setOrders(fetchedOrders);
        if (fetchedOrders.length === 1) {
          setModal({
            isOpen: true,
            message: "",
            order: fetchedOrders[0]
          });
        } else if (fetchedOrders.length > 1) {
          setModal({
            isOpen: true,
            message: "Đã tìm thấy nhiều đơn hàng. Vui lòng xem chi tiết bên dưới.",
            order: null
          });
        }
      } else {
        setModal({
          isOpen: true,
          message: response.data.message || "Không tìm thấy đơn hàng",
          order: null
        });
      }
    } catch (err) {
      console.error("API error:", err);
      setModal({
        isOpen: true,
        message: `Lỗi kết nối server: ${err.message}`,
        order: null
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const renderTimeline = (status) => {
    const statuses = [
      { name: "Chờ xử lý", icon: "fa-hourglass-start", color: "#e67e22" },
      { name: "Đang giao hàng", icon: "fa-truck", color: "#3498db" },
      { name: "Đã giao hàng", icon: "fa-check-circle", color: "#2ecc71" }
    ];
    const currentIndex = statuses.findIndex((s) => s.name === status) >= 0 ? statuses.findIndex((s) => s.name === status) : 0;

    return (
      <div className="timeline">
        {statuses.map((s, index) => (
          <div
            key={s.name}
            className={`timeline-item ${index <= currentIndex ? "active" : ""}`}
            style={{ color: index <= currentIndex ? s.color : "#ccc" }}
          >
            <div className="timeline-icon">
              <i className={`fas ${s.icon}`}></i>
            </div>
            <div className="timeline-content">
              <span>{s.name}</span>
            </div>
            {index < statuses.length - 1 && (
              <div
                className="timeline-line"
                style={{ background: index < currentIndex ? s.color : "#ccc" }}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="order-tracking-container">
      <h1>Tra cứu Đơn hàng</h1>

      {/* Tracking Form */}
      <form className="tracking-form" onSubmit={handleTrackOrder}>
        <div className="form-group">
          <label htmlFor="orderId">Mã đơn hàng</label>
          <input
            type="text"
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.trim())}
            placeholder="Nhập mã đơn hàng (VD: 123)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value.trim())}
            placeholder="Nhập số điện thoại (VD: 0987654333)"
          />
        </div>
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
        <button type="submit" className="track-btn" disabled={loading}>
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <>
              <i className="fas fa-search"></i> Tra cứu
            </>
          )}
        </button>
      </form>

      {/* Order Details */}
      {orders.length > 0 && (
        <div className="order-details">
          {orders.map((order) => (
            <div key={order.ma_don_hang} className="order-item">
              <div
                className="order-header"
                onClick={() => toggleOrderDetails(order.ma_don_hang)}
              >
                <h2>Đơn hàng ID: {order.ma_don_hang}</h2>
                <i className={`fas fa-chevron-${expandedOrder === order.ma_don_hang ? "up" : "down"}`}></i>
              </div>
              {expandedOrder === order.ma_don_hang && (
                <div className="order-content">
                  {renderTimeline(order.trang_thai)}
                  <table className="table">
                    <tbody>
                      <tr>
                        <td><strong>Người đặt:</strong></td>
                        <td>{order.ten_nguoi_dung} ({order.email})</td>
                      </tr>
                      <tr>
                        <td><strong>Tổng tiền:</strong></td>
                        <td>{Number(order.tong_tien).toLocaleString("vi-VN")} đ</td>
                      </tr>
                      <tr>
                        <td><strong>Trạng thái:</strong></td>
                        <td>{order.trang_thai}</td>
                      </tr>
                      <tr>
                        <td><strong>Ngày đặt:</strong></td>
                        <td>{new Date(order.ngay_dat).toLocaleString("vi-VN")}</td>
                      </tr>
                      <tr>
                        <td><strong>Ghi chú:</strong></td>
                        <td>{order.ghi_chu || "Không có"}</td>
                      </tr>
                      {order.address && (
                        <tr>
                          <td><strong>Địa chỉ giao:</strong></td>
                          <td>
                            {order.address.nguoi_nhan}, {order.address.dia_chi}, {order.address.phuong_xa}, {order.address.quan_huyen}, {order.address.tinh_thanh} (SĐT: {order.address.sdt_nhan})
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {order.items && order.items.length > 0 && (
                    <div className="order-items">
                      <h3>Chi tiết sản phẩm</h3>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.ten_san_pham}</td>
                              <td>{item.so_luong}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <TrackModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, message: "", order: null })}
        message={modal.message}
        order={modal.order}
      />
    </div>
  );
}

export default OrderTracking;
