import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBasketballBall,
  FaExternalLinkAlt,
  FaGithub,
  FaBars,
  FaTimes,
  FaLinkedin,
} from "react-icons/fa";
import styled from "styled-components";

// Composant Navbar
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Nav>
      <Logo to="/">Mon Blog</Logo>
      <MenuIcon onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
      </MenuIcon>
      <NavLinks isOpen={isOpen}>
        <NavLink to="/" style={styles.navTitles}>
          Accueil
        </NavLink>
        <NavLink to="/blog/blog-list" style={styles.navTitles}>
          Articles
        </NavLink>
        <NavLink to="/blog/blog-post-creator" style={styles.navTitles}>
          Creation
        </NavLink>

        <SocialIcons>
          <SocialIcon
            href="https://www.david-konate.fr"
            title="Mon site web"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaExternalLinkAlt size={20} />
          </SocialIcon>

          <SocialIcon
            href="https://github.com/David-konate"
            title="Mon GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={20} />
          </SocialIcon>

          <SocialIcon
            href="https://www.linkedin.com/in/david-konate/"
            title="Mon LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={20} />
          </SocialIcon>

          <SocialIcon
            href="https://ballnconnect.com/"
            title="Site sur lequel ce projet a été déployé"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaBasketballBall size={20} />
          </SocialIcon>
        </SocialIcons>

        <ContactBtn>Contactez-moi</ContactBtn>
      </NavLinks>
    </Nav>
  );
};

export default Navbar;

// 🎨 Styles avec styled-components
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #1cb5e0, #000046);
  padding: 20px 40px;
  color: white;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transition: all 0.3s ease-in-out;
`;

const Logo = styled(Link)`
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-decoration: none;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: "Roboto", sans-serif; /* Police moderne */
`;

const MenuIcon = styled.div`
  cursor: pointer;
  display: none;
  color: white;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    display: block;
  }

  &:hover {
    transform: rotate(90deg); /* Rotation de l'icône */
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.8); /* Arrière-plan sombre transparent */
    padding: 20px;
    border-radius: 10px;
  }
`;

const NavLink = styled(Link)`
  color: white;
  margin: 0 20px;
  text-decoration: none;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: 1px;
  text-transform: capitalize;
  font-family: "Roboto", sans-serif;

  &:hover {
    color: #00d2ff; /* Accent bleu clair futuriste */
    font-weight: 800;
    letter-spacing: 2px;
    transition: color 0.3s ease, letter-spacing 0.3s ease;
  }

  @media (max-width: 768px) {
    margin: 10px 0;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-left: 20px;

  @media (max-width: 768px) {
    margin-top: 15px;
  }
`;

const SocialIcon = styled.a`
  color: white;
  transition: color 0.3s ease;

  &:hover {
    color: #00d2ff; /* Accent bleu futuriste sur hover */
    transform: scale(1.1); /* Agrandissement des icônes */
  }
`;

const ContactBtn = styled.button`
  font-size: 16px;
  font-weight: 700;
  color: white;
  background-image: linear-gradient(
    90deg,
    #00d2ff,
    #005c78
  ); /* Dégradé de bleu futuriste */
  border-radius: 25px;
  padding: 12px 30px;
  align-items: center;
  margin-left: 30px;
  cursor: pointer;
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05); /* Agrandissement au survol */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Ombre douce au survol */
  }
`;

const styles = {
  navTitles: {
    marginLeft: 35,
  },
};
