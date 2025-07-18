import React from "react";
import "./OrdersTable.css";

function OrdersTable({ orders, updateOrderStatus, handleViewOrderDetails }) {
    return (
        <div>
            <h2>Danh sách Đơn hàng</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Mã người dùng</th>
                        <th>Tên người dùng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Ngày đặt</th>
                        <th>Cập nhập</th>
                        <th>Ghi chú</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="9" style={{ textAlign: "center" }}>
                                Không có đơn hàng nào
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.ma_nguoi_dung}</td>
                                <td>{order.ten_nguoi_dung}</td>
                                <td>{Number(order.tong_tien).toLocaleString("vi-VN")} đ</td>
                                <td>
                                    <select
                                        value={order.trang_thai}
                                        onChange={(e) => updateOrderStatus(Number(order.id), e.target.value)}
                                    >
                                        <option value="Chưa thanh toán">Chưa thanh toán</option>
                                        <option value="Đã thanh toán">Đã thanh toán</option>
                                        <option value="Đang giao">Đang giao</option>
                                        <option value="Hoàn thành">Hoàn thành</option>
                                        <option value="Đã hủy">Đã hủy</option>
                                    </select>
                                </td>
                                <td>{order.created_at}</td>
                                <td>{order.updated_at}</td>
                                <td>{order.ghi_chu || "Không có"}</td>
                                <td>
                                    <button onClick={() => handleViewOrderDetails(order.id)}>
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default OrdersTable;
