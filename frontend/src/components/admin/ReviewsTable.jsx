import React, { useState } from "react";
import "./ReviewsTable.css";
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
    return (
        <div className="reviews-table-container">
            <h2>Quản lý Đánh giá</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Mã sản phẩm</th>
                        <th>Người đánh giá</th>
                        <th>Số sao</th>
                        <th>Bình luận</th>
                        <th>Ngày</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                Không có đánh giá nào
                            </td>
                        </tr>
                    ) : (
                        reviews.map((review) => (
                            <tr key={review.id}>
                                <td>{review.id}</td>
                                <td>{review.ma_sp}</td>
                                <td>{review.ten_nguoi_dung}</td>
                                <td>{review.so_sao} ★</td>
                                <td>{review.binh_luan || review.noi_dung || ''}</td>
                                <td>{review.created_at}</td>
                                <td>
                                    <button onClick={() => handleViewReply(review.id)}>
                                        Xem phản hồi
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id, "đánh giá", () => deleteReview(review.id))}
                                        className="button-red"
                                        style={{ marginLeft: 10 }}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
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
