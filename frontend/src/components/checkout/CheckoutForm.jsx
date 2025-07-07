import React from "react";

const CheckoutForm = ({
    customerInfo,
    setCustomerInfo,
    formErrors,
    paymentMethod,
    setPaymentMethod,
    shippingMethod,
    setShippingMethod,
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleSubmit,
    handleResetForm,
    isProcessing,
    formRef,
}) => {
    const handleInputChange = (field, value) => {
        setCustomerInfo(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="checkout-form">
            <h3>Thông tin giao hàng</h3>
            
            <div className={`form-group ${formErrors.fullName ? "error" : ""}`}>
                <label htmlFor="fullName">Họ và tên *</label>
                <input
                    id="fullName"
                    type="text"
                    placeholder="Nhập họ và tên"
                    value={customerInfo.fullName || ""}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    required
                />
                {formErrors.fullName && <div className="error-text">{formErrors.fullName}</div>}
            </div>

            <div className={`form-group ${formErrors.email ? "error" : ""}`}>
                <label htmlFor="email">Email *</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    value={customerInfo.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                />
                {formErrors.email && <div className="error-text">{formErrors.email}</div>}
            </div>

            <div className={`form-group ${formErrors.phone ? "error" : ""}`}>
                <label htmlFor="phone">Số điện thoại *</label>
                <input
                    id="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    value={customerInfo.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                />
                {formErrors.phone && <div className="error-text">{formErrors.phone}</div>}
            </div>

            {shippingMethod === "ship" && (
                <>
                    <div className="form-row">
                        <div className={`form-group ${formErrors.city ? "error" : ""}`}>
                            <label htmlFor="city">Tỉnh/Thành phố *</label>
                            <select
                                id="city"
                                value={selectedProvince?.code || ""}
                                onChange={handleProvinceChange}
                                required
                                disabled={isLoadingProvinces}
                            >
                                <option value="">
                                    {isLoadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành phố"}
                                </option>
                                {provinces.map((province) => (
                                    <option key={province.code} value={province.code}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.city && <div className="error-text">{formErrors.city}</div>}
                        </div>

                        <div className={`form-group ${formErrors.district ? "error" : ""}`}>
                            <label htmlFor="district">Quận/Huyện *</label>
                            <select
                                id="district"
                                value={selectedDistrict?.code || ""}
                                onChange={handleDistrictChange}
                                required
                                disabled={!selectedProvince || isLoadingDistricts}
                            >
                                <option value="">
                                    {!selectedProvince
                                        ? "Chọn tỉnh/thành phố trước"
                                        : isLoadingDistricts
                                            ? "Đang tải..."
                                            : "Chọn quận/huyện"}
                                </option>
                                {districts.map((district) => (
                                    <option key={district.code} value={district.code}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.district && <div className="error-text">{formErrors.district}</div>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ward">Phường/Xã</label>
                        <select
                            id="ward"
                            value={customerInfo.wardCode || ""}
                            onChange={handleWardChange}
                            disabled={!selectedDistrict || isLoadingWards}
                        >
                            <option value="">
                                {!selectedDistrict
                                    ? "Chọn quận/huyện trước"
                                    : isLoadingWards
                                        ? "Đang tải..."
                                        : "Chọn phường/xã (không bắt buộc)"}
                            </option>
                            {wards.map((ward) => (
                                <option key={ward.code} value={ward.code}>
                                    {ward.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={`form-group ${formErrors.address ? "error" : ""}`}>
                        <label htmlFor="address">Địa chỉ cụ thể *</label>
                        <input
                            id="address"
                            type="text"
                            placeholder="Nhập số nhà, tên đường (ví dụ: 123 Đường Láng)"
                            value={customerInfo.address || ""}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            required
                        />
                        {formErrors.address && <div className="error-text">{formErrors.address}</div>}
                    </div>
                </>
            )}

            <div className="form-group">
                <label htmlFor="note">Ghi chú đơn hàng</label>
                <textarea
                    id="note"
                    placeholder="Nhập ghi chú nếu có..."
                    value={customerInfo.note || ""}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                    rows="3"
                />
            </div>
        </form>
    );
};

export default CheckoutForm;