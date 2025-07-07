import React from "react";

const ProductReviews = ({
    reviews,
    product,
    newReview,
    setNewReview,
    isSubmitting,
    setIsSubmitting,
    replyForms,
    setReplyForms,
    isSubmittingReply,
    setIsSubmittingReply,
    canReview,
    purchaseDebug,
    isAuthenticated,
    user,
    navigate,
    toast,
    handleReviewChange,
    handleSubmitReview,
    toggleReplyForm,
    handleReplyChange,
    handleSubmitReply
}) => {
    if (!product) return null;
    const averageRating =
        reviews && reviews.length > 0
            ? (
                reviews.reduce((total, review) => total + review.so_sao, 0) /
                reviews.length
            ).toFixed(1)
            : 0;
    return (
        <div className="review-tab">
            <div className="review-summary">
                <div className="rating-overview">
                    <div className="average-rating">
                        <span className="big-rating">{averageRating}</span>
                        <div className="stars">{"⭐".repeat(Math.round(averageRating))}</div>
                        <span className="total-reviews">Dựa trên {reviews.length} đánh giá</span>
                    </div>
                    <div className="rating-bars">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = reviews?.filter((r) => r.so_sao === stars).length || 0;
                            const percentage =
                                reviews?.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                            return (
                                <div className="rating-bar-row" key={stars}>
                                    <span className="star-label" aria-label={`${stars} stars`}>
                                        {stars} sao
                                    </span>
                                    <div
                                        className="bar-container"
                                        role="progressbar"
                                        aria-valuenow={percentage}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <span className="bar-percent">{percentage}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="add-review-section">
                <h4>Thêm đánh giá của bạn</h4>
                {canReview ? (
                    <form onSubmit={handleSubmitReview} className="review-form">
                        <div className="rating-input">
                            <label htmlFor="so_sao">Đánh giá của bạn:</label>
                            <select
                                id="so_sao"
                                name="so_sao"
                                value={newReview.so_sao}
                                onChange={handleReviewChange}
                            >
                                <option value="5">5 sao ⭐⭐⭐⭐⭐</option>
                                <option value="4">4 sao ⭐⭐⭐⭐</option>
                                <option value="3">3 sao ⭐⭐⭐</option>
                                <option value="2">2 sao ⭐⭐</option>
                                <option value="1">1 sao ⭐</option>
                            </select>
                        </div>
                        <div className="comment-input">
                            <label htmlFor="binh_luan">Nhận xét của bạn:</label>
                            <textarea
                                id="binh_luan"
                                name="binh_luan"
                                rows="4"
                                value={newReview.binh_luan}
                                onChange={handleReviewChange}
                                placeholder="Chia sẻ ý kiến của bạn về sản phẩm..."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="submit-review-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                        </button>
                    </form>
                ) : (
                    <div className="review-warning" style={{ color: 'red', margin: '12px 0' }}>
                        Bạn chỉ có thể đánh giá khi đã mua sản phẩm này!
                    </div>
                )}
            </div>
            <div className="review-list">
                <h4>Đánh giá từ khách hàng ({reviews.length})</h4>
                {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div className="review-item" key={review.id}>
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <div className="avatar">{typeof review.ten_nguoi_dung === "string" && review.ten_nguoi_dung.length > 0 ? review.ten_nguoi_dung.charAt(0).toUpperCase() : (review.ma_nguoi_dung ? String(review.ma_nguoi_dung).charAt(0) : "?")}</div>
                                    <div className="name-date">
                                        <strong>{review.ten_nguoi_dung || review.email || review.ma_nguoi_dung || "Ẩn danh"}</strong>
                                        <span className="review-date">{review.ngay}</span>
                                    </div>
                                </div>
                                <div className="review-stars">{"⭐".repeat(review.so_sao)}</div>
                            </div>
                            <div className="review-body">
                                <p className="review-comment">{review.binh_luan}</p>
                            </div>
                            {review.replies && review.replies.length > 0 && (
                                <div className="review-replies">
                                    <h5>Phản hồi:</h5>
                                    {review.replies.map((reply) => (
                                        <div className="reply-item" key={reply.id}>
                                            <div className="reply-header">
                                                <div className="avatar reply-avatar">
                                                    {reply.avatarUrl ? (
                                                        <img src={reply.avatarUrl} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                                    ) : (
                                                        typeof reply.ten_nguoi_tra_loi === "string" && reply.ten_nguoi_tra_loi.length > 0
                                                            ? reply.ten_nguoi_tra_loi.charAt(0).toUpperCase()
                                                            : (reply.ma_nguoi_tra_loi ? String(reply.ma_nguoi_tra_loi).charAt(0) : "?")
                                                    )}
                                                </div>
                                                <div className="name-date">
                                                    <strong>{reply.ten_nguoi_tra_loi || reply.email || reply.ma_nguoi_tra_loi || "Ẩn danh"}</strong>
                                                    <span className="reply-date">{reply.ngay}</span>
                                                </div>
                                            </div>
                                            <p className="reply-content">{reply.noi_dung}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="reply-action">
                                <button
                                    className="reply-button"
                                    onClick={() => toggleReplyForm(review.id)}
                                >
                                    {replyForms[review.id]?.isOpen ? "Hủy" : "Phản hồi"}
                                </button>
                                {replyForms[review.id]?.isOpen && (
                                    <form
                                        className="reply-form"
                                        onSubmit={(e) => handleSubmitReply(e, review.id)}
                                    >
                                        <textarea
                                            value={replyForms[review.id]?.noi_dung || ""}
                                            onChange={(e) => handleReplyChange(review.id, e.target.value)}
                                            placeholder="Nhập phản hồi của bạn..."
                                            rows="3"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="submit-reply-btn"
                                            disabled={isSubmittingReply[review.id]}
                                        >
                                            {isSubmittingReply[review.id] ? "Đang gửi..." : "Gửi phản hồi"}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-reviews">
                        <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                        <p>Hãy là người đầu tiên đánh giá!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
