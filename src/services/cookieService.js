import { useState, useEffect } from "react";
import trackerApi from "../api/tracker";
import useAuth from "./authService";
import Cookies from "js-cookie";

const TOKEN_KEY =
  "6e025402321a87b4e9f4729421059d34a0a40bda09a63c2ef6c84968f4f1b36bc471188416a4831e12f7b6f4738a13c6243ae6c2b3033ee25c6c85d74b351b2a";
const COOKIE_PREFERENCES_KEY = "auth_token";

const useCookies = () => {
  const [cookie, setCookie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getUserFromStorage } = useAuth();
  const user = getUserFromStorage();

  useEffect(() => {
    const getCookiesPreferences = async () => {
      console.log("[useCookies] Début de récupération des cookies");
      setLoading(true);
      try {
        if (user?.id) {
          console.log(
            "[useCookies] Utilisateur connecté, récupération via API"
          );
          const response = await trackerApi.get(`/cookies/${user.id}`);
          setCookie(response.data.cookie);
          Cookies.set(
            COOKIE_PREFERENCES_KEY,
            JSON.stringify(response.data.cookie),
            { expires: 7 }
          );
        } else {
          console.log(
            "[useCookies] Utilisateur non connecté, récupération via cookies"
          );
          const storedCookies = Cookies.get(COOKIE_PREFERENCES_KEY);
          setCookie(storedCookies ? JSON.parse(storedCookies) : {});
        }
      } catch (error) {
        console.error(
          "[useCookies] Erreur lors de la récupération des cookies:",
          error
        );
        setError(
          error.response ? error.response.data.message : "Erreur du serveur"
        );
      } finally {
        setLoading(false);
      }
    };

    getCookiesPreferences();
  }, []);

  const setCookiesPreferences = async (cookiesAccepted, newsletterAccepted) => {
    console.log("[useCookies] Enregistrement des préférences:", {
      cookiesAccepted,
      newsletterAccepted,
    });
    setLoading(true);
    try {
      const newPreferences = { cookiesAccepted, newsletterAccepted };

      if (user?.id) {
        console.log("[useCookies] Utilisateur connecté, envoi à l'API");
        const response = await trackerApi.post("/cookies", {
          userId: user.id,
          ...newPreferences,
        });
        setCookie(response.data.cookie);
        Cookies.set(
          COOKIE_PREFERENCES_KEY,
          JSON.stringify(response.data.cookie),
          { expires: 7 }
        );
      } else {
        console.log(
          "[useCookies] Utilisateur non connecté, enregistrement dans les cookies"
        );
        Cookies.set(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences), {
          expires: 7,
        });
        setCookie(newPreferences);
      }
    } catch (error) {
      console.error(
        "[useCookies] Erreur lors de la mise à jour des cookies:",
        error
      );
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
