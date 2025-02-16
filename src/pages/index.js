import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navBar";
import Welcome from "./welcome";
import { useState } from "react";
import { useMedia } from "../services/useMedia";
import Footer from "./components/footer";
import "../styles/global.css";
import CreateArticlePage from "./blog/blog-post-create";

const MyContext = React.createContext();

const IndexPage = () => {
  const [state, setState] = useState({ user: "David", theme: "light" });

  const isPhone = useMedia("(max-width: 767px)");
  const isTablet = useMedia("(min-width: 768px) and (max-width: 1224px)");
  const isLaptop = useMedia("(min-width: 1225px)");

  const mediaQueryState = { isPhone, isTablet, isLaptop };

  return (
    <Router>
      <MyContext.Provider value={{ state, setState, mediaQueryState }}>
        {/* Structure flexbox pour garder le footer en bas */}
        <div className="page-container">
          <Navbar />

          <div className="content">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route
                path="/blog/blog-post-creator"
                element={<CreateArticlePage />}
              />
              <Route path="/" element={<Welcome />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </MyContext.Provider>
    </Router>
  );
};

export default IndexPage;
