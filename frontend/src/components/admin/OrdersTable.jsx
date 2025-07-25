import React from "react";
import "./CommonTable.css";

function OrdersTable({ orders, updateOrderStatus, handleViewOrderDetails }) {
    return (
        <div className="table-container">
            <div className="table-scroll-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="id-column">ID</th>
                            <th className="id-column">Mã người dùng</th>
                            <th className="name-column">Tên người dùng</th>
                            <th className="price-column">Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th className="date-column">Ngày đặt</th>
                            <th className="date-column">Cập nhật</th>
                            <th>Ghi chú</th>
                            <th className="actions-column">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="table-empty">
                                    Không có đơn hàng nào
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="id-column">{order.id}</td>
                                    <td className="id-column">{order.ma_nguoi_dung}</td>
                                    <td className="name-column">{order.ten_nguoi_dung}</td>
                                    <td className="price-column">{Number(order.tong_tien).toLocaleString("vi-VN")} đ</td>
                                    <td>
                                        <select
                                            value={order.trang_thai}
                                            onChange={(e) => updateOrderStatus(Number(order.id), e.target.value)}
                                            className="table-select"
                                            disabled={order.trang_thai === "Đã thanh toán"}
                                        >
                                            <option value="Chưa thanh toán">Chưa thanh toán</option>
                                            <option value="Đã thanh toán">Đã thanh toán</option>
                                            <option value="Đang giao">Đang giao</option>
                                            <option value="Đã hủy">Đã hủy</option>
                                        </select>
                                    </td>
                                    <td className="date-column">{order.created_at}</td>
                                    <td className="date-column">{order.updated_at}</td>
                                    <td>{order.ghi_chu || "Không có"}</td>
                                    <td className="actions-column">
                                        <button
                                            onClick={() => handleViewOrderDetails(order.id)}
                                            className="table-btn btn-primary"
                                        >
                                            <i className="fas fa-eye"></i>
                                            <span>Chi tiết</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrdersTable;
