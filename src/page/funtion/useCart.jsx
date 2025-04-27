import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import LinhKien from "./Linh_kien";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated, user } = useContext(AuthContext) || {};
  const [cartItems, setCartItems] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const generateSessionId = () => {
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    };
    const storedSessionId = localStorage.getItem("sessionId");
    if (!storedSessionId) {
      const newSessionId = generateSessionId();
      localStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);
    } else {
      setSessionId(storedSessionId);
    }
  }, []);

  useEffect(() => {
    console.log("AuthContext:", { isAuthenticated, user });
    console.log("Session ID:", sessionId);
  }, [isAuthenticated, user, sessionId]);

  useEffect(() => {
    if (!sessionId && !isAuthenticated) return;

    const fetchCart = async () => {
      try {
        const response = await axios.get(
          "http://localhost/backend/gio_hang.php",
          {
            params: { user_id: user?.id || null, session_id: sessionId },
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
  }, [isAuthenticated, user, sessionId]);

  useEffect(() => {
    if (isAuthenticated && user?.id && sessionId) {
      const mergeCart = async () => {
        try {
          const response = await axios.patch(
            "http://localhost/backend/gio_hang.php",
            {
              user_id: user.id,
              session_id: sessionId,
            }
          );
          console.log("Merge cart response:", response.data);
          if (response.data.success) {
            const updatedResponse = await axios.get(
              "http://localhost/backend/gio_hang.php",
              {
                params: { user_id: user.id, session_id: sessionId },
              }
            );
            setCartItems(
              updatedResponse.data.success ? updatedResponse.data.data : []
            );
            localStorage.removeItem("sessionId");
            setSessionId(null);
          } else {
            toast.error(response.data.message || "Lỗi khi hợp nhất giỏ hàng");
          }
        } catch (error) {
          console.error("Error merging cart:", error);
          toast.error("Không thể hợp nhất giỏ hàng");
        }
      };
      mergeCart();
    }
  }, [isAuthenticated, user, sessionId]);

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

  const addToCart = async (product) => {
    if (!sessionId && !isAuthenticated) {
      console.error("Session ID not initialized");
      toast.error("Không thể thêm vào giỏ hàng do lỗi hệ thống");
      return;
    }

    const product_id = product.id;
    const user_id = user?.id || null;
    console.log("Product data:", product);
    console.log("Adding to cart:", {
      user_id,
      session_id: sessionId,
      product_id,
      quantity: 1,
    });

    try {
      const response = await axios.post(
        "http://localhost/backend/gio_hang.php",
        {
          user_id,
          session_id: sessionId,
          product_id,
          quantity: 1,
        }
      );
      console.log("POST cart response:", response.data);
      if (response.data.success) {
        const updatedResponse = await axios.get(
          "http://localhost/backend/gio_hang.php",
          {
            params: { user_id, session_id: sessionId },
          }
        );
        console.log("GET updated cart response:", updatedResponse.data);
        if (updatedResponse.data.success) {
          setCartItems(
            updatedResponse.data.data.filter((item) => item.id_product)
          );
          toast.success(`${product.ten} đã được thêm vào giỏ hàng`);
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
    }
  };

  const removeFromCart = async (product_id) => {
    if (!sessionId && !isAuthenticated) {
      console.error("Session ID not initialized");
      toast.error("Không thể xóa sản phẩm do lỗi hệ thống");
      return;
    }

    const user_id = user?.id || null;
    console.log("Removing from cart:", {
      user_id,
      session_id: sessionId,
      product_id,
    });

    try {
      const response = await axios.post(
        "http://localhost/backend/gio_hang.php",
        {
          action: "delete",
          user_id,
          session_id: sessionId,
          product_id,
        }
      );
      console.log("DELETE cart response:", response.data);
      if (response.data.success) {
        const updatedResponse = await axios.get(
          "http://localhost/backend/gio_hang.php",
          {
            params: { user_id, session_id: sessionId },
          }
        );
        console.log("GET updated cart response:", updatedResponse.data);
        if (updatedResponse.data.success) {
          setCartItems(
            updatedResponse.data.data.filter((item) => item.id_product)
          );
          toast.success("Sản phẩm đã được xóa khỏi giỏ hàng");
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
    if (!sessionId && !isAuthenticated) {
      console.error("Session ID not initialized");
      toast.error("Không thể cập nhật số lượng do lỗi hệ thống");
      return;
    }

    if (quantity < 1) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }

    const user_id = user?.id || null;
    console.log("Updating quantity:", {
      user_id,
      session_id: sessionId,
      product_id,
      quantity,
    });

    try {
      const response = await axios.post(
        "http://localhost/backend/gio_hang.php",
        {
          action: "update_quantity",
          user_id,
          session_id: sessionId,
          product_id,
          quantity,
        }
      );
      console.log("UPDATE quantity response:", response.data);
      if (response.data.success) {
        const updatedResponse = await axios.get(
          "http://localhost/backend/gio_hang.php",
          {
            params: { user_id, session_id: sessionId },
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
    if (!sessionId && !isAuthenticated) {
      console.error("Session ID not initialized");
      toast.error("Không thể xóa giỏ hàng do lỗi hệ thống");
      return;
    }

    const user_id = user?.id || null;
    console.log("Clearing cart:", {
      user_id,
      session_id: sessionId,
    });

    try {
      const response = await axios.post(
        "http://localhost/backend/gio_hang.php",
        {
          action: "clear",
          user_id,
          session_id: sessionId,
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
