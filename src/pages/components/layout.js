import React from "react";
import Navbar from "./navBar";
import Footer from "./Footer";
import "../../styles/global.css"; // Assure-toi d'inclure tes styles globaux

const Layout = ({ children }) => {
  return (
    <div className="page-container">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
