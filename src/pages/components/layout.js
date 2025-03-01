import React, { useState, useEffect } from "react";
import Navbar from "./navBar";
import Footer from "./Footer";
import "../../styles/global.css"; // Assure-toi d'inclure tes styles globaux

export function useMedia(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

const Layout = ({ children }) => {
  const isPhone = useMedia("(max-width: 768px)");
  const isLaptop = useMedia("(min-width: 1024px)");

  return (
    <div className="page-container">
      <Navbar />
      <main className="content-container">
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { isPhone, isLaptop })
            : child
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
