import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./page/funtion/AuthContext";
import { CartProvider } from "./page/funtion/useCart";
import { ToastContainer } from "react-toastify";
import { motion } from "motion/react";
import "./style/home.css";
import "./style/contact.css";
import "./style/header.css";
import "./style/footer.css";
import "./style/app.css";

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
const Hotels = lazy(() => import("./page/funtion/Hotels"));
const ChiTietHotel = lazy(() => import("./page/funtion/ChiTietHotel"));

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <AnimatedRoutes />
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.main
        className="main-content"
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Suspense fallback={<div className="loading">Đang tải...</div>}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/AllLinhKien" element={<AllLinhKien />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="/linh-kien/:id" element={<ChiTietLinhKien />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotel/:id" element={<ChiTietHotel />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
};

const NotFound = () => {
  return (
    <motion.div
      className="not-found"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <h2>404 - Trang không tìm thấy</h2>
      <p>Xin lỗi, trang bạn đang tìm không tồn tại.</p>
      <button onClick={() => (window.location.href = "/")}>
        Quay về trang chủ
      </button>
    </motion.div>
  );
};

export default App;