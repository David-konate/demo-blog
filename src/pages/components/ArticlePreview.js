import React from "react";
import Showdown from "showdown";
import { useArticleContext } from "../../context/use-article-context";
import "../../styles/blog-post.css";

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

  // Fonction pour vérifier si la date est valide
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  // Si la date n'est pas valide, on affiche une date par défaut
  const formattedDate =
    isValidDate(articlePreview.date) && articlePreview.date !== "Date inconnue"
      ? new Intl.DateTimeFormat("fr-FR").format(Date.parse(articlePreview.date))
      : "Date inconnue";

  return (
    <div className="article-preview">
      <header
        className="article-preview-header"
        style={{
          position: "relative",
          height: "300px",
          display: "flex", // Utilisation de Flexbox
          alignItems: "center", // Centre le contenu verticalement
          justifyContent: "center", // Centre le contenu horizontalement
          textAlign: "center", // Assure que le texte est centré
          backgroundImage: articlePreview.image
            ? `url(${articlePreview.image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: articlePreview.image ? "transparent" : "#f4f4f4",
        }}
      >
        <div
          className="article-preview-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.3)", // Ombre pour améliorer la lisibilité du texte
            zIndex: 0, // L'overlay est en dessous du texte
          }}
        ></div>
        <div
          style={{
            position: "relative",
            zIndex: 1, // Le texte est au-dessus de l'overlay
            color: "white", // Texte en blanc pour le contraste
          }}
        >
          <h1 className="article-preview-title">
            {articlePreview.title || "Titre de l'article"}
          </h1>
          <p className="article-preview-author">
            Par {articlePreview.author || "Auteur"} le {formattedDate}
          </p>
        </div>
      </header>

      <div
        className="article-markdown-content"
        dangerouslySetInnerHTML={{
          __html: converter.makeHtml(articlePreview.content || ""),
        }}
      />
    </div>
  );
};

export default ArticlePreview;
