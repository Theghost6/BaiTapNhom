import React from "react";
import "./ReviewsTable.css";

function ReviewReplyModal({ isOpen, onClose, replies, reviewId }) {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay modal-open" style={{ zIndex: 2000 }}>
            <div className="modal-content" style={{ maxWidth: 500, width: '95vw', maxHeight: '80vh', overflowY: 'auto' }}>
                <h2>Phản hồi Đánh giá ID: {reviewId}</h2>
                <button style={{ position: 'absolute', top: 10, right: 10 }} onClick={onClose} className="cancel-button">
                    <i className="fas fa-times"></i> Đóng
                </button>
                {replies.length === 0 ? (
                    <p>Không có phản hồi nào.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Người phản hồi</th>
                                <th>Nội dung</th>
                                <th>Ngày</th>
                            </tr>
                        </thead>
                        <tbody>
                            {replies.map((reply, index) => (
                                <tr key={index}>
                                    <td>{reply.ten_nguoi_tra_loi}</td>
                                    <td>{reply.noi_dung || ''}</td>
                                    <td>{reply.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ReviewReplyModal;
