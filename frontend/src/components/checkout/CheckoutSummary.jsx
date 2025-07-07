import React from "react";

const CheckoutSummary = ({
    finalCartItems,
    finalTotalAmount,
    totalQuantity,
    shippingCost,
    orderTotal,
    shippingMethod,
    paymentMethod,
    setShippingMethod,
    setPaymentMethod,
    isProcessing,
    error,
    formatCurrency,
    handleSubmit,
    handleResetForm,
    formRef,
}) => {
    const handleOrderSubmit = (e) => {
        e.preventDefault();
        if (formRef.current) {
            // Trigger form validation and submission
            const formEvent = new Event('submit', { cancelable: true, bubbles: true });
            formRef.current.dispatchEvent(formEvent);
        }
    };

    return (
        <div className="checkout-summary">
            <h3>Đơn hàng của bạn</h3>
            
            <div className="cart-items">
                {finalCartItems && finalCartItems.length > 0 ? (
                    <>
                        <div className="cart-items-list">
                            {finalCartItems.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="cart-item">
                                    <div className="item-image-name">
                                        {item.images && (
                                            <img
                                                src={item.images}
                                                alt={item.ten_sp}
                                                className="item-thumbnail"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/placeholder.jpg";
                                                }}
                                            />
                                        )}
                                        <div className="item-details">
                                            <span className="item-name">{item.ten_sp}</span>
                                            <span className="item-price">{formatCurrency(item.gia_sau)}</span>
                                        </div>
                                    </div>
                                    <div className="item-quantity">
                                        <span>SL: {item.so_luong}</span>
                                    </div>
                                    <div className="item-total">
                                        {formatCurrency(item.gia_sau * item.so_luong)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-totals">
                            <div className="totals-row">
                                <span>Tạm tính:</span>
                                <span>{formatCurrency(finalTotalAmount)}</span>
                            </div>
                            <div className="totals-row">
                                <span>Tổng số lượng:</span>
                                <span>{totalQuantity}</span>
                            </div>
                            <div className="totals-row">
                                <span>Phí vận chuyển:</span>
                                <span>
                                    {shippingCost === 0
                                        ? "Miễn phí"
                                        : formatCurrency(shippingCost)}
                                </span>
                            </div>
                            {shippingCost === 0 && shippingMethod === "ship" && (
                                <div className="shipping-note">
                                    <small>
                                        Miễn phí vận chuyển cho đơn hàng trên 10.000.000₫
                                    </small>
                                </div>
                            )}
                            <div className="totals-row grand-total">
                                <span>Tổng thanh toán:</span>
                                <span>{formatCurrency(orderTotal)}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-cart-message">
                        <p>Không có sản phẩm nào trong giỏ hàng</p>
                    </div>
                )}
            </div>

            <div className="shipping-section">
                <h3>Phương thức vận chuyển</h3>
                <div className="shipping-methods">
                    <div className="shipping-option">
                        <input
                            type="radio"
                            id="ship"
                            name="shipping"
                            value="ship"
                            checked={shippingMethod === "ship"}
                            onChange={() => setShippingMethod("ship")}
                        />
                        <label htmlFor="ship">
                            <span className="shipping-icon">🚚</span>
                            <span>Giao hàng tận nơi</span>
                        </label>
                    </div>
                    <div className="shipping-option">
                        <input
                            type="radio"
                            id="pickup"
                            name="shipping"
                            value="pickup"
                            checked={shippingMethod === "pickup"}
                            onChange={() => setShippingMethod("pickup")}
                        />
                        <label htmlFor="pickup">
                            <span className="shipping-icon">🏬</span>
                            <span>Đến lấy tại cửa hàng</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="payment-section">
                <h3>Phương thức thanh toán</h3>
                <div className="payment-methods">
                    <div className="payment-option">
                        <input
                            type="radio"
                            id="cod"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === "cod"}
                            onChange={() => setPaymentMethod("cod")}
                        />
                        <label htmlFor="cod">
                            <span className="payment-icon">💵</span>
                            <span>Thanh toán khi nhận hàng (COD)</span>
                        </label>
                    </div>
                    <div className="payment-option">
                        <input
                            type="radio"
                            id="vnpay"
                            name="payment"
                            value="vnpay"
                            checked={paymentMethod === "vnpay"}
                            onChange={() => setPaymentMethod("vnpay")}
                        />
                        <label htmlFor="vnpay">
                            <span className="payment-icon">💳</span>
                            <span>VNPay (Thẻ ATM/Visa/Master/JCB)</span>
                        </label>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="form-actions">
                <button
                    type="button"
                    className="checkout-button"
                    onClick={handleOrderSubmit}
                    disabled={isProcessing || !finalCartItems || finalCartItems.length === 0}
                    title={!finalCartItems || finalCartItems.length === 0 ? "Giỏ hàng trống" : ""}
                >
                    {isProcessing ? (
                        <>
                            <span className="spinner"></span> Đang xử lý...
                        </>
                    ) : (
                        "Đặt hàng"
                    )}
                </button>
                <button
                    type="button"
                    className="reset-button"
                    onClick={handleResetForm}
                    disabled={isProcessing}
                    title="Xóa toàn bộ thông tin đã nhập"
                >
                    Nhập lại
                </button>
            </div>
        </div>
    );
};

export default CheckoutSummary;