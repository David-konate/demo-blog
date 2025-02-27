import { useState, useEffect } from "react";
import trackerApi from "../api/tracker";
import { navigate } from "gatsby";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Vérifier si l'on est dans le navigateur
const isBrowser = () => typeof window !== "undefined";

// Récupérer l'utilisateur stocké en localStorage
export const getUser = () =>
  isBrowser() && window.localStorage.getItem("gatsbyUser")
    ? JSON.parse(window.localStorage.getItem("gatsbyUser"))
    : null;

// Stocker l'utilisateur de manière sécurisée
const setUser = (user) => {
  if (isBrowser()) {
    window.localStorage.setItem("gatsbyUser", JSON.stringify(user));
  }
};

// Supprimer les informations utilisateur lors de la déconnexion
const clearAuth = () => {
  if (isBrowser()) {
    window.localStorage.removeItem("gatsbyUser");
    Cookies.remove("token");
  }
};

// Hook d'authentification sécurisé
const useAuth = () => {
  const [user, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour s'enregistrer
  const register = async (email, password, name, role = "user") => {
    setLoading(true);
    setError(null);
    try {
      const response = await trackerApi.post(
        "/auth/register",
        email,
        password,
        name,
        role
      );

      const { user, token } = response.data;
      Cookies.set("token", token, { expires: 7 });
      setUser(user);
      setUserState(user);

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour se connecter
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await trackerApi.post("/auth/login", email, password);

      const { user, token } = response.data;
      Cookies.set("token", token, { expires: 7 });
      setUser(user);
      setUserState(user);

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // Vérification de l'authentification et rafraîchissement du token si nécessaire
  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await trackerApi.get("/auth/me", {
        withCredentials: true,
      });

      setUser(response.data.user);
      setUserState(response.data.user);
    } catch (error) {
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  // Connexion avec Google
  const loginWithGoogle = async (response) => {
    setLoading(true);
    setError(null);
    console.log(response);

    const googleId = response.clientId; // Il semble que clientId n'est pas directement dans response. À confirmer.
    const googleToken = response.credential;
    const decodedToken = jwtDecode(googleToken);
    console.log({ decodedToken });

    const name = decodedToken.name;
    const email = decodedToken.email;

    try {
      // Envoie les informations d'identification à l'API
      const res = await trackerApi.post("/auth/google", {
        googleId, // Utilise googleId récupéré
        googleToken,
        name, // Nom de l'utilisateur
        email, // Email de l'utilisateur
      });
      console.log(res.data);
      const { user, token } = res.data;

      // Sauvegarde le token dans les cookies
      Cookies.set("token", token, { expires: 7 });

      // Met à jour l'état de l'utilisateur
      setUser(user);
      setUserState(user);

      // Redirige vers le tableau de bord
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // Connexion avec Facebook
  const loginWithFacebook = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const response = await trackerApi.post("/auth/facebook/callback", {
        code,
      });

      const { user, token } = response.data;
      Cookies.set("token", token, { expires: 7 });
      setUser(user);
      setUserState(user);

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion sécurisée
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await trackerApi.post("/auth/logout", {}, { withCredentials: true });

      clearAuth();
      setUserState(null);

      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      setLoading(false);
    }
  };

  // Vérifie si l'utilisateur est connecté
  const isLoggedIn = () => !!user;

  return {
    user,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    loginWithFacebook,
    checkAuth,
    logout,
    isLoggedIn,
  };
};

export default useAuth;
