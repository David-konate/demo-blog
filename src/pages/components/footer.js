import React from "react";
import { Link } from "gatsby";
import {
  FaBasketballBall,
  FaExternalLinkAlt,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import "../../styles/global.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-links">
          <Link className="footer-link" to="/mentions-legales">
            Mentions Légales
          </Link>
          <Link className="footer-link" to="/politique-confidentialite">
            Politique de Confidentialité
          </Link>
        </div>
        <div className="social-icons">
          <a
            className="social-icon"
            href="https://www.david-konate.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaExternalLinkAlt size={20} />
          </a>
          <a
            className="social-icon"
            href="https://github.com/David-konate"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={20} />
          </a>
          <a
            className="social-icon"
            href="https://www.linkedin.com/in/david-konate/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            className="social-icon"
            href="https://ballnconnect.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaBasketballBall size={20} />
          </a>
        </div>
        <p className="copyright">
          © {new Date().getFullYear()} David Konaté. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
