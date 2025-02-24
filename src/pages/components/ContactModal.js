import React from "react";
import "../../styles/contact.css";

const ContactModal = ({ onClose }) => {
  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Contactez-nous</h2>
        <form name="contact" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="contact" />
          <div className="form-group">
            <label>Nom</label>
            <input type="text" name="name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea name="message" rows="4" required></textarea>
          </div>
          <button type="submit" className="submit-btn">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
