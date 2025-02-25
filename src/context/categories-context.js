import React, { createContext, useState, useContext, useEffect } from "react";
import useCategories from "../services/categoryService"; // Le service pour gérer les catégories

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const {
    categories, // Liste des catégories récupérées
    category, // Catégorie spécifique actuellement sélectionnée
    loading, // Indicateur de chargement pour les catégories
    error, // Erreur si quelque chose ne va pas lors de la récupération des catégories
    createCategory, // Fonction pour créer une nouvelle catégorie
    deleteCategory, // Fonction pour supprimer une catégorie
    updateCategory, // Fonction pour mettre à jour une catégorie
    fetchCategories, // Fonction pour récupérer toutes les catégories
    fetchCategoryById, // Fonction pour récupérer une catégorie spécifique
  } = useCategories();

  //   // Vérification que les fonctions et les données sont bien chargées avant de rendre les enfants
  //   const [isReady, setIsReady] = useState(false);

  //   useEffect(() => {
  //     if (fetchCategories && categories !== undefined) {
  //       setIsReady(true); // Tout est prêt, on peut passer à l'affichage des enfants
  //     }
  //   }, [fetchCategories, categories]);

  //   if (!isReady) {
  //     return <div>Loading...</div>; // Affichage d'un message de chargement jusqu'à ce que le contexte soit prêt
  //   }

  return (
    <CategoryContext.Provider
      value={{
        categories,
        category,
        loading,
        error,
        createCategory,
        deleteCategory,
        updateCategory,
        fetchCategories,
        fetchCategoryById,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => useContext(CategoryContext);
