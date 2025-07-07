import React from "react";
import "./admin.css";
import "./FavoritesTable.css";

function FavoritesTable({ favorites, mostFavorited }) {
    // Tìm sản phẩm được yêu thích nhiều nhất dựa trên ma_sp
    const mostFavoritedCount = mostFavorited && favorites.filter(f => f.ma_sp === mostFavorited.ma_sp).length;
    return (
        <div>
            <h2>Quản lý Yêu thích</h2>
            {mostFavorited && (
                <div className="most-favorited-card" style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "5px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <h3>Sản phẩm được yêu thích nhiều nhất</h3>
                    <p><strong>Tên sản phẩm:</strong> {mostFavorited.ten_san_pham || "Không xác định"}</p>
                    <p><strong>Mã sản phẩm:</strong> {mostFavorited.ma_sp}</p>
                    <p><strong>Số lần yêu thích:</strong> {mostFavoritedCount}</p>
                </div>
            )}
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Mã sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Ngày thêm</th>
                    </tr>
                </thead>
                <tbody>
                    {favorites.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>
                                Không có sản phẩm yêu thích nào
                            </td>
                        </tr>
                    ) : (
                        favorites.map((favorite) => (
                            <tr key={favorite.id}>
                                <td>{favorite.id}</td>
                                <td>{favorite.ma_sp}</td>
                                <td>{favorite.ten_san_pham || "Không xác định"}</td>
                                <td>{favorite.created_at}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default FavoritesTable;
