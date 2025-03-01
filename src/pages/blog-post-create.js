import React, { useState, useEffect, useContext } from "react";
import CreatePost from "./components/CreatePost";
import ArticlePreview from "./components/ArticlePreview";
import BlogPreview from "./components/BlogPreview";
import "../styles/blog-editor.css";
import Layout from "./components/layout";

const CreateArticlePage = () => {
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
