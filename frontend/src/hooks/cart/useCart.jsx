import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../../page/function/AuthContext";
import { toast } from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("CartProvider must be used within AuthProvider");
  }
  const { isAuthenticated, user } = context || {};

  const [cartItems, setCartItems] = useState([]);
  const [animationTrigger, setAnimationTrigger] = useState(null);

  // Load cart từ localStorage khi component mount
  useEffect(() => {
    const loadCart = () => {
      let storageKey = 'cartItems_guest';

      if (isAuthenticated && user?.id) {
        storageKey = `cartItems_${user.id}`;
      }

      const savedCartStr = localStorage.getItem(storageKey);
      if (savedCartStr) {
        try {
          setCartItems(JSON.parse(savedCartStr));
        } catch {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };

    loadCart();
  }, [isAuthenticated, user?.id]);

  // Lưu cart vào localStorage mỗi khi thay đổi
  useEffect(() => {
    let storageKey = 'cartItems_guest';
    if (isAuthenticated && user?.id) {
      storageKey = `cartItems_${user.id}`;
    }

    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, isAuthenticated, user?.id]);

  // Tính tổng số lượng và tổng tiền dựa trên cartItems
  const calculateCartSummary = useMemo(() => {
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + (item.so_luong || 1),
      0
    );
    const totalAmount = cartItems.reduce((sum, item) => {
      const price = item.gia_sau || item.gia || 0;
      return sum + price * (item.so_luong || 1);
    }, 0);
    return { totalQuantity, totalAmount };
  }, [cartItems]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product, onAnimationStart) => {
    // Kiểm tra role admin
    if (isAuthenticated && user?.role === 'admin') {
      toast.error("Tài khoản admin không được phép thêm vào giỏ hàng!");
      return;
    }

    // Trigger animation
    if (onAnimationStart) {
      setAnimationTrigger({ productId: product.id, image: product.images?.[0] });
      onAnimationStart();
    }

    // Kiểm tra đã có trong giỏ chưa
    const existing = cartItems.find((item) => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, so_luong: (item.so_luong || 1) + 1 } : item
      );
    } else {
      newCart = [...cartItems, { ...product, so_luong: 1 }];
    }
    setCartItems(newCart);
    toast.success(`${product.ten_sp || "Sản phẩm"} đã được thêm vào giỏ hàng`);
    setAnimationTrigger(null);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (product_id) => {
    setCartItems(cartItems.filter((item) => item.id !== product_id));
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (product_id, quantity) => {
    if (quantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === product_id ? { ...item, so_luong: quantity } : item
      )
    );
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
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
