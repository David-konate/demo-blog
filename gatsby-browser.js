// gatsby-browser.js
import React from "react";
import { ArticleProvider } from "./src/context/use-article-context";
export const wrapRootElement = ({ element }) => {
  return <ArticleProvider>{element}</ArticleProvider>;
};
