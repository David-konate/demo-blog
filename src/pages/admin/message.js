import React, { useEffect, useState } from "react";
import useAuth from "../../services/authService";
import useMessages from "../../services/messageService";
import "../../styles/message.css";
import { navigate } from "gatsby";
import AtomSpinner from "../components/Spinner";
import ConversationModal from "../components/Conversation";
import useUsers from "../../services/userService";
import { FaTrash } from "react-icons/fa"; // Import the trash icon

const AdminMessagesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { users, getAllUsers, loading: userLoading } = useUsers();
  const {
    messages,
    loading: messagesLoading,
    getMessages,
    deleteMessage,
    updateMessageStatus,
  } = useMessages();

  const [filter, setFilter] = useState({ status: "", userId: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [conversationId, setConversationId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    getAllUsers();

    if (!authLoading && user?.role === "admin") {
      getMessages(currentPage, limit, filter);
    } else {
      getMessages(currentPage, limit, { userId: user.id });
    }
  }, [user, authLoading, navigate, currentPage, filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      const totalMessages = messages.length;
      const totalPages = Math.ceil(totalMessages / limit);

      if (newPage <= totalPages) {
        setCurrentPage(newPage);
      } else {
        setCurrentPage(1); // Revenir à la première page si la page suivante n'a pas de messages
      }
    }
  };

  const isLoading = authLoading || messagesLoading || userLoading;

  const totalMessages = messages.length;
  const totalPages = Math.ceil(totalMessages / limit);
  const hasNextPage = currentPage < totalPages;

  if (isLoading) {
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
          <option value="">Tout</option>
          <option value="Nouveau">Non lu</option>
          <option value="En cours">En cours</option>
          <option value="Résolu">Résolu</option>
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
      <div className="table-container">
        <table className="messages-table">
          <thead>
            <tr>
              <th>Expéditeur</th>
              <th className="message-title-header">Titre</th>
              <th className="message-content-header">Message</th>
              <th className="message-action-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => {
              const nameSender =
                user.role !== "admin"
                  ? `Admin : ${msg.admin?.name}`
                  : msg.user?.name || "Utilisateur inconnu";

              return (
                <tr key={msg.id}>
                  <td>{nameSender}</td>
                  <td className="message-title">{msg.title}</td>
                  <td className="message-content">{msg.content}</td>
                  <td className="actions">
                    <div
                      className={`msg-status ${
                        msg.status === "Nouveau"
                          ? "msg-status-new"
                          : msg.status === "En cours"
                          ? "msg-status-in-progress"
                          : "msg-status-default"
                      }`}
                    >
                      {msg.status}
                    </div>

                    <button
                      className="btn btn-reply"
                      onClick={() => {
                        setModalUserId(msg.userId);
                        setIsModalOpen(true);
                        updateMessageStatus(msg.id, "En cours");
                        setConversationId(msg.conversationId);
                      }}
                    >
                      {msg.status === "Nouveau"
                        ? "Voir le message"
                        : "Répondre"}
                    </button>

                    <FaTrash
                      className="icon-delete"
                      onClick={() => deleteMessage(msg.id)}
                      disabled={
                        msg.status === "Nouveau" || msg.status === "En cours"
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination-messages">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Suivant
        </button>
      </div>

      {isModalOpen && (
        <ConversationModal
          userId={modalUserId}
          conversationId={conversationId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminMessagesPage;
