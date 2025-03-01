import React, { useState } from "react";
import { Link } from "gatsby";
import {
  FaBasketballBall,
  FaExternalLinkAlt,
  FaGithub,
  FaBars,
  FaTimes,
  FaLinkedin,
} from "react-icons/fa";
import ContactModal from "./ContactModal"; // Importation de la modal
import "../../styles/global.css"; // Assurez-vous que le fichier global.css est bien importé

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <Link to="/" className="nav-link">
            Accueil
          </Link>
          <Link to="/blog-list" className="nav-link">
            Articles
          </Link>
          <Link to="/app/admin" className="nav-link">
            admin
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

          {/* Bouton qui ouvre la modal */}
          <button className="contact-btn" onClick={() => setIsModalOpen(true)}>
            Contactez-moi
          </button>
        </div>
      </nav>

      {/* Affichage de la modal si isModalOpen est true */}
      {isModalOpen && <ContactModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Navbar;
