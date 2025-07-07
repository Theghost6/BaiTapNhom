import React from "react";
import "./HomeManager.css";


function HomeManager({ products = [], handleDelete }) {
    return (
        <div className="linh-kien-manager">
            <h2>Quản lý Linh kiện</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Mã sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>Không có sản phẩm nào</td>
                        </tr>
                    ) : (
                        products.map((sp) => (
                            <tr key={sp.id}>
                                <td>{sp.id}</td>
                                <td>{sp.ma_sp}</td>
                                <td>{sp.ten_sp}</td>
                                <td>{sp.gia_sau}</td>
                                <td>{sp.so_luong}</td>
                                <td>
                                    <button onClick={() => handleDelete(sp.id)}>Xóa</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default HomeManager;
