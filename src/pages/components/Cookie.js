import React from "react";
import "../../styles/cookie.css";

const CookiesModal = ({
  isOpen,
  onClose,
  handleAcceptCookies,
  cookie,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Gestion des Cookies</h2>
        <p>
          Nous utilisons des cookies pour améliorer votre expérience. Vous
          pouvez gérer vos préférences ici.
        </p>
        <div className="cookie-options">
          {!loading && (
            <p>
              Préférences actuelles:{" "}
              {cookie?.cookiesAccepted ? "✅ Acceptés" : "❌ Refusés"},
              Newsletter:{" "}
              {cookie?.newsletterAccepted ? "✅ Abonné" : "❌ Non abonné"}
            </p>
          )}
          <button
            className="params-cookie-btn"
            onClick={() =>
              handleAcceptCookies(true, cookie?.newsletterAccepted)
            }
          >
            Accepter les cookies 🍪
          </button>
          <button
            className="params-cookie-btn"
            onClick={() =>
              handleAcceptCookies(false, cookie?.newsletterAccepted)
            }
          >
            Refuser les cookies ❌
          </button>
          <button
            className="params-cookie-btn"
            onClick={() => handleAcceptCookies(cookie?.cookiesAccepted, true)}
          >
            S'abonner à la newsletter 📩
          </button>
          <button
            className="params-cookie-btn"
            onClick={() => handleAcceptCookies(cookie?.cookiesAccepted, false)}
          >
            Se désabonner de la newsletter 📭
          </button>
        </div>
        <button className="modal-close-btn" onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default CookiesModal;
