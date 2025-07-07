// This file has been moved to src/components/LinhKien/ProductReviews.jsx

import React from "react";

const ProductReviews = ({ reviews, product, ...props }) => {
    if (!product) return null;
    return (
        <div className="product-reviews">
            <h3>Đánh giá sản phẩm</h3>
            {/* Render reviews here */}
            {reviews && reviews.length > 0 ? (
                reviews.map((review, idx) => (
                    <div key={idx} className="review-item">
                        <strong>{review.ten_nguoi_dung}</strong>: {review.binh_luan}
                    </div>
                ))
            ) : (
                <p>Chưa có đánh giá nào.</p>
            )}
        </div>
    );
};

export default ProductReviews;
