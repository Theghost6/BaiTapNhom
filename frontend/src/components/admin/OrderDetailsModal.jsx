import React from "react";
import "./OrderDetailsModal.css";

function OrderDetailsModal({ isOpen, onClose, orderId, orderItems, orderAddress }) {
    if (!isOpen) return null;

    // Function to format address if it exists
    const renderAddress = () => {
        if (!orderAddress) return "Không có thông tin địa chỉ";

        // If address is a string, just display it
        if (typeof orderAddress === 'string') return orderAddress;

        // If address is an object, format it properly
        return (
            <>
                <p><strong>Người nhận:</strong> {orderAddress.nguoi_nhan || "N/A"}</p>
                <p><strong>SĐT:</strong> {orderAddress.sdt_nhan || "N/A"}</p>
                <p><strong>Địa chỉ:</strong> {[
                    orderAddress.dia_chi,
                    orderAddress.phuong_xa,
                    orderAddress.quan_huyen,
                    orderAddress.tinh_thanh
                ].filter(Boolean).join(', ')}</p>
            </>
        );
    };

    return (
        <div className="modal-overlay modal-open">
            <div className="modal-content">
                <h2>Chi tiết đơn hàng #{orderId}</h2>
                <div className="order-details-section">
                    <h3>Địa chỉ giao hàng</h3>
                    <div className="address-details">
                        {renderAddress()}
                    </div>
                </div>
                <div className="order-details-section">
                    <h3>Sản phẩm</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems && orderItems.length > 0 ? (
                                orderItems.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.ten_san_pham || item.ten || "N/A"}</td>
                                        <td>{item.so_luong || 1}</td>
                                        <td>{Number(item.thanh_tien || 0).toLocaleString("vi-VN")} đ</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">Không có sản phẩm</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={onClose}>
                        <i className="fas fa-times"></i> Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailsModal;