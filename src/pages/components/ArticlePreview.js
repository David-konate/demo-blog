import React from "react";
import { useArticleContext } from "../../context/use-article-context";
import Showdown from "showdown";

const ArticlePreview = () => {
  const { articlePreview } = useArticleContext();

  if (!articlePreview) return <p>Aucun aperçu disponible</p>;
  console.log("Contenu de l'aperçu:", articlePreview.content);

  // Extension pour centrer les images dans le markdown
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

  // Configuration du converter Showdown
  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    literalMidWordUnderscores: true,
    simpleLineBreaks: true,
    extensions: ["size-images"],
  });

  return (
    <div className="article-preview">
      <header
        className="article-preview-header"
        style={
          articlePreview.image
            ? {
                backgroundImage: `url(${articlePreview.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
                backgroundColor: "#f4f4f4",
                padding: "20px",
                textAlign: "center",
              }
        }
      >
        <div className="article-preview-overlay">
          <h1
            className="article-preview-title"
            style={{ color: "rgb(245, 109, 68)" }}
          >
            {articlePreview.title || "Titre de l'article"}
          </h1>
          <p className="article-preview-author">
            Par {articlePreview.author || "Auteur"} le{" "}
            {articlePreview.date || "Date inconnue"}
          </p>
        </div>
      </header>

      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{
          __html: converter.makeHtml(articlePreview.content || ""),
        }}
      />
    </div>
  );
};

export default ArticlePreview;
