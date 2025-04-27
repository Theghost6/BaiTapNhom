import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./page/funtion/AuthContext";
import { CartProvider } from "./page/funtion/useCart";
import { ToastContainer } from "react-toastify";
import "./style/home.css";
import "./style/contact.css";
import "./style/header.css";
import "./style/footer.css";

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
    <CartProvider>
      <AuthProvider>
        <Router>
          <Header />
          <main className="main-content">
            <Suspense fallback={<div>Đang tải...</div>}>
              <Routes>
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
          </main>
          <Footer />
          <ToastContainer />
        </Router>
      </AuthProvider>
    </CartProvider>
  );
};

const NotFound = () => {
  return (
    <div className="not-found">
      <h2>404 - Trang không tìm thấy</h2>
      <p>Xin lỗi, trang bạn đang tìm không tồn tại.</p>
      <button onClick={() => window.location.href = "/"}>Quay về trang chủ</button>
    </div>
  );
};

export default App;
