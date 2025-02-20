import React from "react";
import { Link } from "gatsby";
import useArticles from "../../services/articleService";

const BlogPreview = () => {
  const { articlePreview } = useArticles();

  if (!articlePreview) return <p>Aucun aperçu disponible</p>;

  return (
    <div className="card">
      <div className="card-image">
        <img src={articlePreview.image} alt={articlePreview.title} />
        <div className="card-badge">{articlePreview.category || "Events"}</div>
      </div>

      <div className="card-content">
        <div className="card-info">
          Par {articlePreview.author} le {articlePreview.date}
        </div>
        <div className="card-footer">
          <h2 className="card-title">{articlePreview.title}</h2>
        </div>
        <Link to={articlePreview.slug} className="card-link">
          Lire plus ➝
        </Link>
      </div>
    </div>
  );
};

export default BlogPreview;
