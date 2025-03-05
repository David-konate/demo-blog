import { useState, useEffect } from "react";
import trackerApi from "../api/tracker";
import { navigate } from "gatsby";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY =
  "6e025402321a87b4e9f4729421059d34a0a40bda09a63c2ef6c84968f4f1b36bc471188416a4831e12f7b6f4738a13c6243ae6c2b3033ee25c6c85d74b351b2a";
const isBrowser = () => typeof window !== "undefined";

const getUserFromStorage = () => {
  if (isBrowser()) {
    const user = localStorage.getItem("gatsbyUser");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const setUserToStorage = (user) => {
  if (isBrowser()) {
    localStorage.setItem("gatsbyUser", JSON.stringify(user));
  }
};

const clearAuth = () => {
  if (isBrowser()) {
    localStorage.removeItem("gatsbyUser");
    Cookies.remove(TOKEN_KEY);
  }
};

const useAuth = () => {
  const [state, setState] = useState({
    user: getUserFromStorage(),
    loading: false,
    error: null,
    userCount: 0,
  });

  const setUser = (user) => {
    if (user) {
      setUserToStorage(user);
      setState((prev) => ({ ...prev, user }));
    }
  };

  const register = async (email, password, name, role = "user") => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await trackerApi.post(
        "/auth/register",
        { email, password, name, role },
        { withCredentials: true }
      );
      Cookies.set(TOKEN_KEY, response.data.token, { expires: 7 });
      setUser(response.data.user);
      navigate("/");
    } catch (err) {
      console.log("Erreur de registre :", err);
      setState((prev) => ({ ...prev, error: "Erreur lors de l'inscription" }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const login = async (email, password) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await trackerApi.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      Cookies.set(TOKEN_KEY, response.data.token, { expires: 7 });
      setUser(response.data.user);
      navigate("/app/admin");
    } catch (err) {
      console.log("Erreur de login :", err);
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
      const res = await trackerApi.post(
        "/auth/google",
        {
          name: decoded.name,
          email: decoded.email,
          googleId: decoded.sub,
        },
        { withCredentials: true }
      );

      Cookies.set(TOKEN_KEY, res.data.token, { expires: 7 });
      setUser(res.data.user);
      await checkAuth();
      navigate("/");
    } catch (err) {
      console.log("Erreur de connexion Google :", err);
      setState((prev) => ({
        ...prev,
        error: "Échec de la connexion avec Google",
      }));
    }
  };

  const checkAuth = async () => {
    try {
      const token = Cookies.get(TOKEN_KEY);
      if (!token) {
        console.log("Aucun token trouvé");
        return;
      }
      setState((prev) => ({ ...prev, loading: true }));

      const response = await trackerApi.get("/auth/me", {
        withCredentials: true,
      });

      setUser(response.data.user);
    } catch (err) {
      console.log("Erreur de vérification d'authentification :", err);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await trackerApi.post("/auth/logout", {}, { withCredentials: true });
      clearAuth();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.log("Erreur de déconnexion :", err);
      setState((prev) => ({ ...prev, error: "Erreur lors de la déconnexion" }));
    }
  };

  const getUserCount = async () => {
    try {
      const response = await trackerApi.get("/count-users");
      setState((prev) => ({ ...prev, userCount: response.data.userCount }));
    } catch (err) {
      console.log("Erreur de récupération du nombre d'utilisateurs :", err);
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
    getUserFromStorage,
    isLoggedIn: () => !!state.user,
  };
};

export default useAuth;
