import React from "react";

import { ArticleProvider } from "./src/context/use-article-context";

export default wrapRootElement = ({ element }) => {
  return <ArticleProvider>{element}</ArticleProvider>;
};
