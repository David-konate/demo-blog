import { useState, useEffect } from "react";
import trackerApi from "../api/tracker";
import useAuth from "./authService";

const LOCAL_STORAGE_KEY = "cookies_preferences";

const useCookies = () => {
  const [cookie, setCookie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getUserFromStorage } = useAuth();
  const user = getUserFromStorage();

  useEffect(() => {
    const getCookiesPreferences = async () => {
      try {
        if (user && user.id) {
          // Récupération depuis l'API pour un utilisateur connecté
          const response = await trackerApi.get(`/cookies/${user.id}`);
          setCookie(response.data.cookie);
        } else {
          // Récupération depuis localStorage pour un visiteur
          const localPreferences = localStorage.getItem(LOCAL_STORAGE_KEY);
          setCookie(localPreferences ? JSON.parse(localPreferences) : {});
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn(
            "Préférences de cookies non trouvées, affichage du modal."
          );
          setCookie(null); // Déclenche l'affichage du modal
        } else {
          setError(
            error.response ? error.response.data.message : "Erreur du serveur"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    getCookiesPreferences();
  }, [user]);

  const setCookiesPreferences = async (cookiesAccepted, newsletterAccepted) => {
    setLoading(true);
    try {
      const newPreferences = { cookiesAccepted, newsletterAccepted };

      if (user && user.id) {
        // Enregistrement via l'API
        const response = await trackerApi.post("/cookies", {
          userId: user.id,
          ...newPreferences,
        });
        setCookie(response.data.cookie);
      } else {
        // Stockage local
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPreferences));
        setCookie(newPreferences);
      }
    } catch (error) {
      setError(
        error.response ? error.response.data.message : "Erreur du serveur"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    cookie,
    loading,
    error,
    setCookiesPreferences,
  };
};

export default useCookies;
