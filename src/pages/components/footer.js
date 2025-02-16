import React from "react";
import { Link } from "react-router-dom";
import {
  FaBasketballBall,
  FaExternalLinkAlt,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLinks>
          <FooterLink to="/mentions-legales">Mentions Légales</FooterLink>
          <FooterLink to="/politique-confidentialite">
            Politique de Confidentialité
          </FooterLink>
        </FooterLinks>

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
            title="Projet déployé"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaBasketballBall size={20} />
          </SocialIcon>
        </SocialIcons>
      </FooterContent>
      <Copyright>
        © {new Date().getFullYear()} David Konaté. Tous droits réservés.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;

// 🎨 Styles avec styled-components
const FooterContainer = styled.footer`
  background: linear-gradient(90deg, #1cb5e0, #000046);
  padding: 20px 40px;
  color: white;
  text-align: center;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.6);
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const FooterLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #00d2ff;
    font-weight: 700;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialIcon = styled.a`
  color: white;
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #00d2ff;
    transform: scale(1.1);
  }
`;

const Copyright = styled.p`
  margin-top: 10px;
  font-size: 14px;
  opacity: 0.7;
`;
