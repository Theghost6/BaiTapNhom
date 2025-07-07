import React from "react";

const ProductOverview = ({ product, showFullDescription, setShowFullDescription }) => {
    if (!product) return null;
    return (
        <div className="product-overview">
            <h2>{product.ten_sp || product.ten_lk || "Không xác định"}</h2>
            <img src={product.hinh_anh || (product.images && product.images[0])} alt={product.ten_sp || product.ten_lk} />
            <div className="product-info">
                <div className="info-row">
                    <span className="info-label">Thương hiệu:</span>
                    <span className="info-value">{product.thong_so?.hang_san_xuat || product.hang_san_xuat || "Không rõ"}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Bảo hành:</span>
                    <span className="info-value">{product.bao_hanh || "Không rõ"}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Ngày phát hành:</span>
                    <span className="info-value">{product.ngay_phat_hanh ? new Date(product.ngay_phat_hanh).toLocaleDateString("vi-VN") : "Không rõ"}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Thiết bị tương thích:</span>
                    <span className="info-value">{Array.isArray(product.thiet_bi_tuong_thich) ? product.thiet_bi_tuong_thich.join(", ") : (product.thiet_bi_tuong_thich || "Không có thông tin")}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Tính năng nổi bật:</span>
                    <span className="info-value">{Array.isArray(product.tinh_nang) ? product.tinh_nang.join(", ") : (product.tinh_nang || "Không có thông tin")}</span>
                </div>
            </div>
            <div className="product-description">
                <h3>Mô tả sản phẩm</h3>
                <div className="product-description-content">
                    {showFullDescription ? product.mo_ta : product.mo_ta?.slice(0, 400)}
                    {product.mo_ta && product.mo_ta.length > 400 && (
                        <span onClick={() => setShowFullDescription((v) => !v)} style={{ color: "blue", cursor: "pointer" }}>
                            {showFullDescription ? " Ẩn bớt" : " Xem thêm"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductOverview;
