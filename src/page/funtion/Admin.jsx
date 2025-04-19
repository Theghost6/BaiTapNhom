import React, { useEffect, useState } from "react";
import axios from "axios";
import  DiaDiem from "../funtion/Dia_Diem";

function Admin() {
  // States for different data types
  const [view, setView] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [total_payment, setTotalPayment] = useState([]);

  // States for selected items and related data
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Fetch data based on current view
  useEffect(() => {
    switch (view) {
      case "bookings":
        axios
          .get("http://localhost/backend/api.php?action=get_bookings")
          .then((res) => setBookings(res.data))
          .catch((err) => console.error("Error fetching bookings:", err));
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
      case "hotels":
        axios
          .get("http://localhost/backend/api.php?action=get_hotels")
          .then((res) => setHotels(res.data))
          .catch((err) => console.error("Error fetching hotels:", err));
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

  // View booking details
  const viewDetails = (id) => {
    axios
      .get(
        `http://localhost/backend/api.php?action=get_booking_detail&id=${id}`,
      )
      .then((res) => {
        setCartItems(res.data);
        setSelectedBooking(id);
      })
      .catch((err) => console.error("Error fetching booking details:", err));
  };

  // Delete booking
  const deleteBooking = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa booking này?")) {
      axios
        .get(`http://localhost/backend/api.php?action=delete_booking&id=${id}`)
        .then(() => {
          setBookings(bookings.filter((b) => b.id !== id));
          if (selectedBooking === id) {
            setSelectedBooking(null);
            setCartItems([]);
          }
        })
        .catch((err) => console.error("Error deleting booking:", err));
    }
  };

  // Delete user
  const deleteUser = (phone) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      axios
        .get(
          `http://localhost/backend/api.php?action=delete_user&phone=${phone}`,
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

  // Delete hotel
  const deleteHotel = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách sạn này?")) {
      axios
        .get(`http://localhost/backend/api.php?action=delete_hotel&id=${id}`)
        .then(() => {
          setHotels(hotels.filter((h) => h.id !== id));
        })
        .catch((err) => console.error("Error deleting hotel:", err));
    }
  };

  // Render different views based on the selected menu item
  const renderContent = () => {
    switch (view) {
      case "bookings":
        return (
          <div>
            <h2>Danh sách Booking</h2>
            <table
              border="1"
              cellPadding="8"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Ngày</th>
                  <th>Số người</th>
                  <th>Thông Tin Địa Điểm</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      Không có booking nào
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.ten}</td>
                      <td>{b.email}</td>
                      <td>{b.sdt}</td>
                      <td>
                        {b.ngay_vao} → {b.ngay_ra}
                      </td>
                      <td>{b.so_nguoi}</td>
                      <td>
                        <button onClick={() => viewDetails(b.id)}>
                          Chi tiết
                        </button>
                        <button
                          onClick={() => deleteBooking(b.id)}
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

            {selectedBooking && (
              <div style={{ marginTop: 40 }}>
                <h2>Chi tiết Tour cho Booking ID: {selectedBooking}</h2>
                {cartItems.length === 0 ? (
                  <p>Không có tour nào.</p>
                ) : (
                  <table
                    border="1"
                    cellPadding="8"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr>
                        <th>Tên Tour</th>
                        <th>Địa điểm</th>
                        <th>Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.ten}</td>
                          <td>{item.dia_diem}</td>
                          <td>{Number(item.gia).toLocaleString("vi-VN")} đ</td>
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
                  <th>Tour ID</th>
                  <th>Người đánh giá</th>
                  <th>Đánh giá</th>
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
                  reviews.map((review) => {
                      
                    const diaDiem = DiaDiem.find((item) => item.id === Number( review.id_tour ));
                    return (
                      <tr key={review.id}>
                        <td>{review.id}</td>
                        <td>{diaDiem ? diaDiem.name : "Không rõ"}</td>
                        <td>{review.ten_nguoi_dung}</td>
                        <td>{review.danh_gia} ★</td>
                        <td>{review.binh_luan}</td>
                        <td>{review.ngay}</td>
                        <td>
                          <button
                            onClick={() => deleteReview(review.id)}
                            style={{ color: "red" }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}{" "}
              </tbody>
            </table>
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
                  <th>Booking ID</th>
                  <th>Phương thức thanh toán</th>
                  <th>Tổng tiền</th>
                  <th>Số lượng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      Không có thanh toán nào
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>{payment.booking_id}</td>
                      <td>{payment.pp_thanh_toan}</td>
                      <td>
                        {Number(payment.tong_sotien).toLocaleString("vi-VN")} đ
                      </td>
                      <td>{payment.tong_solg}</td>
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

      case "hotels":
        return (
          <div>
            <h2>Quản lý Khách sạn</h2>
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
                alert("Chức năng thêm khách sạn sẽ được phát triển sau")
              }
            >
              Thêm khách sạn mới
            </button>
            <table
              border="1"
              cellPadding="8"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên khách sạn</th>
                  <th>Địa chỉ</th>
                  <th>Số sao</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {hotels.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      Không có khách sạn nào
                    </td>
                  </tr>
                ) : (
                  hotels.map((hotel) => (
                    <tr key={hotel.id}>
                      <td>{hotel.id}</td>
                      <td>{hotel.ten_khach_san}</td>
                      <td>{hotel.dia_chi}</td>
                      <td>{hotel.so_sao} ★</td>
                      <td>
                        <button style={{ marginRight: "10px" }}>Sửa</button>
                        <button
                          onClick={() => deleteHotel(hotel.id)}
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
              {total_payment && total_payment.tong
                ? Number(total_payment.tong).toLocaleString("vi-VN") + " đ"
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
      <h1>Quản trị Hệ thống Du lịch</h1>

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
          onClick={() => setView("bookings")}
          style={{
            padding: "10px 15px",
            backgroundColor: view === "bookings" ? "#007bff" : "#e9e9e9",
            color: view === "bookings" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Bookings
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
          Reviews
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
          onClick={() => setView("hotels")}
          style={{
            padding: "10px 15px",
            backgroundColor: view === "hotels" ? "#007bff" : "#e9e9e9",
            color: view === "hotels" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Khách sạn
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
          Thống Kê
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
