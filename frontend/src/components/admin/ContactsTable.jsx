import React from "react";
import "./CommonTable.css";

function ContactsTable({ contacts, handleDelete, deleteContact }) {
    const handleReply = (contact) => {
        // Tạo nội dung email mẫu
        const subject = `Phản hồi: Liên hệ từ ${contact.ten}`;
        const body = `Kính chào ${contact.ten},

Cảm ơn bạn đã liên hệ với Nhóm 8. Chúng tôi đã nhận được tin nhắn của bạn:

"${contact.noi_dung}"

Phản hồi của chúng tôi:
[Vui lòng nhập nội dung phản hồi tại đây]

Trân trọng,
Đội ngũ hỗ trợ Nhóm 8
Email: nhom8$sh3.com
Hotline: không có đâu hẹ hẹ`;

        // Tạo Gmail compose URL
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contact.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Mở Gmail trong tab mới
        window.open(gmailUrl, '_blank');
    };
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
                                            onClick={() => handleReply(contact)}
                                            className="table-btn btn-primary"
                                            title="Phản hồi qua Gmail"
                                        >
                                            <i className="fas fa-reply"></i>
                                            <span>Phản hồi</span>
                                        </button>
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
