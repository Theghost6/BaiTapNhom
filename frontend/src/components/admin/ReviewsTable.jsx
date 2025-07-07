import React from "react";
import "./ReviewsTable.css";

function ReviewsTable({ reviews, viewReply, handleDelete, deleteReview, replies, selectedReview }) {
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
                                    <button onClick={() => viewReply(review.id)}>
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
            {selectedReview && (
                <div style={{ marginTop: 40 }}>
                    <h2>Phản hồi Đánh giá ID: {selectedReview}</h2>
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
            )}
        </div>
    );
}

export default ReviewsTable;
