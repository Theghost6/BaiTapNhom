import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("AuthContext is undefined. Ensure AuthProvider wraps CartProvider.");
  }
  const { isAuthenticated, user } = context || {};

  const [cartItems, setCartItems] = useState([]);
  const [animationTrigger, setAnimationTrigger] = useState(null); // For triggering animations
  const apiUrl = import.meta.env.VITE_HOST;
  useEffect(() => {
    console.log("AuthContext in CartProvider:", { isAuthenticated, user });
    if (!isAuthenticated) {
      console.log("isAuthenticated is false in CartProvider");
    }
    if (!user?.id) {
      console.log("user.id is undefined in CartProvider", { user });
    }
  }, [isAuthenticated, user]);

  // Khi load lại trang, lấy cart từ localStorage nếu có
  useEffect(() => {
    // Nếu chưa đăng nhập, dùng localStorage với key 'cartItems_guest'
    if (!isAuthenticated || !user?.id) {
      const guestCart = localStorage.getItem('cartItems_guest');
      if (guestCart) {
        try {
          setCartItems(JSON.parse(guestCart));
        } catch {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
      return;
    }
    // Đã đăng nhập, ưu tiên lấy cart theo user
    const savedCart = localStorage.getItem(`cartItems_${user.id}`);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
      return;
    }
    // Nếu chưa có cart user, chuyển cart guest sang user (nếu có)
    const guestCart = localStorage.getItem('cartItems_guest');
    if (guestCart) {
      localStorage.setItem(`cartItems_${user.id}`, guestCart);
      localStorage.removeItem('cartItems_guest');
      setCartItems(JSON.parse(guestCart));
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user?.id]);

  // Lưu cart vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      localStorage.setItem(`cartItems_${user.id}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem('cartItems_guest', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated, user?.id]);

  // Khi render giỏ hàng, fetch chi tiết sản phẩm từ backend
  const [cartProducts, setCartProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      if (!cartItems.length) {
        setCartProducts([]);
        return;
      }
      try {
        // Lấy tất cả id sản phẩm trong giỏ
        const ids = cartItems.map(item => item.id);
        // Gọi API nhiều lần hoặc backend hỗ trợ lấy nhiều id cùng lúc
        const productPromises = ids.map(id =>
          fetch(`${apiUrl}/products.php?id=${id}`).then(res => res.json())
        );
        const results = await Promise.all(productPromises);
        // Kết hợp số lượng từ cartItems vào sản phẩm
        const products = results.map((res, idx) => {
          const prod = res.success ? res.data : null;
          if (!prod) return null;
          return { ...prod, so_luong: cartItems[idx]?.so_luong || 1 };
        }).filter(Boolean);
        setCartProducts(products);
      } catch (err) {
        setCartProducts([]);
      }
    };
    fetchProducts();
  }, [cartItems, apiUrl]);

  // Tính tổng số lượng và tổng tiền dựa trên cartProducts (dữ liệu từ backend)
  const calculateCartSummary = useMemo(() => {
    const totalQuantity = cartProducts.reduce(
      (sum, item) => sum + (item.so_luong || 1),
      0
    );
    const totalAmount = cartProducts.reduce((sum, item) => {
      const price = item.gia_sau || 0;
      return sum + price * (item.so_luong || 1);
    }, 0);
    return { totalQuantity, totalAmount };
  }, [cartProducts]);

  // Khi thêm/xóa/cập nhật giỏ hàng, vẫn cho phép thao tác khi chưa đăng nhập (giỏ hàng tạm cho khách)
  const addToCart = (product, onAnimationStart) => {
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

  const removeFromCart = (product_id) => {
    setCartItems(cartItems.filter((item) => item.id !== product_id));
  };

  const updateQuantity = (product_id, quantity) => {
    if (quantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === product_id ? { ...item, so_luong: quantity } : item
      )
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
    updateQuantity,
    clearCart,
    animationTrigger,
    cartProducts, // Thêm vào đây
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
