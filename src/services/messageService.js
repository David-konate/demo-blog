import { useState, useEffect } from "react";
import trackerApi from "../api/tracker";
import socket from "../services/socketService"; // Importation du WebSocket

const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour envoyer un message
  const sendMessage = async (userId, content) => {
    setLoading(true);
    try {
      const response = await trackerApi.post("/messages", { userId, content });
      setMessages((prevMessages) => [...prevMessages, response.data.data]);
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les messages non lus
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

  // Fonction pour marquer un message comme lu
  const markMessageAsRead = async (messageId) => {
    setLoading(true);
    try {
      const response = await trackerApi.put(`/messages/${messageId}/read`);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? response.data.data : msg
        )
      );
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour répondre à un message
  const replyToMessage = async (messageId, adminId, content) => {
    setLoading(true);
    try {
      const response = await trackerApi.post("/messages/reply", {
        messageId,
        adminId,
        content,
      });
      setMessages((prevMessages) => [...prevMessages, response.data.data]);
    } catch (error) {
      setError(error.response ? error.response.data.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Écoute des événements WebSocket
  useEffect(() => {
    // Écoute les nouveaux messages en temps réel
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Écoute les réponses aux messages
    socket.on("newReply", (reply) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === reply.messageId
            ? { ...msg, replies: [...msg.replies, reply] }
            : msg
        )
      );
    });

    return () => {
      socket.off("newMessage");
      socket.off("newReply");
    };
  }, []);

  return {
    messages,
    message,
    loading,
    error,
    sendMessage,
    getUnreadMessages,
    markMessageAsRead,
    replyToMessage,
  };
};

export default useMessages;
