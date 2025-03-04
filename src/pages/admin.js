import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";
import { FaNewspaper, FaUser, FaEnvelope } from "react-icons/fa";
import useArticles from "../services/articleService";
import useAuth from "../services/authService";
import AtomSpinner from "./components/Spinner";
import "../styles/admin.css";
import CookieModal from "./components/Cookie"; // Assurez-vous de créer la modal CookieModal
import useMessages from "../services/messageService";
import useUsers from "../services/userService";

const Admin = () => {
  const { loading, user, userCount, getUserCount, checkAuth } = useAuth();
  const { users } = useUsers();
  const { articlesCount, getTotalArticlesByUser } = useArticles();
  const { getUnreadMessages, messages } = useMessages();

  const [showCookieModal, setShowCookieModal] = useState(false);

  console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      if (user.role === "admin") {
        getUserCount();
        articlesCount();
        getUnreadMessages();
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Si l'utilisateur est connecté et qu'il n'a pas encore accepté les cookies
    if (user && !user.cookie && !localStorage.getItem("cookiesAccepted")) {
      setShowCookieModal(true); // Affiche la modal des cookies
    }
  }, [user]);

  const handleCookiesAcceptance = () => {
    // Enregistrer l'acceptation des cookies
    localStorage.setItem("cookiesAccepted", "true");
    setShowCookieModal(false); // Fermer la modal
  };

  console.log(messages.length);

  const todaysDateFormatted = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
  }).format(new Date());

  // Fonction pour récupérer le nom de l'utilisateur basé sur message.userId
  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Utilisateur inconnu"; // Renvoie "Utilisateur inconnu" si aucun utilisateur n'est trouvé
  };

  return loading ? (
    <AtomSpinner />
  ) : (
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
        <article onClick={() => navigate("/articles")}>
          <FaNewspaper size={48} className="admin-icon" />
          <p className="title">{user.articles?.length ?? 0}</p>
          <p className="subtitle">Articles</p>
        </article>

        <article onClick={() => navigate("/app/messages")}>
          <FaEnvelope size={48} className="admin-icon" />
          <p className="title">{messages?.length ?? 0}</p>
          <p className="subtitle">Nouveau(x) Messages</p>
        </article>

        {user?.role === "admin" && (
          <article onClick={() => navigate("/users")}>
            <FaUser size={48} className="admin-icon" />
            <p className="title">{userCount ?? 0}</p>
            <p className="subtitle">Utilisateurs</p>
          </article>
        )}
      </div>

      {/* Affichage des messages avec nom d'utilisateur */}
      <div className="admin-messages">
        {messages?.map((message) => (
          <div key={message.id} className="message-item">
            <p>
              <strong>Message de:</strong> {getUserName(message.userId)}
            </p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
