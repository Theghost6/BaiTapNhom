import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import LinhKien from "./Linh_kien";

const CartContext = createContext();

export function CartProvider({ children }) {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("AuthContext is undefined. Ensure AuthProvider wraps CartProvider.");
  }
  const { isAuthenticated, user } = context || {};

  const [cartItems, setCartItems] = useState([]);
  const [animationTrigger, setAnimationTrigger] = useState(null); // For triggering animations

  useEffect(() => {
    console.log("AuthContext in CartProvider:", { isAuthenticated, user });
    if (!isAuthenticated) {
      console.log("isAuthenticated is false in CartProvider");
    }
    if (!user?.id) {
      console.log("user.id is undefined in CartProvider", { user });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      console.log("No user or not authenticated, clearing cart");
      setCartItems([]);
      return;
    }

    const fetchCart = async () => {
      try {
        console.log("Fetching cart for user_id:", user.id);
        const response = await axios.get(
          "http://localhost/backend/gio_hang.php",
          {
            params: { user_id: user.id },
          }
        );
        console.log("Initial cart from server:", response.data);
        setCartItems(response.data.success ? response.data.data : []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Không thể tải giỏ hàng");
      }
    };

    fetchCart();
  }, [isAuthenticated, user]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const calculateCartSummary = useMemo(() => {
    const Products = Object.values(LinhKien).flat();
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + (item.so_luong || 1),
      0
    );
    const totalAmount = cartItems.reduce((sum, item) => {
      const product = Products.find((p) => p.id === item.id_product);
      const price = product?.gia || 0;
      return sum + price * (item.so_luong || 1);
    }, 0);
    return { totalQuantity, totalAmount };
  }, [cartItems]);

  const addToCart = async (product, onAnimationStart) => {
    console.log("addToCart called with product:", product);
    console.log("Auth state in addToCart:", { isAuthenticated, user });
    if (!isAuthenticated) {
      console.log("addToCart: Not authenticated");
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    if (!user?.id) {
      console.log("addToCart: No user.id", { user });
      toast.error("Thông tin tài khoản không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }

    const product_id = product.id;
    const user_id = user.id;
    const productName = product.ten || "Sản phẩm không xác định"; // Fallback
    console.log("Adding to cart:", {
      user_id,
      product_id,
      quantity: 1,
    });

    // Trigger animation before API call
    if (onAnimationStart) {
      setAnimationTrigger({ productId: product_id, image: product.images?.[0] });
      onAnimationStart();
    }

    try {
      const response = await axios.post(
        "http://localhost/backend/gio_hang.php",
        {
          user_id,
          product_id,
          quantity: 1,
        }
      );
      console.log("POST cart response:", response.data);
      if (response.data.success) {
        const updatedResponse = await axios.get(
          "http://localhost/backend/gio_hang.php",
          {
            params: { user_id },
          }
        );
        console.log("GET updated cart response:", updatedResponse.data);
        if (updatedResponse.data.success) {
          setCartItems(
            updatedResponse.data.data.filter((item) => item.id_product)
          );
          toast.success(`${productName} đã được thêm vào giỏ hàng`, {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error(updatedResponse.data.message || "Lỗi khi tải giỏ hàng");
        }
      } else {
        toast.error(response.data.message || "Lỗi khi thêm vào giỏ hàng");
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Không thể thêm vào giỏ hàng"
      );
    } finally {
      // Reset animation trigger
      setAnimationTrigger(null);
    }
  };

  const removeFromCart = async (product_id) => {
    if (!isAuthenticated) {
      console.log("removeFromCart: Not authenticated");
      toast.error("Vui lòng đăng nhập để xóa sản phẩm");
      return;
    }
    if (!user?.id) {
      console.log("removeFromCart: No user.id", { user });
      toast.error("Thông tin tài khoản không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }

    const user_id = user.id;
    console.log("Removing from cart:", {
      user_id,
      product_id,
    });

    try {
      const response = await axios.post(
        "http://localhost/backend/gio_hang.php",
        {
          action: "delete",
          user_id,
          product_id,
        }
      );
      console.log("DELETE cart response:", response.data);
      if (response.data.success) {
        const updatedResponse = await axios.get(
          "http://localhost/backend/gio_hang.php",
          {
            params: { user_id },
          }
        );
        console.log("GET updated cart response:", updatedResponse.data);
        if (updatedResponse.data.success) {
          setCartItems(
            updatedResponse.data.data.filter((item) => item.id_product)
          );
          // toast.success("Sản phẩm đã được xóa khỏi giỏ hàng");
        } else {
          toast.error(updatedResponse.data.message || "Lỗi khi tải giỏ hàng");
        }
      } else {
        toast.error(response.data.message || "Lỗi khi xóa sản phẩm");
      }
    } catch (error) {
      console.error("Error removing from cart:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Không thể xóa sản phẩm"
      );
    }
  };

  const updateQuantity = async (product_id, quantity) => {
    if (!isAuthenticated) {
      console.log("updateQuantity: Not authenticated");
      toast.error("Vui lòng đăng nhập để cập nhật số lượng");
      return;
    }
    if (!user?.id) {
      console.log("updateQuantity: No user.id", { user });
      toast.error("Thông tin tài khoản không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }

    if (quantity < 1) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }

    const user_id = user.id;
    console.log("Updating quantity:", {
      user_id,
      product_id,
      quantity,
    });

    try {
      const response = await axios.post(
        "http://localhost/backend/gio_hang.php",
        {
          action: "update_quantity",
          user_id,
          product_id,
          quantity,
        }
      );
      console.log("UPDATE quantity response:", response.data);
      if (response.data.success) {
        const updatedResponse = await axios.get(
          "http://localhost/backend/gio_hang.php",
          {
            params: { user_id },
          }
        );
        console.log("GET updated cart response:", updatedResponse.data);
        if (updatedResponse.data.success) {
          setCartItems(
            updatedResponse.data.data.filter((item) => item.id_product)
          );
          toast.success("Cập nhật số lượng thành công");
        } else {
          toast.error(updatedResponse.data.message || "Lỗi khi tải giỏ hàng");
        }
      } else {
        toast.error(response.data.message || "Lỗi khi cập nhật số lượng");
      }
    } catch (error) {
      console.error("Error updating quantity:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Không thể cập nhật số lượng"
      );
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      console.log("clearCart: Not authenticated");
      toast.error("Vui lòng đăng nhập để xóa giỏ hàng");
      return;
    }
    if (!user?.id) {
      console.log("clearCart: No user.id", { user });
      toast.error("Thông tin tài khoản không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }

    const user_id = user.id;
    console.log("Clearing cart:", {
      user_id,
    });

    try {
      const response = await axios.post(
        "http://localhost/backend/gio_hang.php",
        {
          action: "clear",
          user_id,
        }
      );
      console.log("CLEAR cart response:", response.data);
      if (response.data.success) {
        setCartItems([]);
        toast.success("Giỏ hàng đã được xóa");
      } else {
        toast.error(response.data.message || "Lỗi khi xóa giỏ hàng");
      }
    } catch (error) {
      console.error("Error clearing cart:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Không thể xóa giỏ hàng"
      );
    }
  };

  const value = {
    cartItems,
    totalQuantity: calculateCartSummary.totalQuantity,
    totalAmount: calculateCartSummary.totalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    animationTrigger,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
