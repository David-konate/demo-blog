import Layout from "./components/layout";
import React from "react";
import { Router } from "@reach/router";
import PrivateRoute from "./components/privateRoute";

const App = () => {
  <Layout>
    <Router basepath="app">
      <PrivateRoute path="/categories" />
      <PrivateRoute path="/blog-post-create" />
    </Router>
  </Layout>;
};

export default App;
