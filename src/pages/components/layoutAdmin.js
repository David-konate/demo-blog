import React, { useState, useEffect } from "react";
import Navbar from "./navBar";
import Footer from "./Footer";
import "../../styles/global.css"; // Assure-toi d'inclure tes styles globaux
import SideBar from "./SideBarCRM";

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

const LayoutAdmin = ({ children }) => {
  const isPhone = useMedia("(max-width: 768px)");
  const isLaptop = useMedia("(min-width: 1024px)");

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  return (
    <div className="page-container">
      {!isPhone && <Navbar />} {/* Hide Navbar on mobile */}
      {isPhone && (
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          ☰ {/* Icon for menu */}
        </button>
      )}
      {isPhone && sidebarVisible && <SideBar />} {/* Show Sidebar button */}
      {!isPhone && <SideBar />} {/* Always show Sidebar on larger screens */}
      <main className="content">
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

export default LayoutAdmin;
