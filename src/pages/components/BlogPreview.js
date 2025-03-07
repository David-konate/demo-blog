import React from "react";
import { Link } from "gatsby";
import { useArticleContext } from "../../context/use-article-context";
import useCategories from "../../services/categoryService";
import useAuth from "../../services/authService";

// Fonction pour vérifier si la date est valide
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const BlogPreview = () => {
  const { articlePreview } = useArticleContext();
  const { categories } = useCategories();
  const { user } = useAuth();

  if (!articlePreview) return <p>Aucun aperçu disponible</p>;

  // Formatage de la date en vérifiant si elle est valide
  const formattedDate =
    isValidDate(articlePreview.date) && articlePreview.date !== "Date inconnue"
      ? new Intl.DateTimeFormat("fr-FR").format(Date.parse(articlePreview.date))
      : "Date inconnue";

  // Trouver la catégorie correspondant à l'ID
  const category = categories.find(
    (cat) => cat.id === parseInt(articlePreview.category)
  );

  // Afficher le label_category de la catégorie si trouvé, sinon afficher "Inconnue"
  const categoryLabel = category ? category.label_category : "Inconnue";

  return (
    <div className="card">
      <div className="card-image">
        <img src={articlePreview.image} alt={articlePreview.title} />
        <div className="card-badge">{categoryLabel}</div>
      </div>

      <div className="card-content">
        <div className="card-info">
          Par {user.name} le {formattedDate}
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
