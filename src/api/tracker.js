import axios from "axios";
import Cookies from "js-cookie";

// Création d'une instance d'API avec un en-tête par défaut
const trackerApi = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Vérifier si l'on est dans le navigateur
const isBrowser = () => typeof window !== "undefined";

// Récupérer le token actuel depuis les cookies
const getToken = () => Cookies.get("token");

// Vérifier si le token est expiré
const isTokenExpired = (token) => {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp < Date.now() / 1000;
};

// Fonction pour rafraîchir le token si nécessaire
const refreshToken = async () => {
  try {
    const response = await trackerApi.post("/auth/refresh");
    const { token } = response.data;
    Cookies.set("token", token, { expires: 7 });
    return token;
  } catch (error) {
    throw new Error("Token refresh failed");
  }
};

// Intercepteur de requête pour ajouter le token dans l'en-tête
trackerApi.interceptors.request.use(
  async (config) => {
    let token = getToken();

    // Si le token est expiré, tenter de le rafraîchir
    if (token && isTokenExpired(token)) {
      try {
        token = await refreshToken();
      } catch (error) {
        // Si le rafraîchissement échoue, supprimer le token et rediriger vers la page de login
        Cookies.remove("token");
        window.localStorage.removeItem("gatsbyUser");
        window.location.href = "/login"; // Redirection vers la page de connexion
        return Promise.reject(error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse pour gérer les erreurs d'authentification
trackerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si la réponse est une erreur d'authentification (401), déconnecter l'utilisateur
      Cookies.remove("token");
      window.localStorage.removeItem("gatsbyUser");
      window.location.href = "/login"; // Redirection vers la page de connexion
    }
    return Promise.reject(error);
  }
);

export default trackerApi;
