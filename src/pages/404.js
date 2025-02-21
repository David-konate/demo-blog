import React from "react";
import { Link } from "gatsby";
import "../styles/404.css"; //

const NotFoundPage = () => {
  return (
    <main className="not-found-container">
      <h1 className="glitch-text">404</h1>
      <p className="not-found-text">
        Oups... Cette page semble avoir disparu dans les abysses du web !
        Peut-être qu’un <span className="highlight">nouvel article</span> vous
        attend ailleurs ?
      </p>
      <Link to="/" className="back-home-button">
        Retour à l'accueil
      </Link>
    </main>
  );
};

export default NotFoundPage;
