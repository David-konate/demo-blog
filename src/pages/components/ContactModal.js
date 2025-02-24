import React, { useEffect } from "react";
import { FaPhone } from "react-icons/fa";
import "../../styles/contact.css";

const ContactModal = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleCall = () => {
    if (window && window.navigator) {
      window.location.href = "tel:+33763418790";
    }
  };

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        {/* En-tête avec téléphone et fermeture */}
        <div className="header-container">
          <button
            className="phone-btn"
            onClick={handleCall}
            aria-label="Appeler le numéro"
          >
            <FaPhone className="phone-icon" /> 07 63 41 87 90
          </button>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Fermer le formulaire de contact"
          >
            &times;
          </button>
        </div>

        <h2>Ou par mail</h2>

        <form name="contact" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="contact" />
          <div className="form-group">
            <label htmlFor="name">Nom</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="4" required></textarea>
          </div>
          <button type="submit" className="submit-btn">
            Envoyer
          </button>
        </form>

        <p className="signature">
          Développé par <strong>David Konaté v</strong>
        </p>
      </div>
    </div>
  );
};

export default ContactModal;
