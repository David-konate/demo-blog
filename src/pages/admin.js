import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";
import { FaNewspaper, FaUser, FaEnvelope } from "react-icons/fa";
import useArticles from "../services/articleService";
import useAuth from "../services/authService";
import AtomSpinner from "./components/Spinner";
import "../styles/admin.css";
import CookieModal from "./components/Cookie";
import useMessages from "../services/messageService";
import useUsers from "../services/userService";

const Admin = () => {
  const { loading, user, userCount, getUserCount } = useAuth();
  const { users } = useUsers();
  const { articlesCount } = useArticles();
  const { getUnreadMessages, messages, getMessageCountByStatus, countMessage } =
    useMessages();

  const [showCookieModal, setShowCookieModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user.role === "admin") {
        getUserCount();
        articlesCount();
        getUnreadMessages();
        getMessageCountByStatus();
      } else {
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

  const todaysDateFormatted = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
  }).format(new Date());

  // Fonction pour récupérer le nom de l'utilisateur basé sur message.userId
  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Utilisateur inconnu"; // Renvoie "Utilisateur inconnu" si aucun utilisateur n'est trouvé
  };

  // Récupérer le nombre de messages non lus ou le nombre de messages "En cours"
  const getMessageCount = () => {
    if (countMessage.Nouveau > 0) {
      return `${countMessage.Nouveau} Non lu(s)`; // Affiche le nombre de messages non lus
    }

    if (countMessage.EnCours > 0) {
      return `${countMessage.EnCours} En cours`; // Affiche le nombre de messages "En cours"
    }

    return "Messages"; // Si aucun message non lu ni en cours, affiche "Messages"
  };

  const deleteMessage = (messageId) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (
      message &&
      message.status !== "Nouveau" &&
      message.status !== "En cours"
    ) {
      // Appel API ou logique pour supprimer le message
      console.log(`Message ${messageId} supprimé`);
      // Ici, tu peux ajouter ta logique pour supprimer un message (par exemple, une API)
    } else {
      console.log(`Impossible de supprimer le message avec l'ID ${messageId}`);
    }
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

        <article
          onClick={() => navigate("/app/messages")}
          className={
            getMessageCount().includes("Non lu")
              ? "message-status-new"
              : getMessageCount().includes("En cours")
              ? "message-status-in-progress"
              : "message-status-default"
          }
        >
          <FaEnvelope
            size={48}
            className={`admin-icon ${
              getMessageCount().includes("Non lu")
                ? "icon-status-new"
                : getMessageCount().includes("En cours")
                ? "icon-status-in-progress"
                : "icon-status-default"
            }`}
          />
          <p className="title">{getMessageCount()}</p>
          <p className="subtitle">Messages</p>
        </article>

        {user?.role === "admin" && (
          <article onClick={() => navigate("/users")}>
            <FaUser size={48} className="admin-icon" />
            <p className="title">{userCount ?? 0}</p>
            <p className="subtitle">Utilisateurs</p>
          </article>
        )}
      </div>

      {/* Affichage des messages avec nom d'utilisateur et suppression */}
      <div className="admin-messages">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`message-item ${
              message.status === "Nouveau" || message.status === "En cours"
                ? "message-status-disabled"
                : ""
            }`}
          >
            <p>
              <strong>Message de:</strong> {getUserName(message.userId)}
            </p>
            <p>{message.content}</p>
            <button
              className="btn btn-delete"
              onClick={() => deleteMessage(message.id)}
              disabled={
                message.status === "Nouveau" || message.status === "En cours"
              }
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
