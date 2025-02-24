import React from "react";
import { Link, navigate } from "gatsby"; // Importer navigate de Gatsby
import { FiEdit, FiTrash2 } from "react-icons/fi";
import "../../styles/blog-card.css";

const BlogCard = ({
  title,
  image,
  category,
  author,
  date,
  resume,
  slug,
  protectedPost,
  onEdit,
  onDelete,
}) => {
  const handleEditClick = () => {
    navigate("/blog-update", {
      state: { slug: slug }, // Passe le slug dans le state
    });
  };

  const formattedDate =
    date && !isNaN(Date.parse(date))
      ? new Intl.DateTimeFormat("fr-FR").format(new Date(date))
      : "Date inconnue";

  return (
    <div className="blog-card-container">
      <img
        src={
          image ||
          "https://ballnconnect.com/static/bnctext-logo-a3863fd46c7d43be9a5168bf983e5254.webp"
        }
        alt={title}
        className="blog-card-image"
      />
      <div className="blog-card-category">{category}</div>
      <div className="blog-card-content">
        <div>
          <p className="blog-card-date">
            {formattedDate} par {author}
          </p>

          <p className="blog-card-title">{title}</p>
          <p className="blog-card-resume">{resume}</p>
        </div>

        <div className="blog-card-footer">
          <Link
            to={`/blog-post`}
            state={{ slug: slug }}
            className="blog-card-link"
          >
            LIRE PLUS
          </Link>

          {!protectedPost && (
            <div className="blog-card-actions">
              <button className="blog-card-btn edit" onClick={handleEditClick}>
                <FiEdit />
              </button>
              <button
                className="blog-card-btn delete"
                onClick={() => onDelete({ title, slug })}
              >
                <FiTrash2 />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
