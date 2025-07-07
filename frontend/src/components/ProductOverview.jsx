// This file has been moved to src/components/LinhKien/ProductOverview.jsx

import React from "react";

const ProductOverview = ({ product, showFullDescription, setShowFullDescription }) => {
    if (!product) return null;
    return (
        <div className="product-overview">
            <h2>{product.ten_lk}</h2>
            <img src={product.hinh_anh} alt={product.ten_lk} />
            <p>
                {showFullDescription ? product.mo_ta : product.mo_ta?.slice(0, 200)}
                {product.mo_ta && product.mo_ta.length > 200 && (
                    <span onClick={() => setShowFullDescription((v) => !v)} style={{ color: "blue", cursor: "pointer" }}>
                        {showFullDescription ? " Ẩn bớt" : " Xem thêm"}
                    </span>
                )}
            </p>
        </div>
    );
};

export default ProductOverview;
