import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebook } from "react-icons/fa";
import useAuth from "../../services/authService";

const LoginIcon = () => {
  const { loginWithGoogle, loginWithFacebook } = useAuth();

  const handleGoogleSuccess = (response) => {
    if (response.credential) {
      loginWithGoogle(response);
    }
  };

  return (
    <div className="login-icon-container">
      <h2 className="login-icon-title">
        Vous pouvez vous connecter sans créer de compte via :
      </h2>
      <GoogleOAuthProvider clientId="188096247271-04ikj1mehgh7re2fgni7mh3iq8ftb60o.apps.googleusercontent.com">
        <div className="google-provider-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error("Échec de la connexion Google")}
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default LoginIcon;
