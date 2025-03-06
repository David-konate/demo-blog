import React, { useState, useEffect } from "react";
import "../styles/parametres.css";
import useAuth from "../services/authService";
import AtomSpinner from "./components/Spinner";
import CookiesModal from "./components/Cookie";

const Parametres = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuth();
  const [isCookieModalOpen, setCookieModalOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") === "dark";
    setDarkMode(savedTheme);
    document.documentElement.classList.toggle("dark-mode", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    document.documentElement.classList.toggle("dark-mode", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <div className="params-container">
      <h1>Paramètres</h1>
      <p>Personnalise ton expérience selon tes préférences.</p>

      <div className="params-section">
        <h2>Thème</h2>
        <p>
          Choisis entre un mode clair énergisant et un mode sombre immersif.
        </p>
        <button className="params-cookie-btn" onClick={toggleTheme}>
          {darkMode ? "🌙 Mode Sombre" : "☀️ Mode Clair"}
        </button>
      </div>

      <div className="params-section">
        <h2>Cookies</h2>
        <p>Gère tes préférences en matière de cookies.</p>
        <button
          className="params-cookie-btn"
          type="button"
          onClick={() => setCookieModalOpen(true)}
        >
          Gérer les cookies 🍪
        </button>
      </div>

      <CookiesModal
        isOpen={isCookieModalOpen}
        onClose={() => setCookieModalOpen(false)}
      />
    </div>
  );
};

export default Parametres;
