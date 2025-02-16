import React, { useEffect, useState } from "react";
import { useLocation, navigate } from "@reach/router";
import useArticles from "../../services/articleService";

import { SEO } from "../components/seo";
import Showdown from "showdown";
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

const BlogPost = () => {
  Showdown.extension("size-images", function () {
    return [
      {
        type: "output",
        regex: /<img.*?src="(.*?)".*?>/g,
        replace:
          '<div style="display: flex; justify-content: center;"><img src="$1" style="max-width:100%; height:auto; max-height:400px;" /></div>',
      },
    ];
  });
  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    literalMidWordUnderscores: true,
    simpleLineBreaks: true,
    extensions: ["size-images"],
  });
  const location = useLocation();
  const { fetchArticleBySlug, article, loading, markdown } = useArticles();

  // Vérifie si un slug est dans l'état ou dans sessionStorage
  const [slug, setSlug] = useState(() => {
    if (typeof window !== "undefined") {
      // Vérifie si on est dans un environnement client avant d'utiliser sessionStorage
      return location.state?.slug || sessionStorage.getItem("slug");
    }
    return location.state?.slug || null;
  });

  const isLaptop = useMedia("(min-width: 1225px)");

  useEffect(() => {
    if (typeof window !== "undefined" && slug) {
      sessionStorage.setItem("slug", slug); // Sauvegarde le slug en session
      fetchArticleBySlug(slug);
    }
    if (!slug) {
      navigate("/blog-list"); // Redirige si pas de slug
    }
  }, [slug]);

  if (loading) return <p>Chargement...</p>;
  if (!article) return <p>Article introuvable.</p>;
  return (
    <>
      <SEO
        title={article?.title || "Chargement..."}
        description={
          article?.content?.slice(0, 150) || "Article en cours de chargement"
        }
        slug={slug}
      />
      <div className="article-view">
        {loading ? (
          <p>Chargement de l'article...</p>
        ) : article ? (
          <>
            <div className="article-view-header">
              <h1 className="article-view-title">{article.title}</h1>
            </div>
            <div className="article-view-content">
              {/* <ReactMarkdown className="article-markdown-content">
                {markdown}
              </ReactMarkdown> */}
              <div
                className="article-markdown-content"
                dangerouslySetInnerHTML={{
                  __html: converter.makeHtml(markdown || ""),
                }}
              />
            </div>
          </>
        ) : (
          <p>Article non trouvé.</p>
        )}
      </div>
    </>
  );
};

export default BlogPost;
