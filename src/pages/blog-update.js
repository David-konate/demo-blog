import React, { useState, useEffect } from "react";
import ArticlePreview from "./components/ArticlePreview";
import BlogPreview from "./components/BlogPreview";
import BlogPostEditor from "./components/BlogPostEditor";
import { useLocation } from "@reach/router";
import Layout from "./components/layout";

export function useMedia(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    setMatches(media.matches);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

const UpdateArticlePage = () => {
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();

  // Gestion du slug avec sessionStorage et location.state
  const [slug, setSlug] = useState(() => {
    if (typeof window !== "undefined") {
      return location.state?.slug || sessionStorage.getItem("slug") || null;
    }
    return null;
  });

  // Met à jour sessionStorage dès que le slug est défini
  useEffect(() => {
    if (slug) {
      sessionStorage.setItem("slug", slug);
    }
  }, [slug]);

  const isLaptop = useMedia("(min-width: 1225px)");

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
          <BlogPostEditor slug={slug} />
        </div>
        <div className="blog-preview">
          <BlogPreview />
          <ArticlePreview />
        </div>
      </div>
    </Layout>
  );
};

export default UpdateArticlePage;
