import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./page/Home";
import "./page/home.css";
// import "./components/header.css";
// import "./components/footer.css";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes as needed */}
        </Routes>
      </main>
      {/* <Footer /> Uncomment this line if Footer component is available */}
    </Router>
  );
};

export default App;

