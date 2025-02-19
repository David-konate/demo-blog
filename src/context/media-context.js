import React, { createContext, useState } from "react";
import { useMedia } from "../services/useMedia";

export const MediaContext = createContext(); // Assure-toi que ce contexte est exporté

export const MediaProvider = ({ children }) => {
  const [state, setState] = useState({ user: "David", theme: "light" });

  const isPhone = useMedia("(max-width: 767px)");
  const isTablet = useMedia("(min-width: 768px) and (max-width: 1224px)");
  const isLaptop = useMedia("(min-width: 1225px)");

  const mediaQueryState = { isPhone, isTablet, isLaptop };

  return (
    <MediaContext.Provider value={{ state, setState, mediaQueryState }}>
      {children}
    </MediaContext.Provider>
  );
};
