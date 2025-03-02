import React, { createContext, useState, useContext, useEffect } from "react";
import useMessages from "../services/messageService"; // Le service pour gérer les messages

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const {
    messages, // Liste des messages récupérés
    message, // Message spécifique actuellement sélectionné
    loading, // Indicateur de chargement pour les messages
    error, // Erreur si quelque chose ne va pas lors de la récupération des messages
    sendMessage, // Fonction pour envoyer un message
    getUnreadMessages, // Fonction pour récupérer les messages non lus
    markMessageAsRead, // Fonction pour marquer un message comme lu
    replyToMessage, // Fonction pour répondre à un message
  } = useMessages();

  return (
    <MessageContext.Provider
      value={{
        messages,
        message,
        loading,
        error,
        sendMessage,
        getUnreadMessages,
        markMessageAsRead,
        replyToMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);
