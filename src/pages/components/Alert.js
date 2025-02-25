import React, { useEffect } from "react";
import "../../styles/alert.css"; // Import du fichier CSS dédié

const Alert = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
  onConfirm,
  visible, // Utilisation directe de visible
}) => {
  useEffect(() => {
    if (duration > 0 && visible) {
      const timer = setTimeout(() => {
        onClose(); // Utilisation directe de la prop
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, visible, onClose]);

  if (!visible) return null; // On utilise directement visible

  return (
    <div className="modal-overlay">
      <div className={`modal-content alert alert-${type}`}>
        <h3 className="alert-title">
          <strong>{type}</strong>
        </h3>

        <span>{message}</span>
        <div className="alert-actions">
          {onConfirm && (
            <button
              className="alert-btn confirm"
              onClick={() => {
                onConfirm(); // Exécuter l'action
                onClose(); // Fermer la modal après l'action
              }}
            >
              Confirmer
            </button>
          )}
          <button className="alert-close" onClick={onClose}>
            ✖
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
