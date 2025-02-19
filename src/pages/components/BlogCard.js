import React from "react";
import { Link } from "gatsby";
import arrowRight from "../../images/arrow_right.png"; // Assurez-vous d'importer l'icône
import "../../styles/blog-card.css";

const BlogCard = ({
  title,
  image,
  category,
  author,
  date,
  resume,
  slug,
  sections,
  link,
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
        <div>
          <Link
            to={`/blog-post`}
            state={{ slug: slug }}
            className="blog-card-link"
          >
            LIRE PLUS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
