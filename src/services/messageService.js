import { useState, useEffect } from "react";
import trackerApi from "../api/tracker";
import socket from "../services/socketService"; // Importation du WebSocket

const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [countMessage, setCountMessage] = useState(0);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Envoyer un message
  const sendMessage = async (userId, { title, content }) => {
    setLoading(true);
    try {
      const response = await trackerApi.post("/messages/send", {
        userId,
        title, // 🔹 Assurer l'envoi du titre
        content: String(content), // 🔹 Convertir en chaîne au cas où
      });

      setMessages((prev) => [...prev, response.data.data]); // 🔹 Ajouter uniquement le message
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Répondre à un message
  const replyToMessage = async (
    messageId,
    senderId,
    content,
    isAdmin = false
  ) => {
    setLoading(true);
    try {
      const response = await trackerApi.post("/messages/reply", {
        messageId,
        content,
        ...(isAdmin ? { adminId: senderId } : { userId: senderId }), // Détecte si l'expéditeur est admin ou utilisateur
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "En cours" } : msg
        )
      );

      setMessages((prev) => [...prev, response.data.data]);
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
      updateMessageStatus(messageId, "Résolu");
    }
  };

  // 🔹 Récupérer les messages non lus
  const getUnreadMessages = async () => {
    setLoading(true);
    try {
      const response = await trackerApi.get("/messages/unread");
      console.log({ response });
      setMessages(response.data.messages);
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Marquer un message comme lu
  const markMessageAsRead = async (messageId) => {
    setLoading(true);
    try {
      const response = await trackerApi.put(`/messages/${messageId}/read`);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? response.data.data : msg))
      );
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Récupérer l'historique des messages d'un utilisateur
  const getMessagesByUserId = async (userId) => {
    setLoading(true);
    try {
      const response = await trackerApi.get(`/messages/history/${userId}`);
      setMessages(response.data.messages);
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Récupérer les messages avec pagination
  const getMessages = async (page = 1, limit = 10, filters = {}) => {
    setLoading(true);
    try {
      const response = await trackerApi.get("/messages/filter", {
        params: {
          ...filters, // Ajout des filtres
          page, // Paramètre pour la pagination
          limit, // Paramètre pour la pagination
        },
      });
      setMessages(response.data.messages);
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Supprimer un message
  const deleteMessage = async (messageId) => {
    setLoading(true);
    try {
      await trackerApi.delete(`/messages/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Mettre à jour le statut d’un message
  const updateMessageStatus = async (messageId, status) => {
    setLoading(true);
    try {
      const response = await trackerApi.put(`/messages/${messageId}/status`, {
        status,
      });
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? response.data.data : msg))
      );
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Écoute des événements WebSocket
  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("newReply", (reply) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === reply.messageId
            ? { ...msg, replies: [...(msg.replies || []), reply] }
            : msg
        )
      );
    });

    return () => {
      socket.off("newMessage");
      socket.off("newReply");
    };
  }, []);

  // 🔹 Fonction pour récupérer le nombre de messages non lus
  const getUnreadMessageCount = async (userId = null) => {
    console.log("getcout");
    try {
      const response = await trackerApi.get("/messages/unreadCount", {
        params: userId ? { userId } : {},
      });
      console.log(response.data.unreadCount);
      setCountMessage(response.data.unreadCount);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du nombre de messages non lus :",
        error
      );
      return 0; // Retourne 0 en cas d'erreur pour éviter de planter l'affichage
    }
  };

  return {
    messages,
    message,
    loading,
    error,
    countMessage,
    sendMessage,
    getUnreadMessages,
    markMessageAsRead,
    replyToMessage,
    getMessagesByUserId,
    getMessages,
    deleteMessage,

    updateMessageStatus,
    getUnreadMessageCount,
  };
};

export default useMessages;
