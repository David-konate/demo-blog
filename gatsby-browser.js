import React, { useState, useEffect } from "react";
import { ArticleProvider } from "./src/context/use-article-context";
import { MediaProvider } from "./src/context/media-context";
import { CategoryProvider } from "./src/context/categories-context";
import { AuthProvider } from "./src/context/use-user-contexte";
import { MessageProvider } from "./src/context/use-message-context";
import { CookieProvider } from "./src/context/use-cookie-context";
import CookiesModal from "./src/pages/components/Cookie"; // Importer le modal des cookies
import useCookies from "./src/services/cookieService";
import { UserProvider } from "./src/context/use-users-context";

const WrapRootElement = ({ element }) => {
  const { cookie, setCookiesPreferences, loading } = useCookies();
  const [isClient, setIsClient] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Vérifier et appliquer le thème au montage
    const savedTheme = localStorage.getItem("theme") === "dark";
    setDarkMode(savedTheme);
    document.documentElement.classList.toggle("dark-mode", savedTheme);
  }, []);

  const handleCloseModal = () => {
    setCookiesPreferences(true, false); // Accepter uniquement les cookies, pas la newsletter
  };

  if (!isClient || loading) {
    return <>{element}</>; // Ne pas afficher le modal avant le chargement
  }

  return (
    <AuthProvider>
      <UserProvider>
        <CookieProvider>
          <CategoryProvider>
            <ArticleProvider>
              <MessageProvider>
                <MediaProvider>
                  {!cookie?.cookiesAccepted && (
                    <CookiesModal onClose={handleCloseModal} />
                  )}
                  {element}
                </MediaProvider>
              </MessageProvider>
            </ArticleProvider>
          </CategoryProvider>
        </CookieProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export const wrapRootElement = ({ element }) => {
  return <WrapRootElement element={element} />;
};
