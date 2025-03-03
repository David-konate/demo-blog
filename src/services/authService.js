import { useState, useEffect } from "react";
import trackerApi from "../api/tracker";
import { navigate } from "gatsby";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth_token";
const isBrowser = () => typeof window !== "undefined";

const getUserFromStorage = () => {
  if (isBrowser()) {
    const user = window.localStorage.getItem("gatsbyUser");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const setUserToStorage = (user) => {
  if (isBrowser()) {
    window.localStorage.setItem("gatsbyUser", JSON.stringify(user));
  }
};

const clearAuth = () => {
  if (isBrowser()) {
    window.localStorage.removeItem("gatsbyUser");
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

  const handleRequest = async (requestFn, onSuccess) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await requestFn();
      console.log("Réponse API:", response.data);
      onSuccess(response.data);
    } catch (error) {
      console.error("Erreur API:", error.response?.data || error.message);
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.message || "Erreur serveur",
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const register = (email, password, name, role = "user") => {
    handleRequest(
      () =>
        trackerApi.post(
          "/auth/register",
          { email, password, name, role },
          { withCredentials: true }
        ),
      ({ user, token }) => {
        Cookies.set(TOKEN_KEY, token, { expires: 7 });
        setUser(user);
        navigate("/");
      }
    );
  };

  const login = (email, password) => {
    handleRequest(
      () =>
        trackerApi.post(
          "/auth/login",
          { email, password },
          { withCredentials: true }
        ),
      ({ user, token }) => {
        Cookies.set(TOKEN_KEY, token, { expires: 7 });
        setUser(user);
        navigate("/app/admin");
      }
    );
  };

  const loginWithGoogle = async (response) => {
    const googleToken = response.credential;
    console.log("Token Google reçu:", googleToken);

    try {
      const { name, email, sub: googleId } = jwtDecode(googleToken);
      console.log("Décodage du token Google:", { name, email, googleId });

      const res = await trackerApi.post(
        "/auth/google",
        { name, email, googleId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { user, token } = res.data;
      console.log("Connexion Google réussie:", user);

      Cookies.set(TOKEN_KEY, token, { expires: 7 });
      setUser(user);
      navigate("/");
    } catch (error) {
      console.error("Échec de la connexion Google:", error);
      setState((prev) => ({
        ...prev,
        error: "Échec de la connexion avec Google",
      }));
    }
  };

  const checkAuth = () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      console.warn("Aucun token trouvé, utilisateur non connecté.");
      return;
    }

    handleRequest(
      () =>
        trackerApi.get("/auth/me", {
          withCredentials: true,
        }),
      ({ user }) => {
        if (user) {
          setUser(user);
        }
      }
    );
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = () => {
    handleRequest(
      () => trackerApi.post("/auth/logout", {}, { withCredentials: true }),
      () => {
        clearAuth();
        setUser(null);
        navigate("/login");
      }
    );
  };

  const getUserCount = () => {
    trackerApi
      .get("/count-users")
      .then((response) =>
        setState((prev) => ({ ...prev, userCount: response.data.userCount }))
      )
      .catch((err) => {
        setState((prev) => ({
          ...prev,
          error: "Erreur lors du chargement des données",
        }));
        console.error(err);
      });
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
