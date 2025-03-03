import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";
import { FaNewspaper, FaUser, FaEnvelope } from "react-icons/fa";
import useArticles from "../services/articleService";
import useAuth from "../services/authService";
import AtomSpinner from "./components/Spinner";
import "../styles/admin.css";
import CookieModal from "./components/Cookie"; // Assurez-vous de créer la modal CookieModal

const Admin = () => {
  const { loading, user, userCount, getUserCount } = useAuth();
  const { articlesCount, articleCount } = useArticles();
  const [showCookieModal, setShowCookieModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      articlesCount();
      getUserCount();
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Si l'utilisateur est connecté et qu'il n'a pas encore accepté les cookies
    if (user && user.count === 1 && !localStorage.getItem("cookiesAccepted")) {
      setShowCookieModal(true); // Affiche la modal des cookies
    }
  }, [user]);

  const checkUserCountAndTriggerAuth = (user) => {
    if (user && user.cookieId === 1) {
    }
  };

  const handleCookiesAcceptance = () => {
    // Enregistrer l'acceptation des cookies
    localStorage.setItem("cookiesAccepted", "true");
    setShowCookieModal(false); // Fermer la modal
  };

  if (loading) return <AtomSpinner />;

  const todaysDateFormatted = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
  }).format(new Date());

  return (
    <div className="admin-container">
      {/* Modal de cookies */}
      {showCookieModal && <CookieModal onAccept={handleCookiesAcceptance} />}

      <section className="admin-header">
        <h1>Bienvenue sur le tableau de bord, {user?.name || "Utilisateur"}</h1>
        <h2>
          {todaysDateFormatted.charAt(0).toUpperCase() +
            todaysDateFormatted.slice(1)}
        </h2>
      </section>

      <div className="admin-statistics">
        <article>
          <FaNewspaper size={48} className="admin-icon" />
          <p className="title">{articleCount ?? 0}</p>
          <p className="subtitle">Articles</p>
        </article>

        <article>
          <FaUser size={48} className="admin-icon" />
          <p className="title">{userCount ?? 0}</p>
          <p className="subtitle">Utilisateurs</p>
        </article>

        {user?.role === "admin" && (
          <article>
            <FaEnvelope size={48} className="admin-icon" />
            <p className="title">{articleCount ?? 0}</p>
            <p className="subtitle">Messages</p>
          </article>
        )}
      </div>
    </div>
  );
};

export default Admin;
