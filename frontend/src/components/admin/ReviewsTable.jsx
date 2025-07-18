import React, { useState } from "react";
import "./CommonTable.css";
import ReviewReplyModal from "./ReviewReplyModal";

function ReviewsTable({ reviews, viewReply, handleDelete, deleteReview, replies, selectedReview }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalReviewId, setModalReviewId] = useState(null);

    // Khi ấn xem phản hồi, vừa gọi viewReply vừa mở modal
    const handleViewReply = (reviewId) => {
        viewReply(reviewId);
        setModalReviewId(reviewId);
        setModalOpen(true);
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div className="table-container">
            <div className="table-scroll-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th className="id-column">ID</th>
                            <th className="id-column">Mã sản phẩm</th>
                            <th className="name-column">Người đánh giá</th>
                            <th>Số sao</th>
                            <th className="description-column">Bình luận</th>
                            <th className="date-column">Ngày</th>
                            <th className="actions-column">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="table-empty">
                                    Không có đánh giá nào
                                </td>
                            </tr>
                        ) : (
                            reviews.map((review) => (
                                <tr key={review.id}>
                                    <td className="id-column">{review.id}</td>
                                    <td className="id-column">{review.ma_sp}</td>
                                    <td className="name-column">{review.ten_nguoi_dung}</td>
                                    <td>
                                        <span className={`status-badge ${review.so_sao >= 4 ? 'success' : review.so_sao >= 3 ? 'warning' : 'error'}`}>
                                            {renderStars(review.so_sao)} ({review.so_sao})
                                        </span>
                                    </td>
                                    <td className="description-column">{review.binh_luan || review.noi_dung || ''}</td>
                                    <td className="date-column">{review.created_at}</td>
                                    <td className="actions-column">
                                        <button
                                            onClick={() => handleViewReply(review.id)}
                                            className="table-btn btn-primary"
                                        >
                                            <i className="fas fa-reply"></i>
                                            <span>Xem phản hồi</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(review.id, "đánh giá", () => deleteReview(review.id))}
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
            <ReviewReplyModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                replies={replies}
                reviewId={modalReviewId}
            />
        </div>
    );
}

export default ReviewsTable;
