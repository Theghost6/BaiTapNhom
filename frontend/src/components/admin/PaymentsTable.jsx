import React from "react";
import "./CommonTable.css";

function PaymentsTable({ payments }) {
    return (
        <div className="table-container">
            <div className="table-scroll-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="id-column">ID</th>
                            <th className="id-column">Mã đơn hàng</th>
                            <th>Phương thức thanh toán</th>
                            <th className="price-column">Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th className="date-column">Thời gian thanh toán</th>
                            <th className="date-column">Thời gian cập nhật</th>
                            <th>Mã giao dịch</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="table-empty">
                                    Không có thanh toán nào
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="id-column">{payment.id}</td>
                                    <td className="id-column">{payment.ma_don_hang}</td>
                                    <td>{payment.phuong_thuc}</td>
                                    <td className="price-column">{Number(payment.tong_so_tien || payment.tong_tien || 0).toLocaleString("vi-VN")} đ</td>
                                    <td>
                                        <span className={`status-badge ${payment.trang_thai_thanh_toan || payment.trang_thai === 'Đã thanh toán' ? 'success' : 'pending'}`}>
                                            {payment.trang_thai_thanh_toan || payment.trang_thai}
                                        </span>
                                    </td>
                                    <td className="date-column">
                                        {payment.thoi_gian_thanh_toan && payment.thoi_gian_thanh_toan !== '0000-00-00 00:00:00'
                                            ? new Date(payment.thoi_gian_thanh_toan).toLocaleString('vi-VN')
                                            : "Chưa thanh toán"}
                                    </td>
                                    <td className="date-column">{payment.thoi_gian_cap_nhat ? new Date(payment.thoi_gian_cap_nhat).toLocaleString('vi-VN') : 'N/A'}</td>
                                    <td>{payment.ma_giao_dich || "N/A"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PaymentsTable;
