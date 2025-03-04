// PrivateRoute.js
import React from "react";
import { navigate } from "gatsby";
import useAuth from "../services/authService";
import AtomSpinner from "../pages/components/Spinner";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user, loading, isLoggedIn } = useAuth();
  if (loading) {
    return (
      <p>
        <AtomSpinner />
      </p>
    ); // Affichage d'un écran de chargement
  }
  console.log(isLoggedIn());
  if (!isLoggedIn()) {
    navigate("/login");
    return null;
  }

  return <Component {...rest} user={user} />;
};

export default PrivateRoute;
