import React, { createContext, useState, useContext, useEffect } from "react";
import useArticles from "../services/articleService";

const ArticleContext = createContext();

export const ArticleProvider = ({ children }) => {
  const {
    articles, // Liste des articles récupérés
    article, // Article spécifique actuellement sélectionné
    loading, // Indicateur de chargement pour les articles
    error, // Erreur si quelque chose ne va pas lors de la récupération des articles
    markdown, // Contenu markdown de l'article sélectionné
    fetchArticleBySlug, // Fonction pour récupérer un article spécifique par son slug
    saveArticle, // Fonction pour enregistrer un article
    saveImages, // Fonction pour enregistrer les images liées à un article
    checkOrGenerateSlug, // Fonction pour vérifier ou générer un slug unique
    generateMarkdown,
    articlePreview,
    setArticlePreview,
    fetchArticles,
    deleteArticle,
    updateArticle,
    categoriesCount,
    getArticleCountByCategory,
  } = useArticles();

  // Vérification que saveArticle et les autres données sont bien chargées avant de rendre les enfants
  const [isReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   if (saveArticle && articles !== undefined) {
  //     setIsReady(true); // Tout est prêt, on peut passer à l'affichage des enfants
  //   }
  // }, [saveArticle, articles]);

  // if (!isReady) {
  //   return <div>Loading...</div>; // Affichage d'un message de chargement jusqu'à ce que le contexte soit prêt
  // }

  return (
    <ArticleContext.Provider
      value={{
        articles,
        article,
        loading,
        error,
        markdown,
        fetchArticleBySlug,
        saveArticle,
        saveImages,
        checkOrGenerateSlug,
        generateMarkdown,
        articlePreview,
        setArticlePreview,
        fetchArticles,
        deleteArticle,
        updateArticle,
        categoriesCount,
        getArticleCountByCategory,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticleContext = () => useContext(ArticleContext);
