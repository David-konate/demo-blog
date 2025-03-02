// gatsby-browser.js
import React from "react";
import { ArticleProvider } from "./src/context/use-article-context";
import { MediaProvider } from "./src/context/media-context";
import { CategoryProvider } from "./src/context/categories-context";
import { AuthProvider } from "./src/context/use-user-contexte";
import { MessageProvider } from "./src/context/use-message-context";
export const wrapRootElement = ({ element }) => {
  return (
    <AuthProvider>
      <CategoryProvider>
        <ArticleProvider>
          <MessageProvider>
            <MediaProvider>{element} </MediaProvider>
          </MessageProvider>
        </ArticleProvider>
      </CategoryProvider>
    </AuthProvider>
  );
};
