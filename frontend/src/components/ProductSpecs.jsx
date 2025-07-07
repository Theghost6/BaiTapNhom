// This file has been moved to src/components/LinhKien/ProductSpecs.jsx

import React from "react";

const ProductSpecs = ({ product }) => {
    if (!product) return null;
    return (
        <div className="product-specs">
            <h3>Thông số kỹ thuật</h3>
            <ul>
                {Object.entries(product.thong_so || {}).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductSpecs;
