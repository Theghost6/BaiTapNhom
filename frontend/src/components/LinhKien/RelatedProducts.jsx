import React from "react";

const RelatedProducts = ({ relatedProducts }) => {
    if (!relatedProducts || relatedProducts.length === 0) return null;
    return (
        <div className="related-products-section">
            <h2>Sản phẩm liên quan</h2>
            <div className="related-products-grid">
                {relatedProducts.map((relatedProduct) => (
                    <div className="related-product-card" key={relatedProduct.id}>
                        <a href={`/linh-kien/${relatedProduct.id}`} className="product-link">
                            <div className="product-image">
                                <img
                                    src={relatedProduct.images?.[0] || relatedProduct.hinh_anh || "/placeholder.jpg"}
                                    alt={relatedProduct.ten_sp || relatedProduct.ten_lk}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/placeholder.jpg";
                                    }}
                                />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{relatedProduct.ten_sp || relatedProduct.ten_lk}</h3>
                                {relatedProduct.gia_sau && (
                                    <div className="product-price">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(relatedProduct.gia_sau)}
                                    </div>
                                )}
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
