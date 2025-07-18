import React from "react";
import "./CommonTable.css";

function ContactsTable({ contacts, handleDelete, deleteContact }) {
    return (
        <div className="table-container">
            <div className="table-scroll-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="id-column">ID</th>
                            <th className="name-column">Họ tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th className="description-column">Nội dung</th>
                            <th className="date-column">Ngày gửi</th>
                            <th className="actions-column">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="table-empty">
                                    Không có liên hệ nào
                                </td>
                            </tr>
                        ) : (
                            contacts.map((contact) => (
                                <tr key={contact.id}>
                                    <td className="id-column">{contact.id}</td>
                                    <td className="name-column">{contact.ten}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.sdt}</td>
                                    <td className="description-column">{contact.noi_dung}</td>
                                    <td className="date-column">{contact.thoi_gian_gui}</td>
                                    <td className="actions-column">
                                        <button
                                            onClick={() => handleDelete(contact.id, "liên hệ", () => deleteContact(contact.id))}
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

export default ContactsTable;
