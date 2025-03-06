import React, { useState, useEffect } from "react";
import { ArticleProvider } from "./src/context/use-article-context";
import { MediaProvider } from "./src/context/media-context";
import { CategoryProvider } from "./src/context/categories-context";
import { AuthProvider } from "./src/context/use-user-contexte";
import { MessageProvider } from "./src/context/use-message-context";
import CookiesModal from "./src/pages/components/Cookie"; // Importer le modal des cookies
import Cookies from "js-cookie";

export const wrapRootElement = ({ element }) => {
  const [showModal, setShowModal] = useState(false);
  const [isClient, setIsClient] = useState(false); // Ajoutez l'état pour vérifier si nous sommes côté client

  useEffect(() => {
    setIsClient(true); // Une fois monté côté client
    const cookiesAccepted = Cookies.get("cookiesAccepted");
    if (!cookiesAccepted) {
      setShowModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    Cookies.set("cookiesAccepted", true, { expires: 365 });
    setShowModal(false);
  };

  if (!isClient) {
    // Ne rien rendre côté serveur
    return <>{element}</>;
  }

  return (
    <AuthProvider>
      <CategoryProvider>
        <ArticleProvider>
          <MessageProvider>
            <MediaProvider>
              {showModal && <CookiesModal onClose={handleCloseModal} />}
              {element}
            </MediaProvider>
          </MessageProvider>
        </ArticleProvider>
      </CategoryProvider>
    </AuthProvider>
  );
};
