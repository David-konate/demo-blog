import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/create-category.css";
import useCategories from "../services/categoryService";
import Spinner from "./components/Spinner";
import Alert from "./components/Alert";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Layout from "./components/layout";

const CreateCategoryPage = () => {
  const {
    categories,
    getCategories,
    deleteCategory,
    createCategory,
    updateCategory,
  } = useCategories();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 4;

  const [showAlert, setShowAlert] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [alertVisible, setAlertVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const initialValues = {
    labelCategory: categoryToEdit ? categoryToEdit.label_category : "",
  };

  const validationSchema = Yup.object({
    labelCategory: Yup.string()
      .required("Le nom de la catégorie est requis !")
      .min(3, "Le nom de la catégorie doit contenir au moins 3 caractères."),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await getCategories();
      } catch (err) {
        setError(
          err.message || "Erreur lors de la récupération des catégories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.label_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const handleEdit = (id) => {
    const category = categories.find((category) => category.id === id);
    setCategoryToEdit(category);
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete);
        await getCategories();
        setAlertMessage("Catégorie supprimée avec succès !");
        setAlertType("success");
        setAlertVisible(true);
      } catch (err) {
        setAlertMessage(`Erreur : ${err.message}`);
        setAlertType("error");
        setAlertVisible(true);
      } finally {
        setShowAlert(false);
        setCategoryToDelete(null);
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    try {
      if (categoryToEdit) {
        await updateCategory(categoryToEdit.id, values.labelCategory);
        setAlertMessage("Catégorie mise à jour avec succès !");
      } else {
        await createCategory(values.labelCategory);
        setAlertMessage("Catégorie créée avec succès !");
      }
      setAlertType("success");
      setAlertVisible(true);
      resetForm();
      setCategoryToEdit(null);
    } catch (err) {
      setAlertMessage(`Erreur : ${err.message}`);
      setAlertType("error");
      setAlertVisible(true);
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-text">Erreur : {error}</div>;

  return (
    <div className="page-wrapper">
      <div className="category-section">
        <h1 className="title">Toutes les catégories</h1>
        <input
          type="text"
          placeholder="Filtrer par nom de catégorie"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="category-search-input"
        />

        <div className="category-list">
          <ul>
            {currentCategories.map((category) => (
              <li key={category.id} className="category-item">
                <FaEdit
                  className="icon edit-icon"
                  onClick={() => handleEdit(category.id)}
                />
                <span className="category-label">
                  {category.label_category}
                </span>
                <FaTrash
                  className="icon delete-icon"
                  onClick={() => handleDelete(category.id)}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span>{currentPage}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>

        {showAlert && (
          <Alert
            message="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
            type="warning"
            onClose={() => setShowAlert(false)}
            onConfirm={confirmDelete}
            visible={showAlert}
          />
        )}
      </div>

      <div className="create-category-section">
        <h1 className="title">
          {categoryToEdit ? "Modifier une catégorie" : "Créer une catégorie"}
        </h1>
        <Formik
          initialValues={{
            labelCategory: categoryToEdit ? categoryToEdit.label_category : "",
          }}
          enableReinitialize={true} // Ajoute cette option
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
                ) : categoryToEdit ? (
                  "Mettre à jour la catégorie"
                ) : (
                  "Créer la catégorie"
                )}
              </button>
            </Form>
          )}
        </Formik>

        {alertVisible && (
          <Alert
            message={alertMessage}
            type={alertType}
            visible={alertVisible}
            onClose={handleAlertClose}
            onConfirm={handleAlertClose}
          />
        )}
      </div>
    </div>
  );
};

export default CreateCategoryPage;
