import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Contact from "./page/Contact";
import Home from "./page/Home";
import Register from "./page/Register";
import AllDiaDiem from "./page/funtion/AllDiaDiem";
import ChiTietDiaDiem from "./page/funtion/ChiTietDiaDiem";
import Profile from "./page/funtion/Profile";
import { AuthProvider } from "./page/funtion/AuthContext";
import Checkout from "./page/funtion/Checkout";
import Cart from "./page/funtion/Cart";
import Admin from "./page/funtion/Admin";
import ThankYou from "./page/funtion/ThankYou";
import Hotels from "./page/funtion/Hotels";
import ChiTietHotel from "./page/funtion/ChiTietHotel";
import "./style/home.css";
import "./style/contact.css";
import "./style/header.css";
import "./style/footer.css";
import { CartProvider } from "./page/funtion/useCart";
import { Hotel } from "lucide-react";

const App = () => {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/AllDiaDiem" element={<AllDiaDiem />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/thankyou" element={<ThankYou />} />
              <Route path="/dia-diem/:id" element={<ChiTietDiaDiem />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotel/:id" element={<ChiTietHotel/>} />
              {/* <Route path="/about" element={<About />} /> */}
              <Route path="/contact" element={<Contact />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>

          <Footer />
        </Router>
      </AuthProvider>
    </CartProvider>
  );
};

export default App;
