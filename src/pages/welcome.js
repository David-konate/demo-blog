import React, { useState } from "react";
import { Helmet } from "react-helmet";
import "./../styles/welcome.css";
import testImage from "../assets/img/test.png";

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
    <div className="carousel-container">
      <button onClick={prevImage} className="carousel-button">
        ◀
      </button>
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="carousel-image"
      />
      <button onClick={nextImage} className="carousel-button">
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
      images: [testImage], // Utilisation de l'import
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
    <main className="welcome-page">
      <Helmet>
        <title>Notre Blog - Articles sur la Tech, le Sport et plus</title>
        <meta
          name="description"
          content="Découvrez une variété d'articles sur le développement, la tech, le sport, la culture et bien plus encore."
        />
        <meta
          name="keywords"
          content="blog, tech, développement, sport, culture, articles, web"
        />
        <meta name="author" content="Ton Nom" />

        {/* Open Graph pour Facebook & LinkedIn */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Notre Blog - Articles sur la Tech, le Sport et plus"
        />
        <meta
          property="og:description"
          content="Découvrez une variété d'articles sur le développement, la tech, le sport, la culture et bien plus encore."
        />
        <meta property="og:url" content="https://ton-site.com/blog" />
        <meta
          property="og:image"
          content="https://ton-site.com/images/blog-banner.jpg"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Notre Blog - Articles sur la Tech, le Sport et plus"
        />
        <meta
          name="twitter:description"
          content="Découvrez une variété d'articles sur le développement, la tech, le sport, la culture et bien plus encore."
        />
        <meta
          name="twitter:image"
          content="https://ton-site.com/images/blog-banner.jpg"
        />
        <meta name="twitter:site" content="@TonTwitter" />

        {/* SEO spécifique pour la page d'accueil */}
        <meta property="og:site_name" content="Nom de Ton Site" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className="content-container">
        <h1 className="page-heading">
          Bienvenue sur mon projet de création de blog
          <br />
          <span className="highlight-text">
            — Une solution optimisée pour le CRM d'une entreprise 🚀
          </span>
        </h1>
        <p className="description-text">
          Cette application permet de créer et gérer des articles en utilisant
          Markdown, tout en s'intégrant avec un CRM pour une meilleure gestion
          des publications.
        </p>
        <ul className="features-list">
          {features.map((feature, index) => (
            <li key={index} className="feature-item">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <FeatureCarousel images={feature.images} />
            </li>
          ))}
        </ul>
        <p className="links-text">
          Découvrez le projet sur{" "}
          <a
            className="external-link"
            href="https://github.com/David-konate/demo-blog"
          >
            GitHub (Front-end)
          </a>{" "}
          et{" "}
          <a
            className="external-link"
            href="https://github.com/David-konate/demo-blog-api"
          >
            GitHub (Back-end)
          </a>
          , ou consultez la{" "}
          <a className="external-link" href="/documentation">
            documentation
          </a>
          .
        </p>
      </div>
    </main>
  );
};

export default Welcome;
