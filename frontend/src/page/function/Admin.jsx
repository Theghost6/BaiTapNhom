import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../style/color-scheme.css";
import "../../style/Admin.css";
import "../../components/admin/TableCompatibility.css";
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
import SearchBar from "../../components/admin/SearchBar";
import useAdminSearch from "../../hooks/admin/useAdminSearch";
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
      <div className="modal-content modern-modal">
        <div className="modal-header">
          <div className="modal-icon-wrapper">
            <div className="modal-icon delete-icon">
              <i className="fas fa-trash-alt"></i>
            </div>
          </div>
          <h2 className="modal-title">Xác nhận xóa {itemType}</h2>
          <p className="modal-description">
            Bạn có chắc chắn muốn xóa <span className="highlight">{itemType} ID: {itemId}</span>?
            <br />Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="modal-buttons">
          <button className="btn-cancel modern-btn" onClick={onCancel}>
            <i className="fas fa-times"></i>
            <span>Hủy bỏ</span>
          </button>
          <button className="btn-confirm modern-btn" onClick={onConfirm}>
            <i className="fas fa-check"></i>
            <span>Xác nhận</span>
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
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const loaiRefs = React.useRef({});
  const apiUrl = import.meta.env.VITE_HOST;

  // Custom hooks
  const { payments, loading: loadingPayments } = usePayments(apiUrl, view);
  const { reviews, replies, selectedReview, loading: loadingReviews, deleteReview, viewReply } = useReviews(apiUrl, view);
  const { orders, orderItems, orderAddress, selectedOrder, loading: loadingOrders, viewDetails, updateOrderStatus } = useOrders(apiUrl, view);
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

  // Search hooks for different tabs (after all data hooks are initialized)
  const {
    filteredData: filteredUsers,
    handleSearch: handleUserSearch,
    resetSearch: resetUserSearch,
    searchStats: userSearchStats,
    tabConfig: userTabConfig
  } = useAdminSearch(users, 'users');

  const {
    filteredData: filteredOrders,
    handleSearch: handleOrderSearch,
    resetSearch: resetOrderSearch,
    searchStats: orderSearchStats,
    tabConfig: orderTabConfig
  } = useAdminSearch(orders, 'orders');

  const {
    filteredData: filteredPayments,
    handleSearch: handlePaymentSearch,
    resetSearch: resetPaymentSearch,
    searchStats: paymentSearchStats,
    tabConfig: paymentTabConfig
  } = useAdminSearch(payments, 'payments');

  const {
    filteredData: filteredReviews,
    handleSearch: handleReviewSearch,
    resetSearch: resetReviewSearch,
    searchStats: reviewSearchStats,
    tabConfig: reviewTabConfig
  } = useAdminSearch(reviews, 'reviews');

  const {
    filteredData: filteredContacts,
    handleSearch: handleContactSearch,
    resetSearch: resetContactSearch,
    searchStats: contactSearchStats,
    tabConfig: contactTabConfig
  } = useAdminSearch(contacts, 'contacts');

  const {
    filteredData: filteredLinhKien,
    handleSearch: handleProductSearch,
    resetSearch: resetProductSearch,
    searchStats: productSearchStats,
    tabConfig: productTabConfig
  } = useAdminSearch(linhKien, 'products');

  const {
    filteredData: filteredFavorites,
    handleSearch: handleFavoriteSearch,
    resetSearch: resetFavoriteSearch,
    searchStats: favoriteSearchStats,
    tabConfig: favoriteTabConfig
  } = useAdminSearch(favorites, 'favorites');

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
          <div className="dashboard_container modern-dashboard">
            <div className="dashboard-header">
              <div className="header-content">
                <h2 className="dashboard_title">
                  <i className="fas fa-chart-line"></i>
                  Bảng điều khiển
                </h2>
                <p className="dashboard-subtitle">Tổng quan hoạt động hệ thống</p>
              </div>
            </div>
            <div className="date_selector modern-date-selector">
              <div className="selector-header">
                <i className="fas fa-calendar-alt"></i>
                <span>Chọn thời gian thống kê</span>
              </div>
              <div className="date-inputs">
                <div className="date_picker">
                  <label>Tháng</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="select_input modern-select"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        Tháng {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="date_picker">
                  <label>Năm</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="select_input modern-select"
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
              <div className="loading modern-loading">
                <div className="loading-container">
                  <div className="loading_spinner modern-spinner"></div>
                  <div className="loading-text">
                    <h3>Đang tải dữ liệu</h3>
                    <p>Vui lòng chờ trong giây lát...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "home":
        return <HomeManager handleDelete={handleDelete} />;
      case "orders":
        return (
          <div className="orders-tab-container">
            <div className="tab-header">
              <h2 className="tab-title">
                <i className="fas fa-shopping-cart"></i>
                Quản lý Đơn hàng
              </h2>
              <div className="search-stats">
                Hiển thị {orderSearchStats.filtered} / {orderSearchStats.total} đơn hàng
                {orderSearchStats.isFiltered && (
                  <button
                    className="reset-search-btn"
                    onClick={resetOrderSearch}
                    title="Xóa bộ lọc"
                  >
                    <i className="fas fa-times"></i>
                    <span>Xóa bộ lọc</span>
                  </button>
                )}
              </div>
            </div>

            <SearchBar
              {...orderTabConfig}
              onSearch={handleOrderSearch}
              className="orders-search"
            />

            <OrdersTable
              orders={filteredOrders}
              updateOrderStatus={updateOrderStatus}
              handleViewOrderDetails={handleViewOrderDetails}
            />
          </div>
        );
      case "users":
        return (
          <div className="users-tab-container">
            <div className="tab-header">
              <h2 className="tab-title">
                <i className="fas fa-users"></i>
                Quản lý Tài khoản
              </h2>
              <div className="search-stats">
                Hiển thị {userSearchStats.filtered} / {userSearchStats.total} tài khoản
                {userSearchStats.isFiltered && (
                  <button
                    className="reset-search-btn"
                    onClick={resetUserSearch}
                    title="Xóa bộ lọc"
                  >
                    <i className="fas fa-times"></i>
                    <span>Xóa bộ lọc</span>
                  </button>
                )}
              </div>
            </div>

            <SearchBar
              placeholder={userTabConfig.placeholder}
              onSearch={handleUserSearch}
              searchFields={userTabConfig.searchFields}
              filterOptions={userTabConfig.filterOptions}
              showDateFilter={userTabConfig.showDateFilter}
              showStatusFilter={userTabConfig.showStatusFilter}
              statusOptions={userTabConfig.statusOptions}
              className="users-search"
            />

            <UsersTable
              users={filteredUsers}
              loadingUsers={loadingUsers}
              toggleUserStatus={toggleUserStatus}
              handleDelete={handleDelete}
              deleteUser={deleteUser}
            />
          </div>
        );
      case "reviews":
        return (
          <div className="reviews-tab-container">
            <div className="tab-header">
              <h2 className="tab-title">
                <i className="fas fa-star"></i>
                Quản lý Đánh giá
              </h2>
              <div className="search-stats">
                Hiển thị {reviewSearchStats.filtered} / {reviewSearchStats.total} đánh giá
                {reviewSearchStats.isFiltered && (
                  <button
                    className="reset-search-btn"
                    onClick={resetReviewSearch}
                    title="Xóa bộ lọc"
                  >
                    <i className="fas fa-times"></i>
                    <span>Xóa bộ lọc</span>
                  </button>
                )}
              </div>
            </div>

            <SearchBar
              {...reviewTabConfig}
              onSearch={handleReviewSearch}
              className="reviews-search"
            />

            <ReviewsTable
              reviews={filteredReviews}
              viewReply={viewReply}
              handleDelete={handleDelete}
              deleteReview={deleteReview}
              replies={replies}
              selectedReview={selectedReview}
            />
          </div>
        );
      case "payments":
        return (
          <div className="payments-tab-container">
            <div className="tab-header">
              <h2 className="tab-title">
                <i className="fas fa-credit-card"></i>
                Quản lý Thanh toán
              </h2>
              <div className="search-stats">
                Hiển thị {paymentSearchStats.filtered} / {paymentSearchStats.total} thanh toán
                {paymentSearchStats.isFiltered && (
                  <button
                    className="reset-search-btn"
                    onClick={resetPaymentSearch}
                    title="Xóa bộ lọc"
                  >
                    <i className="fas fa-times"></i>
                    <span>Xóa bộ lọc</span>
                  </button>
                )}
              </div>
            </div>

            <SearchBar
              {...paymentTabConfig}
              onSearch={handlePaymentSearch}
              className="payments-search"
            />

            <PaymentsTable
              payments={filteredPayments}
            />
          </div>
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
          <div className="products-tab-container">
            <div className="tab-header">
              <h2 className="tab-title">
                <i className="fas fa-microchip"></i>
                Quản lý Sản phẩm
              </h2>
              <div className="search-stats">
                Hiển thị {productSearchStats.filtered} / {productSearchStats.total} sản phẩm
                {productSearchStats.isFiltered && (
                  <button
                    className="reset-search-btn"
                    onClick={resetProductSearch}
                    title="Xóa bộ lọc"
                  >
                    <i className="fas fa-times"></i>
                    <span>Xóa bộ lọc</span>
                  </button>
                )}
              </div>
            </div>

            <LinhKienManager
              linhKien={filteredLinhKien}
              loaiLinhKienList={loaiLinhKienList}
              formatPrice={formatPrice}
              handleDelete={handleDelete}
              deleteLinhKien={deleteLinhKien}
              setEditLinhKien={setEditLinhKien}
              setIsEditModalOpen={setIsEditModalOpen}
              setIsAddFormVisible={setIsAddFormVisible}
              isAddFormVisible={isAddFormVisible}
              searchConfig={productTabConfig}
              onSearch={handleProductSearch}
              loading={loadingLinhKien}
            />
          </div>
        );
      case "contacts":
        return (
          <div className="contacts-tab-container">
            <div className="tab-header">
              <h2 className="tab-title">
                <i className="fas fa-envelope"></i>
                Quản lý Liên hệ
              </h2>
              <div className="search-stats">
                Hiển thị {contactSearchStats.filtered} / {contactSearchStats.total} liên hệ
                {contactSearchStats.isFiltered && (
                  <button
                    className="reset-search-btn"
                    onClick={resetContactSearch}
                    title="Xóa bộ lọc"
                  >
                    <i className="fas fa-times"></i>
                    <span>Xóa bộ lọc</span>
                  </button>
                )}
              </div>
            </div>

            <SearchBar
              {...contactTabConfig}
              onSearch={handleContactSearch}
              className="contacts-search"
            />

            <ContactsTable
              contacts={filteredContacts}
              handleDelete={handleDelete}
              deleteContact={deleteContact}
            />
          </div>
        );
      case "favorites":
        return (
          <div className="favorites-tab-container">
            <div className="tab-header">
              <h2 className="tab-title">
                <i className="fas fa-heart"></i>
                Quản lý Yêu thích
              </h2>
              <div className="search-stats">
                Hiển thị {favoriteSearchStats.filtered} / {favoriteSearchStats.total} yêu thích
                {favoriteSearchStats.isFiltered && (
                  <button
                    className="reset-search-btn"
                    onClick={resetFavoriteSearch}
                    title="Xóa bộ lọc"
                  >
                    <i className="fas fa-times"></i>
                    <span>Xóa bộ lọc</span>
                  </button>
                )}
              </div>
            </div>

            <SearchBar
              {...favoriteTabConfig}
              onSearch={handleFavoriteSearch}
              className="favorites-search"
            />

            <FavoritesTable
              favorites={filteredFavorites}
              mostFavorited={mostFavorited}
            />
          </div>
        );
    }
  };

  return (
    <div className="admin-container">
      <div className="sidebar modern-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h2>Admin Panel</h2>
          </div>
          <div className="admin-badge">
            <span className="admin-text">Administrator</span>
          </div>
        </div>
        <ul className="sidebar-menu">
          <li>
            <button
              className={`sidebar-button ${view === "dashboard" ? "active" : ""}`}
              onClick={() => setView("dashboard")}
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Trang chủ</span>
            </button>
          </li>

          <li>
            <button
              className={`sidebar-button ${view === "linh_kien" ? "active" : ""}`}
              onClick={() => setView("linh_kien")}
            >
              <i className="fas fa-microchip"></i>
              <span>Quản lý Sản phẩm</span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "orders" ? "active" : ""}`}
              onClick={() => setView("orders")}
            >
              <i className="fas fa-shopping-cart"></i>
              <span>Quản lý Đơn hàng</span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "users" ? "active" : ""}`}
              onClick={() => setView("users")}
            >
              <i className="fas fa-users"></i>
              <span>Quản lý Tài khoản</span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "reviews" ? "active" : ""}`}
              onClick={() => setView("reviews")}
            >
              <i className="fas fa-star"></i>
              <span>Quản lý Đánh giá</span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "payments" ? "active" : ""}`}
              onClick={() => setView("payments")}
            >
              <i className="fas fa-credit-card"></i>
              <span>Quản lý Thanh toán</span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "total_payment" ? "active" : ""}`}
              onClick={() => setView("total_payment")}
            >
              <i className="fas fa-chart-bar"></i>
              <span>Thống kê Doanh thu</span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "contacts" ? "active" : ""}`}
              onClick={() => setView("contacts")}
            >
              <i className="fas fa-envelope"></i>
              <span>Quản lý Liên hệ</span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-button ${view === "favorites" ? "active" : ""}`}
              onClick={() => setView("favorites")}
            >
              <i className="fas fa-heart"></i>
              <span>Quản lý Yêu thích</span>
            </button>
          </li>
        </ul>
        <div className="sidebar-footer">
          <div className="status-indicator">
            <div className="status-dot online"></div>
            <span>Trực tuyến</span>
          </div>
        </div>
      </div>
      <div className="main-content modern-main">
        <div className="content-wrapper">
          {renderContent()}
        </div>
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