import React from "react";
import { Router } from "@reach/router";
import PrivateRoute from "../utils/privateRoute";
import CreateCategoryPage from "./categories";
import UpdateArticlePage from "./blog-update";
import Admin from "./admin";
import LayoutAdmin from "./components/layoutAdmin";
import Login from "./login";
import CreateArticlePage from "./blog-post-create";

const App = () => {
  return (
    <LayoutAdmin>
      <Router basepath="/app">
        <PrivateRoute path="/categories" component={CreateCategoryPage} />
        <PrivateRoute path="/blog-post-create" component={CreateArticlePage} />
        <PrivateRoute path="/blog-update" component={UpdateArticlePage} />
        <PrivateRoute path="/admin" component={Admin} />
        <Login path="/login" />
      </Router>
    </LayoutAdmin>
  );
};

export default App;
