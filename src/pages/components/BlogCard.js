import React from "react";
import { Link } from "gatsby";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Import des icônes
import "../../styles/blog-card.css";

const BlogCard = ({
  title,
  image,
  category,
  author,
  date,
  resume,
  slug,
  protectedPost, // Renommé en protectedPost pour éviter la confusion avec le mot-clé `protected`
  onEdit,
  onDelete,
}) => {
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
            {date} par {author}
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
              <button className="blog-card-btn edit" onClick={() => onEdit()}>
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
