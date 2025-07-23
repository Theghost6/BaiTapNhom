import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../function/AuthContext";
import { getCookie } from "../../helper/cookieHelper";

import "../../style/lich_su.css";
import { toast } from "react-toastify";

const OrderHistory = () => {
  // Hàm hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    try {
      setLoading(true);
      const userStr = getCookie("user");
      const user_id = userStr ? JSON.parse(userStr).id : null;
      const response = await axios.post(`${apiUrl}/lich_su_dh.php`, { order_id: orderId, user_id });
      if (response.data?.success) {
        toast.success("Đã hủy đơn hàng thành công!");
        setOrders(prev => prev.map(o => o.ma_don_hang === orderId ? { ...o, trang_thai: "Đã hủy" } : o));
      } else {
        toast.error(response.data?.message || "Hủy đơn hàng thất bại!");
      }
    } catch (err) {
      toast.error("Lỗi khi hủy đơn hàng!");
    } finally {
      setLoading(false);
    }
  };
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { user } = useContext(AuthContext); // Fixed: Use useContext instead of useState
  const apiUrl = import.meta.env.VITE_HOST;
  useEffect(() => {
    const fetchOrders = async () => {
      const userStr = getCookie("user");
      const user_id = userStr ? JSON.parse(userStr) : null;

      try {
        setLoading(true);
        if (!user_id) {
          toast.error("Bạn chưa đăng nhập");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `  ${apiUrl}/lich_su_dh.php?user_id=${user_id.id}`
        );
        const orderData = Array.isArray(response.data?.data) ? response.data.data : [];
        if (!Array.isArray(response.data?.data)) {
          toast.error("Lỗi dữ liệu đơn hàng từ server hoặc không đúng định dạng!");
        }
        setOrders(orderData);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Đã xảy ra lỗi khi tải đơn hàng"
        );
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Format giá tiền VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Format ngày giờ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Lấy màu dựa trên trạng thái đơn hàng
  const getStatusColor = (status) => {
    switch (status) {
      case "Đã giao hàng":
        return "green";
      case "Đang giao hàng":
        return "blue";
      case "Đã hủy":
        return "red";
      case "Chờ xử lý":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <div className="order-history-container">
      <h1>Lịch sử đơn hàng</h1>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <p>Bạn chưa có đơn hàng nào.</p>
          <Link to="/AllLinhKien" className="shop-now-btn">
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-item" key={order.ma_don_hang}>
              <div
                className="order-header"
                onClick={() => toggleOrderDetails(order.ma_don_hang)}
              >
                <div className="order-basic-info">
                  <div className="order-id">Đơn hàng #{order.ma_don_hang}</div>
                  <div className="order-date">{formatDate(order.ngay_dat)}</div>
                </div>

                <div className="order-summary">
                  <div className="order-total-price">
                    {formatPrice(order.tong_tien)}
                  </div>
                  <div
                    className="order-status"
                    style={{ color: getStatusColor(order.trang_thai) }}
                  >
                    {order.trang_thai}
                  </div>
                  <div className="toggle-icon">
                    {expandedOrder === order.ma_don_hang ? "▲" : "▼"}
                  </div>
                </div>
              </div>

              {expandedOrder === order.ma_don_hang && (
                <div className="order-details">
                  <div className="order-sections">
                    <div className="order-section">
                      <h3>Thông tin giao hàng</h3>
                      <p>
                        <strong>Người nhận:</strong> {order.nguoi_nhan}
                      </p>
                      <p>
                        <strong>Số điện thoại:</strong> {order.sdt_nhan}
                      </p>
                      {order.dia_chi !== "Lấy tại cửa hàng" && (
                        <p>
                          <strong>Địa chỉ:</strong> {order.dia_chi},{" "}
                          {order.phuong_xa}, {order.quan_huyen},{" "}
                          {order.tinh_thanh}
                        </p>
                      )}
                    </div>

                    <div className="order-section">
                      <h3>Thông tin thanh toán</h3>
                      <p>
                        <strong>Phương thức:</strong>{" "}
                        {order.phuong_thuc_thanh_toan === "cod"
                          ? "Thanh toán khi nhận hàng"
                          : order.phuong_thuc_thanh_toan}
                      </p>
                      <p>
                        <strong>Phương thức vận chuyển:</strong>{" "}
                        {order.dia_chi === "Lấy tại cửa hàng"
                          ? "Lấy tại cửa hàng"
                          : "Giao hàng tận tay"}
                      </p>
                      <p>
                        <strong>Trạng thái:</strong>{" "}
                        {order.trang_thai_thanh_toan}
                      </p>
                      <p>
                        <strong>Tổng tiền:</strong>{" "}
                        {formatPrice(order.tong_tien)}
                      </p>
                    </div>
                  </div>

                  {order.ghi_chu && (
                    <div className="order-note">
                      <h3>Ghi chú</h3>
                      <p>{order.ghi_chu}</p>
                    </div>
                  )}

                  <div className="product-list">
                    <h3>Sản phẩm</h3>
                    <table className="product-table">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Số lượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(order.san_pham) &&
                          order.san_pham.length > 0 ? (
                          order.san_pham.map((product, index) => (
                            <tr key={index}>
                              <td>{product.ten_sp}</td>
                              <td>{product.so_luong}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2">
                              Không có sản phẩm nào trong đơn hàng này.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="order-actions">
                    {/* Đã bỏ nút Xem chi tiết */}
                    {order.trang_thai === "Chờ xử lý" && order.trang_thai_thanh_toan !== "Đã thanh toán" && (
                      <button className="cancel-order-btn" onClick={() => handleCancelOrder(order.ma_don_hang)} disabled={loading}>
                        Hủy đơn hàng
                      </button>
                    )}
                    {order.trang_thai === "Đã giao hàng" && (
                      <Link
                        to={`/review-products/${order.ma_don_hang}`}
                        className="review-btn"
                      >
                        Đánh giá sản phẩm
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
