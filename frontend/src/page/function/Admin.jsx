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
import usePayments from '../../hooks/admin/usePayments';
import useReviews from '../../hooks/admin/useReviews';
import useOrders from '../../hooks/admin/useOrders';
import useUsers from '../../hooks/admin/useUsers';
import useContacts from '../../hooks/admin/useContacts';
import useDashboard from '../../hooks/admin/useDashboard';
import useFavorites from '../../hooks/admin/useFavorites';
import useLinhKien from '../../hooks/admin/useLinhKien';
import OrderDetailsModal from "../../components/admin/OrderDetailsModal";
import EditLinhKienModal from "../../components/admin/EditLinhKienModal";
import HomeManager from "../../components/admin/HomeManager";
import DashboardContent from "../../components/admin/DashboardContent";
import OrdersTable from "../../components/admin/OrdersTable";
import UsersTable from "../../components/admin/UsersTable";
import ReviewsTable from "../../components/admin/ReviewsTable";
import PaymentsTable from "../../components/admin/PaymentsTable";
import TotalPaymentStatistics from "../../components/admin/TotalPaymentStatistics";
import LinhKienManager from "../../components/admin/LinhKienManager";
import ContactsTable from "../../components/admin/ContactsTable";
import FavoritesTable from "../../components/admin/FavoritesTable";

