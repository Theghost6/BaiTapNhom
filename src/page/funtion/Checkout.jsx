import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./useCart";
import { AuthContext } from "./AuthContext";
import "../../style/checkout.css";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Checkout = () => {
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
  };

  const [formErrors, setFormErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingMethod, setShippingMethod] = useState("ship");

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Vui lòng đăng nhập để thanh toán");
      navigate("/register");
    }
  }, [isAuthenticated, navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    let calculatedCartItems = [];
    let calculatedTotal = 0;

    if (directProduct) {
      const item = {
        id_product: directProduct.id || "unknown",
        ten: directProduct.ten || "Sản phẩm không xác định",
        gia: Number(directProduct.gia) || 0,
        so_luong: location.state?.quantity || 1,
        danh_muc: directProduct.danh_muc || "Linh kiện",
        images: directProduct.images?.[0] || "/placeholder.jpg",
      };
      calculatedCartItems.push(item);
      calculatedTotal = item.gia * item.so_luong;
    } else if (cartItemsFromRoute && cartItemsFromRoute.length > 0) {
      calculatedCartItems = cartItemsFromRoute.map((item) => ({
        id_product: item.id_product || "unknown",
        ten: item.ten || "Sản phẩm không xác định",
        gia: Number(item.gia) || 0,
        so_luong: item.so_luong || 1,
        danh_muc: item.danh_muc || "Linh kiện",
        images: item.images || "/placeholder.jpg",
      }));
      calculatedTotal = calculatedCartItems.reduce(
        (total, item) => total + item.gia * item.so_luong,
        0
      );
    } else if (cartItems && cartItems.length > 0) {
      calculatedCartItems = cartItems.map((item) => ({
        id_product: item.id_product,
        ten: item.ten || "Sản phẩm không xác định",
        gia: Number(item.gia) || 0,
        so_luong: item.so_luong || 1,
        danh_muc: item.danh_muc || "Linh kiện",
        images: item.images,
      }));
      calculatedTotal = totalAmount;
    }
    const maxTotalAllowed = 99999999.99;
    if (calculatedTotal > maxTotalAllowed) {
      toast.error("Số tiền quá lớn! Vui lòng giảm số lượng hoặc chọn sản phẩm khác.");
      setFinalCartItems(calculatedCartItems);
      setFinalTotalAmount(calculatedTotal);
      return;
    }
    setFinalCartItems(calculatedCartItems);
    setFinalTotalAmount(calculatedTotal);
  }, [directProduct, cartItems, cartItemsFromRoute, totalAmount]);

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

    finalCartItems.forEach((item, index) => {
      if (!item.id_product || item.id_product === "unknown") {
        errors[`id_product_${index}`] = `Sản phẩm tại vị trí ${index + 1} thiếu ID`;
      }
      if (!item.ten || item.ten === "Sản phẩm không xác định") {
        errors[`ten_${index}`] = `Sản phẩm tại vị trí ${index + 1} thiếu tên`;
      }
      if (!item.danh_muc) {
        errors[`danh_muc_${index}`] = `Sản phẩm tại vị trí ${index + 1} thiếu danh mục`;
      }
      if (!Number.isFinite(item.gia) || item.gia <= 0) {
        errors[`gia_${index}`] = `Sản phẩm tại vị trí ${index + 1} có giá không hợp lệ`;
      }
      if (!item.so_luong || item.so_luong < 1) {
        errors[`so_luong_${index}`] = `Sản phẩm tại vị trí ${index + 1} có số lượng không hợp lệ`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateProductStock = async (products) => {
    try {
      const updatePromises = products.map(async (item) => {
        const formData = new FormData();
        formData.append('id', item.id_product);
        formData.append('so_luong', item.so_luong);

        console.log(`Updating stock for product: id=${item.id_product}, so_luong=${item.so_luong}`);

        const response = await fetch("http://localhost/BaiTapNhom/backend/stock_json.php", {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      });

      const results = await Promise.all(updatePromises);
      const hasError = results.some(result => !result.success);
      if (hasError) {
        console.error("Stock update errors:", results);
        return { success: false, message: "Không thể cập nhật tồn kho cho một số sản phẩm" };
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating stock:", error);
      return { success: false, message: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const orderData = {
        userId: user?.id || null,
        cartItems: finalCartItems.map((item) => ({
          id_product: item.id_product,
          ten: item.ten,
          gia: item.gia,
          so_luong: item.so_luong,
          danh_muc: item.danh_muc,
        })),
        customerInfo,
        paymentMethod,
        shippingMethod,
        totalAmount: finalTotalAmount,
        orderDate: new Date().toISOString(),
      };

      console.log("Order data being sent:", orderData);

      const response = await fetch("http://localhost/BaiTapNhom/backend/payments.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "No response body");
        const headers = Object.fromEntries(response.headers.entries());
        console.error("Fetch error details:", {
          status: response.status,
          statusText: response.statusText,
          errorText,
          headers,
          url: response.url
        });
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
      }

      const result = await response.json();
      console.log("Backend response:", result);

      if (result.status === "success") {
        const stockUpdateResult = await updateProductStock(finalCartItems);

        if (!stockUpdateResult.success) {
          toast.warning("Đơn hàng đã được xử lý, nhưng có lỗi khi cập nhật tồn kho: " +
            (stockUpdateResult.message || "Lỗi không xác định"));
        }

        if (paymentMethod === "vnpay" && result.payUrl) {
          window.location.href = result.payUrl;
          clearCart();
        } else {
          clearCart();
          navigate("/invoice", {
            state: {
              orderData: {
                customerInfo,
                cartItems: finalCartItems,
                totalAmount: finalTotalAmount,
                shippingCost: shippingMethod === "ship" ? shippingCost : 0,
                paymentMethod,
                shippingMethod,
                orderDate: new Date().toISOString(),
                orderId: result.orderId
              }
            }
          });
        }
      } else {
        setError(result.message || "Có lỗi xảy ra trong quá trình xử lý");
      }
    } catch (err) {
      console.error("Checkout error details:", {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      setError("Có lỗi xảy ra: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingCost =
    shippingMethod === "ship" && finalTotalAmount > 10000000 ? 0 : 30000;

  const orderTotal = finalTotalAmount + shippingCost;

  return (
    <div className="checkout-page">

      {error && <div className="error-message">{error}</div>}

      <div className="checkout-container">
        <div className="checkout-form-container">
          <div className="checkout-summary">
            <h3>Đơn hàng của bạn</h3>
            <div className="cart-summary">
              <div className="cart-items">
                {finalCartItems.length > 0 ? (
                  <>
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Giá</th>
                          <th>SL</th>
                          <th>Tổng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {finalCartItems.map((item, index) => (
                          <motion.tr
                            key={`${item.id_product}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="cart-item"
                          >
                            <td className="item-info">
                              <div className="item-image-name">
                                {item.images && (
                                  <img
                                    src={item.images}
                                    alt={item.ten}
                                    className="item-thumbnail"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/placeholder.jpg";
                                    }}
                                  />
                                )}
                                <span className="item-name">{item.ten}</span>
                              </div>
                            </td>
                            <td className="item-price">
                              {formatCurrency(item.gia)}
                            </td>
                            <td className="item-quantity">{item.so_luong}</td>
                            <td className="item-total">
                              {formatCurrency(item.gia * item.so_luong)}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                    <ToastContainer />
                    <div className="cart-totals">
                      <div className="totals-row">
                        <span>Tạm tính:</span>
                        <span>{formatCurrency(finalTotalAmount)}</span>
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
                  <p className="empty-cart-message">
                    Không có sản phẩm nào trong giỏ hàng
                  </p>
                )}
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="checkout-form">
            <h3>Thông tin giao hàng</h3>

            <div className={`form-group ${formErrors.fullName ? "error" : ""}`}>
              <label htmlFor="fullName">Họ và tên</label>
              <input
                id="fullName"
                type="text"
                placeholder="Nhập họ và tên"
                value={customerInfo.fullName}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, fullName: e.target.value })
                }
                required
              />
              {formErrors.fullName && (
                <div className="error-text">{formErrors.fullName}</div>
              )}
            </div>

            <div className={`form-group ${formErrors.email ? "error" : ""}`}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Nhập địa chỉ email"
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, email: e.target.value })
                }
                required
              />
              {formErrors.email && (
                <div className="error-text">{formErrors.email}</div>
              )}
            </div>

            <div className={`form-group ${formErrors.phone ? "error" : ""}`}>
              <label htmlFor="phone">Số điện thoại</label>
              <input
                id="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
                required
              />
              {formErrors.phone && (
                <div className="error-text">{formErrors.phone}</div>
              )}
            </div>

            {shippingMethod === "ship" && (
              <>
                <div
                  className={`form-group ${formErrors.address ? "error" : ""}`}
                >
                  <label htmlFor="address">Địa chỉ</label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Nhập địa chỉ nhận hàng"
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                  {formErrors.address && (
                    <div className="error-text">{formErrors.address}</div>
                  )}
                </div>

                <div className="form-row">
                  <div
                    className={`form-group ${formErrors.city ? "error" : ""}`}
                  >
                    <label htmlFor="city">Tỉnh/Thành phố</label>
                    <select
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          city: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP HCM">TP HCM</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                    </select>
                    {formErrors.city && (
                      <div className="error-text">{formErrors.city}</div>
                    )}
                  </div>

                  <div
                    className={`form-group ${formErrors.district ? "error" : ""}`}
                  >
                    <label htmlFor="district">Quận/Huyện</label>
                    <select
                      id="district"
                      value={customerInfo.district}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          district: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Chọn quận/huyện</option>
                      <option value="Quận 1">Quận 1</option>
                      <option value="Quận 2">Quận 2</option>
                      <option value="Quận 3">Quận 3</option>
                      <option value="Quận 4">Quận 4</option>
                      <option value="Quận 5">Quận 5</option>
                    </select>
                    {formErrors.district && (
                      <div className="error-text">{formErrors.district}</div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="ward">Phường/Xã</label>
                  <select
                    id="ward"
                    value={customerInfo.ward}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, ward: e.target.value })
                    }
                  >
                    <option value="">Chọn phường/xã</option>
                    <option value="Phường 1">Phường 1</option>
                    <option value="Phường 2">Phường 2</option>
                    <option value="Phường 3">Phường 3</option>
                    <option value="Phường 4">Phường 4</option>
                    <option value="Phường 5">Phường 5</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="note">Ghi chú đơn hàng</label>
              <textarea
                id="note"
                placeholder="Nhập ghi chú nếu có..."
                value={customerInfo.note}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    note: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="button"
              className="reset-button"
              onClick={handleResetForm}
              disabled={isProcessing}
              title="Xóa toàn bộ thông tin đã nhập"
            >
              Nhập lại
            </button>

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

            <button
              type="submit"
              className="checkout-button"
              disabled={isProcessing || finalCartItems.length === 0 || !!error}
              title={finalCartItems.length === 0 ? "Giỏ hàng trống" : ""}
            >
              {isProcessing ? (
                <>
                  <span className="spinner"></span> Đang xử lý...
                </>
              ) : (
                "Đặt hàng"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
