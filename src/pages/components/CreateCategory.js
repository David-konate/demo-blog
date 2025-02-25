import React, { useState, useEffect } from "react";
import { useCategoryContext } from "../../context/categories-context";
import "../../styles/create-category.css";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Spinner from "../../pages/components/Spinner";
import Layout from "../../pages/components/layout";
import Alert from "../../pages/components/Alert"; // Importation du composant Alert

const CreateOrUpdateCategory = ({ category }) => {
  const { createCategory, updateCategory, loading, error } =
    useCategoryContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("info");

  // Valeurs initiales basées sur la présence d'une catégorie à mettre à jour
  const initialValues = {
    labelCategory: category ? category.label : "",
  };

  // Validation du formulaire
  const validationSchema = Yup.object({
    labelCategory: Yup.string()
      .required("Le nom de la catégorie est requis !")
      .min(3, "Le nom de la catégorie doit contenir au moins 3 caractères."),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    try {
      if (category && category.id) {
        // Mise à jour de la catégorie si un id est présent
        await updateCategory(category.id, values.labelCategory);
        setAlertMessage("Catégorie mise à jour avec succès !");
        setAlertType("success");
      } else {
        // Création d'une nouvelle catégorie
        await createCategory(values.labelCategory);
        setAlertMessage("Catégorie créée avec succès !");
        setAlertType("success");
      }
      setAlertVisible(true);
      resetForm();
    } catch (err) {
      setAlertMessage(`Erreur : ${error}`);
      setAlertType("error");
      setAlertVisible(true);
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false); // Ferme l'alerte
  };

  return (
    <div className="create-category-container">
      <h1 className="title">
        {category && category.id
          ? "Mettre à jour la catégorie"
          : "Créer une nouvelle catégorie"}
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="category-form">
            <div className="form-group">
              <label htmlFor="labelCategory" className="label">
                Nom de la catégorie
              </label>
              <Field
                type="text"
                id="labelCategory"
                className="input"
                name="labelCategory"
                placeholder="Entrez le nom de la catégorie"
              />
              <ErrorMessage
                name="labelCategory"
                component="div"
                className="error-text"
              />
            </div>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner />
              ) : category && category.id ? (
                "Mettre à jour la catégorie"
              ) : (
                "Créer la catégorie"
              )}
            </button>
          </Form>
        )}
      </Formik>
      {loading && <Spinner />}
      {error && <p className="error-text">Erreur: {error}</p>}

      {/* Intégration du composant Alert */}
      <Alert
        message={alertMessage}
        type={alertType}
        visible={alertVisible}
        onClose={handleAlertClose}
        onConfirm={handleAlertClose}
      />
    </div>
  );
};

export default CreateOrUpdateCategory;
