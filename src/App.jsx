import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./page/funtion/AuthContext";
import { CartProvider } from "./page/funtion/useCart";
import Sidebar from "./components/Sidebar";
import "./style/home.css";
import "./style/contact.css";
import "./style/header.css";
import "./style/footer.css";
import "./style/app.css";
import ScrollToTop from "./page/funtion/ScrollToTop";
import { createGlobalStyle } from "styled-components";
import styled from 'styled-components';

const ResponsiveDiv = styled.div`
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 480px) {
    padding: 5px;
  }
`;

// Global style for font
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Ubuntu', sans-serif;
  }
`;

// Lazy load components
const Contact = lazy(() => import("./page/Contact"));
const Home = lazy(() => import("./page/Home"));
const Register = lazy(() => import("./page/Register"));
const AllLinhKien = lazy(() => import("./page/funtion/AllLinhKien"));
const ChiTietLinhKien = lazy(() => import("./page/funtion/ChiTietLinhKien"));
const Profile = lazy(() => import("./page/funtion/Profile"));
const Checkout = lazy(() => import("./page/funtion/Checkout"));
const Cart = lazy(() => import("./page/funtion/Cart"));
const Admin = lazy(() => import("./page/funtion/Admin"));
const ThankYou = lazy(() => import("./page/funtion/ThankYou"));
const TraCuuDonHang = lazy(() => import("./page/funtion/TraCuuDonHang"));
const LichSuDonHang = lazy(() => import("./page/funtion/Lich_Su_DH"));
const Developer = lazy(() => import("./page/funtion/Developer"));
const Blog = lazy(() => import("./page/funtion/Blog"));
const Invoice = lazy(() => import("./page/funtion/Invoice"));
const Wishlist = lazy(() => import("./page/funtion/Wishlist"));

// NotFound component
const NotFound = () => (
  <motion.div
    className="not-found"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.5 }}
  >
    <h2>404 - Trang không tìm thấy</h2>
    <p>Xin lỗi, trang bạn đang tìm không tồn tại!</p>
    <button onClick={() => (window.location.href = "/")}>
      Quay về trang chủ
    </button>
  </motion.div>
);

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <GlobalStyle />
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="page-container">
              <Header />
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <Suspense fallback={<div className="loading">Đang tải...</div>}>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <motion.div
                          key="home"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <Home />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <motion.div
                          key="register"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <Register />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/AllLinhKien"
                      element={
                        <motion.div
                          key="all-linh-kien"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <AllLinhKien />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/Profile"
                      element={
                        <motion.div
                          key="profile"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <Profile />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <motion.div
                          key="checkout"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <Checkout />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/invoice"
                      element={
                        <motion.div
                          key="invoice"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <Invoice />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/cart"
                      element={
                        <motion.div
                          key="cart"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <Cart />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <motion.div
                          key="admin"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <Admin />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/thankyou"
                      element={
                        <motion.div
                          key="thankyou"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <ThankYou />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/linh-kien/:id"
                      element={
                        <motion.div
                          key="chi-tiet-linh-kien"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <ChiTietLinhKien />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <motion.div
                          key="contact"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <Contact />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/developer"
                      element={
                        <motion.div
                          key="developer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <Developer />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/blog"
                      element={
                        <motion.div
                          key="blog"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <Blog />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/tracuu"
                      element={
                        <motion.div
                          key="tracuu"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <TraCuuDonHang />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/lich_su_don_hang"
                      element={
                        <motion.div
                          key="lich-su-don-hang"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <LichSuDonHang />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/wishlist"
                      element={
                        <motion.div
                          key="wishlist"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <Wishlist />
                        </motion.div>
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <motion.div
                          key="not-found"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                          <NotFound />
                        </motion.div>
                      }
                    />
                  </Routes>
                </AnimatePresence>
              </Suspense>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </>
  );
};

export default App;
