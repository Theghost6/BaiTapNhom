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
  Filler,
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
  Legend,
  Filler
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
  const [totalPayment, setTotalPayment] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replies, setReplies] = useState([]);
  const [orderAddress, setOrderAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [linhKien, setLinhKien] = useState({});
  const [editLinhKien, setEditLinhKien] = useState(null);
  const [newLinhKien, setNewLinhKien] = useState({
    loai: "cpu",
    ten: "",
    mo_ta: "",
    gia: "",
  });
  const [loaiLinhKienList, setLoaiLinhKienList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false); // New loading state

  // Lấy icon phù hợp với loại linh kiện
  const getCategoryIcon = (loai) => {
    const iconMap = {
      cpu: "microchip",
      mainboard: "server",
      ram: "memory",
      ssd: "hdd",
      psu: "plug",
      case: "desktop",
      gpu: "gamepad",
      keyboard: "keyboard",
      mouse: "mouse",
      monitor: "tv",
      default: "laptop-code",
    };

    return iconMap[loai] || iconMap.default;
  };

  // Lấy nhãn hiển thị cho từng trường
  const getFieldLabel = (key) => {
    const labelMap = {
      id: "Mã",
      ten: "Tên sản phẩm",
      mo_ta: "Mô tả",
      gia: "Giá bán",
      hang: "Hãng",
      socket: "Socket",
      core: "Lõi",
      xung: "Xung nhịp",
      tdp: "TDP",
      solg_trong_kho: "Tồn kho",
    };

    return (
      labelMap[key] ||
      key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")
    );
  };

  // Lấy placeholder cho từng trường
  const getFieldPlaceholder = (key) => {
    const placeholderMap = {
      id: "Tự động tạo",
      ten: "Nhập tên sản phẩm",
      mo_ta: "Nhập mô tả chi tiết",
      gia: "Nhập giá bán",
      hang: "Nhập tên hãng sản xuất",
      socket: "Ví dụ: LGA1700",
      core: "Ví dụ: 8 cores 16 threads",
      xung: "Ví dụ: 3.6 GHz",
      tdp: "Ví dụ: 65W",
      solg_trong_kho: "Nhập số lượng",
    };

    return placeholderMap[key] || `Nhập ${key}`;
  };

  // Lấy kiểu input phù hợp
  const getInputType = (key) => {
    if (key === "gia" || key === "solg_trong_kho" || key.includes("nam"))
      return "number";
    if (key.includes("ngay")) return "date";
    return "text";
  };

  // Format giá tiền
  const formatPrice = (price) => {
    if (!price) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Lấy danh sách trường từ mẫu
  const getSampleKeys = (linhKien, loai) => {
    if (Array.isArray(linhKien[loai]) && linhKien[loai][0]) {
      return Object.keys(linhKien[loai][0]).filter(
        (k) => k !== "rating" && k !== "reviewCount" && k !== "id"
      );
    }
    return ["ten", "mo_ta", "gia", "hang", "solg_trong_kho"];
  };

  // Thêm state cho hộp thoại xác nhận xóa
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    id: null,
    loai: null,
  });

  // Hiển thị hộp thoại xác nhận trước khi xóa
  const handleDeleteConfirm = (id, loai) => {
    setDeleteConfirmation({
      show: true,
      id,
      loai,
    });
  };

  // Tạo ref cho từng bảng loại linh kiện
  const loaiRefs = React.useRef({});
  React.useEffect(() => {
    loaiLinhKienList.forEach((loai) => {
      if (!loaiRefs.current[loai]) {
        loaiRefs.current[loai] = React.createRef();
      }
    });
  }, [loaiLinhKienList]);

  // Thêm state để lưu loại linh kiện đang được chọn để hiển thị bảng
  const [selectedLoaiTable, setSelectedLoaiTable] = useState("");

  // Khi danh sách loại thay đổi, nếu chưa chọn loại nào thì mặc định chọn loại đầu tiên
  React.useEffect(() => {
    if (loaiLinhKienList.length > 0 && !selectedLoaiTable) {
      setSelectedLoaiTable(loaiLinhKienList[0]);
    }
  }, [loaiLinhKienList]);

  // Trạng thái đơn hàng
  const updateOrderStatus = (id, status) => {
    console.log(`Updating order ${id} to status ${status}`);
    axios
      .get(
        `http://localhost/BaiTapNhom/backend/api.php?action=update_order_status&id=${id}&status=${status}`
      )
      .then(() => {
        console.log("Update successful");
        setOrders(
          orders.map((o) => (o.id === id ? { ...o, trang_thai: status } : o))
        );
        if (view === "total_payment") {
          axios
            .get(
              `http://localhost/BaiTapNhom/backend/api.php?action=get_statistics&month=${selectedMonth}&year=${selectedYear}`
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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch data based on current view
  useEffect(() => {
    switch (view) {
      case "orders":
        axios
          .get("http://localhost/BaiTapNhom/backend/api.php?action=get_orders")
          .then((res) => {
            if (Array.isArray(res.data)) {
              setOrders(res.data);
            } else {
              console.error("API get_orders did not return an array:", res.data);
              setOrders([]);
            }
          })
          .catch((err) => {
            console.error("Error fetching orders:", err);
            setOrders([]);
          });
        break;
      case "users":
        setIsLoadingUsers(true);
        axios
          .get("http://localhost/BaiTapNhom/backend/api.php?action=get_users")
          .then((res) => {
            console.log("Users API response:", res.data);
            if (Array.isArray(res.data)) {
              const usersData = res.data.map((user) => ({
                ...user,
                is_active: Number(user.is_active), // Ensure is_active is a number
              }));
              setUsers(usersData);
            } else {
              console.error("API get_users did not return an array:", res.data);
              setUsers([]);
            }
          })
          .catch((err) => {
            console.error("Error fetching users:", err);
            setUsers([]);
          })
          .finally(() => setIsLoadingUsers(false));
        break;
      case "reviews":
        axios
          .get("http://localhost/BaiTapNhom/backend/api.php?action=get_reviews")
          .then((res) => {
            if (Array.isArray(res.data)) {
              setReviews(res.data);
            } else {
              console.error("API get_reviews did not return an array:", res.data);
              setReviews([]);
            }
          })
          .catch((err) => {
            console.error("Error fetching reviews:", err);
            setReviews([]);
          });
        break;
      case "payments":
        axios
          .get("http://localhost/BaiTapNhom/backend/api.php?action=get_payments")
          .then((res) => {
            if (Array.isArray(res.data)) {
              setPayments(res.data);
            } else {
              console.error(
                "API get_payments did not return an array:",
                res.data
              );
              setPayments([]);
            }
          })
          .catch((err) => {
            console.error("Error fetching payments:", err);
            setPayments([]);
          });
        break;
      case "total_payment":
        axios
          .get(
            "http://localhost/BaiTapNhom/backend/api.php?action=get_total_payment"
          )
          .then((res) => {
            if (Array.isArray(res.data)) {
              setTotalPayment(res.data);
            } else {
              console.error(
                "API get_total_payment did not return an array:",
                res.data
              );
              setTotalPayment([]);
            }
          })
          .catch((err) => {
            console.error("Error fetching total:", err);
            setTotalPayment([]);
          });
        axios
          .get(
            `http://localhost/BaiTapNhom/backend/api.php?action=get_statistics&month=${selectedMonth}&year=${selectedYear}`
          )
          .then((res) => {
            console.log("data static", res.data);
            setStatistics(res.data);
          })
          .catch((err) => console.error("Error fetching statistics:", err));
        break;
      case "linh_kien":
        axios
          .get(
            "http://localhost/BaiTapNhom/backend/manage_linh_kien.php?action=get_all"
          )
          .then((res) => {
            if (
              res.data &&
              typeof res.data === "object" &&
              !Array.isArray(res.data)
            ) {
              setLinhKien(res.data);
              setLoaiLinhKienList(Object.keys(res.data));
              if (!Object.keys(res.data).includes(newLinhKien.loai)) {
                setNewLinhKien((lk) => ({
                  ...lk,
                  loai: Object.keys(res.data)[0] || "",
                }));
              }
            } else {
              console.error(
                "API get_all linh_kien did not return an object:",
                res.data
              );
              setLinhKien({});
              setLoaiLinhKienList([]);
            }
          })
          .catch((err) => {
            console.error("Error fetching linh_kien:", err);
            setLinhKien({});
            setLoaiLinhKienList([]);
          });
        break;
      default:
        break;
    }
  }, [view, selectedMonth, selectedYear]);

  // View order details
  const viewDetails = (id) => {
    axios
      .get(
        `http://localhost/BaiTapNhom/backend/api.php?action=get_order_detail&id=${id}`
      )
      .then((res) => {
        setOrderItems(res.data.items || []);
        setOrderAddress(res.data.address || null);
        setSelectedOrder(id);
        setShowAddress(false);
      })
      .catch((err) => console.error("Error fetching order details:", err));
  };

  // View review replies
  const viewReply = (id) => {
    axios
      .get(
        `http://localhost/BaiTapNhom/backend/api.php?action=get_review_replies&id=${id}`
      )
      .then((res) => {
        if (Array.isArray(res.data)) {
          setReplies(res.data);
          setSelectedReview(id);
        } else {
          console.error(
            "API get_review_replies did not return an array:",
            res.data
          );
          setReplies([]);
          setSelectedReview(id);
        }
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
      .get(
        `http://localhost/BaiTapNhom/backend/api.php?action=delete_order&id=${id}`
      )
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
      .get(
        `http://localhost/BaiTapNhom/backend/api.php?action=delete_user&phone=${phone}`
      )
      .then(() => {
        setUsers(users.filter((u) => u.phone !== phone));
        cancelDelete();
      })
      .catch((err) => console.error("Error deleting user:", err));
  };

  // Delete review
  const deleteReview = (id) => {
    axios
      .get(
        `http://localhost/BaiTapNhom/backend/api.php?action=delete_review&id=${id}`
      )
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
      .get(
        `http://localhost/BaiTapNhom/backend/api.php?action=delete_payment&id=${id}`
      )
      .then(() => {
        setPayments(payments.filter((p) => p.id !== id));
        cancelDelete();
      })
      .catch((err) => console.error("Error deleting payment:", err));
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

  // Thêm các hàm CRUD cho linh kiện
  const handleAddLinhKien = () => {
    const item = { ...newLinhKien };
    delete item.loai;
    axios
      .post(
        `http://localhost/BaiTapNhom/backend/manage_linh_kien.php?action=add&loai=${newLinhKien.loai}`,
        new URLSearchParams({ item: JSON.stringify(item) })
      )
      .then((res) => {
        if (res.data.success) {
          setLinhKien((lk) => ({
            ...lk,
            [newLinhKien.loai]: [
              ...(lk[newLinhKien.loai] || []),
              res.data.item,
            ],
          }));
          setNewLinhKien((lk) => ({ ...lk, ten: "", mo_ta: "", gia: "" }));
        } else {
          alert("Thêm thất bại: " + (res.data.error || "Lỗi không xác định"));
        }
      })
      .catch((err) => console.error("Error adding linh_kien:", err));
  };

  const handleUpdateLinhKien = () => {
    const { loai, ...item } = editLinhKien;
    axios
      .post(
        `http://localhost/BaiTapNhom/backend/manage_linh_kien.php?action=update&loai=${loai}`,
        new URLSearchParams({
          id: item.id,
          item: JSON.stringify(item),
        })
      )
      .then((res) => {
        if (res.data.success) {
          setLinhKien((lk) => ({
            ...lk,
            [loai]: lk[loai].map((l) => (l.id === item.id ? { ...item } : l)),
          }));
          setEditLinhKien(null);
        } else {
          alert(
            "Cập nhật thất bại: " + (res.data.error || "Lỗi không xác định")
          );
        }
      })
      .catch((err) => console.error("Error updating linh_kien:", err));
  };

  const handleDeleteLinhKien = (id, loai) => {
    axios
      .post(
        `http://localhost/BaiTapNhom/backend/manage_linh_kien.php?action=delete&loai=${loai}`,
        new URLSearchParams({ id })
      )
      .then((res) => {
        if (res.data.success) {
          setLinhKien((lk) => ({
            ...lk,
            [loai]: lk[loai].filter((l) => l.id !== id),
          }));
        } else {
          alert("Xóa thất bại: " + (res.data.error || "Lỗi không xác định"));
        }
      })
      .catch((err) => console.error("Error deleting linh_kien:", err));
  };

  const toggleUserStatus = (phone, is_active) => {
    console.log(`Toggling status for phone: ${phone}, is_active: ${is_active}`);
    axios
      .get(
        `http://localhost/BaiTapNhom/backend/api.php?action=toggle_user_status&phone=${phone}&is_active=${
          is_active ? 0 : 1
        }`
      )
      .then((res) => {
        console.log("API response:", res.data);
        if (res.data.success) {
          // Làm mới danh sách người dùng từ API
          axios
            .get("http://localhost/BaiTapNhom/backend/api.php?action=get_users")
            .then((res) => {
              if (Array.isArray(res.data)) {
                const usersData = res.data.map((user) => ({
                  ...user,
                  is_active: Number(user.is_active),
                }));
                setUsers(usersData);
              } else {
                console.error(
                  "API get_users did not return an array:",
                  res.data
                );
                setUsers([]);
              }
            })
            .catch((err) => {
              console.error("Error fetching users:", err);
              setUsers([]);
            });
        } else {
          alert(
            "Không thể cập nhật trạng thái tài khoản: " +
              (res.data.error || "Lỗi không xác định")
          );
        }
      })
      .catch((err) => {
        console.error("Error toggling user status:", err);
        alert("Có lỗi xảy ra khi cập nhật trạng thái tài khoản");
      });
  };

  // Render different views based on the selected menu item
  const [searchKeyword, setSearchKeyword] = useState("");

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
                          <option value="Chưa thanh toán">
                            Chưa thanh toán
                          </option>
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
            {isLoadingUsers ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Đang tải danh sách tài khoản...</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Tên đăng nhập</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {!Array.isArray(users) || users.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        Không có tài khoản nào
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr key={user.phone}>
                        <td>{user.user}</td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          {user.is_active === 1 ? "Hoạt động" : "Vô hiệu hóa"}
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              toggleUserStatus(user.phone, user.is_active)
                            }
                            className={
                              user.is_active === 1
                                ? "button-yellow"
                                : "button-green"
                            }
                            style={{ marginRight: 10 }}
                          >
                            {user.is_active === 1 ? "Vô hiệu hóa" : "Kích hoạt"}
                          </button>
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
                    ))
                  )}
                </tbody>
              </table>
            )}
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

      case "total_payment":
        return (
          <div className="statistics-dashboard">
            <h2 className="dashboard-title">Thống kê Doanh Thu</h2>

            {/* Bộ chọn tháng và năm */}
            <div className="date-selector">
              <div className="date-picker">
                <label>Chọn tháng: </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="select-input"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="date-picker">
                <label>Chọn năm: </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="select-input"
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
              <div className="statistics-content">
                <div className="stats-cards">
                  <div className="stats-card revenue">
                    <div className="card-icon">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="card-content">
                      <h3>Tổng doanh thu</h3>
                      <p className="stats-value">
                        {Number(statistics.tong_doanh_thu || 0).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        đ
                      </p>
                    </div>
                  </div>

                  <div className="stats-card orders">
                    <div className="card-icon">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="card-content">
                      <h3>Tổng đơn hàng</h3>
                      <p className="stats-value">
                        {statistics.tong_don_hang || 0}
                      </p>
                    </div>
                  </div>

                  <div className="stats-card avg-order">
                    <div className="card-icon">
                      <i className="fas fa-receipt"></i>
                    </div>
                    <div className="card-content">
                      <h3>Giá trị trung bình/đơn</h3>
                      <p className="stats-value">
                        {statistics.tong_don_hang > 0
                          ? Number(
                              statistics.tong_doanh_thu /
                                statistics.tong_don_hang
                            ).toLocaleString("vi-VN")
                          : 0}{" "}
                        đ
                      </p>
                    </div>
                  </div>

                  <div className="stats-card daily-avg">
                    <div className="card-icon">
                      <i className="fas fa-calendar-day"></i>
                    </div>
                    <div className="card-content">
                      <h3>Doanh thu TB/ngày</h3>
                      <p className="stats-value">
                        {statistics.doanh_thu_theo_ngay &&
                        statistics.doanh_thu_theo_ngay.length > 0
                          ? Number(
                              statistics.tong_doanh_thu /
                                statistics.doanh_thu_theo_ngay.length
                            ).toLocaleString("vi-VN")
                          : 0}{" "}
                        đ
                      </p>
                    </div>
                  </div>
                </div>

                <div className="statistics-panels">
                  <div className="chart-panel">
                    <h3 className="panel-title">Doanh thu theo ngày</h3>
                    <div className="chart-container">
                      <Line
                        key={`${selectedMonth}-${selectedYear}`}
                        data={chartData}
                        options={{
                          ...chartOptions,
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            ...chartOptions.plugins,
                            legend: {
                              position: "top",
                              labels: {
                                font: {
                                  size: 14,
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="bestsellers-panel">
                    <h3 className="panel-title">Sản phẩm bán chạy nhất</h3>
                    {(statistics?.san_pham_ban_chay || []).length > 0 ? (
                      <div className="bestsellers-list">
                        {statistics.san_pham_ban_chay.map((product, index) => (
                          <div key={index} className="bestseller-item">
                            <div className="bestseller-rank">{index + 1}</div>
                            <div className="bestseller-info">
                              <div className="bestseller-name">
                                {product.ten_san_pham}
                              </div>
                              <div className="bestseller-sales">
                                <span className="sales-count">
                                  {product.tong_so_luong}
                                </span>
                                <span className="sales-label">sản phẩm</span>
                              </div>
                            </div>
                            <div className="bestseller-bar-container">
                              <div
                                className="bestseller-bar"
                                style={{
                                  width: `${
                                    (product.tong_so_luong /
                                      Math.max(
                                        ...statistics.san_pham_ban_chay.map(
                                          (p) => p.tong_so_luong
                                        )
                                      )) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data">
                        Không có dữ liệu sản phẩm bán chạy.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu thống kê...</p>
              </div>
            )}
          </div>
        );

      case "linh_kien":
        return (
          <div className="linh-kien-manager">
            <div className="linh-kien-header">
              <h2>Quản lý Linh kiện</h2>
              <div className="linh-kien-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-microchip"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">
                      {Object.values(linhKien).flat().length}
                    </span>
                    <span className="stat-label">Tổng linh kiện</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-tags"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">
                      {loaiLinhKienList.length}
                    </span>
                    <span className="stat-label">Danh mục</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu mục lục các loại linh kiện */}
            <div className="category-tabs">
              {loaiLinhKienList.map((loai) => (
                <button
                  key={loai}
                  className={`category-tab ${
                    selectedLoaiTable === loai ? "active" : ""
                  }`}
                  onClick={() => setSelectedLoaiTable(loai)}
                >
                  <i className={`fas fa-${getCategoryIcon(loai)}`}></i>
                  <span>{loai.toUpperCase()}</span>
                </button>
              ))}
            </div>

            {/* Phần thêm mới linh kiện */}
            <div className="add-component-card">
              <div className="card-header">
                <h3>Thêm linh kiện mới</h3>
                <div className="category-selector">
                  <label>Loại linh kiện:</label>
                  <select
                    value={newLinhKien.loai}
                    onChange={(e) =>
                      setNewLinhKien({ ...newLinhKien, loai: e.target.value })
                    }
                    className="select-input"
                  >
                    {loaiLinhKienList.map((loai) => (
                      <option key={loai} value={loai}>
                        {loai.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="add-form">
                {getSampleKeys(linhKien, newLinhKien.loai).map((key) => (
                  <div className="form-group" key={key}>
                    <label htmlFor={`new-${key}`}>{getFieldLabel(key)}:</label>
                    {key === "mo_ta" ? (
                      <textarea
                        id={`new-${key}`}
                        placeholder={getFieldPlaceholder(key)}
                        value={newLinhKien[key] || ""}
                        onChange={(e) =>
                          setNewLinhKien({
                            ...newLinhKien,
                            [key]: e.target.value,
                          })
                        }
                      />
                    ) : key === "gia" ? (
                      <div className="price-input">
                        <input
                          id={`new-${key}`}
                          type="number"
                          placeholder={getFieldPlaceholder(key)}
                          value={newLinhKien[key] || ""}
                          onChange={(e) =>
                            setNewLinhKien({
                              ...newLinhKien,
                              [key]: e.target.value,
                            })
                          }
                        />
                        <span className="price-suffix">VNĐ</span>
                      </div>
                    ) : (
                      <input
                        id={`new-${key}`}
                        type={getInputType(key)}
                        placeholder={getFieldPlaceholder(key)}
                        value={newLinhKien[key] || ""}
                        onChange={(e) =>
                          setNewLinhKien({
                            ...newLinhKien,
                            [key]: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                ))}
                <button className="add-button" onClick={handleAddLinhKien}>
                  <i className="fas fa-plus-circle"></i> Thêm linh kiện
                </button>
              </div>
            </div>

            {/* Hiển thị bảng linh kiện cho loại đang chọn */}
            {loaiLinhKienList.map((loai) => {
              if (loai !== selectedLoaiTable) return null;

              const items = Array.isArray(linhKien[loai])
                ? linhKien[loai].filter((item) => {
                    const keyword = searchKeyword.trim().toLowerCase();
                    if (!keyword) return true;

                    const normalizeText = (text) =>
                      text
                        ? text
                            .normalize("NFD")
                            .replace(/\p{Diacritic}/gu, "")
                            .toLowerCase()
                        : "";
                    return Object.values(item).some((value) => {
                      if (value === null || value === undefined) return false;
                      return normalizeText(String(value)).includes(
                        normalizeText(keyword)
                      );
                    });
                  })
                : [];
              if (items.length === 0) {
                return (
                  <div key={loai} className="empty-table-container">
                    <div className="empty-table-message">
                      <i className="fas fa-box-open"></i>
                      <p>
                        Không có linh kiện {loai.toUpperCase()} nào trong danh
                        sách
                      </p>
                      <button
                        className="add-first-button"
                        onClick={() => {
                          setNewLinhKien({ ...newLinhKien, loai: loai });
                          document
                            .querySelector(".add-component-card")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <i className="fas fa-plus"></i> Thêm{" "}
                        {loai.toUpperCase()} đầu tiên
                      </button>
                    </div>
                  </div>
                );
              }

              const allKeys = Object.keys(items[0] || {}).filter(
                (k) => k !== "rating" && k !== "reviewCount"
              );

              return (
                <div key={loai} className="component-table-container">
                  <div className="table-header">
                    <h3>
                      <i className={`fas fa-${getCategoryIcon(loai)}`}></i>
                      Danh sách {loai.toUpperCase()}
                    </h3>
                    <div className="table-actions">
                      <div className="search-box">
                        <input
                          type="text"
                          placeholder={`Tìm kiếm ${loai}...`}
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <i className="fas fa-search"></i>
                      </div>
                      <button
                        className="export-button"
                        onClick={() =>
                          alert(`Xuất danh sách ${loai} sẽ được phát triển sau`)
                        }
                      >
                        <i className="fas fa-file-export"></i> Xuất
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="components-table">
                      <thead>
                        <tr>
                          {allKeys.map((key) => (
                            <th key={key}>{getFieldLabel(key)}</th>
                          ))}
                          <th className="action-column">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((lk) =>
                          editLinhKien && editLinhKien.id === lk.id ? (
                            <tr key={lk.id} className="editing-row">
                              {allKeys.map((key) => (
                                <td key={key}>
                                  {key === "mo_ta" ? (
                                    <textarea
                                      value={editLinhKien[key] || ""}
                                      onChange={(e) =>
                                        setEditLinhKien({
                                          ...editLinhKien,
                                          [key]: e.target.value,
                                        })
                                      }
                                    />
                                  ) : key === "gia" ? (
                                    <div className="price-input">
                                      <input
                                        type="number"
                                        value={editLinhKien[key] || ""}
                                        onChange={(e) =>
                                          setEditLinhKien({
                                            ...editLinhKien,
                                            [key]: e.target.value,
                                          })
                                        }
                                      />
                                      <span className="price-suffix">VNĐ</span>
                                    </div>
                                  ) : (
                                    <input
                                      type={getInputType(key)}
                                      value={editLinhKien[key] || ""}
                                      onChange={(e) =>
                                        setEditLinhKien({
                                          ...editLinhKien,
                                          [key]: e.target.value,
                                        })
                                      }
                                    />
                                  )}
                                </td>
                              ))}
                              <td className="action-column">
                                <div className="action-buttons">
                                  <button
                                    className="save-button"
                                    onClick={handleUpdateLinhKien}
                                    title="Lưu thay đổi"
                                  >
                                    <i className="fas fa-save"></i>
                                  </button>
                                  <button
                                    className="cancel-button"
                                    onClick={() => setEditLinhKien(null)}
                                    title="Hủy chỉnh sửa"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr key={lk.id}>
                              {allKeys.map((key) => (
                                <td
                                  key={key}
                                  className={
                                    key === "gia" ? "price-column" : ""
                                  }
                                >
                                  {key === "mo_ta" ? (
                                    <div className="description-cell">
                                      <span className="description-text">
                                        {lk[key] && lk[key].length > 60
                                          ? lk[key].slice(0, 60) + "..."
                                          : lk[key] || ""}
                                      </span>
                                      {lk[key] && lk[key].length > 60 && (
                                        <div className="tooltip-content">
                                          {lk[key]}
                                        </div>
                                      )}
                                    </div>
                                  ) : key === "gia" ? (
                                    formatPrice(lk[key])
                                  ) : Array.isArray(lk[key]) ? (
                                    lk[key].join(", ")
                                  ) : typeof lk[key] === "object" &&
                                    lk[key] !== null ? (
                                    JSON.stringify(lk[key])
                                  ) : (
                                    lk[key] || ""
                                  )}
                                </td>
                              ))}
                              <td className="action-column">
                                <div className="action-buttons">
                                  <button
                                    className="edit-button"
                                    onClick={() =>
                                      setEditLinhKien({ ...lk, loai })
                                    }
                                    title="Chỉnh sửa"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    className="delete-button"
                                    onClick={() =>
                                      handleDeleteConfirm(lk.id, loai)
                                    }
                                    title="Xóa"
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {/* Hộp thoại xác nhận xóa linh kiện */}
            {deleteConfirmation.show && (
              <div className="delete-confirmation-modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <i className="fas fa-exclamation-triangle"></i>
                    <h3>Xác nhận xóa</h3>
                  </div>
                  <div className="modal-body">
                    <p>Bạn có chắc chắn muốn xóa linh kiện này?</p>
                    <p>Hành động này không thể hoàn tác.</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="cancel-button"
                      onClick={() =>
                        setDeleteConfirmation({
                          show: false,
                          id: null,
                          loai: null,
                        })
                      }
                    >
                      <i className="fas fa-times"></i> Hủy
                    </button>
                    <button
                      className="confirm-button"
                      onClick={() => {
                        handleDeleteLinhKien(
                          deleteConfirmation.id,
                          deleteConfirmation.loai
                        );
                        setDeleteConfirmation({
                          show: false,
                          id: null,
                          loai: null,
                        });
                      }}
                    >
                      <i className="fas fa-check"></i> Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="admin-container">
      <h1>Quản trị Hệ thống Bán Linh kiện</h1>

      {/* Navigation Menu */}
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
          onClick={() => setView("total_payment")}
          className={`nav-button ${view === "total_payment" ? "active" : ""}`}
        >
          Thống kê
        </button>
        <button
          onClick={() => setView("linh_kien")}
          className={`nav-button ${view === "linh_kien" ? "active" : ""}`}
        >
          Linh kiện
        </button>
      </div>

      {/* Content Area */}
      <div className="content-box">{renderContent()}</div>

      {/* Delete Confirmation Modal */}
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
