import React from "react";

function ContactsTable({ contacts, handleDelete, deleteContact }) {
    return (
        <div>
            <h2>Quản lý Liên hệ</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Nội dung</th>
                        <th>Ngày gửi</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                Không có liên hệ nào
                            </td>
                        </tr>
                    ) : (
                        contacts.map((contact) => (
                            <tr key={contact.id}>
                                <td>{contact.id}</td>
                                <td>{contact.ten}</td>
                                <td>{contact.email}</td>
                                <td>{contact.sdt}</td>
                                <td>{contact.noi_dung}</td>
                                <td>{contact.thoi_gian_gui}</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(contact.id, "liên hệ", () => deleteContact(contact.id))}
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

export default ContactsTable;
