import React, { useState, useEffect } from "react";
import "../../styles/cookie.css";
import useAuth from "../../services/authService";

const CookiesModal = ({ isOpen, onClose }) => {
  const { user, updateUserPreferences, updateNewsletterSubscription } =
    useAuth();

  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    if (user) {
      setNewsletterSubscribed(user.newsletter?.subscribed || false); // Chargement de l'état de la newsletter
    }
  }, [user]);

  const handleNewsletterToggle = () => {
    setNewsletterSubscribed(!newsletterSubscribed);
  };

  const handleSubmit = async () => {
    // Mettre à jour l'abonnement à la newsletter
    if (user) {
      await updateNewsletterSubscription(newsletterSubscribed);
    }

    console.log("Newsletter subscribed:", newsletterSubscribed);
    onClose(); // Ferme la modal après soumission
  };

  return isOpen ? (
    <div className="cookie-modal-overlay">
      <div className="cookie-modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          ✖️
        </button>
        <h2 className="cookie-modal-title">Préférences Cookies</h2>
        <p className="cookie-modal-description">
          Nous utilisons des cookies pour assurer la sécurité de votre
          expérience. Vous ne pouvez pas modifier ces cookies. Vous pouvez
          néanmoins gérer vos préférences pour notre newsletter ci-dessous.
        </p>
        <div className="cookie-options">
          {/* Option cookie nécessaire (sécurité) */}
          <div className="toggle-container">
            <span>Cookies de sécurité (non modifiables)</span>
            <input
              type="checkbox"
              checked={true} // Ces cookies sont toujours activés et non modifiables
              disabled // Empêche l'utilisateur de les modifier
            />
            <span className="toggle-slider"></span>
          </div>

          {/* Option pour la newsletter */}
          <div className="toggle-container">
            <span>S'abonner à la newsletter</span>
            <input
              type="checkbox"
              checked={newsletterSubscribed}
              onChange={handleNewsletterToggle}
            />
            <span className="toggle-slider"></span>
          </div>
        </div>
        <button className="params-cookie-btn" onClick={handleSubmit}>
          Sauvegarder
        </button>
      </div>
    </div>
  ) : null;
};

export default CookiesModal;
