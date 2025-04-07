import React, { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Hàm tính tổng số lượng và tổng giá trị
  const calculateCartSummary = useMemo(() => {
    const totalQuantity = cartItems.length; // hoặc cách tính khác tùy logic
    const totalAmount = cartItems.reduce((sum, item) => {
      const cleanPrice = String(item.price).replace(/[^\d]/g, ""); // loại bỏ mọi ký tự không phải số

      const price = parseInt(cleanPrice, 10);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    return { totalQuantity, totalAmount };
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    totalQuantity: calculateCartSummary.totalQuantity,
    totalAmount: calculateCartSummary.totalAmount,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
