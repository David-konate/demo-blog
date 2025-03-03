import React, { createContext, useContext } from "react";
import useCookies from "../services/cookieService"; // Le service pour gérer les cookies

const CookieContext = createContext();

export const CookieProvider = ({ children }) => {
  const {
    cookie, // Préférences de cookies récupérées
    loading, // Indicateur de chargement pour les cookies
    error, // Erreur si quelque chose ne va pas lors de la récupération des cookies
    setCookiesPreferences, // Fonction pour définir ou mettre à jour les préférences de cookies
    getCookiesPreferences, // Fonction pour récupérer les préférences de cookies
  } = useCookies();

  return (
    <CookieContext.Provider
      value={{
        cookie,
        loading,
        error,
        setCookiesPreferences,
        getCookiesPreferences,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};

export const useCookieContext = () => useContext(CookieContext);
