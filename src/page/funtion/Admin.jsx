import React, { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  // States for different data types
  const [view, setView] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [totalPayment, setTotalPayment] = useState([]);

  // States for selected items and related data
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replies, setReplies] = useState([]);

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
        setOrderItems(res.data);
        setSelectedOrder(id);
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

  // Delete order
  const deleteOrder = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      axios
        .get(`http://localhost/backend/api.php?action=delete_order&id=${id}`)
        .then(() => {
          setOrders(orders.filter((o) => o.id !== id));
          if (selectedOrder === id) {
            setSelectedOrder(null);
            setOrderItems([]);
          }
        })
        .catch((err) => console.error("Error deleting order:", err));
    }
  };

  // Delete user
  const deleteUser = (phone) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      axios
        .get(
          `http://localhost/backend/api.php?action=delete_user&phone=${phone}`
        )
        .then(() => {
          setUsers(users.filter((u) => u.phone !== phone));
        })
        .catch((err) => console.error("Error deleting user:", err));
    }
  };

  // Delete review
  const deleteReview = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      axios
        .get(`http://localhost/backend/api.php?action=delete_review&id=${id}`)
        .then(() => {
          setReviews(reviews.filter((r) => r.id !== id));
        })
        .catch((err) => console.error("Error deleting review:", err));
    }
  };

  // Delete payment
  const deletePayment = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thanh toán này?")) {
      axios
        .get(`http://localhost/backend/api.php?action=delete_payment&id=${id}`)
        .then(() => {
          setPayments(payments.filter((p) => p.id !== id));
        })
        .catch((err) => console.error("Error deleting payment:", err));
    }
  };

  // Delete promotion
  const deletePromotion = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      axios
        .get(
          `http://localhost/backend/api.php?action=delete_promotion&id=${id}`
        )
        .then(() => {
          setPromotions(promotions.filter((p) => p.id !== id));
        })
        .catch((err) => console.error("Error deleting promotion:", err));
    }
  };

  // Render different views based on the selected menu item
  const renderContent = () => {
    switch (view) {
      case "orders":
        return (
          <div>
            <h2>Danh sách Đơn hàng</h2>
            <table
              border="1"
              cellPadding="8"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
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
                      <td>{order.trang_thai}</td>
                      <td>{order.ngay_dat}</td>
                      <td>{order.ghi_chu || "Không có"}</td>
                      <td>
                        <button onClick={() => viewDetails(order.id)}>
                          Chi tiết
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          style={{ color: "red", marginLeft: 10 }}
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
                {orderItems.length === 0 ? (
                  <p>Không có sản phẩm nào.</p>
                ) : (
                  <table
                    border="1"
                    cellPadding="8"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
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
            <table
              border="1"
              cellPadding="8"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
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
                        onClick={() => deleteUser(user.phone)}
                        style={{ color: "red" }}
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
            <table
              border="1"
              cellPadding="8"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
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
                          onClick={() => deleteReview(review.id)}
                          style={{ color: "red", marginLeft: 10 }}
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
                  <table
                    border="1"
                    cellPadding="8"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
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
            <table
              border="1"
              cellPadding="8"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
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
                          onClick={() => deletePayment(payment.id)}
                          style={{ color: "red" }}
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
              style={{
                marginBottom: "20px",
                padding: "8px 15px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() =>
                alert("Chức năng thêm khuyến mãi sẽ được phát triển sau")
              }
            >
              Thêm khuyến mãi mới
            </button>
            <table
              border="1"
              cellPadding="8"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
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
                          onClick={() => deletePromotion(promo.id)}
                          style={{ color: "red" }}
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

      case "total_payment":
        return (
          <div>
            <h2>Tổng số tiền đã thanh toán</h2>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: "20px",
                padding: "20px",
                background: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              Tổng tiền:{" "}
              {totalPayment && totalPayment.tong
                ? Number(totalPayment.tong).toLocaleString("vi-VN") + " đ"
                : "Chưa có dữ liệu"}
            </div>
          </div>
        );

      default:
        return <div>Chọn một mục từ menu để quản lý</div>;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản trị Hệ thống Bán Linh kiện</h1>

      {/* Navigation Menu */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          gap: "10px",
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
        }}
      >
        <button
          onClick={() => setView("orders")}
          style={{
            padding: "10px 15px",
            backgroundColor: view === "orders" ? "#007bff" : "#e9e9e9",
            color: view === "orders" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Đơn hàng
        </button>
        <button
          onClick={() => setView("users")}
          style={{
            padding: "10px 15px",
            backgroundColor: view === "users" ? "#007bff" : "#e9e9e9",
            color: view === "users" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Tài khoản
        </button>
        <button
          onClick={() => setView("reviews")}
          style={{
            padding: "10px 15px",
            backgroundColor: view === "reviews" ? "#007bff" : "#e9e9e9",
            color: view === "reviews" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Đánh giá
        </button>
        <button
          onClick={() => setView("payments")}
          style={{
            padding: "10px 15px",
            backgroundColor: view === "payments" ? "#007bff" : "#e9e9e9",
            color: view === "payments" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Thanh toán
        </button>
        <button
          onClick={() => setView("promotions")}
          style={{
            padding: "10px 15px",
            backgroundColor: view === "promotions" ? "#007bff" : "#e9e9e9",
            color: view === "promotions" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Khuyến mãi
        </button>
        <button
          onClick={() => setView("total_payment")}
          style={{
            padding: "10px 15px",
            backgroundColor: view === "total_payment" ? "#007bff" : "#e9e9e9",
            color: view === "total_payment" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Thống kê
        </button>
      </div>

      {/* Content Area */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}

export default Admin;
