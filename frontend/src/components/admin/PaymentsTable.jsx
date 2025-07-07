import React from "react";
import "./PaymentsTable.css";

function PaymentsTable({ payments, handleDelete, deletePayment }) {
    return (
        <div className="payments-table-container">
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
                        <th>Thời gian cập nhật</th>
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
                                <td>{payment.phuong_thuc}</td>
                                <td>{Number(payment.tong_so_tien || payment.tong_tien || 0).toLocaleString("vi-VN")} đ</td>
                                <td>{payment.trang_thai_thanh_toan || payment.trang_thai}</td>
                                <td>{payment.thoi_gian_thanh_toan || "Chưa thanh toán"}</td>
                                <td>{payment.thoi_gian_cap_nhat}</td>
                                <td>{payment.ma_giao_dich || "N/A"}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(payment.id, "thanh toán", () => deletePayment(payment.id))}
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
}

export default PaymentsTable;
