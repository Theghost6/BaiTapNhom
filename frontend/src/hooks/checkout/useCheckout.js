import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../page/function/useCart";
import { AuthContext } from "../../page/function/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_HOST;

export function useCheckout() {
    const { cartItems, totalAmount, clearCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useContext(AuthContext) || {};
    const directProduct = location.state?.product;
    const cartItemsFromRoute = location.state?.products;
    const [finalCartItems, setFinalCartItems] = useState([]);
    const [finalTotalAmount, setFinalTotalAmount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
    const [isLoadingWards, setIsLoadingWards] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        fullName: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: "",
        city: "",
        district: "",
        ward: "",
        note: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [shippingMethod, setShippingMethod] = useState("ship");
    const formRef = useRef(null);
    const [totalQuantity, setTotalQuantity] = useState(0);

    // Authentication check
    useEffect(() => {
        if (!isAuthenticated) {
            setError("Vui lòng đăng nhập để thanh toán");
            navigate("/register");
        }
    }, [isAuthenticated, navigate]);

    // Cart items calculation
    useEffect(() => {
        let calculatedCartItems = [];
        let calculatedTotal = 0;
        let calculatedQuantity = 0;

        if (directProduct) {
            const item = {
                id: directProduct.id || "unknown",
                ma_sp: directProduct.ma_sp || directProduct.ma_sp || "",
                ten_sp: directProduct.ten_sp || directProduct.ten || "Sản phẩm không xác định",
                gia_sau: Number(directProduct.gia_sau) || Number(directProduct.gia) || Number(directProduct.price) || 0,
                so_luong: directProduct.quantity || directProduct.so_luong || location.state?.quantity || 1,
                loai: directProduct.loai || directProduct.danh_muc || "Linh kiện",
                images: directProduct.images?.[0] || directProduct.images || "/placeholder.jpg",
            };
            calculatedCartItems.push(item);
            calculatedTotal = item.gia_sau * item.so_luong;
            calculatedQuantity = item.so_luong;
        } else if (cartItemsFromRoute && cartItemsFromRoute.length > 0) {
            calculatedCartItems = cartItemsFromRoute.map((item) => ({
                id: item.id || item.id_product || "unknown",
                ma_sp: item.ma_sp || item.ma_sp || "",
                ten_sp: item.ten_sp || item.ten || "Sản phẩm không xác định",
                gia_sau: Number(item.gia_sau) || Number(item.gia) || Number(item.price) || 0,
                so_luong: item.so_luong || item.quantity || 1,
                loai: item.loai || item.danh_muc || "Linh kiện",
                images: item.images?.[0] || item.images || "/placeholder.jpg",
            }));
            calculatedTotal = calculatedCartItems.reduce(
                (total, item) => total + item.gia_sau * item.so_luong,
                0
            );
            calculatedQuantity = calculatedCartItems.reduce((sum, item) => sum + item.so_luong, 0);
        } else if (cartItems && cartItems.length > 0) {
            calculatedCartItems = cartItems.map((item) => ({
                id: item.id || item.id_product,
                ma_sp: item.ma_sp || item.ma_sp || "",
                ten_sp: item.ten_sp || item.ten || "Sản phẩm không xác định",
                gia_sau: Number(item.gia_sau) || Number(item.gia) || Number(item.price) || 0,
                so_luong: item.so_luong || item.quantity || 1,
                loai: item.loai || item.danh_muc || "Linh kiện",
                images: item.images?.[0] || item.images || "/placeholder.jpg",
            }));
            calculatedTotal = calculatedCartItems.reduce(
                (total, item) => total + item.gia_sau * item.so_luong,
                0
            );
            calculatedQuantity = calculatedCartItems.reduce((sum, item) => sum + item.so_luong, 0);
        }

        // Check for maximum total allowed
        const maxTotalAllowed = 99999999.99;
        if (calculatedTotal > maxTotalAllowed) {
            toast.error("Số tiền quá lớn! Vui lòng giảm số lượng hoặc chọn sản phẩm khác.");
            setFinalCartItems(calculatedCartItems);
            setFinalTotalAmount(calculatedTotal);
            return;
        }

        setFinalCartItems(calculatedCartItems);
        setFinalTotalAmount(calculatedTotal);
        setTotalQuantity(calculatedQuantity);
    }, [directProduct, cartItems, cartItemsFromRoute, totalAmount]);

    // Fetch provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            setIsLoadingProvinces(true);
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/p/');
                setProvinces(response.data || []);
            } catch (err) {
                console.error("Error fetching provinces:", err);
                toast.error("Không thể tải danh sách tỉnh/thành phố");
            } finally {
                setIsLoadingProvinces(false);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch districts when province changes
    useEffect(() => {
        const fetchDistricts = async () => {
            if (!selectedProvince || !selectedProvince.code) return;
            setIsLoadingDistricts(true);
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`);
                setDistricts(response.data.districts || []);
                setWards([]); // Reset wards when province changes
                setSelectedDistrict(null);
            } catch (err) {
                console.error("Error fetching districts:", err);
                toast.error("Không thể tải danh sách quận/huyện");
            } finally {
                setIsLoadingDistricts(false);
            }
        };
        fetchDistricts();
    }, [selectedProvince]);

    // Fetch wards when district changes
    useEffect(() => {
        const fetchWards = async () => {
            if (!selectedDistrict || !selectedDistrict.code) return;
            setIsLoadingWards(true);
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`);
                setWards(response.data.wards || []);
            } catch (err) {
                console.error("Error fetching wards:", err);
                toast.error("Không thể tải danh sách phường/xã");
            } finally {
                setIsLoadingWards(false);
            }
        };
        fetchWards();
    }, [selectedDistrict]);

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        const selectedProv = provinces.find(p => p.code.toString() === provinceCode);

        if (selectedProv) {
            setSelectedProvince(selectedProv);
            setCustomerInfo((prev) => ({
                ...prev,
                city: selectedProv.name,
                district: "",
                ward: ""
            }));
        } else {
            setSelectedProvince(null);
            setDistricts([]);
            setWards([]);
            setCustomerInfo((prev) => ({
                ...prev,
                city: "",
                district: "",
                ward: ""
            }));
        }
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        const selectedDist = districts.find(d => d.code.toString() === districtCode);

        if (selectedDist) {
            setSelectedDistrict(selectedDist);
            setCustomerInfo((prev) => ({
                ...prev,
                district: selectedDist.name,
                ward: ""
            }));
        } else {
            setSelectedDistrict(null);
            setWards([]);
            setCustomerInfo((prev) => ({
                ...prev,
                district: "",
                ward: ""
            }));
        }
    };

    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        const selectedWard = wards.find(w => w.code.toString() === wardCode);

        if (selectedWard) {
            setCustomerInfo((prev) => ({
                ...prev,
                ward: selectedWard.name
            }));
        } else {
            setCustomerInfo((prev) => ({
                ...prev,
                ward: ""
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!customerInfo.fullName.trim()) {
            errors.fullName = "Vui lòng nhập họ và tên";
        }

        if (!customerInfo.email.trim()) {
            errors.email = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
            errors.email = "Email không hợp lệ";
        }

        if (!customerInfo.phone.trim()) {
            errors.phone = "Vui lòng nhập số điện thoại";
        } else if (!/^\d{10,11}$/.test(customerInfo.phone.replace(/[^0-9]/g, ""))) {
            errors.phone = "Số điện thoại không hợp lệ";
        }

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

        // Validate cart items
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
    };

    const updateProductStock = async (cartItems) => {
        try {
            const updatePromises = cartItems.map(async (item) => {
                const formData = new FormData();
                formData.append("id", item.id);
                formData.append("so_luong", item.so_luong);

                const response = await fetch(
                    `${apiUrl}/stock_json.php`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                return result;
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmit triggered, paymentMethod:", paymentMethod);

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
                    ma_sp: item.ma_sp, // Sử dụng đúng mã sản phẩm
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

            const response = await fetch(
                `${apiUrl}/payments.php`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData),
                }
            );

            if (!response.ok) {
                const errorText = await response.text().catch(() => "No response body");
                console.error("Fetch error details:", {
                    status: response.status,
                    statusText: response.statusText,
                    errorText,
                });
                throw new Error(
                    `HTTP error! Status: ${response.status}, Response: ${errorText}`
                );
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
                    // Gọi tiếp API lấy payUrl
                    try {
                        const payRes = await fetch(`${apiUrl}/vnpay_create.php`, {
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
                    const shippingCost = (shippingMethod === "ship" && finalTotalAmount > 10000000) ||
                        shippingMethod === "pickup" ? 0 : 30000;
                    navigate("/invoice", {
                        state: {
                            orderData: {
                                customerInfo,
                                cartItems: finalCartItems,
                                totalAmount: finalTotalAmount,
                                shippingCost: shippingCost,
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
    };

    const handleResetForm = () => {
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
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    return {
        // Original returns
        cartItems,
        totalAmount,
        clearCart,
        location,
        navigate,
        isAuthenticated,
        user,
        directProduct,
        cartItemsFromRoute,
        finalCartItems,
        setFinalCartItems,
        finalTotalAmount,
        setFinalTotalAmount,
        isProcessing,
        setIsProcessing,
        error,
        setError,
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
        isLoadingProvinces,
        setIsLoadingProvinces,
        isLoadingDistricts,
        setIsLoadingDistricts,
        isLoadingWards,
        setIsLoadingWards,
        customerInfo,
        setCustomerInfo,
        formErrors,
        setFormErrors,
        paymentMethod,
        setPaymentMethod,
        shippingMethod,
        setShippingMethod,
        formRef,
        totalQuantity,
        setTotalQuantity,
        validateForm,
        updateProductStock,
        handleSubmit,
        handleResetForm,
        formatCurrency,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
    };
}