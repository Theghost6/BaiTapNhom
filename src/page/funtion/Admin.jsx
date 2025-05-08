import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../style/Admin.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

// Đăng ký các component vào ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DeleteModal({ isOpen, onCancel, onConfirm, itemId, itemType }) {
  if (!isOpen) return null;
  return (
    <div className={`modal-overlay ${isOpen ? "modal-open" : "modal-close"}`}>
      <div className="modal-content">
        <div className="modal-icon">
          <i className="fas fa-trash-alt"></i>
        </div>
        <h2>Xác nhận xóa {itemType}</h2>
        <p>
          Bạn có chắc chắn muốn xóa {itemType} ID: {itemId}? Hành động này không
          thể hoàn tác.
        </p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            <i className="fas fa-times"></i> Hủy
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            <i className="fas fa-check"></i> Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

function Admin() {
  // States for different data types
  const [view, setView] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [totalPayment, setTotalPayment] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replies, setReplies] = useState([]);
  const [orderAddress, setOrderAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);

  //trạng thái đơn hàng
const updateOrderStatus = (id, status) => {
  console.log(`Updating order ${id} to status ${status}`);
  axios
    .get(`http://localhost/backend/api.php?action=update_order_status&id=${id}&status=${status}`)
    .then(() => {
      console.log("Update successful");
      setOrders(orders.map((o) => (o.id === id ? { ...o, trang_thai: status } : o)));
      if (view === "total_payment") {
        axios
          .get(
            `http://localhost/backend/api.php?action=get_statistics&month=${selectedMonth}&year=${selectedYear}`
          )
          .then((res) => {
            console.log("Statistics updated:", res.data);
            setStatistics(res.data);
          })
          .catch((err) => console.error("Error fetching statistics:", err));
      }
    })
    .catch((err) => console.error("Error updating order status:", err));
};
  // State for delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemType: "",
    onConfirm: () => {},
  });
  // State mới cho thống kê
  const [statistics, setStatistics] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Tháng hiện tại
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Năm hiện tại
  // Fetch data based on current view
  useEffect(() => {
    switch (view) {
      case "orders":
        axios
          .get("http://localhost/backend/api.php?action=get_orders")
          .then((res) => setOrders(res.data))
          .catch((err) => console.error("Error fetching orders:", err));
        break;
      case "users":
        axios
          .get("http://localhost/backend/api.php?action=get_users")
          .then((res) => setUsers(res.data))
          .catch((err) => console.error("Error fetching users:", err));
        break;
      case "reviews":
        axios
          .get("http://localhost/backend/api.php?action=get_reviews")
          .then((res) => setReviews(res.data))
          .catch((err) => console.error("Error fetching reviews:", err));
        break;
      case "payments":
        axios
          .get("http://localhost/backend/api.php?action=get_payments")
          .then((res) => setPayments(res.data))
          .catch((err) => console.error("Error fetching payments:", err));
        break;
      case "promotions":
        axios
          .get("http://localhost/backend/api.php?action=get_promotions")
          .then((res) => setPromotions(res.data))
          .catch((err) => console.error("Error fetching promotions:", err));
        break;
      case "total_payment":
        axios
          .get("http://localhost/backend/api.php?action=get_total_payment")
          .then((res) => setTotalPayment(res.data))
          .catch((err) => console.error("Error fetching total:", err));
        // Fetch thống kê nâng cao
        axios
          .get(
            `http://localhost/backend/api.php?action=get_statistics&month=${selectedMonth}&year=${selectedYear}`
          )
          .then((res) => {
            console.log("data static", res.data);
            setStatistics(res.data);
          })
          .catch((err) => console.error("Error fetching statistics:", err));
        break;
      case "inventory":
        axios
          .get("http://localhost/backend/api.php?action=get_inventory")
          .then((res) => {
            // Kiểm tra và đảm bảo dữ liệu là mảng
            if (Array.isArray(res.data)) {
              setInventory(res.data);
            } else {
              console.error("Dữ liệu tồn kho không hợp lệ:", res.data);
              setInventory([]);
            }
          })
          .catch((err) => {
            console.error("Error fetching inventory:", err);
            setInventory([]);
          });
        break;
      default:
        break;
    }
  }, [view]);

  // View order details
  const viewDetails = (id) => {
    axios
      .get(`http://localhost/backend/api.php?action=get_order_detail&id=${id}`)
      .then((res) => {
        setOrderItems(res.data.items);
        setOrderAddress(res.data.address);
        setSelectedOrder(id);
        setShowAddress(false); // Ẩn địa chỉ mặc định khi xem chi tiết đơn hàng mới
      })
      .catch((err) => console.error("Error fetching order details:", err));
  };

  // View review replies
  const viewReply = (id) => {
    axios
      .get(
        `http://localhost/backend/api.php?action=get_review_replies&id=${id}`
      )
      .then((res) => {
        setReplies(res.data);
        setSelectedReview(id);
      })
      .catch((err) => console.error("Error fetching replies:", err));
  };

  // Handle delete actions
  const handleDelete = (itemId, itemType, onConfirm) => {
    setDeleteModal({
      isOpen: true,
      itemId,
      itemType,
      onConfirm,
    });
  };

  const cancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      itemId: null,
      itemType: "",
      onConfirm: () => {},
    });
  };

  // Delete order
  const deleteOrder = (id) => {
    axios
      .get(`http://localhost/backend/api.php?action=delete_order&id=${id}`)
      .then(() => {
        setOrders(orders.filter((o) => o.id !== id));
        if (selectedOrder === id) {
          setSelectedOrder(null);
          setOrderItems([]);
        }
        cancelDelete();
      })
      .catch((err) => console.error("Error deleting order:", err));
  };

  // Delete user
  const deleteUser = (phone) => {
    axios
      .get(`http://localhost/backend/api.php?action=delete_user&phone=${phone}`)
      .then(() => {
        setUsers(users.filter((u) => u.phone !== phone));
        cancelDelete();
      })
      .catch((err) => console.error("Error deleting user:", err));
  };

  // Delete review
  const deleteReview = (id) => {
    axios
      .get(`http://localhost/backend/api.php?action=delete_review&id=${id}`)
      .then(() => {
        setReviews(reviews.filter((r) => r.id !== id));
        if (selectedReview === id) {
          setSelectedReview(null);
          setReplies([]);
        }
        cancelDelete();
      })
      .catch((err) => console.error("Error deleting review:", err));
  };

  // Delete payment
  const deletePayment = (id) => {
    axios
      .get(`http://localhost/backend/api.php?action=delete_payment&id=${id}`)
      .then(() => {
        setPayments(payments.filter((p) => p.id !== id));
        cancelDelete();
      })
      .catch((err) => console.error("Error deleting payment:", err));
  };

  // Delete promotion
  const deletePromotion = (id) => {
    axios
      .get(`http://localhost/backend/api.php?action=delete_promotion&id=${id}`)
      .then(() => {
        setPromotions(promotions.filter((p) => p.id !== id));
        cancelDelete();
      })
      .catch((err) => console.error("Error deleting promotion:", err));
  };
  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: (statistics?.doanh_thu_theo_ngay || []).map(
      (item) => `Ngày ${item.ngay}`
    ),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: (statistics?.doanh_thu_theo_ngay || []).map(
          (item) => item.doanh_thu
        ),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Doanh thu theo ngày - Tháng ${selectedMonth}/${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Doanh thu (VNĐ)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
      },
    },
  };

  // Thêm hàm cập nhật số lượng tồn kho
  const updateInventoryQuantity = (id_san_pham, quantity) => {
    console.log("Updating inventory:", { id_san_pham, quantity }); // Log dữ liệu gửi đi
    const url = `http://localhost/backend/api.php?action=update_inventory&id=${id_san_pham}&quantity=${quantity}`;
    console.log("Request URL:", url); // Log URL request

    axios
      .get(url)
      .then((res) => {
        console.log("Response:", res.data); // Log response
        if (res.data.success) {
          setInventory(inventory.map((item) => 
            item.id_san_pham === id_san_pham ? { ...item, solg_trong_kho: quantity } : item
          ));
        } else {
          alert("Không thể cập nhật số lượng: " + (res.data.error || "Lỗi không xác định"));
        }
      })
      .catch((err) => {
        console.error("Error updating inventory:", err);
        alert("Có lỗi xảy ra khi cập nhật số lượng: " + err.message);
      });
  };

  // Render different views based on the selected menu item
  const renderContent = () => {
    switch (view) {
      case "orders":
        return (
          <div>
            <h2>Danh sách Đơn hàng</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mã người dùng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                  <th>Ghi chú</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      Không có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.ma_nguoi_dung}</td>
                      <td>
                        {Number(order.tong_tien).toLocaleString("vi-VN")} đ
                      </td>
                      <td>
                        <select
                          value={order.trang_thai}
                          onChange={(e) => {
                            console.log("Selected status:", e.target.value);
                            updateOrderStatus(Number(order.id), e.target.value);
                          }}
                        >
                          <option value="Chưa thanh toán">Chưa thanh toán</option>
                          <option value="Đã thanh toán">Đã thanh toán</option>
                          <option value="Đang giao">Đang giao</option>
                          <option value="Hoàn thành">Hoàn thành</option>
                          <option value="Đã hủy">Đã hủy</option>
                        </select>
                      </td>
                      <td>{order.ngay_dat}</td>
                      <td>{order.ghi_chu || "Không có"}</td>
                      <td>
                        <button onClick={() => viewDetails(order.id)}>
                          Chi tiết
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(order.id, "đơn hàng", () =>
                              deleteOrder(order.id)
                            )
                          }
                          className="button-red"
                          style={{ marginLeft: 10 }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {selectedOrder && (
              <div style={{ marginTop: 40 }}>
                <h2>Chi tiết Đơn hàng ID: {selectedOrder}</h2>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 15,
                  }}
                >
                  <div>
                    <button
                      onClick={() => setShowAddress(!showAddress)}
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        padding: "8px 15px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      {showAddress ? "Ẩn địa chỉ" : "Xem địa chỉ"}
                    </button>
                  </div>
                </div>

                {showAddress && orderAddress && (
                  <div
                    style={{
                      backgroundColor: "#f9f9f9",
                      padding: "15px",
                      borderRadius: "5px",
                      marginBottom: "20px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <h3 style={{ marginTop: 0 }}>Địa chỉ giao hàng</h3>
                    <p>
                      <strong>Người nhận:</strong> {orderAddress.nguoi_nhan}
                    </p>
                    <p>
                      <strong>Điện thoại:</strong> {orderAddress.sdt_nhan}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {orderAddress.dia_chi}
                    </p>
                    <p>
                      <strong>Ghi chú:</strong>{" "}
                      {orderAddress.ghi_chu || "Không có"}
                    </p>
                  </div>
                )}

                {orderItems.length === 0 ? (
                  <p>Không có sản phẩm nào.</p>
                ) : (
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
                      {orderItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.ten_san_pham}</td>
                          <td>{item.danh_muc}</td>
                          <td>{item.so_luong}</td>
                          <td>{Number(item.gia).toLocaleString("vi-VN")} đ</td>
                          <td>
                            {Number(item.gia * item.so_luong).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        );

      case "users":
        return (
          <div>
            <h2>Quản lý Tài khoản</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Tên đăng nhập</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.user}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        onClick={() =>
                          handleDelete(user.phone, "tài khoản", () =>
                            deleteUser(user.phone)
                          )
                        }
                        className="button-red"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "reviews":
        return (
          <div>
            <h2>Quản lý Đánh giá</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mã sản phẩm</th>
                  <th>Người đánh giá</th>
                  <th>Số sao</th>
                  <th>Bình luận</th>
                  <th>Ngày</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      Không có đánh giá nào
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id}>
                      <td>{review.id}</td>
                      <td>{review.id_product}</td>
                      <td>{review.ten_nguoi_dung}</td>
                      <td>{review.so_sao} ★</td>
                      <td>{review.binh_luan}</td>
                      <td>{review.ngay}</td>
                      <td>
                        <button onClick={() => viewReply(review.id)}>
                          Xem phản hồi
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(review.id, "đánh giá", () =>
                              deleteReview(review.id)
                            )
                          }
                          className="button-red"
                          style={{ marginLeft: 10 }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {selectedReview && (
              <div style={{ marginTop: 40 }}>
                <h2>Phản hồi Đánh giá ID: {selectedReview}</h2>
                {replies.length === 0 ? (
                  <p>Không có phản hồi nào.</p>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Người phản hồi</th>
                        <th>Nội dung</th>
                        <th>Ngày</th>
                      </tr>
                    </thead>
                    <tbody>
                      {replies.map((reply, index) => (
                        <tr key={index}>
                          <td>{reply.ten_nguoi_tra_loi}</td>
                          <td>{reply.noi_dung_phan_hoi}</td>
                          <td>{reply.ngay}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        );

      case "payments":
        return (
          <div>
            <h2>Quản lý Thanh toán</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mã đơn hàng</th>
                  <th>Phương thức thanh toán</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thời gian thanh toán</th>
                  <th>Mã giao dịch</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      Không có thanh toán nào
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>{payment.ma_don_hang}</td>
                      <td>{payment.phuong_thuc_thanh_toan}</td>
                      <td>
                        {Number(payment.tong_so_tien).toLocaleString("vi-VN")} đ
                      </td>
                      <td>{payment.trang_thai_thanh_toan}</td>
                      <td>
                        {payment.thoi_gian_thanh_toan || "Chưa thanh toán"}
                      </td>
                      <td>{payment.ma_giao_dich || "N/A"}</td>
                      <td>
                        <button
                          onClick={() =>
                            handleDelete(payment.id, "thanh toán", () =>
                              deletePayment(payment.id)
                            )
                          }
                          className="button-red"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );

      case "promotions":
        return (
          <div>
            <h2>Quản lý Khuyến mãi</h2>
            <button
              className="button-green"
              onClick={() =>
                alert("Chức năng thêm khuyến mãi sẽ được phát triển sau")
              }
            >
              Thêm khuyến mãi mới
            </button>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên khuyến mãi</th>
                  <th>Mô tả</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Mã sản phẩm</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      Không có khuyến mãi nào
                    </td>
                  </tr>
                ) : (
                  promotions.map((promo) => (
                    <tr key={promo.id}>
                      <td>{promo.id}</td>
                      <td>{promo.ten_khuyen_mai}</td>
                      <td>{promo.mo_ta}</td>
                      <td>{promo.ngay_bat_dau}</td>
                      <td>{promo.ngay_ket_thuc}</td>
                      <td>{promo.id_product || "N/A"}</td>
                      <td>
                        <button style={{ marginRight: "10px" }}>Sửa</button>
                        <button
                          onClick={() =>
                            handleDelete(promo.id, "khuyến mãi", () =>
                              deletePromotion(promo.id)
                            )
                          }
                          className="button-red"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
      case "inventory":
        return (
          <div>
            <h2>Quản lý Tồn kho</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>ID Sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng trong kho</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(inventory) || inventory.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      Không có dữ liệu tồn kho
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => (
                    <tr key={item.id_san_pham}>
                      <td>{item.id_san_pham}</td>
                      <td>{item.ten_san_pham}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={item.solg_trong_kho || 0}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            if (!isNaN(newQuantity) && newQuantity >= 0) {
                              updateInventoryQuantity(item.id_san_pham, newQuantity);
                            }
                          }}
                          style={{ width: "80px" }}
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            const newQuantity = parseInt(prompt("Nhập số lượng mới:", item.solg_trong_kho || 0));
                            if (!isNaN(newQuantity) && newQuantity >= 0) {
                              updateInventoryQuantity(item.id_san_pham, newQuantity);
                            } else {
                              alert("Vui lòng nhập số lượng hợp lệ");
                            }
                          }}
                        >
                          Cập nhật
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
      case "total_payment":
        return (
          <div>
            <h2>Thống kê Doanh thu</h2>

            {/* Bộ chọn tháng và năm */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "15px" }}>
              <div>
                <label>Chọn tháng: </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  style={{ padding: "5px", marginLeft: "5px" }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Chọn năm: </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  style={{ padding: "5px", marginLeft: "5px" }}
                >
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hiển thị thống kê */}
            {statistics ? (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "30px",
                  }}
                >
                  <div
                    style={{
                      padding: "20px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <h3>Tổng doanh thu</h3>
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                      {Number(statistics.tong_doanh_thu || 0).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      đ{console.log("Tong danh thu", statistics.tong_doanh_thu)}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "20px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <h3>Tổng đơn hàng</h3>
                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                      {statistics.tong_don_hang || 0}
                    </p>
                  </div>
                </div>

                {/* Sản phẩm bán chạy */}
                <h3>Sản phẩm bán chạy nhất</h3>
                {(statistics?.san_pham_ban_chay || []).length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng bán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statistics.san_pham_ban_chay.map((product, index) => (
                        <tr key={index}>
                          <td>{product.ten_san_pham}</td>
                          <td>{product.tong_so_luong}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Không có dữ liệu sản phẩm bán chạy.</p>
                )}

                {/* Biểu đồ doanh thu theo ngày */}
                <h3>Doanh thu theo ngày</h3>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                  {/* <Line data={chartData} options={chartOptions} /> */}
                  <Line
                    key={`${selectedMonth}-${selectedYear}`}
                    data={chartData}
                    options={chartOptions}
                  />
                </div>
              </div>
            ) : (
              <p>Đang tải dữ liệu thống kê...</p>
            )}
          </div>
        );

      default:
        return <div>Chọn một mục từ menu để quản lý</div>;
    }
  };

  return (
    <div className="admin-container">
      <h1>Quản trị Hệ thống Bán Linh kiện</h1>

      {/* Navigation Menu (giữ nguyên) */}
      <div className="nav-menu">
        <button
          onClick={() => setView("orders")}
          className={`nav-button ${view === "orders" ? "active" : ""}`}
        >
          Đơn hàng
        </button>
        <button
          onClick={() => setView("users")}
          className={`nav-button ${view === "users" ? "active" : ""}`}
        >
          Tài khoản
        </button>
        <button
          onClick={() => setView("reviews")}
          className={`nav-button ${view === "reviews" ? "active" : ""}`}
        >
          Đánh giá
        </button>
        <button
          onClick={() => setView("payments")}
          className={`nav-button ${view === "payments" ? "active" : ""}`}
        >
          Thanh toán
        </button>
        <button
          onClick={() => setView("promotions")}
          className={`nav-button ${view === "promotions" ? "active" : ""}`}
        >
          Khuyến mãi
        </button>
        <button
          onClick={() => setView("inventory")}
          className={`nav-button ${view === "inventory" ? "active" : ""}`}
        >
          Tồn kho
        </button>
        <button
          onClick={() => setView("total_payment")}
          className={`nav-button ${view === "total_payment" ? "active" : ""}`}
        >
          Thống kê
        </button>
      </div>

      {/* Content Area */}
      <div className="content-box">{renderContent()}</div>

      {/* Delete Confirmation Modal (giữ nguyên) */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onCancel={cancelDelete}
        onConfirm={deleteModal.onConfirm}
        itemId={deleteModal.itemId}
        itemType={deleteModal.itemType}
      />
    </div>
  );
}

export default Admin;
