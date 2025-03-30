import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Contact from "./page/Contact";
import Home from "./page/Home";
import Account from "./page/Account";
import Register from "./page/Register";
import "./style/home.css";
import "./style/contact.css";
import "./style/header.css"
import "./style/footer.css";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/contact" element={<Contact />} />
          {/* Add more routes as needed */}
        </Routes>
      </main>
     
      <Footer/>
    </Router>
  );
};

export default App;

