import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // 🔸 Load tất cả bookings khi trang được mở
  useEffect(() => {
    axios.get("http://localhost/backend/api.php?action=get_bookings")
      .then(res => setBookings(res.data));
  }, []);

  // 🔸 Xem chi tiết booking + tour
  const viewDetails = (id) => {
    axios.get(`http://localhost/backend/api.php?action=get_booking_detail&id=${id}`)
      .then(res => {
        setCartItems(res.data);
        setSelectedBooking(id);
      });
  };

  // 🔸 Xóa booking và liên quan
  const deleteBooking = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa booking này?")) {
      axios.get(`http://localhost/backend/api.php?action=delete_booking&id=${id}`)
        .then(() => {
          setBookings(bookings.filter(b => b.id !== id));
          if (selectedBooking === id) {
            setSelectedBooking(null);
            setCartItems([]);
          }
        });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý Booking</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Tên</th><th>Email</th><th>SĐT</th><th>Ngày</th><th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.ten}</td>
              <td>{b.email}</td>
              <td>{b.sdt}</td>
              <td>{b.ngay_vao} → {b.ngay_ra}</td>
              <td>
                <button onClick={() => viewDetails(b.id)}>Chi tiết</button>
                <button onClick={() => deleteBooking(b.id)} style={{ color: "red", marginLeft: 10 }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedBooking && (
        <div style={{ marginTop: 40 }}>
          <h2>Chi tiết Tour cho Booking ID: {selectedBooking}</h2>
          {cartItems.length === 0 ? (
            <p>Không có tour nào.</p>
          ) : (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Tên Tour</th><th>Địa điểm</th><th>Giá</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.ten}</td>
                    <td>{item.dia_diem}</td>
                    <td>{item.gia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

