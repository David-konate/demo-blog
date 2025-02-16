import React from "react";
import { Link } from "gatsby";
import arrowRight from "../../images/arrow_right.png"; // Assurez-vous d'importer l'icône

const styles = {
  container: {
    maxWidth: "755px",
    width: "100%", // Assurez-vous que la carte a la largeur maximale
    borderRadius: "5px",
    marginBottom: 25,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    border: "1px solid #D2D2D2",
    position: "relative", // Ajouté pour que l'élément .categorie soit positionné relativement à ce conteneur
  },
  title: {
    fontSize: "24px",
    fontWeight: 800,
    color: "black",
    marginTop: 13,
  },
  content: {
    fontSize: "14px",
    fontWeight: 400,
    color: "#000000",
    marginTop: 18,
    textAlign: "justify",
  },
  image: {
    width: "100%", // L'image prend toute la largeur du conteneur
    height: 341,
    objectFit: "cover",
    borderRadius: "5px 5px 0 0", // Ajouté pour arrondir le haut de l'image
  },
  date: {
    fontSize: "14px",
    fontWeight: 400,
    color: "black",
    opacity: 0.5,
    marginTop: 20,
  },
  link: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    color: "#F56D44",
    fontSize: "14px",
    fontWeight: 700,
    marginBottom: 25,
    marginTop: 25,
  },
  categorie: {
    color: "white",
    fontWeight: 700,
    fontSize: "18px",
    backgroundColor: "#F56D44",
    borderRadius: "33px",
    height: "44px",
    width: "165px",

    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "10px",
    paddingBottom: "10px",
    textAlign: "center",
    marginLeft: "20px", // Espacement à gauche
    marginBottom: "10px", // Espacement du bas
    marginTop: "-20px", // Espacement du bas
  },
  cardBadge: {
    backgroundColor: "#F56D44",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontWeight: 700,
    marginLeft: "10px",
    whiteSpace: "nowrap",
    display: "inline-block",
  },
  cardContent: {
    paddingLeft: 25,
    paddingRight: 25,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: 800,
    color: "black",
  },
  cardDescription: {
    fontSize: "14px",
    fontWeight: 400,
    color: "#000000",
    marginTop: 18,
    textAlign: "justify",
  },
  cardFooter: {
    fontSize: "14px",
    fontWeight: 400,
    color: "black",
    opacity: 0.5,
    marginTop: 20,
  },
  sectionPreview: {
    marginTop: "10px",
  },
  sectionImage: {
    width: "100%",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  noImagePlaceholder: {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    textAlign: "center",
    borderRadius: "8px",
    fontStyle: "italic",
  },
};

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
    <div style={styles.container}>
      <img
        src={
          image ||
          "https://ballnconnect.com/static/bnctext-logo-a3863fd46c7d43be9a5168bf983e5254.webp"
        }
        alt={title}
        style={styles.image}
      />
      <div style={styles.categorie}>{category}</div>
      <div style={styles.cardContent}>
        <div>
          <p style={styles.date}>
            {date} par {author}
          </p>
          <p style={styles.title}>{title}</p>
          <p style={styles.content}>{resume}</p>
        </div>
        <div>
          <Link to={`/blog-post`} state={{ slug: slug }} style={styles.link}>
            LIRE P LUS
            <img src={arrowRight} alt="arrow" style={{ marginLeft: 14 }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
