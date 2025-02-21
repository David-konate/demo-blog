import React from "react";
import Layout from "./components/layout";
import Welcome from "./welcome";
import "../styles/global.css";

const IndexPage = () => {
  return (
    <Layout>
      <div className="body">
        {" "}
        <Welcome />
      </div>
    </Layout>
  );
};

export default IndexPage;
