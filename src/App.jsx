import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Contact from "./page/Contact";
import Home from "./page/Home";
import "./page/home.css";
import "./page/contact.css";
import "./components/header.css"
import "./components/footer.css";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
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

