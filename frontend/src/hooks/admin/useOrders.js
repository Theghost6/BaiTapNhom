/**
 * Custom hook dùng để lấy, quản lý và thao tác dữ liệu đơn hàng từ backend (MySQL).
 *
 * @param {string} apiUrl - Đường dẫn API backend (ví dụ: import.meta.env.VITE_HOST)
 * @param {any} trigger - Giá trị trigger (có thể là view, số lần reload, v.v.) để đồng bộ lại dữ liệu khi thay đổi. Nên truyền từ ngoài vào để tránh lặp request không cần thiết.
 *
 * @returns {
 *   orders: Array,                // Danh sách đơn hàng (mỗi đơn là object)
 *   orderItems: Object,           // Thông tin chi tiết sản phẩm của đơn hàng đang xem (nếu có)
 *   orderAddress: Object|null,    // Địa chỉ giao hàng của đơn hàng đang xem (nếu có)
 *   selectedOrder: number|null,   // ID đơn hàng đang xem chi tiết
 *   loading: boolean,             // Trạng thái loading khi fetch dữ liệu
 *   viewDetails: Function         // Hàm lấy chi tiết đơn hàng (id)
 * }
 *
 * HƯỚNG DẪN SỬ DỤNG:
 *
 * const { orders, orderItems, orderAddress, selectedOrder, loading, viewDetails } = useOrders(apiUrl, trigger);
 *
 * - Nên truyền trigger (ví dụ: view, hoặc số lần reload) từ ngoài vào để đồng bộ dữ liệu khi cần (ví dụ sau khi xóa/thêm/sửa đơn hàng).
 * - Khi gọi viewDetails(id), orderItems và orderAddress sẽ chứa thông tin chi tiết đơn hàng đó.
 * - loading: true khi đang tải dữ liệu đơn hàng.
 */
import { useEffect, useState } from "react";
import axios from "axios";

export default function useOrders(apiUrl, trigger) {
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState({});
    const [orderAddress, setOrderAddress] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${apiUrl}/api.php?action=get_orders`)
            .then((res) => {
                if (Array.isArray(res.data)) setOrders(res.data);
                else setOrders([]);
            })
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, [apiUrl, trigger]);

    /**
     * Lấy chi tiết đơn hàng (sản phẩm, địa chỉ) theo id. Kết quả sẽ được lưu vào orderItems, orderAddress, selectedOrder.
     * @param {number} id - ID đơn hàng cần xem chi tiết
     */
    const viewDetails = (id) => {
        axios
            .get(`${apiUrl}/api.php?action=get_order_detail&id=${id}`)
            .then((res) => {
                setOrderItems(res.data.items || {});
                setOrderAddress(res.data.address || null);
                setSelectedOrder(id);
            });
    };

    /**
     * Cập nhật trạng thái đơn hàng
     * @param {number} orderId - ID đơn hàng
     * @param {string} newStatus - Trạng thái mới
     * @param {Function} [cb] - Callback sau khi cập nhật
     */
    const updateOrderStatus = (orderId, newStatus, cb) => {
        axios
            .post(`${apiUrl}/api.php?action=update_order_status`, { id: orderId, trang_thai: newStatus })
            .then((res) => {
                if (res.data.success) {
                    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, trang_thai: newStatus } : o));
                    if (cb) cb(true);
                } else {
                    if (cb) cb(false);
                }
            })
            .catch(() => { if (cb) cb(false); });
    };

    return { orders, orderItems, orderAddress, selectedOrder, loading, viewDetails, updateOrderStatus };
}