// Register ChartJS components
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
const apiUrl = import.meta.env.VITE_HOST;

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
  const [view, setView] = useState("dashboard");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [editLinhKien, setEditLinhKien] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newLinhKien, setNewLinhKien] = useState({
    loai: "cpu",
    ten: "",
    mo_ta: "",
    gia: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemType: "",
    onConfirm: () => { },
  });
  const [selectedLoaiTable, setSelectedLoaiTable] = useState("");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const loaiRefs = React.useRef({});
  const apiUrl = import.meta.env.VITE_HOST;

  // Custom hooks
  const { payments, loading: loadingPayments, deletePayment } = usePayments(apiUrl, view);
  const { reviews, replies, selectedReview, loading: loadingReviews, deleteReview, viewReply } = useReviews(apiUrl, view);
  const { orders, orderItems, orderAddress, selectedOrder, loading: loadingOrders, deleteOrder, viewDetails, updateOrderStatus } = useOrders(apiUrl, view);
  const { users, loading: loadingUsers, deleteUser, toggleUserStatus } = useUsers(apiUrl, view);
  const { contacts, loading: loadingContacts, deleteContact } = useContacts(apiUrl, view);
  // Truyền orders, users, reviews vào useDashboard
  const {
    dashboardMetrics,
    statistics,
    loading: loadingDashboard,
    revenuePercentage,
    orderCompletionPercentage,
    userActivePercentage,
    positiveReviewPercentage,
    chartDataRevenue,
    chartDataOrders,
    chartDataUsers,
    chartDataReviews,
    chartOptions,
    chartData,
  } = useDashboard(apiUrl, selectedMonth, selectedYear, orders, users, reviews);
  const { favorites, mostFavorited, loading: loadingFavorites } = useFavorites(apiUrl, view);
  const { linhKien, loaiLinhKienList, loading: loadingLinhKien, setLinhKien, setLoaiLinhKienList, addLinhKien, updateLinhKien, deleteLinhKien } = useLinhKien(apiUrl, view);

  // Khi nhấn nút 'Chi tiết' đơn hàng
  const handleViewOrderDetails = (orderId) => {
    viewDetails(orderId);
    setIsOrderModalOpen(true);
  };
  // Đóng modal chi tiết đơn hàng
  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
  };

  // Thêm hàm cancelDelete
  const cancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      itemId: null,
      itemType: "",
      onConfirm: () => { },
    });
  };

  // Thêm hàm handleDelete
  const handleDelete = (itemId, itemType, deleteFunction) => {
    setDeleteModal({
      isOpen: true,
      itemId,
      itemType,
      onConfirm: async () => {
        try {
          await deleteFunction();
        } catch (error) {
          // Error handled by deleteFunction
        }
        cancelDelete();
      },
    });
  };

  function getFieldLabel(key) {
    const labels = {
      ten: "Tên sản phẩm",
      hang: "Hãng",
      gia: "Giá bán",
      so_luong: "Tồn kho",
      mo_ta: "Mô tả",
      // Thêm các trường khác nếu có
    };
    return labels[key] || key;
  }

  function getFieldPlaceholder(key) {
    const placeholders = {
      ten: "Nhập tên sản phẩm",
      hang: "Nhập hãng sản xuất",
      gia: "Nhập giá bán",
      so_luong: "Nhập số lượng tồn kho",
      mo_ta: "Nhập mô tả chi tiết",
      // Thêm các trường khác nếu có
    };
    return placeholders[key] || "";
  }

  function getInputType(key) {
    if (key === "gia" || key === "so_luong") return "number";
    if (key === "email") return "email";
    if (key === "sdt" || key === "phone") return "tel";
    return "text";
  }



  function formatPrice(value) {
    if (!value) return "0 đ";
    return Number(value).toLocaleString("vi-VN") + " đ";
  }

  function getCategoryIcon(loai) {
    // Trả về tên icon font-awesome phù hợp với từng loại linh kiện
    const icons = {
      cpu: "microchip",
      ram: "memory",
      vga: "video",
      main: "server",
      ssd: "hdd",
      hdd: "hdd",
      psu: "bolt",
      case: "cube",
      fan: "fan",
      // Thêm các loại khác nếu có
    };
    return icons[loai] || "box";
  }

  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return (
          <div className="dashboard_container">
            <h2 className="dashboard_title">Thông tin chung</h2>
            <div className="date_selector">
              <div className="date_picker">
                <label>Chọn tháng: </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="select_input"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="date_picker">
                <label>Chọn năm: </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="select_input"
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
            {statistics && dashboardMetrics ? (
              <DashboardContent
                statistics={statistics}
                dashboardMetrics={dashboardMetrics}
                revenuePercentage={revenuePercentage}
                orderCompletionPercentage={orderCompletionPercentage}
                userActivePercentage={userActivePercentage}
                positiveReviewPercentage={positiveReviewPercentage}
                chartDataRevenue={chartDataRevenue}
                chartDataOrders={chartDataOrders}
                chartDataUsers={chartDataUsers}
                chartDataReviews={chartDataReviews}
                chartOptions={chartOptions}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                orders={orders}
                users={users}
                reviews={reviews}
                loadingDashboard={loadingDashboard}
              />
            ) : (
              <div className="loading">
                <div className="loading_spinner"></div>
                <p>Đang tải dữ liệu thống kê...</p>
              </div>
            )}
          </div>
        );
      case "home":
        return <HomeManager handleDelete={handleDelete} />;
      case "orders":
        return (
          <OrdersTable
            orders={orders}
            updateOrderStatus={updateOrderStatus}
            handleViewOrderDetails={handleViewOrderDetails}
            handleDelete={handleDelete}
            deleteOrder={deleteOrder}
          />
        );
      case "users":
        return (
          <UsersTable
            users={users}
            loadingUsers={loadingUsers}
            toggleUserStatus={toggleUserStatus}
            handleDelete={handleDelete}
            deleteUser={deleteUser}
          />
        );
      case "reviews":
        return (
          <ReviewsTable
            reviews={reviews}
            viewReply={viewReply}
            handleDelete={handleDelete}
            deleteReview={deleteReview}
            replies={replies}
            selectedReview={selectedReview}
          />
        );
      case "payments":
        return (
          <PaymentsTable
            payments={payments}
            handleDelete={handleDelete}
            deletePayment={deletePayment}
          />
        );
      case "total_payment":
        return (
          <div className="statistics_dashboard">
            <h2 className="dashboard_title">Thống kê Doanh Thu</h2>
            <div className="date_selector">
              <div className="date_picker">
                <label>Chọn tháng: </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="select_input"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="date_picker">
                <label>Chọn năm: </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="select_input"
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
            <TotalPaymentStatistics
              statistics={statistics}
              chartData={chartData}
              chartOptions={chartOptions(`Doanh thu - Tháng ${selectedMonth}/${selectedYear}`)}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          </div>
        );
      case "linh_kien":
        return (
          <LinhKienManager
            linhKien={linhKien}
            loaiLinhKienList={loaiLinhKienList}
            selectedLoaiTable={selectedLoaiTable}
            setSelectedLoaiTable={setSelectedLoaiTable}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            formatPrice={formatPrice}
            handleDelete={handleDelete}
            deleteLinhKien={deleteLinhKien}
            setEditLinhKien={setEditLinhKien}
            setIsEditModalOpen={setIsEditModalOpen}
            setIsAddFormVisible={setIsAddFormVisible}
            isAddFormVisible={isAddFormVisible}
          />
        );
      case "contacts":
        return (
          <ContactsTable
            contacts={contacts}
            handleDelete={handleDelete}
            deleteContact={deleteContact}
          />
        );
      case "favorites":
        return (
          <FavoritesTable
            favorites={favorites}
            mostFavorited={mostFavorited}
          />
        );
    }
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <button
              className={`sidebar-button ${view === "dashboard" ? "active" : ""}`}
              onClick={() => setView("dashboard")}
            >
              <i className="fas fa-tachometer-alt"></i> Trang chủ
            </button>
          </li>

          <li>
            <button
              className={`sidebar-button ${view === "linh_kien" ? "active" : ""}`}
              onClick={() => setView("linh_kien")}
            >
              <i className="fas fa-microchip"></i> Quản lý Sản phẩm
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "orders" ? "active" : ""}`}
              onClick={() => setView("orders")}
            >
              <i className="fas fa-shopping-cart"></i> Quản lý Đơn hàng
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "users" ? "active" : ""}`}
              onClick={() => setView("users")}
            >
              <i className="fas fa-users"></i> Quản lý Tài khoản
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "reviews" ? "active" : ""}`}
              onClick={() => setView("reviews")}
            >
              <i className="fas fa-star"></i> Quản lý Đánh giá
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "payments" ? "active" : ""}`}
              onClick={() => setView("payments")}
            >
              <i className="fas fa-credit-card"></i> Quản lý Thanh toán
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "total_payment" ? "active" : ""}`}
              onClick={() => setView("total_payment")}
            >
              <i className="fas fa-chart-bar"></i> Thống kê Doanh thu
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "contacts" ? "active" : ""}`}
              onClick={() => setView("contacts")}
            >
              <i className="fas fa-envelope"></i> Quản lý Liên hệ
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "favorites" ? "active" : ""}`}
              onClick={() => setView("favorites")}
            >
              <i className="fas fa-heart"></i> Quản lý Yêu thích
            </button>
          </li>
        </ul>
      </div>
      <div className="main-content">
        {renderContent()}
        <OrderDetailsModal
          isOpen={isOrderModalOpen}
          onClose={closeOrderModal}
          orderId={selectedOrder}
          orderItems={orderItems}
          orderAddress={orderAddress}
        />
        <EditLinhKienModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          linhKien={editLinhKien}
          loai={editLinhKien?.loai}
          onSave={updateLinhKien}
          loaiLinhKienList={loaiLinhKienList}
          getFieldLabel={getFieldLabel}
          getFieldPlaceholder={getFieldPlaceholder}
          getInputType={getInputType}
        />
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onCancel={cancelDelete}
          onConfirm={deleteModal.onConfirm}
          itemId={deleteModal.itemId}
          itemType={deleteModal.itemType}
        />
      </div>
    </div>
  );
}

export default Admin;