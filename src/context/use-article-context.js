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
    setMarkdown,
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

  return (
    <ArticleContext.Provider
      value={{
        articles,
        article,
        loading,
        error,
        markdown,
        setMarkdown,
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
