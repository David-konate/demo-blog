// gatsby-browser.js
import React from "react";
import { ArticleProvider } from "./src/context/use-article-context";
import { MediaProvider } from "./src/context/media-context";
import { CategoryProvider } from "./src/context/categories-context";
export const wrapRootElement = ({ element }) => {
  return (
    <CategoryProvider>
      <ArticleProvider>
        <MediaProvider>{element} </MediaProvider>
      </ArticleProvider>
    </CategoryProvider>
  );
};
