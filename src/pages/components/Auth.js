import React, { useState, useEffect } from "react";
import { navigate } from "gatsby";
import SignUpModal from "./Signup"; // Importation de la modale
import "../../styles/login.css"; // Importation du fichier CSS spécifique
import useAuth from "../../services/authService";
import PasswordInput from "./PasswordInput";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpOpen, setIsSignUpOpen] = useState(false); // État pour la modale
  const { login, isLoggedIn } = useAuth();

  // useEffect(() => {
  //   if (isLoggedIn()) {
  //     navigate(`/`);
  //   }
  // }, [isLoggedIn]); // Ajout de la dépendance pour éviter les effets indésirables

  return (
    <section className="login-container">
      <div className="login-box">
        <h1 className="login-title">Connexion</h1>

        <div className="login-field">
          <label>E-mail</label>
          <input
            className="login-input"
            type="text"
            name="email"
            placeholder="Ton adresse mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-field">
          <label>Mot de passe</label>
          <div className="password-container">
            <PasswordInput
              name="password"
              placeholder="Ton mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="login-actions">
          <button
            className="login-button"
            onClick={() => login({ email, password })}
          >
            Se connecter
          </button>
        </div>

        {/* Lien pour créer un compte */}
        <p className="signup-link">
          Pas encore de compte ?{" "}
          <span className="signup-button" onClick={() => setIsSignUpOpen(true)}>
            Créer un compte
          </span>
        </p>
      </div>

      {/* Modale d'inscription */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </section>
  );
};

export default Auth;
