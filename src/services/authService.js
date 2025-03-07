import { useState, useEffect } from "react";
import trackerApi from "../api/tracker";
import { navigate } from "gatsby";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = process.env.GATSBY_TOKEN_KEY;

const isBrowser = () => typeof window !== "undefined";

const getLocalData = (key) =>
  isBrowser() ? JSON.parse(localStorage.getItem(key)) : null;
const setLocalData = (key, data) =>
  isBrowser() && localStorage.setItem(key, JSON.stringify(data));
const clearAuth = () => {
  if (isBrowser()) {
    localStorage.removeItem("gatsbyUser");
    Cookies.remove(TOKEN_KEY);
  }
};

const useAuth = () => {
  const [state, setState] = useState({
    user: getLocalData("gatsbyUser"),
    loading: false,
    error: null,
    userCount: 0,
    cookiePreferences: null,
    newsletterSubscription: null,
  });

  const setUser = (user) => {
    if (user) {
      setLocalData("gatsbyUser", user);
      setState((prev) => ({ ...prev, user }));
    }
  };

  const register = async (email, password, name, role = "user") => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await trackerApi.post("/auth/register", {
        email,
        password,
        name,
        role,
      });
      Cookies.set(TOKEN_KEY, response.data.token, { expires: 7 });
      setUser(response.data.user);
      navigate("/app/admin");
    } catch (err) {
      console.error("Erreur d'inscription :", err);
      setState((prev) => ({ ...prev, error: "Erreur lors de l'inscription" }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const login = async (email, password) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await trackerApi.post("/auth/login", {
        email,
        password,
      });
      Cookies.set(TOKEN_KEY, response.data.token, { expires: 7 });
      setUser(response.data.user);
      navigate("/app/admin");
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setState((prev) => ({ ...prev, error: "Échec de la connexion" }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const loginWithGoogle = async (response) => {
    try {
      const googleToken = response.credential;
      if (!googleToken) throw new Error("Aucun token Google reçu");

      const decoded = jwtDecode(googleToken);
      const res = await trackerApi.post("/auth/google", {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
      });

      Cookies.set(TOKEN_KEY, res.data.token, { expires: 7 });
      setUser(res.data.user);
      await checkAuth();
      navigate("/app/admin");
    } catch (err) {
      console.error("Erreur de connexion Google :", err);
      setState((prev) => ({
        ...prev,
        error: "Échec de la connexion avec Google",
      }));
    }
  };

  const checkAuth = async () => {
    try {
      const token = Cookies.get(TOKEN_KEY);
      if (!token) return;

      setState((prev) => ({ ...prev, loading: true }));
      const response = await trackerApi.get("/auth/me");
      setUser(response.data.user);
    } catch (err) {
      console.error("Erreur de vérification d'authentification :", err);
      clearAuth();
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await trackerApi.post("/auth/logout");
      clearAuth();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Erreur de déconnexion :", err);
      setState((prev) => ({ ...prev, error: "Erreur lors de la déconnexion" }));
    }
  };

  const getUserCount = async () => {
    try {
      const response = await trackerApi.get("/count-users");
      setState((prev) => ({ ...prev, userCount: response.data.userCount }));
    } catch (err) {
      console.error("Erreur de récupération du nombre d'utilisateurs :", err);
      setState((prev) => ({
        ...prev,
        error: "Erreur lors du chargement des données",
      }));
    }
  };

  return {
    ...state,
    register,
    login,
    loginWithGoogle,
    checkAuth,
    logout,
    getUserCount,
    updateUserPreferences: async (preferences) => {
      try {
        await trackerApi.put(`/auth/${state.user.id}/cookies`, preferences);
        setState((prev) => ({ ...prev, cookiePreferences: preferences }));
      } catch (err) {
        console.error("Erreur mise à jour préférences cookies :", err);
      }
    },
    updateNewsletterSubscription: async (subscribed) => {
      try {
        await trackerApi.put(`/auth/${state.user.id}/newsletter`, {
          subscribed,
        });
        setState((prev) => ({
          ...prev,
          newsletterSubscription: { subscribed },
        }));
      } catch (err) {
        console.error("Erreur mise à jour abonnement newsletter :", err);
      }
    },
    isLoggedIn: () => !!state.user,
  };
};

export default useAuth;
