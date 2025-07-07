// This file has been moved to src/components/LinhKien/RelatedProducts.jsx

import React from "react";

const RelatedProducts = ({ relatedProducts }) => {
    if (!relatedProducts || relatedProducts.length === 0) return null;
    return (
        <div className="related-products">
            <h3>Sản phẩm liên quan</h3>
            <ul>
                {relatedProducts.map((item) => (
                    <li key={item.id}>
                        <img src={item.hinh_anh} alt={item.ten_lk} width={60} />
                        <span>{item.ten_lk}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RelatedProducts;
