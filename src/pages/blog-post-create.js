import React, { useState, useEffect, useContext } from "react";
import CreatePost from "./components/createPost";
import ArticlePreview from "./components/ArticlePreview";
import BlogPreview from "./components/BlogPreview";
import "../styles/blog-editor.css";
import Layout from "./components/layout";

const CreateArticlePage = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="blog-editor-preview-container">
        <div className="blog-editor">
          <CreatePost />
        </div>
        <div className="blog-preview">
          <BlogPreview />
          <ArticlePreview />
        </div>
      </div>
    </Layout>
  );
};

export default CreateArticlePage;
