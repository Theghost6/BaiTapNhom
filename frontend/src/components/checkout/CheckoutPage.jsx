import React, { useContext } from "react";
import { useCheckout } from "../../hooks/checkout/useCheckout";
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";
import { AuthContext } from "../../page/function/AuthContext";
import { useNavigate } from "react-router-dom";
import "./css/layout.css";
import "./css/cart.css";
import "./css/form.css";
import "./css/method.css";
import "./css/button.css";

const CheckoutPage = () => {
    const checkout = useCheckout();
    const { isAuthenticated, user } = useContext(AuthContext) || {};
    const navigate = useNavigate();
    
    // Kiểm tra role admin
    if (isAuthenticated && user?.role === 'admin') {
        return (
            <div className="checkout-page">
                <div className="error-message global-error">
                    Tài khoản admin không được phép truy cập trang thanh toán!
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button onClick={() => navigate('/')} className="btn btn-primary">
                        Về trang chủ
                    </button>
                </div>
            </div>
        );
    }
    
    // Kiểm tra nếu checkout hook chưa sẵn sàng
    if (!checkout) {
        return (
            <div className="checkout-page">
                <div className="loading-message">
                    Đang tải thông tin đơn hàng...
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            {checkout.error && (
                <div className="error-message global-error">
                    {checkout.error}
                </div>
            )}
            
            <div className="checkout-container">
                <div className="checkout-form-container">
                    <CheckoutForm
                        customerInfo={checkout.customerInfo}
                        setCustomerInfo={checkout.setCustomerInfo}
                        formErrors={checkout.formErrors}
                        paymentMethod={checkout.paymentMethod}
                        setPaymentMethod={checkout.setPaymentMethod}
                        shippingMethod={checkout.shippingMethod}
                        setShippingMethod={checkout.setShippingMethod}
                        provinces={checkout.provinces}
                        districts={checkout.districts}
                        wards={checkout.wards}
                        selectedProvince={checkout.selectedProvince}
                        selectedDistrict={checkout.selectedDistrict}
                        isLoadingProvinces={checkout.isLoadingProvinces}
                        isLoadingDistricts={checkout.isLoadingDistricts}
                        isLoadingWards={checkout.isLoadingWards}
                        handleProvinceChange={checkout.handleProvinceChange}
                        handleDistrictChange={checkout.handleDistrictChange}
                        handleWardChange={checkout.handleWardChange}
                        handleSubmit={checkout.handleSubmit}
                        handleResetForm={checkout.handleResetForm}
                        isProcessing={checkout.isProcessing}
                        formRef={checkout.formRef}
                    />
                </div>
                
                <div className="checkout-summary-container">
                    <CheckoutSummary
                        finalCartItems={checkout.finalCartItems}
                        finalTotalAmount={checkout.finalTotalAmount}
                        totalQuantity={checkout.totalQuantity}
                        shippingCost={checkout.shippingCost || 0}
                        orderTotal={checkout.orderTotal || checkout.finalTotalAmount}
                        shippingMethod={checkout.shippingMethod}
                        paymentMethod={checkout.paymentMethod}
                        setShippingMethod={checkout.setShippingMethod}
                        setPaymentMethod={checkout.setPaymentMethod}
                        isProcessing={checkout.isProcessing}
                        error={checkout.error}
                        formatCurrency={checkout.formatCurrency}
                        handleSubmit={checkout.handleSubmit}
                        handleResetForm={checkout.handleResetForm}
                        formRef={checkout.formRef}
                    />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;