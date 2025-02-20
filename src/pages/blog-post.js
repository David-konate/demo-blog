import React, { useEffect, useState } from "react";
import { useLocation, navigate } from "@reach/router";
import useArticles from "../services/articleService";
import Layout from "./components/layout";
import { SEO } from "./components/seo";
import Showdown from "showdown";
import "../styles/blog-post.css";

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
  console.log(slug);

  useEffect(() => {
    if (slug) {
      sessionStorage.setItem("slug", slug); // Sauvegarde le slug en session
      fetchArticleBySlug(slug);
    }
    if (!slug) {
      navigate("/blog-list"); // Redirige si pas de slug
    }
  }, [slug]);
  console.log(article);
  if (loading) return <p>Chargement...</p>;
  if (!article) return <p>Article introuvable.</p>;
  return (
    <Layout>
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
            <div
              className="article-view-header"
              style={{
                position: "relative",
                height: "300px",
                display: "flex", // Utilisation de Flexbox
                alignItems: "center", // Centre le contenu verticalement
                justifyContent: "center", // Centre le contenu horizontalement
                textAlign: "center", // Assure que le texte est centré
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${article.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "brightness(0.4)", // Applique un filtre de luminosité pour la lisibilité du texte
                  zIndex: 0, // Assure que l'image est en arrière-plan
                }}
              ></div>
              <div
                style={{
                  position: "relative",
                  zIndex: 1, // Assure que le texte est au-dessus de l'image
                  color: "white",
                }}
              >
                <h1 className="article-view-title">{article.title}</h1>
                <p className="article-view-meta">
                  Par {article.author}, le {article.date}
                </p>
              </div>
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
    </Layout>
  );
};

export default BlogPost;
