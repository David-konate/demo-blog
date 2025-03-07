import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import "../../styles/global.css";
import SideBar from "./SideBarCRM";
import NavbarAdmin from "./NavBarAdmin";
import CookiesModal from "./Cookie";
import useAuth from "../../services/authService";
import { navigate } from "gatsby";

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
  const { user } = useAuth(); // Assuming the user info is fetched from authService
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isCookiesModalOpen, setIsCookiesModalOpen] = useState(false);
  console.log(user);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  useEffect(() => {
    if (user && user.loginCount === 1) {
      setIsCookiesModalOpen(true); // Open the modal if user.logincount === 1
    } else if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <div className="page-container">
      {!isPhone && <NavbarAdmin />} {/* Hide Navbar on mobile */}
      {isPhone && (
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          ☰ {/* Icon for menu */}
        </button>
      )}
      {isPhone && sidebarVisible && <SideBar />} {/* Show Sidebar button */}
      {!isPhone && <SideBar />} {/* Always show Sidebar on larger screens */}
      {/* Main Content */}
      <main className="content">
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { isPhone, isLaptop })
            : child
        )}
      </main>
      <Footer />
      {/* Cookies Modal */}
      <CookiesModal
        isOpen={isCookiesModalOpen}
        onClose={() => setIsCookiesModalOpen(false)}
      />
    </div>
  );
};

export default LayoutAdmin;
