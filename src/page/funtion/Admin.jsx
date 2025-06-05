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

function OrderDetailsModal({ isOpen, onClose, orderId, orderItems, orderAddress }) {
  const [showAddress, setShowAddress] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className.includes("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className={`modal-overlay ${isOpen ? "modal-open" : "modal-close"}`}
      onClick={handleOverlayClick}
    >
      <div
        className="modal-content"
        style={{
          maxWidth: "800px",
          width: "90%",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="modal-header"
          style={{ position: "sticky", top: 0, background: "#fff", zIndex: 10 }}
        >
          <h2>Chi tiết Đơn hàng ID: {orderId}</h2>
          <button
            className="close-btn"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              position: "absolute",
              right: "15px",
              top: "15px",
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div
          className="modal-body"
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "15px",
          }}
        >
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

          {orderItems && Object.keys(orderItems).length === 0 ? (
            <p>Không có sản phẩm nào.</p>
          ) : (
            <div>
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "15px",
                  borderRadius: "5px",
                  marginBottom: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ marginTop: 0 }}>Thông tin hóa đơn</h3>
                <p>
                  <strong>Người nhận:</strong> {orderItems.ten_nguoi}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  {Number(orderItems.tong_tien).toLocaleString("vi-VN")} đ
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {orderItems.dia_chi}
                </p>
                <p>
                  <strong>Phương thức thanh toán:</strong>{" "}
                  {orderItems.phuong_thuc_thanh_toan}
                </p>
                <p>
                  <strong>Ngày tạo:</strong> {orderItems.ngay_tao}
                </p>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.san_pham && orderItems.san_pham.length > 0 ? (
                    orderItems.san_pham.map((item, index) => (
                      <tr key={index}>
                        <td>{item.ten_san_pham}</td>
                        <td>{item.so_luong}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" style={{ textAlign: "center" }}>
                        Không có sản phẩm nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditLinhKienModal({ isOpen, onClose, linhKien, loai, onSave, loaiLinhKienList, getFieldLabel, getFieldPlaceholder, getInputType }) {
  const [editData, setEditData] = useState(linhKien || {});

  useEffect(() => {
    setEditData(linhKien || {});
  }, [linhKien]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className.includes("modal-overlay")) {
      onClose();
    }
  };

  const handleChange = (key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave(editData);
    onClose();
  };

  const sampleKeys = Object.keys(linhKien).filter(
    (k) => k !== "rating" && k !== "reviewCount" && k !== "id"
  );

  return (
    <div
      className={`modal-overlay ${isOpen ? "modal-open" : "modal-close"}`}
      onClick={handleOverlayClick}
    >
      <div
        className="modal-content"
        style={{
          maxWidth: "600px",
          width: "90%",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="modal-header"
          style={{ position: "sticky", top: 0, background: "#fff", zIndex: 10 }}
        >
          <h2>Chỉnh sửa Linh kiện ID: {linhKien.id}</h2>
          <button
            className="close-btn"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              position: "absolute",
              right: "15px",
              top: "15px",
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div
          className="modal-body"
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "15px",
          }}
        >
          <div className="form-group">
            <label>Loại linh kiện:</label>
            <select
              value={editData.loai || loai}
              onChange={(e) => handleChange("loai", e.target.value)}
              className="select-input"
            >
              {loaiLinhKienList.map((loaiOption) => (
                <option key={loaiOption} value={loaiOption}>
                  {loaiOption.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          {sampleKeys.map((key) => (
            <div className="form-group" key={key}>
              <label htmlFor={`edit-${key}`}>{getFieldLabel(key)}:</label>
              {key === "mo_ta" ? (
                <textarea
                  id={`edit-${key}`}
                  placeholder={getFieldPlaceholder(key)}
                  value={editData[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : key === "gia" ? (
                <div className="price-input">
                  <input
                    id={`edit-${key}`}
                    type="number"
                    placeholder={getFieldPlaceholder(key)}
                    value={editData[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                  <span className="price-suffix">VNĐ</span>
                </div>
              ) : (
                <input
                  id={`edit-${key}`}
                  type={getInputType(key)}
                  placeholder={getFieldPlaceholder(key)}
                  value={editData[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}
            </div>
          ))}
          <div className="modal-buttons">
            <button className="cancel-btn" onClick={onClose}>
              <i className="fas fa-times"></i> Hủy
            </button>
            <button className="confirm-btn" onClick={handleSubmit}>
              <i className="fas fa-check"></i> Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// New HomeManager Component
function HomeManager({ handleDelete }) {
  const [activeTab, setActiveTab] = useState('banner');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState({});
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemType: "",
    onConfirm: () => {},
  });

  const apiUrl = 'http://localhost/BaiTapNhom/backend/tt_home.php';

  const tables = {
    banner: ['hinh_anh', 'thu_tu', 'trang_thai'],
    footer: ['noi_dung', 'tac_gia', 'ban_quyen', 'dia_diem', 'ten_lop', 'ten_truong', 'trang_thai'],
    top_menu: ['ten', 'url', 'thu_tu', 'trang_thai'],
    chu_chay: ['noi_dung', 'toc_do', 'trang_thai']
  };

  const tableLabels = {
    banner: { hinh_anh: 'Hình ảnh (URL)', thu_tu: 'Thứ tự', trang_thai: 'Kích hoạt' },
    footer: {
      noi_dung: 'Nội dung', tac_gia: 'Tác giả', ban_quyen: 'Bản quyền',
      dia_diem: 'Địa điểm', ten_lop: 'Tên lớp', ten_truong: 'Tên trường', trang_thai: 'Trạng thái'
    },
    top_menu: { ten: 'Tên', url: 'URL', thu_tu: 'Thứ tự', trang_thai: 'Trạng thái' },
    chu_chay: { noi_dung: 'Nội dung', toc_do: 'Tốc độ', trang_thai: 'Trạng thái' }
  };

  const fetchData = async (table) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}?path=${table}`);
      setData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
    setNewItem({});
    setEditingId(null);
    setEditItem({});
  }, [activeTab]);

  const normalizeItem = (item) => {
  const copy = { ...item };
  if (copy.trang_thai === "active") copy.trang_thai = 1;
  else if (copy.trang_thai === "inactive") copy.trang_thai = 0;
  return copy;
};

  const handleAdd = async () => {
  try {
    // Validate required fields
    if (activeTab === 'chu_chay' && !newItem.noi_dung) {
      alert('Nội dung là bắt buộc');
      return;
    }
const normalized = normalizeItem(newItem);
    const response = await axios.post(`${apiUrl}?path=${activeTab}`, normalized);
    if (response.data.success) {
      fetchData(activeTab);
      setNewItem({});
      alert('Thêm thành công!');
    } else {
      alert(response.data.error || 'Có lỗi xảy ra khi thêm');
    }
  } catch (error) {
    console.error('Error adding item:', error);
    alert(`Lỗi: ${error.response?.data?.error || error.message}`);
  }
};
  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditItem(item);
  };

  const handleUpdate = async () => {
    try {
      const normalized = normalizeItem(editItem);
      const response = await axios.put(`${apiUrl}?path=${activeTab}/${editingId}`, normalized);
      if (response.data.success) {
        fetchData(activeTab);
        setEditingId(null);
        setEditItem({});
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const openDeleteModal = (itemId, itemType) => {
    setDeleteModal({
      isOpen: true,
      itemId,
      itemType,
      onConfirm: async () => {
        try {
          const response = await axios.delete(`${apiUrl}?path=${activeTab}/${itemId}`);
          if (response.data.success) {
            fetchData(activeTab);
            setDeleteModal({ isOpen: false, itemId: null, itemType: "", onConfirm: () => {} });
          }
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      },
    });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, itemId: null, itemType: "", onConfirm: () => {} });
  };

  const renderInput = (field, value, setValue, isEditing = false) => {
    if (field === 'trang_thai') {
      return (
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => setValue({ ...isEditing ? editItem : newItem, [field]: e.target.checked })}
        />
      );
    }
    if (field === 'thu_tu' || field === 'toc_do') {
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => setValue({ ...isEditing ? editItem : newItem, [field]: e.target.value })}
          min="0"
        />
      );
    }
    if (field === 'trang_thai') {
      return (
        <select
          value={value || ''}
          onChange={(e) => setValue({ ...isEditing ? editItem : newItem, [field]: e.target.value })}
        >
          <option value="">Chọn trạng thái</option>
          <option value="active">Kích hoạt</option>
          <option value="inactive">Không kích hoạt</option>
        </select>
      );
    }
    if (field === 'noi_dung') {
      return (
        <textarea
          value={value || ''}
          onChange={(e) => setValue({ ...isEditing ? editItem : newItem, [field]: e.target.value })}
        />
      );
    }
    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => setValue({ ...isEditing ? editItem : newItem, [field]: e.target.value })}
      />
    );
  };

  return (
    <div className="linh-kien-manager">
      <div className="linh-kien-header">
        <h2>Quản lý Giao Diện</h2>
      </div>
      <div className="category-tabs">
        {Object.keys(tables).map((table) => (
          <button
            key={table}
            className={`category-tab ${activeTab === table ? 'active' : ''}`}
            onClick={() => setActiveTab(table)}
          >
            <i className={`fas fa-${table === 'banner' ? 'image' : table === 'footer' ? 'shoe-prints' : table === 'top_menu' ? 'bars' : 'running'}`}></i>
            {table.charAt(0).toUpperCase() + table.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>
      <div className="add-component-card">
        <div className="card-header">
          <h3>Thêm mới</h3>
        </div>
        <div className="add-form">
          {tables[activeTab].map((field) => (
            <div className="form-group" key={field}>
              <label>{tableLabels[activeTab][field]}</label>
              {renderInput(field, newItem[field], setNewItem)}
            </div>
          ))}
          <button className="add-button" onClick={handleAdd}>
            <i className="fas fa-plus"></i> Thêm
          </button>
        </div>
      </div>
      <div className="component-table-container">
        <div className="table-header">
          <h3>Danh sách {activeTab.replace('_', ' ')}</h3>
        </div>
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Đang tải...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="empty-table-container">
            <div className="empty-table-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>Không có dữ liệu</p>
              <button className="add-first-button" onClick={() => setNewItem({})}>
                <i className="fas fa-plus"></i> Thêm mới
              </button>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="components-table">
              <thead>
                <tr>
                  <th>ID</th>
                  {tables[activeTab].map((field) => (
                    <th key={field}>{tableLabels[activeTab][field]}</th>
                  ))}
                  <th className="action-column">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className={editingId === item.id ? 'editing-row' : ''}>
                    <td>{item.id}</td>
                    {tables[activeTab].map((field) => (
                      <td key={field}>
                        {editingId === item.id ? (
                          renderInput(field, editItem[field], setEditItem, true)
                        ) : field === 'hinh_anh' ? (
                          <img src={item[field]} alt="Banner" style={{ width: '50px', height: 'auto' }} />
                        ) : field === 'trang_thai' ? (
                          item[field] ? 'Có' : 'Không'
                        ) : field === 'trang_thai' ? (
                          item[field] === 'active' ? 'Kích hoạt' : ' không kích hoạt'
                        ) : (
                          item[field]
                        )}
                      </td>
                    ))}
                    <td className="action-column">
                      <div className="action-buttons">
                        {editingId === item.id ? (
                          <>
                            <button className="save-button" onClick={handleUpdate}>
                              <i className="fas fa-save"></i>
                            </button>
                            <button className="cancel-button" onClick={() => setEditingId(null)}>
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="edit-button" onClick={() => handleEdit(item)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => openDeleteModal(item.id, activeTab.replace('_', ' '))}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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

function Admin() {
  const [view, setView] = useState("dashboard");
  const [contacts, setContacts] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [totalPayment, setTotalPayment] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState({});
  const [selectedReview, setSelectedReview] = useState(null);
  const [replies, setReplies] = useState([]);
  const [orderAddress, setOrderAddress] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [linhKien, setLinhKien] = useState({});
  const [editLinhKien, setEditLinhKien] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newLinhKien, setNewLinhKien] = useState({
    loai: "cpu",
    ten: "",
    mo_ta: "",
    gia: "",
  });
  const [loaiLinhKienList, setLoaiLinhKienList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    id: null,
    loai: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemType: "",
    onConfirm: () => {},
  });
  const [statistics, setStatistics] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

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
      so_luong: "Tồn kho",
    };
    return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
  };

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
      so_luong: "Nhập số lượng",
    };
    return placeholderMap[key] || `Nhập ${key}`;
  };

  const getInputType = (key) => {
    if (key === "gia" || key === "so_luong" || key.includes("nam")) return "number";
    if (key.includes("ngay")) return "date";
    return "text";
  };

  const formatPrice = (price) => {
    if (!price) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getSampleKeys = (linhKien, loai) => {
    if (Array.isArray(linhKien[loai]) && linhKien[loai][0]) {
      return Object.keys(linhKien[loai][0]).filter(
        (k) => k !== "rating" && k !== "reviewCount" && k !== "id"
      );
    }
    return ["ten", "mo_ta", "gia", "hang", "so_luong"];
  };

  const handleDeleteConfirm = (id, loai) => {
    setDeleteConfirmation({
      show: true,
      id,
      loai,
    });
  };

  const loaiRefs = React.useRef({});
  React.useEffect(() => {
    loaiLinhKienList.forEach((loai) => {
      if (!loaiRefs.current[loai]) {
        loaiRefs.current[loai] = React.createRef();
      }
    });
  }, [loaiLinhKienList]);

  const [selectedLoaiTable, setSelectedLoaiTable] = useState("");
  React.useEffect(() => {
    if (loaiLinhKienList.length > 0 && !selectedLoaiTable) {
      setSelectedLoaiTable(loaiLinhKienList[0]);
    }
  }, [loaiLinhKienList]);

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

  const viewDetails = (id) => {
    axios
      .get(
        `http://localhost/BaiTapNhom/backend/api.php?action=get_order_detail&id=${id}`
      )
      .then((res) => {
        setOrderItems(res.data.items || {});
        setOrderAddress(res.data.address || null);
        setSelectedOrder(id);
        setIsOrderModalOpen(true);
      })
      .catch((err) => console.error("Error fetching order details:", err));
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
    setOrderItems({});
    setOrderAddress(null);
  };

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
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

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
          setIsAddFormVisible(false);
        } else {
          alert("Thêm thất bại: " + (res.data.error || "Lỗi không xác định"));
        }
      })
      .catch((err) => console.error("Error adding linh_kien:", err));
  };

  const handleUpdateLinhKien = (updatedItem) => {
    const { loai, ...item } = updatedItem;
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
          setIsEditModalOpen(false);
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

  const chartDataRevenue = {
    labels: (statistics?.doanh_thu_theo_ngay || []).map((item) => `Ngày ${item.ngay}`),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: (statistics?.doanh_thu_theo_ngay || []).map((item) => item.doanh_thu),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartDataOrders = {
    labels: (statistics?.don_hang_theo_ngay || []).map((item) => `Ngày ${item.ngay}`),
    datasets: [
      {
        label: "Số đơn hàng",
        data: (statistics?.don_hang_theo_ngay || []).map((item) => item.don_hang),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartDataUsers = {
    labels: (statistics?.nguoi_dung_theo_ngay || []).map((item) => {
      return `Ngày ${item.ngay}`;
    }),
    datasets: [
      {
        label: "Người dùng hoạt động",
        data: (statistics?.nguoi_dung_theo_ngay || []).map((item) => {
          return item.nguoi_dung;
        }),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartDataReviews = {
    labels: (statistics?.danh_gia_theo_ngay || []).map((item) => `Ngày ${item.ngay}`),
    datasets: [
      {
        label: "Số đánh giá",
        data: (statistics?.danh_gia_theo_ngay || []).map((item) => item.danh_gia),
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: title.includes("Doanh thu") ? "Doanh thu (VNĐ)" : title.includes("Người dùng") ? "Số người dùng" : "Số lượng",
        },
      },
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
      },
    },
  });

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
                is_active: Number(user.is_active),
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
      case "dashboard":
        Promise.all([
          axios.get("http://localhost/BaiTapNhom/backend/api.php?action=get_dashboard_metrics"),
          axios.get(`http://localhost/BaiTapNhom/backend/api.php?action=get_statistics&month=${selectedMonth}&year=${selectedYear}`),
          axios.get("http://localhost/BaiTapNhom/backend/api.php?action=get_reviews"),
          axios.get("http://localhost/BaiTapNhom/backend/api.php?action=get_orders"),
          axios.get("http://localhost/BaiTapNhom/backend/api.php?action=get_users"),
        ])
          .then(([metricsRes, statsRes, reviewsRes, ordersRes, usersRes]) => {
            setDashboardMetrics(metricsRes.data);
            setStatistics(statsRes.data);
            if (Array.isArray(reviewsRes.data)) {
              setReviews(reviewsRes.data);
            } else {
              console.error("API get_reviews did not return an array:", reviewsRes.data);
              setReviews([]);
            }
            if (Array.isArray(usersRes.data)) {
              const usersData = usersRes.data.map((user) => ({
                ...user,
                is_active: Number(user.is_active),
              }));
              setUsers(usersData);
            } else {
              console.error("API get_users did not return an array:", usersRes.data);
              setUsers([]);
            }
            if (Array.isArray(ordersRes.data)) {
              setOrders(ordersRes.data);
            } else {
              console.error("API get_orders did not return an array:", ordersRes.data);
              setOrders([]);
            }
          })
          .catch((err) => {
            console.error("Error fetching dashboard data:", err);
            setDashboardMetrics(null);
            setStatistics([]);
            setReviews([]);
            setOrders([]);
            setUsers([]);
          });
        break;
    // Sửa thành:
case "linh_kien":
  axios
    .get("http://localhost/BaiTapNhom/backend/manage_linh_kien.php?action=get_all")
    .then((res) => {
      if (res.data && typeof res.data === "object" && !Array.isArray(res.data)) {
        setLinhKien(res.data);
        setLoaiLinhKienList(Object.keys(res.data));
        if (!Object.keys(res.data).includes(newLinhKien.loai)) {
          setNewLinhKien(prev => ({
            ...prev,
            loai: Object.keys(res.data)[0] || "cpu"
          }));
        }
      } else {
        console.error("Invalid data format from API");
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
     case "contacts":
  axios
    .get("http://localhost/BaiTapNhom/backend/api.php?action=get_contacts")
    .then((res) => {
      if (Array.isArray(res.data)) {
        setContacts(res.data);
      } else {
        console.error("API get_contacts did not return an array:", res.data);
        setContacts([]);
      }
    })
    .catch((err) => {
      console.error("Error fetching contacts:", err);
      setContacts([]);
    });
  break;
      default:
        break;
    }
  }, [view, selectedMonth, selectedYear]);

  const targetRevenue = 100000000;
  const revenuePercentage = statistics?.tong_doanh_thu
    ? (statistics.tong_doanh_thu / targetRevenue) * 100
    : 0;

  const completedOrders = orders.filter((order) => order.trang_thai === "Đã thanh toán").length;
const orderCompletionPercentage = orders.length
  ? (completedOrders / orders.length) * 100
  : 0;

  const activeUsers = users.filter((user) => user.is_active === 1).length;
  const userActivePercentage = users.length > 0 ? (activeUsers / users.length) * 100 : 0;

  const positiveReviews = reviews.filter((review) => review.so_so_sao >= 3).length;
const positiveReviewPercentage = reviews.length === 0 
  ? 0 
  : (positiveReviews / reviews.length) * 100;

const deleteContact = (id) => {
  axios
    .get(`http://localhost/BaiTapNhom/backend/api.php?action=delete_contact&id=${id}`)
    .then(() => {
      setContacts(contacts.filter((c) => c.id !== id));
      cancelDelete();
    })
    .catch((err) => console.error("Error deleting contact:", err));
};
  const renderContent = () => {
    switch (view) {
      case "dashboard":
        return (
          <div className="dashboard-container">
            <h2 className="dashboard-title">Thông tin chung</h2>
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
            {statistics && dashboardMetrics ? (
              <div className="dashboard-content">
                <div className="stats-cards">
                  <div className="stats-card">
                    <div className="card-icon">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="card-content">
                      <h3>Doanh thu</h3>
                      <p className="stats-value">
                        {Number(statistics.tong_doanh_thu || 0).toLocaleString("vi-VN")} đ
                      </p>
                      <p className="stats-progress" title="Tỷ lệ đạt mục tiêu doanh thu">
                        <span className="progress-bar" style={{ width: `${revenuePercentage}%` }}></span>
                        <span className="progress-text">{revenuePercentage.toFixed(1)}%</span>
                      </p>
                    </div>
                  </div>
                  <div className="stats-card">
                    <div className="card-icon">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="card-content">
                      <h3>Đơn hàng</h3>
                      <p className="stats-value">{orders.length || 0}</p>
                      <p className="stats-progress" title="Tỷ lệ đơn hàng đã thanh toán">
                        <span className="progress-bar" style={{ width: `${orderCompletionPercentage}%` }}></span>
                        <span className="progress-text">{orderCompletionPercentage.toFixed(1)}%</span>
                      </p>
                    </div>
                  </div>
                  <div className="stats-card">
                    <div className="card-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="card-content">
                      <h3>Người dùng</h3>
                      <p className="stats-value">{users.length || 0}</p>
                      <p className="stats-progress" title="Tỷ lệ người dùng hoạt động">
                        <span className="progress-bar" style={{ width: `${userActivePercentage}%` }}></span>
                        <span className="progress-text">{userActivePercentage.toFixed(1)}%</span>
                      </p>
                    </div>
                  </div>
                  <div className="stats-card">
                    <div className="card-icon">
                      <i className="fas fa-star"></i>
                    </div>
                    <div className="card-content">
                      <h3>Đánh giá</h3>
                      <p className="stats-value">{reviews.length || 0}</p>
                      <p className="stats-progress" title="Tỷ lệ đánh giá tích cực (≥ 4 sao)">
                        <span className="progress-bar" style={{ width: `${positiveReviewPercentage}%` }}></span>
                        <span className="progress-text">{positiveReviewPercentage.toFixed(1)}%</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="charts-container">
                  <div className="chart-card">
                    <h3>Doanh thu</h3>
                    <div className="chart-container" style={{ height: "300px" }}>
                      <Line
                        data={chartDataRevenue}
                        options={chartOptions(`Doanh thu - Tháng ${selectedMonth}/${selectedYear}`)}
                      />
                    </div>
                  </div>
                  <div className="chart-card">
                    <h3>Đơn hàng</h3>
                    <div className="chart-container" style={{ height: "300px" }}>
                      <Line
                        data={chartDataOrders}
                        options={chartOptions(`Đơn hàng - Tháng ${selectedMonth}/${selectedYear}`)}
                      />
                    </div>
                  </div>
                  <div className="chart-card">
                    <h3>Người dùng</h3>
                    <div className="chart-container" style={{ height: "300px" }}>
                      <Line
                        data={chartDataUsers}
                        options={chartOptions(`Người dùng hoạt động - Tháng ${selectedMonth}/${selectedYear}`)}
                      />
                    </div>
                  </div>
                  <div className="chart-card">
                    <h3>Đánh giá</h3>
                    <div className="chart-container" style={{ height: "300px" }}>
                      <Line
                        data={chartDataReviews}
                        options={chartOptions(`Đánh giá - Tháng ${selectedMonth}/${selectedYear}`)}
                      />
                    </div>
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
      case "home":
        return <HomeManager handleDelete={handleDelete} />;
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
                          onChange={(e) =>
                            updateOrderStatus(Number(order.id), e.target.value)
                          }
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
                            {user.is_active === 1 ? "Kích hoạt" : "Vô hiệu hóa"}
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
              <h2>Quản lý sản phẩm</h2>
              <div className="linh-kien-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-microchip"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{Object.values(linhKien).flat().length}</span>
                    <span className="stat-label">Tổng linh kiện</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-tags"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{loaiLinhKienList.length}</span>
                    <span className="stat-label">Danh mục</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="category-tabs">
              {loaiLinhKienList.map((loai) => (
                <button
                  key={loai}
                  className={`category-tab ${selectedLoaiTable === loai ? "active" : ""}`}
                  onClick={() => setSelectedLoaiTable(loai)}
                >
                  <i className={`fas fa-${getCategoryIcon(loai)}`}></i>
                  <span>{loai.toUpperCase()}</span>
                </button>
              ))}
            </div>
            <div className="add-component-card">
              <div className="card-header">
                <h3>Thêm linh kiện mới</h3>
                <button
                  className="add-button"
                  onClick={() => setIsAddFormVisible(!isAddFormVisible)}
                >
                  <i className="fas fa-plus-circle"></i> 
                  {isAddFormVisible ? "Ẩn biểu mẫu" : "Thêm linh kiện"}
                </button>
              </div>
              {isAddFormVisible && (
                <div className="add-form">
                  <div className="category-selector">
                    <label>Loại linh kiện:</label>
                    <select
                      value={newLinhKien.loai}
                      onChange={(e) => setNewLinhKien({ ...newLinhKien, loai: e.target.value })}
                      className="select-input"
                    >
                      {loaiLinhKienList.map((loai) => (
                        <option key={loai} value={loai}>
                          {loai.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
{getSampleKeys(linhKien, newLinhKien.loai).map((key) => (
  <div className="form-group" key={key}>
    <label htmlFor={`add-${key}`}>{getFieldLabel(key)}:</label>
    {key === "mo_ta" ? (
      <textarea
        id={`add-${key}`}
        placeholder={getFieldPlaceholder(key)}
        value={newLinhKien[key] || ""}
        onChange={(e) =>
          setNewLinhKien({ ...newLinhKien, [key]: e.target.value })
        }
      />
    ) : key === "gia" ? (
      <div className="price-input">
        <input
          id={`add-${key}`}
          type="number"
          placeholder={getFieldPlaceholder(key)}
          value={newLinhKien[key] || ""}
          onChange={(e) =>
            setNewLinhKien({ ...newLinhKien, [key]: e.target.value })
          }
        />
        <span className="price-suffix">VNĐ</span>
      </div>
    ) : (
      <input
        id={`add-${key}`}
        type={getInputType(key)}
        placeholder={getFieldPlaceholder(key)}
        value={newLinhKien[key] || ""}
        onChange={(e) =>
          setNewLinhKien({ ...newLinhKien, [key]: e.target.value })
        }
      />
    )}
  </div>
))}
<div className="form-actions">
  <button className="cancel-button" onClick={() => setIsAddFormVisible(false)}>
    <i className="fas fa-times"></i> Hủy
  </button>
  <button className="add-button" onClick={handleAddLinhKien}>
    <i className="fas fa-plus"></i> Thêm
  </button>
</div>
</div>
)}
</div>

{selectedLoaiTable && (
  <div className="component-table-container" ref={loaiRefs.current[selectedLoaiTable]}>
    <div className="table-header">
      <h3>
        Danh sách {selectedLoaiTable.charAt(0).toUpperCase() + selectedLoaiTable.slice(1)}
      </h3>
      <div className="table-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder={`Tìm kiếm ${selectedLoaiTable}...`}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
      </div>
    </div>
    {linhKien[selectedLoaiTable] && linhKien[selectedLoaiTable].length > 0 ? (
      <div className="table-responsive">
        <table className="components-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Hãng</th>
              <th>Giá bán</th>
              <th>Tồn kho</th>
              <th className="action-column">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {linhKien[selectedLoaiTable]
              .filter((item) =>
                Object.values(item).some((value) =>
                  value
                    ?.toString()
                    .toLowerCase()
                    .includes(searchKeyword.toLowerCase())
                )
              )
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.ten || "N/A"}</td>
                  <td>{item.hang || "N/A"}</td>
                  <td>{formatPrice(item.gia)}</td>
                  <td>{item.so_luong ? `${item.so_luong} cái` : "N/A"}</td>
                  <td className="action-column">
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => {
                          setEditLinhKien({ ...item, loai: selectedLoaiTable });
                          setIsEditModalOpen(true);
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(item.id, `${selectedLoaiTable}`, () =>
                            handleDeleteLinhKien(item.id, selectedLoaiTable)
                          )
                        }
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="empty-table-container">
        <div className="empty-table-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>Không có linh kiện nào trong danh mục này</p>
          <button
            className="add-first-button"
            onClick={() => setIsAddFormVisible(true)}
          >
            <i className="fas fa-plus"></i> Thêm linh kiện đầu tiên
          </button>
        </div>
      </div>
    )}
  </div>
)}
</div>
);
      case "contacts":
        return (
          <div>
            <h2>Quản lý Liên hệ</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Nội dung</th>
                  <th>Ngày gửi</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      Không có liên hệ nào
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>{contact.id}</td>
                      <td>{contact.ho_ten}</td>
                      <td>{contact.email}</td>
                      <td>{contact.so_dien_thoai}</td>
                      <td>{contact.noi_dung}</td>
                      <td>{contact.ngay_gui}</td>
                      <td>
                        <button
                          onClick={() =>
                            handleDelete(contact.id, "liên hệ", () =>
                              deleteContact(contact.id)
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
      default:
        return <div>Chọn một mục từ menu để xem nội dung</div>;
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
              className={`sidebar-button ${view === "home" ? "active" : ""}`}
              onClick={() => setView("home")}
            >
              <i className="fas fa-home"></i> Quản lý Giao Diện
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
          onSave={handleUpdateLinhKien}
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
