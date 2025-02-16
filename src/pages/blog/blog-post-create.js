import React, { useState, useEffect } from "react";
import CreatePost from "../components/createPost";
import ArticlePreview from "../components/ArticlePreview";
import BlogPreview from "../components/BlogPreview";
import "../../styles/blog-editor.css";
const CreateArticlePage = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ce code s'assure que le contexte est disponible avant de rendre le composant
    setIsReady(true); // Simulation d'une condition pour vérifier l'état du contexte
  }, []);

  if (!isReady) {
    return <div>Loading...</div>; // Affiche un message de chargement en attendant que le contexte soit prêt
  }

  return (
    <div className="blog-editor-preview-container">
      <div className="blog-editor">
        <CreatePost />
      </div>
      <div className="blog-preview">
        <BlogPreview />
        <ArticlePreview />
      </div>
    </div>
  );
};

export default CreateArticlePage;
