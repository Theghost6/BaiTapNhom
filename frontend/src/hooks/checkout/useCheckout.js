import { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../cart/useCart";
import { AuthContext } from "../../page/function/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_HOST;

// Constants
const MAX_TOTAL_ALLOWED = 99999999.99;
const DEFAULT_SHIPPING_COST = 30000;
const FREE_SHIPPING_THRESHOLD = 10000000;

// API endpoints
const API_ENDPOINTS = {
    PROVINCES: 'https://provinces.open-api.vn/api/p/',
    DISTRICTS: (code) => `https://provinces.open-api.vn/api/p/${code}?depth=2`,
    WARDS: (code) => `https://provinces.open-api.vn/api/d/${code}?depth=2`,
    PAYMENTS: `${apiUrl}/payments.php`,
    STOCK_UPDATE: `${apiUrl}/stock_json.php`,
    VNPAY_CREATE: `${apiUrl}/vnpay_create.php`
};

// Validation patterns
const VALIDATION_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\d{10,11}$/
};

export function useCheckout() {
    const { cartItems, totalAmount, clearCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useContext(AuthContext) || {};
    const directProduct = location.state?.product;
    const cartItemsFromRoute = location.state?.products;

    // Core state
    const [finalCartItems, setFinalCartItems] = useState([]);
    const [finalTotalAmount, setFinalTotalAmount] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    // Location state
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    // Loading states
    const [loadingStates, setLoadingStates] = useState({
        provinces: false,
        districts: false,
        wards: false
    });

    // Form state
    const [customerInfo, setCustomerInfo] = useState({
        fullName: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: "",
        city: "",
        district: "",
        ward: "",
        wardCode: "",
        note: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [shippingMethod, setShippingMethod] = useState("ship");
    const formRef = useRef(null);

    // Memoized values
    const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

    const shippingCost = useMemo(() => {
        if (shippingMethod === "pickup") return 0;
        if (finalTotalAmount >= FREE_SHIPPING_THRESHOLD) return 0;
        return DEFAULT_SHIPPING_COST;
    }, [shippingMethod, finalTotalAmount]);

    // Helper functions
    const normalizeCartItem = useCallback((item) => ({
        id: item.id || item.id_product || "unknown",
        ma_sp: item.ma_sp || "",
        ten_sp: item.ten_sp || item.ten || "Sản phẩm không xác định",
        gia_sau: Number(item.gia_sau) || Number(item.gia) || Number(item.price) || 0,
        so_luong: item.quantity || item.so_luong || 1, // Ưu tiên quantity (số lượng người dùng chọn) trước so_luong (tồn kho)
        loai: item.loai || item.danh_muc || "Linh kiện",
        images: item.images?.[0] || item.images || "/placeholder.jpg",
    }), []);

    const calculateCartSummary = useCallback((items) => {
        const total = items.reduce((sum, item) => sum + item.gia_sau * item.so_luong, 0);
        const quantity = items.reduce((sum, item) => sum + item.so_luong, 0);
        return { total, quantity };
    }, []);

    // API functions with better error handling
    const fetchWithErrorHandling = useCallback(async (url, errorMessage) => {
        try {
            const response = await axios.get(url);
            return response.data || [];
        } catch (err) {
            console.error(`Error fetching data from ${url}:`, err);
            toast.error(errorMessage);
            throw err;
        }
    }, []);

    const setLoadingState = useCallback((key, value) => {
        setLoadingStates(prev => ({ ...prev, [key]: value }));
    }, []);

    // Authentication check
    useEffect(() => {
        if (!isAuthenticated) {
            setError("Vui lòng đăng nhập để thanh toán");
            navigate("/register");
        }
    }, [isAuthenticated, navigate]);

    // Cart items calculation - optimized
    useEffect(() => {
        let calculatedCartItems = [];

        try {
            if (directProduct) {
                calculatedCartItems = [normalizeCartItem({
                    ...directProduct,
                    quantity: directProduct.quantity || location.state?.quantity || 1
                })];
            } else if (cartItemsFromRoute?.length > 0) {
                calculatedCartItems = cartItemsFromRoute.map(normalizeCartItem);
            } else if (cartItems?.length > 0) {
                calculatedCartItems = cartItems.map(normalizeCartItem);
            }

            const { total, quantity } = calculateCartSummary(calculatedCartItems);

            // Check for maximum total allowed
            if (total > MAX_TOTAL_ALLOWED) {
                toast.error("Số tiền quá lớn! Vui lòng giảm số lượng hoặc chọn sản phẩm khác.");
            }

            setFinalCartItems(calculatedCartItems);
            setFinalTotalAmount(total);
            setTotalQuantity(quantity);
        } catch (error) {
            console.error("Error calculating cart items:", error);
            toast.error("Có lỗi khi tính toán giỏ hàng");
        }
    }, [directProduct, cartItems, cartItemsFromRoute, location.state?.quantity, normalizeCartItem, calculateCartSummary]);

    // Fetch provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            setLoadingState('provinces', true);
            try {
                const data = await fetchWithErrorHandling(
                    API_ENDPOINTS.PROVINCES,
                    "Không thể tải danh sách tỉnh/thành phố"
                );
                setProvinces(data);
            } finally {
                setLoadingState('provinces', false);
            }
        };
        fetchProvinces();
    }, [fetchWithErrorHandling, setLoadingState]);

    // Fetch districts when province changes
    useEffect(() => {
        const fetchDistricts = async () => {
            if (!selectedProvince?.code) return;

            setLoadingState('districts', true);
            try {
                const data = await fetchWithErrorHandling(
                    API_ENDPOINTS.DISTRICTS(selectedProvince.code),
                    "Không thể tải danh sách quận/huyện"
                );
                setDistricts(data.districts || []);
                setWards([]); // Reset wards when province changes
                setSelectedDistrict(null);
            } finally {
                setLoadingState('districts', false);
            }
        };
        fetchDistricts();
    }, [selectedProvince, fetchWithErrorHandling, setLoadingState]);

    // Fetch wards when district changes
    useEffect(() => {
        const fetchWards = async () => {
            if (!selectedDistrict?.code) return;

            setLoadingState('wards', true);
            try {
                const data = await fetchWithErrorHandling(
                    API_ENDPOINTS.WARDS(selectedDistrict.code),
                    "Không thể tải danh sách phường/xã"
                );
                setWards(data.wards || []);
            } finally {
                setLoadingState('wards', false);
            }
        };
        fetchWards();
    }, [selectedDistrict, fetchWithErrorHandling, setLoadingState]);

    // Event handlers
    const handleProvinceChange = useCallback((e) => {
        const provinceCode = e.target.value;
        const selectedProv = provinces.find(p => p.code.toString() === provinceCode);

        if (selectedProv) {
            setSelectedProvince(selectedProv);
            setCustomerInfo(prev => ({
                ...prev,
                city: selectedProv.name,
                district: "",
                ward: "",
                wardCode: ""
            }));
        } else {
            setSelectedProvince(null);
            setDistricts([]);
            setWards([]);
            setCustomerInfo(prev => ({
                ...prev,
                city: "",
                district: "",
                ward: "",
                wardCode: ""
            }));
        }
    }, [provinces]);

    const handleDistrictChange = useCallback((e) => {
        const districtCode = e.target.value;
        const selectedDist = districts.find(d => d.code.toString() === districtCode);

        if (selectedDist) {
            setSelectedDistrict(selectedDist);
            setCustomerInfo(prev => ({
                ...prev,
                district: selectedDist.name,
                ward: "",
                wardCode: ""
            }));
        } else {
            setSelectedDistrict(null);
            setWards([]);
            setCustomerInfo(prev => ({
                ...prev,
                district: "",
                ward: "",
                wardCode: ""
            }));
        }
    }, [districts]);

    const handleWardChange = useCallback((e) => {
        const wardCode = e.target.value;
        const selectedWard = wards.find(w => w.code.toString() === wardCode);

        setCustomerInfo(prev => ({
            ...prev,
            wardCode: wardCode,
            ward: selectedWard?.name || ""
        }));
    }, [wards]);

    // Validation function - improved
    const validateForm = useCallback(() => {
        const errors = {};

        // Basic info validation
        if (!customerInfo.fullName.trim()) {
            errors.fullName = "Vui lòng nhập họ và tên";
        }

        if (!customerInfo.email.trim()) {
            errors.email = "Vui lòng nhập email";
        } else if (!VALIDATION_PATTERNS.EMAIL.test(customerInfo.email)) {
            errors.email = "Email không hợp lệ";
        }

        if (!customerInfo.phone.trim()) {
            errors.phone = "Vui lòng nhập số điện thoại";
        } else if (!VALIDATION_PATTERNS.PHONE.test(customerInfo.phone.replace(/[^0-9]/g, ""))) {
            errors.phone = "Số điện thoại không hợp lệ";
        }

        // Shipping validation
        if (shippingMethod === "ship") {
            if (!customerInfo.address.trim()) {
                errors.address = "Vui lòng nhập địa chỉ";
            }
            if (!customerInfo.city.trim()) {
                errors.city = "Vui lòng chọn tỉnh/thành phố";
            }
            if (!customerInfo.district.trim()) {
                errors.district = "Vui lòng chọn quận/huyện";
            }
        }

        // Cart validation
        finalCartItems.forEach((item, index) => {
            if (!item.id || item.id === "unknown") {
                errors[`id_${index}`] = `Sản phẩm tại vị trí ${index + 1} thiếu ID`;
            }
            if (!item.ten_sp || item.ten_sp === "Sản phẩm không xác định") {
                errors[`ten_sp_${index}`] = `Sản phẩm tại vị trí ${index + 1} thiếu tên`;
            }
            if (!item.loai) {
                errors[`loai_${index}`] = `Sản phẩm tại vị trí ${index + 1} thiếu danh mục`;
            }
            if (!Number.isFinite(item.gia_sau) || item.gia_sau <= 0) {
                errors[`gia_sau_${index}`] = `Sản phẩm tại vị trí ${index + 1} có giá không hợp lệ`;
            }
            if (!item.so_luong || item.so_luong < 1) {
                errors[`so_luong_${index}`] = `Sản phẩm tại vị trí ${index + 1} có số lượng không hợp lệ`;
            }
        });

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [customerInfo, shippingMethod, finalCartItems]);

    // Stock update function - improved error handling
    const updateProductStock = useCallback(async (cartItems) => {
        try {
            const updatePromises = cartItems.map(async (item) => {
                const formData = new FormData();
                formData.append("id", item.id);
                formData.append("so_luong", item.so_luong);

                const response = await fetch(API_ENDPOINTS.STOCK_UPDATE, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return await response.json();
            });

            const results = await Promise.all(updatePromises);
            const hasError = results.some((result) => !result.success);

            if (hasError) {
                console.error("Stock update errors:", results);
                return {
                    success: false,
                    message: "Không thể cập nhật tồn kho cho một số sản phẩm",
                };
            }

            return { success: true };
        } catch (error) {
            console.error("Error updating stock:", error);
            return { success: false, message: error.message };
        }
    }, []);

    // Main submit handler - improved
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        console.log("handleSubmit triggered, paymentMethod:", paymentMethod);

        // Admin check
        if (isAdmin) {
            toast.error("Tài khoản admin không được phép thực hiện thanh toán!");
            setError("Tài khoản admin không được phép thực hiện thanh toán!");
            return;
        }

        if (!validateForm()) {
            console.log("Form validation failed:", formErrors);
            return;
        }

        setIsProcessing(true);
        setError("");

        try {
            const orderData = {
                userId: user?.id || null,
                cartItems: finalCartItems.map((item) => ({
                    ma_sp: item.ma_sp,
                    ten: item.ten_sp,
                    gia: item.gia_sau,
                    so_luong: item.so_luong,
                    danh_muc: item.loai,
                })),
                customerInfo,
                paymentMethod,
                shippingMethod,
                totalAmount: finalTotalAmount,
                orderDate: new Date().toISOString(),
            };

            console.log("Sending orderData to backend:", orderData);

            const response = await fetch(API_ENDPOINTS.PAYMENTS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => "No response body");
                console.error("Fetch error details:", {
                    status: response.status,
                    statusText: response.statusText,
                    errorText,
                });
                throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
            }

            const result = await response.json();
            console.log("Backend response:", result);

            if (result.status === "success") {
                const stockUpdateResult = await updateProductStock(finalCartItems);
                console.log("Stock update result:", stockUpdateResult);

                if (!stockUpdateResult.success) {
                    toast.warning(
                        "Đơn hàng đã được xử lý, nhưng có lỗi khi cập nhật tồn kho: " +
                        (stockUpdateResult.message || "Lỗi không xác định")
                    );
                }

                if (paymentMethod === "vnpay") {
                    try {
                        const payRes = await fetch(API_ENDPOINTS.VNPAY_CREATE, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderId: result.orderId }),
                        });

                        if (!payRes.ok) {
                            throw new Error(`Lỗi lấy link thanh toán VNPay: ${payRes.status}`);
                        }

                        const payData = await payRes.json();
                        if (payData.status === "success" && payData.payUrl) {
                            window.location.href = payData.payUrl;
                            setTimeout(() => clearCart(), 0);
                        } else {
                            toast.error(payData.message || "Không nhận được URL thanh toán VNPay từ server");
                            setError("Không thể xử lý thanh toán VNPay. Vui lòng thử lại.");
                        }
                    } catch (err) {
                        toast.error("Lỗi lấy link thanh toán VNPay: " + err.message);
                        setError("Không thể xử lý thanh toán VNPay. Vui lòng thử lại.");
                    }
                } else {
                    console.log("Processing COD order, navigating to invoice");
                    clearCart();
                    navigate("/invoice", {
                        state: {
                            orderData: {
                                customerInfo,
                                cartItems: finalCartItems,
                                totalAmount: finalTotalAmount,
                                shippingCost,
                                paymentMethod,
                                shippingMethod,
                                orderDate: new Date().toISOString(),
                                orderId: result.orderId,
                            },
                        },
                    });
                }
            } else {
                console.error("Backend returned non-success status:", result);
                setError(result.message || "Có lỗi xảy ra trong quá trình xử lý");
                toast.error(result.message || "Lỗi xử lý đơn hàng");
            }
        } catch (err) {
            console.error("Checkout error details:", {
                message: err.message,
                name: err.name,
                stack: err.stack,
            });
            setError("Có lỗi xảy ra: " + err.message);
            toast.error("Lỗi: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    }, [
        paymentMethod, isAdmin, validateForm, finalCartItems, customerInfo,
        shippingMethod, finalTotalAmount, user?.id, updateProductStock,
        clearCart, navigate, shippingCost
    ]);

    const handleResetForm = useCallback(() => {
        setCustomerInfo({
            fullName: user?.username || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: "",
            city: "",
            district: "",
            ward: "",
            note: "",
        });
        setPaymentMethod("cod");
        setShippingMethod("ship");
        setFormErrors({});
        setError("");
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setDistricts([]);
        setWards([]);
        setTotalQuantity(0);
    }, [user]);

    const formatCurrency = useCallback((amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    }, []);

    return {
        // Core data
        finalCartItems,
        setFinalCartItems,
        finalTotalAmount,
        setFinalTotalAmount,
        totalQuantity,
        setTotalQuantity,
        shippingCost,

        // State
        isProcessing,
        setIsProcessing,
        error,
        setError,

        // Location data
        provinces,
        setProvinces,
        districts,
        setDistricts,
        wards,
        setWards,
        selectedProvince,
        setSelectedProvince,
        selectedDistrict,
        setSelectedDistrict,

        // Loading states
        isLoadingProvinces: loadingStates.provinces,
        setIsLoadingProvinces: (value) => setLoadingState('provinces', value),
        isLoadingDistricts: loadingStates.districts,
        setIsLoadingDistricts: (value) => setLoadingState('districts', value),
        isLoadingWards: loadingStates.wards,
        setIsLoadingWards: (value) => setLoadingState('wards', value),

        // Form data
        customerInfo,
        setCustomerInfo,
        formErrors,
        setFormErrors,
        paymentMethod,
        setPaymentMethod,
        shippingMethod,
        setShippingMethod,
        formRef,

        // Functions
        validateForm,
        updateProductStock,
        handleSubmit,
        handleResetForm,
        formatCurrency,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,

        // Legacy compatibility
        cartItems,
        totalAmount,
        clearCart,
        location,
        navigate,
        isAuthenticated,
        user,
        directProduct,
        cartItemsFromRoute,
    };
}