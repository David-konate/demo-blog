import axios from "axios";
import Cookies from "js-cookie";

const TOKEN_KEY =
  "6e025402321a87b4e9f4729421059d34a0a40bda09a63c2ef6c84968f4f1b36bc471188416a4831e12f7b6f4738a13c6243ae6c2b3033ee25c6c85d74b351b2a";

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
const getToken = () => Cookies.get(TOKEN_KEY);

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
    Cookies.set(TOKEN_KEY, token, { expires: 7 });
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
        Cookies.remove(TOKEN_KEY);
        window.localStorage.removeItem("gatsbyUser");
        window.location.href = "/login";
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
      Cookies.remove(TOKEN_KEY);
      window.localStorage.removeItem("gatsbyUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default trackerApi;
