import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaPhone } from "react-icons/fa";
import "../../styles/contact.css";
import useAuth from "../../services/authService";
import useMessage from "../../services/messageService";

const ContactModalAdmin = ({ onClose }) => {
  const { sendMessage } = useMessage();
  const [user, setUser] = useState(null);

  const handleCall = () => {
    if (window && window.navigator) {
      window.location.href = "tel:+33763418790";
    }
  };

  // Schéma de validation avec Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("L'objet est requis"),
    content: Yup.string()
      .required("Le message est requis")
      .min(10, "Le message doit contenir au moins 10 caractères"),
  });

  // Gestion de la soumission du formulaire
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    if (!user || !user.id) {
      console.error("Utilisateur non authentifié !");
      return;
    }

    try {
      // S'assurer que content est une chaîne
      const formattedValues = {
        title: values.title,
        content: String(values.content), // Forcer le message à être une chaîne
      };

      await sendMessage(user.id, formattedValues);
      console.log("Message envoyé avec succès :", formattedValues);

      resetForm(); // Réinitialise le formulaire après l'envoi
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    } finally {
      setSubmitting(false); // Désactive l'état de soumission
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
          initialValues={{ title: "", content: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="contact-form">
              <div className="form-group">
                <label htmlFor="title">Objet</label>
                <Field type="text" id="title" name="title" />
                <ErrorMessage
                  name="title"
                  component="p"
                  className="error-text"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Message</label>
                <Field as="textarea" id="content" name="content" rows="4" />
                <ErrorMessage
                  name="content"
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
