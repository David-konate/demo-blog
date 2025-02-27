import React from "react";
import Auth from "./components/Auth";
import Layout from "./components/layout";
import LoginIcon from "./components/LoginIcon";

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
