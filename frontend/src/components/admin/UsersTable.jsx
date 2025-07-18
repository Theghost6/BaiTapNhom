import React from "react";
import "./CommonTable.css";

function UsersTable({ users, loadingUsers, toggleUserStatus, handleDelete, deleteUser }) {
    return loadingUsers ? (
        <div className="table-loading">
            <div className="table-loading-spinner"></div>
        </div>
    ) : (
        <div className="table-container">
            <div className="table-scroll-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="name-column">Tên đăng nhập</th>
                            <th className="id-column">Số điện thoại</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th className="actions-column">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!Array.isArray(users) || users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="table-empty">
                                    {users.length === 0 ? "Không tìm thấy tài khoản nào phù hợp" : "Không có tài khoản nào"}
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.phone}>
                                    <td className="name-column">{user.user}</td>
                                    <td className="id-column">{user.phone}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`status-badge ${user.role === 'admin' ? 'warning' : 'success'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.is_active === 1 ? 'success' : 'error'}`}>
                                            {user.is_active === 1 ? "Hoạt động" : "Vô hiệu hóa"}
                                        </span>
                                    </td>
                                    <td className="actions-column">
                                        <button
                                            onClick={() => toggleUserStatus(user.phone, user.is_active)}
                                            className={`table-btn ${user.is_active === 1 ? "btn-warning" : "btn-success"}`}
                                        >
                                            <i className={`fas ${user.is_active === 1 ? "fa-ban" : "fa-check"}`}></i>
                                            <span>{user.is_active === 1 ? "Vô hiệu hóa" : "Kích hoạt"}</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.phone, "tài khoản", () => deleteUser(user.phone))}
                                            className="table-btn btn-danger"
                                        >
                                            <i className="fas fa-trash"></i>
                                            <span>Xóa</span>
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

export default UsersTable;
