import React, { useEffect, useState } from "react";
import useMessages from "../../services/messageService";
import AtomSpinner from "../components/Spinner";
import "../../styles/conversation.css";
import useAuth from "../../services/authService";

const ConversationModal = ({ userId, conversationId, isAdmin, onClose }) => {
  const {
    messages,
    loading,
    getMessagesByConversation,
    replyToMessage,
    closeConversation,
  } = useMessages();
  const { user } = useAuth();

  const [messagesList, setMessagesList] = useState([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (conversationId) {
      getMessagesByConversation(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    setMessagesList(messages);
  }, [messages]);

  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };

  const handleSendReply = () => {
    if (messagesList.length > 0 && reply.trim() !== "") {
      const lastMessage = messagesList[messagesList.length - 1];
      const firstMessage = messagesList[0];
      console.log({ lastMessage, firstMessage });
      // Déterminer le titre original pour la réponse
      const originalTitle = lastMessage.title
        ? lastMessage.title
        : `RE : ${firstMessage.title}`;

      // Si c'est un admin, on ajoute aussi l'adminId
      const adminId = user.role === "admin" ? user.id : null;
      const userId = firstMessage.userId;
      // Envoi de la réponse
      replyToMessage(
        lastMessage.id,
        reply,
        originalTitle,
        userId,
        adminId // Ajout de l'adminId si c'est un admin
      );

      setReply(""); // Réinitialiser le champ après l'envoi
      onClose(); // Fermer la modal après l'envoi
    }
  };

  const handleCloseConversation = () => {
    if (messagesList.length > 0) {
      closeConversation(messagesList[0].id);
      onClose(); // Fermer la modal après la clôture de la conversation
    }
  };

  if (loading) {
    return (
      <div className="conversation-modal">
        <p className="conversation-loading-text">
          <AtomSpinner />
        </p>
      </div>
    );
  }

  return (
    <div className="conversation-modal">
      <div className="conversation-modal-content">
        <button className="conversation-btn-close" onClick={onClose}>
          X
        </button>

        {/* Affichage du titre du premier message */}
        <h2 className="conversation-title">
          {messagesList.length > 0 ? messagesList[0].title : "Conversation"}
        </h2>

        <div className="conversation-messages-list">
          {messagesList.length === 0 ? (
            <p>Aucun message dans cette conversation.</p>
          ) : (
            messagesList.map((msg) => (
              <div
                key={msg.id}
                className={`conversation-message ${
                  msg.adminId === null ? "message-user" : "message-admin"
                }`}
              >
                <p>
                  <strong>{msg.title}</strong>
                </p>
                <p>{msg.content}</p>
                <p>
                  <em>Status: {msg.status}</em>
                </p>
              </div>
            ))
          )}
        </div>

        {messagesList.length > 0 && (
          <div className="conversation-actions">
            <div className="conversation-reply">
              <input
                type="text"
                value={reply}
                onChange={handleReplyChange}
                placeholder="Répondre au dernier message..."
                className="conversation-reply-input"
              />
              <button
                onClick={handleSendReply}
                className="conversation-reply-button"
              >
                Envoyer
              </button>
            </div>

            {/* Bouton pour clôturer la conversation (visible uniquement pour les admins) */}
            {user.role === "admin" && (
              <button
                onClick={handleCloseConversation}
                className="conversation-close-button"
              >
                Clôturer la conversation
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationModal;
