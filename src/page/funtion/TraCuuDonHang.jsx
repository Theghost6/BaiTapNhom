import React, { useState } from "react";
import axios from "axios";
import "../../style/tracuudonhang.css";

function TrackModal({ isOpen, onClose, message, order, items, address }) {
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
            <h2>Đơn hàng ID: {order.id}</h2>
            <p><strong>Trạng thái:</strong> {order.trang_thai}</p>
            <p><strong>Tổng tiền:</strong> {Number(order.tong_tien).toLocaleString("vi-VN")} đ</p>
            <p><strong>Người đặt:</strong> {order.user} ({order.email})</p>
            {address && (
              <p>
                <strong>Địa chỉ giao:</strong> {address.nguoi_nhan}, {address.dia_chi}, {address.phuong_xa}, {address.quan_huyen}, {address.tinh_thanh}
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
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, message: "" });
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    console.log("Tracking order:", { orderId, phone }); // Debug
    setModal({ isOpen: false, message: "" });
    setOrder(null);
    setOrderItems([]);
    setAddress(null);
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost/backend/tracuudh.php?action=track_order&order_id=${orderId}&phone=${phone}`
      );
      console.log("API response:", response.data); // Debug
      if (response.data.success) {
        setOrder(response.data.order);
        setOrderItems(response.data.items || []);
        setAddress(response.data.address);
        setModal({
          isOpen: true,
          message: "",
        });
      } else {
        setModal({
          isOpen: true,
          message: response.data.message || "Không tìm thấy đơn hàng",
        });
      }
    } catch (err) {
      console.error("API error:", err); // Debug
      setModal({
        isOpen: true,
        message: `Lỗi kết nối server: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTimeline = (status) => {
    const statuses = [
      { name: "Chờ xử lý", icon: "fa-hourglass-start" },
      { name: "Đang giao", icon: "fa-truck" },
      { name: "Hoàn thành", icon: "fa-check-circle" },
    ];
    const currentIndex = statuses.findIndex((s) => s.name === status);

    return (
      <div className="timeline">
        {statuses.map((s, index) => (
          <div
            key={s.name}
            className={`timeline-item ${index <= currentIndex ? "active" : ""}`}
          >
            <div className="timeline-icon">
              <i className={`fas ${s.icon}`}></i>
            </div>
            <div className="timeline-content">
              <span>{s.name}</span>
            </div>
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
            onChange={(e) => setOrderId(e.target.value.trim())} // Xóa khoảng trắng
            placeholder="Nhập mã đơn hàng (VD: 123)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value.trim())} // Xóa khoảng trắng
            placeholder="Nhập số điện thoại (VD: 0987654333)"
          />
        </div>
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
      {order && (
        <div className="order-details">
          <h2>Thông tin Đơn hàng ID: {order.id}</h2>
          {renderTimeline(order.trang_thai)}
          <table className="table">
            <tbody>
              <tr>
                <td><strong>Người đặt:</strong></td>
                <td>{order.user} ({order.email})</td>
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
              {address && (
                <tr>
                  <td><strong>Địa chỉ giao:</strong></td>
                  <td>
                    {address.nguoi_nhan}, {address.dia_chi}, {address.phuong_xa}, {address.quan_huyen}, {address.tinh_thanh} (SĐT: {address.sdt_nhan})
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Order Items */}
          {orderItems.length > 0 && (
            <div className="order-items">
              <h3>Chi tiết sản phẩm</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.ten_san_pham}</td>
                      <td>{item.danh_muc}</td>
                      <td>{item.so_luong}</td>
                      <td>{Number(item.gia).toLocaleString("vi-VN")} đ</td>
                      <td>
                        {Number(item.gia * item.so_luong).toLocaleString("vi-VN")} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <TrackModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, message: "" })}
        message={modal.message}
        order={order}
        items={orderItems}
        address={address}
      />
    </div>
  );
}

export default OrderTracking;
