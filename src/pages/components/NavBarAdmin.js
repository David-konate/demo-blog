import React, { useEffect, useState } from "react";
import { Link, navigate } from "gatsby";
import {
  FaBasketballBall,
  FaExternalLinkAlt,
  FaGithub,
  FaBars,
  FaTimes,
  FaLinkedin,
} from "react-icons/fa";
import ArticlePreview from "./ArticlePreview"; // Modal générique
import "../../styles/global.css"; // Assurez-vous que le fichier global.css est bien importé
import ContactModalAdmin from "./ContactModalAdmin"; // Modal pour l'admin
import useAuth from "../../services/authService";
import Newsletter from "./Newsletter";

const NavbarAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth(); // Récupération de l'utilisateur connecté

  useEffect(() => {
    if (user === null) {
      navigate("login"); // Redirection si l'utilisateur est non authentifié
    }
  }, [user]);

  if (user === null) {
    return null; // Retourner rien tant que l'utilisateur est null et qu'on attend la redirection
  }

  const handleModalOpen = () => {
    if (user.role === "admin") {
      // Ouvre la modal spécifique pour la newsletter si l'utilisateur est un admin
      setIsModalOpen(true);
    } else {
      // Ouvre la modal générique de contact pour les autres utilisateurs
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Mon Blog
        </Link>
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </div>
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" activeClassName="active">
            Accueil
          </Link>
          <Link to="/blog-list" className="nav-link" activeClassName="active">
            Articles
          </Link>
          <Link to="/app/admin" className="nav-link" activeClassName="active">
            Admin
          </Link>

          <div className="social-icons">
            <a
              href="https://www.david-konate.fr"
              title="Mon site web"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaExternalLinkAlt size={20} />
            </a>

            <a
              href="https://github.com/David-konate"
              title="Mon GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaGithub size={20} />
            </a>

            <a
              href="https://www.linkedin.com/in/david-konate/"
              title="Mon LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaLinkedin size={20} />
            </a>

            <a
              href="https://ballnconnect.com/"
              title="Site sur lequel ce projet a été déployé"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaBasketballBall size={20} />
            </a>
          </div>

          {/* Bouton qui ouvre la modal - newsletter pour admin, contact pour autres utilisateurs */}
          <button className="contact-btn" onClick={handleModalOpen}>
            {user.role === "admin" ? "Newsletter" : "Contactez-nous"}
          </button>
        </div>
      </nav>

      {/* Affichage de la modal appropriée en fonction du rôle */}
      {isModalOpen && user.role === "admin" && (
        <Newsletter onClose={() => setIsModalOpen(false)} />
      )}
      {isModalOpen && user.role !== "admin" && (
        <ContactModalAdmin onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default NavbarAdmin;
