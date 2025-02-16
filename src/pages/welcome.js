import React, { useState } from "react";
import { Helmet } from "react-helmet";

// Composants pour le carrousel
const FeatureCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div style={{ marginTop: 10 }}>
      <button onClick={prevImage} style={{ marginRight: 10 }}>
        ◀
      </button>
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        style={{
          maxWidth: "300px",
          height: "auto",
          borderRadius: "8px", // Coins arrondis pour les images
        }}
      />
      <button onClick={nextImage} style={{ marginLeft: 10 }}>
        ▶
      </button>
    </div>
  );
};

const Welcome = () => {
  const features = [
    {
      title: "Gestion intuitive des articles",
      description:
        "Créez et modifiez facilement vos articles de blog grâce à la syntaxe Markdown.",
      images: [],
    },
    {
      title: "Aperçu en temps réel",
      description:
        "Visualisez instantanément vos modifications avant publication.",
      images: [],
    },
    {
      title: "Intégration CRM",
      description:
        "Synchronisez les articles avec le CRM de l'entreprise pour une gestion efficace.",
      images: [],
    },
    {
      title: "Publication rapide",
      description:
        "Publiez vos articles en un clic avec une interface épurée et efficace.",
      images: [],
    },
  ];

  return (
    <main style={pageStyles}>
      <Helmet>
        <title>Page d'accueil</title>
        <meta
          name="description"
          content="Bienvenue sur la page d'accueil de l'application"
        />
      </Helmet>
      <div style={contentStyles}>
        <h1 style={headingStyles}>
          Bienvenue sur mon projet de création de blog
          <br />
          <span style={headingAccentStyles}>
            — Une solution optimisée pour le CRM d'une entreprise 🚀
          </span>
        </h1>
        <p style={paragraphStyles}>
          Cette application permet de créer et gérer des articles en utilisant
          Markdown, tout en s'intégrant avec un CRM pour une meilleure gestion
          des publications.
        </p>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {features.map((feature, index) => (
            <li key={index} style={{ marginBottom: 24 }}>
              <h3 style={{ color: "#00d2ff", marginBottom: 8 }}>
                {feature.title}
              </h3>
              <p style={{ margin: 0, color: "#232129" }}>
                {feature.description}
              </p>
              <FeatureCarousel images={feature.images} />
            </li>
          ))}
        </ul>
        <p>
          Découvrez le projet sur{" "}
          <a style={linkStyle} href="#">
            GitHub
          </a>{" "}
          ou consultez la{" "}
          <a style={linkStyle} href="#">
            documentation
          </a>
          .
        </p>
      </div>
    </main>
  );
};

const pageStyles = {
  color: "#232129",
  padding: "96px 24px", // Ajout d'un peu d'espace pour les petits écrans
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  background: "white",
  transition: "all 0.3s ease-in-out",
  display: "flex",
  justifyContent: "center", // Centrer horizontalement
};

const contentStyles = {
  maxWidth: "900px", // Limite la largeur de l'intérieur pour plus de lisibilité
  width: "100%",
  textAlign: "center", // Centrer tout le contenu
};

const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  color: "#232129",
};

const headingAccentStyles = {
  color: "#00d2ff",
};

const paragraphStyles = {
  marginBottom: 48,
  fontSize: "1.2rem",
  color: "#232129",
};

const linkStyle = {
  color: "#00d2ff",
  fontWeight: "bold",
  fontSize: 16,
  transition: "color 0.3s ease",
};

export default Welcome;
