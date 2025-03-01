import React, { useEffect } from "react";
import { navigate } from "gatsby";
import Auth from "./components/Auth";
import Layout from "./components/layout";
import LoginIcon from "./components/LoginIcon";
import { useAuthContext } from "../context/use-user-contexte";
import AtomSpinner from "./components/Spinner";

const Login = () => {
  return (
    <Layout>
      <div className="loginPage">
        <LoginIcon />
        <Auth />
      </div>
    </Layout>
  );
};

export default Login;
