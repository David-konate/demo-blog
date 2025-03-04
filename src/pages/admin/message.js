import React, { useEffect, useState } from "react";
import useAuth from "../../services/authService";
import useMessages from "../../services/messageService";
import "../../styles/message.css";
import { navigate } from "gatsby";
import AtomSpinner from "../components/Spinner";
import ConversationModal from "../components/Conversation";

const AdminMessagesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    messages,
    loading: messagesLoading,
    getMessages,
    deleteMessage,
    getMessagesByUserId,
    updateMessageStatus,
  } = useMessages();

  const [replyContent, setReplyContent] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState({ status: "Nouveau", userId: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);

  // Liste des statuts possibles avec mappage
  const statusMapping = {
    Nouveau: "Non lu",
    EnCours: "En cours",
    Resolu: "Résolu",
  };

  // On récupère tous les statuts possibles (clé = statut, valeur = libellé)
  const statusKeys = Object.keys(statusMapping);

  useEffect(() => {
    if (!authLoading && user.role !== "admin") {
      getMessages({ userId: Number(user.id) }); // 🔹 Assurer un nombre
    } else if (user?.role === "admin") {
      getMessages();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // On applique le filtre sur le statut et les autres critères
    if (filter.status) {
      getMessages(filter);
    }
  }, [filter, getMessages]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredMessages = messages.filter((msg) => {
    // Filtrage des messages en fonction du statut et d'autres filtres comme l'ID utilisateur
    const statusMatch = filter.status ? msg.status === filter.status : true;
    const userIdMatch = filter.userId ? msg.userId === filter.userId : true;
    return statusMatch && userIdMatch;
  });

  const handleReply = (msg) => {
    setSelectedMessage(msg);
    setReplyContent("");
  };

  if (authLoading || messagesLoading) {
    return (
      <p className="loading-text">
        <AtomSpinner />
      </p>
    );
  }

  return (
    <div className="admin-messages-container">
      <h1 className="admin-messages-title">Gestion des Messages</h1>

      <div className="filter-section">
        <label htmlFor="status">Filtrer par statut</label>
        <select
          id="status"
          name="status"
          value={filter.status}
          onChange={handleFilterChange}
        >
          {statusKeys.map((statusKey) => (
            <option key={statusKey} value={statusKey}>
              {statusMapping[statusKey]}
            </option>
          ))}
        </select>

        <label htmlFor="userId">Filtrer par utilisateur</label>
        <input
          type="text"
          id="userId"
          name="userId"
          value={filter.userId}
          onChange={handleFilterChange}
          placeholder="ID de l'utilisateur"
        />
      </div>

      <table className="messages-table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Titre</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMessages.map((msg) => (
            <tr key={msg.id}>
              <td>{user.name}</td>
              <td className="message-title">{msg.title}</td>
              <td className="message-content">{msg.content}</td>
              <td className="actions">
                <div className="btn btn-read">{msg.status}</div>
                <button
                  className="btn btn-reply"
                  onClick={() => {
                    setModalUserId(msg.userId);
                    setIsModalOpen(true);
                    updateMessageStatus(msg.id, "En cours");
                  }}
                >
                  {msg.status === "Nouveau" ? "Répondre" : "Conversation"}
                </button>

                <button
                  className="btn btn-delete"
                  onClick={() => deleteMessage(msg.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <ConversationModal
          userId={modalUserId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminMessagesPage;
