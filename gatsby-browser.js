import React, { useState, useEffect } from "react";
import { ArticleProvider } from "./src/context/use-article-context";
import { MediaProvider } from "./src/context/media-context";
import { CategoryProvider } from "./src/context/categories-context";
import { AuthProvider } from "./src/context/use-user-contexte";
import { MessageProvider } from "./src/context/use-message-context";
import CookiesModal from "./src/pages/components/Cookie"; // Importer le modal des cookies
import { UserProvider } from "./src/context/use-users-context";

const WrapRootElement = ({ element }) => {
  const [isClient, setIsClient] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Vérifier et appliquer le thème au montage
    const savedTheme = localStorage.getItem("theme") === "dark";
    setDarkMode(savedTheme);
    document.documentElement.classList.toggle("dark-mode", savedTheme);
  }, []);

  return (
    <AuthProvider>
      <UserProvider>
        <CategoryProvider>
          <ArticleProvider>
            <MessageProvider>
              <MediaProvider>{element}</MediaProvider>
            </MessageProvider>
          </ArticleProvider>
        </CategoryProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export const wrapRootElement = ({ element }) => {
  return <WrapRootElement element={element} />;
};
