import React, { useState, useEffect } from "react";
import useCookies from "../../services/cookieService";
import useAuth from "../../services/authService"; // Vérification de l'utilisateur
import "../../styles/cookie.css";

const CookiesModal = () => {
  const { cookie, loading, error, setCookiesPreferences } = useCookies();
  const { getUserFromStorage } = useAuth();
  const user = getUserFromStorage(); // Récupération sécurisée de l'utilisateur
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [newsletterAccepted, setNewsletterAccepted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isOpen, setIsOpen] = useState(true); // Gérer l'affichage du modal

  // Effet pour initialiser les préférences de cookies si elles existent
  useEffect(() => {
    if (cookie) {
      setCookiesAccepted(cookie.cookiesAccepted || false);
      setNewsletterAccepted(cookie.newsletterAccepted || false);
    }
  }, [cookie]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    try {
      await setCookiesPreferences(cookiesAccepted, newsletterAccepted);
      setSuccessMessage("Vos préférences ont été enregistrées !");
      setTimeout(() => {
        setSuccessMessage("");
        setIsOpen(false); // Fermer le modal après enregistrement
      }, 2000);
    } catch (err) {
      console.error("Erreur d'enregistrement des cookies :", err);
      setSuccessMessage("Une erreur est survenue, veuillez réessayer.");
    }
  };

  if (!isOpen) return null; // Ne pas afficher le modal s'il est fermé
  if (loading) return <div className="cookie-modal-loading">Chargement...</div>;
  if (error) return <div className="cookie-modal-error">Erreur : {error}</div>;

  return (
    <div className="cookie-modal-overlay">
      <div className="cookie-modal-content">
        <span className="cookie-modal-close" onClick={() => setIsOpen(false)}>
          ×
        </span>
        <h2 className="cookie-modal-title">Préférences de Cookies</h2>
        <p className="cookie-modal-description">
          Nous utilisons des cookies pour améliorer votre expérience. Vous
          pouvez accepter ou refuser les cookies non essentiels. Pour plus
          d'informations, consultez notre{" "}
          <a
            href="/politique-de-confidentialite"
            target="_blank"
            rel="noopener noreferrer"
          >
            politique de confidentialité
          </a>
          .
        </p>
        <form className="cookie-modal-form" onSubmit={handleSubmit}>
          <label className="cookie-modal-label">
            <input
              type="checkbox"
              checked={cookiesAccepted}
              onChange={() => setCookiesAccepted(!cookiesAccepted)}
              className="cookie-modal-checkbox"
            />
            J'accepte les cookies nécessaires au fonctionnement du site
          </label>
          <br />
          {user && (
            <label className="cookie-modal-label">
              <input
                type="checkbox"
                checked={newsletterAccepted}
                onChange={() => setNewsletterAccepted(!newsletterAccepted)}
                className="cookie-modal-checkbox"
              />
              Je souhaite recevoir la newsletter
            </label>
          )}
          <br />
          <button type="submit" className="cookie-modal-submit-btn">
            Enregistrer mes préférences
          </button>
        </form>
        {successMessage && (
          <p className="cookie-modal-success">{successMessage}</p>
        )}
        <p className="cookie-modal-note">
          Vous pouvez modifier vos préférences à tout moment dans les paramètres
          de votre compte.
        </p>
      </div>
    </div>
  );
};

export default CookiesModal;
