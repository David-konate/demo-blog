import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../styles/create-category.css";
import useCategories from "../../services/categoryService";
import Spinner from "../../pages/components/Spinner";
import Alert from "../../pages/components/Alert";

const AllCategories = () => {
  const { categories, getCategories, deleteCategory } = useCategories(); // Ajout de deleteCategory
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 4;

  const [showAlert, setShowAlert] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

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

  if (loading) return <Spinner />;
  if (error) return <div className="error-text">Erreur : {error}</div>;

  const handleEdit = (id) => {
    console.log("Éditer la catégorie avec l'ID:", id);
  };

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete); // Appel de la suppression depuis le service
        await getCategories(); // Rafraîchir la liste après suppression
        console.log(
          "Suppression réussie de la catégorie ID:",
          categoryToDelete
        );
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
      } finally {
        setShowAlert(false);
        setCategoryToDelete(null);
      }
    }
  };

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  return (
    <div className="all-category-container">
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
              <span className="category-label">{category.label_category}</span>
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
          onConfirm={confirmDelete} // Suppression des parenthèses ici
          visible={showAlert}
        />
      )}
    </div>
  );
};

export default AllCategories;
