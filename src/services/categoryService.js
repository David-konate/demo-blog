import { useState, useEffect } from "react";
import trackerApi from "../api/tracker"; // Assurez-vous que trackerApi est correctement configuré pour interagir avec votre API
import { navigate } from "gatsby";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour récupérer toutes les catégories
  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await trackerApi.get("/categories");
      setCategories(response.data); // Mise à jour des catégories récupérées
    } catch (error) {
      setError(error.response ? error.response.data.message : "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer une catégorie par son ID
  const getCategoryById = async (id) => {
    setLoading(true);
    try {
      const response = await trackerApi.get(`/categories/${id}`);
      setCategory(response.data); // Mise à jour de la catégorie récupérée
    } catch (error) {
      setError(error.response ? error.response.data.message : "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer une nouvelle catégorie
  const createCategory = async (label_category) => {
    setLoading(true);
    try {
      console.log({ categories });
      const response = await trackerApi.post("/categories", { label_category });
      console.log(response.data);
      setCategories((prevCategories) => [...prevCategories, response.data]);
      console.log({ categories });
    } catch (error) {
      setError(error.response ? error.response.data.message : "Server error");
    } finally {
      setLoading(false); // Pas besoin d'appeler getCategories ici
    }
  };

  // Fonction pour mettre à jour une catégorie
  const updateCategory = async (id, label_category) => {
    setLoading(true);
    try {
      const response = await trackerApi.put(`/categories/${id}`, {
        label_category,
      });
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === id ? response.data : category
        )
      );
      navigate("/categories"); // Redirection vers la page des catégories
    } catch (error) {
      setError(error.response ? error.response.data.message : "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une catégorie
  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      await trackerApi.delete(`/categories/${id}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== id)
      );
    } catch (error) {
      setError(error.response ? error.response.data.message : "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Utiliser useEffect pour charger les catégories au démarrage si nécessaire
  useEffect(() => {
    getCategories();
  }, []);

  return {
    categories,
    category,
    loading,
    error,
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategories;
