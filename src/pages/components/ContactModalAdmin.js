import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaPhone } from "react-icons/fa";
import "../../styles/contact.css";
import useAuth from "../../services/authService";

const ContactModalAdmin = ({ onClose }) => {
  const { getUserFromStorage } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setUser(getUserFromStorage());

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [getUserFromStorage]);

  const handleCall = () => {
    if (window && window.navigator) {
      window.location.href = "tel:+33763418790";
    }
  };

  // Schéma de validation avec Yup
  const validationSchema = Yup.object({
    subject: Yup.string().required("L'objet est requis"),
    message: Yup.string()
      .required("Le message est requis")
      .min(10, "Le message doit contenir au moins 10 caractères"),
  });

  // Gestion de la soumission du formulaire
  const handleSubmit = (values, { resetForm }) => {
    if (!user || !user.id) {
      console.error("Utilisateur non authentifié !");
      return;
    }

    const formData = {
      ...values,
      userId: user.id, // Ajout de l'ID utilisateur
    };

    console.log("Données soumises :", formData);

    // Ici, tu peux envoyer `formData` à ton API
    // Exemple avec fetch :
    /*
    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => console.log("Réponse API:", data))
      .catch(error => console.error("Erreur d'envoi :", error));
    */

    resetForm(); // Réinitialise le formulaire après l'envoi
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
            <FaPhone className="phone-icon" />
          </button>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Fermer le formulaire de contact"
          >
            &times;
          </button>
        </div>

        <h2>Ou par Message</h2>

        {/* Formulaire avec Formik */}
        <Formik
          initialValues={{ subject: "", message: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="contact-form">
              <div className="form-group">
                <label htmlFor="subject">Objet</label>
                <Field type="text" id="subject" name="subject" />
                <ErrorMessage
                  name="subject"
                  component="p"
                  className="error-text"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <Field as="textarea" id="message" name="message" rows="4" />
                <ErrorMessage
                  name="message"
                  component="p"
                  className="error-text"
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi..." : "Envoyer"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="signature">
          Développé par <strong>David Konaté</strong>
        </p>
      </div>
    </div>
  );
};

export default ContactModalAdmin;
