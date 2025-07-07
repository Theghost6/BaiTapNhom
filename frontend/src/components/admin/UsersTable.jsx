import React from "react";
import "./UsersTable.css";

function UsersTable({ users, loadingUsers, toggleUserStatus, handleDelete, deleteUser }) {
    return loadingUsers ? (
        <div className="loading">
            <div className="loading_spinner"></div>
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
                    users.map((user) => (
                        <tr key={user.phone}>
                            <td>{user.user}</td>
                            <td>{user.phone}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.is_active === 1 ? "Hoạt động" : "Vô hiệu hóa"}</td>
                            <td>
                                <button
                                    onClick={() => toggleUserStatus(user.phone, user.is_active)}
                                    className={user.is_active === 1 ? "button-yellow" : "button-green"}
                                    style={{ marginRight: 10 }}
                                >
                                    {user.is_active === 1 ? "Vô hiệu hóa" : "Kích hoạt"}
                                </button>
                                <button
                                    onClick={() => handleDelete(user.phone, "tài khoản", () => deleteUser(user.phone))}
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
    );
}

export default UsersTable;
