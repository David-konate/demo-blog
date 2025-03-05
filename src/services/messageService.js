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
    content,
    originalTitle,
    userId,
    adminId
  ) => {
    setLoading(true);
    try {
      // Envoi de la requête de réponse
      const response = await trackerApi.post("/messages/reply", {
        messageId,
        content,
        title: originalTitle, // Ajouter le titre du message original
        userId, // Toujours envoyer userId pour savoir avec qui l'administrateur discute
        ...(adminId ? { adminId } : {}), // Ajouter adminId seulement si l'utilisateur est un admin
      });

      // Mise à jour de l'état des messages : on marque le message comme "En cours"
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "En cours" } : msg
        )
      );

      // Ajout de la nouvelle réponse dans l'état des messages
      setMessages((prev) => [...prev, response.data.data]);

      // Si une réponse a été ajoutée avec succès, on met à jour son statut à "Résolu"
      updateMessageStatus(messageId, "Résolu");
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // // 🔹 Gestion de l'envoi de la réponse
  // const handleSendReply = () => {
  //   if (messagesList.length > 0 && reply.trim() !== "") {
  //     const lastMessage = messagesList[messagesList.length - 1];
  //     const firstMessage = messagesList[0];
  //     console.log({ lastMessage, firstMessage });

  //     // Déterminer le titre original pour la réponse
  //     const originalTitle = lastMessage.title
  //       ? lastMessage.title
  //       : `RE : ${firstMessage.title}`;

  //     // Si c'est un admin, on ajoute aussi l'adminId
  //     const adminId = user.role === "admin" ? user.id : null;
  //     const userId = firstMessage.userId;

  //     // Envoi de la réponse
  //     replyToMessage(
  //       lastMessage.id,
  //       reply,
  //       originalTitle,
  //       userId,
  //       adminId // Ajout de l'adminId si c'est un admin
  //     );

  //     setReply(""); // Réinitialiser le champ après l'envoi
  //     onClose(); // Fermer la modal après l'envoi
  //   }
  // };

  // 🔹 Récupérer les messages non lus
  const getUnreadMessages = async () => {
    setLoading(true);
    try {
      const response = await trackerApi.get("/messages/unread");
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
      const response = await trackerApi.put(`/messages/status/${messageId}`, {
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

  // 🔹 Fonction pour récupérer le nombre de messages par statut
  const getMessageCountByStatus = async (status, userId = null) => {
    try {
      const response = await trackerApi.get("/messages/countByStatus", {
        params: {
          status, // Le statut des messages à filtrer, comme "Nouveau", "En cours", etc.
          userId, // Optionnel : si un userId est fourni, il sera inclus dans les paramètres
        },
      });
      setCountMessage(response.data); // Mets à jour l'état avec le nombre de messages
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du nombre de messages par statut :",
        error
      );
      return 0; // Retourne 0 en cas d'erreur pour éviter de planter l'affichage
    }
  };

  const getMessagesByConversation = async (conversationId) => {
    setLoading(true);
    try {
      const response = await trackerApi.get(
        `/conversations/${conversationId}/messages`
      );

      setMessages(response.data.messages); // Stocke les messages de la conversation
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
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
    getMessagesByConversation,
    updateMessageStatus,
    getMessageCountByStatus,
  };
};

export default useMessages;
