import React from "react";

import { ArticleProvider } from "./src/context/use-article-context";
import { MediaProvider } from "./src/context/media-context";

export default wrapRootElement = ({ element }) => {
  return (
    <ArticleProvider>
      <MediaProvider>{element}</MediaProvider>
    </ArticleProvider>
  );
};
