// context/UserContext.js
import React, { createContext, useContext } from "react";
import useUsersService from "../services/userService"; // Le service pour gérer les utilisateurs

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const {
    users, // Liste des utilisateurs récupérés
    userCount, // Nombre total d'utilisateurs
    loading, // Indicateur de chargement
    error, // Erreur potentielle lors de la récupération des données
    getAllUsers, // Fonction pour récupérer tous les utilisateurs
    getUserCount, // Fonction pour récupérer le nombre d'utilisateurs
  } = useUsersService();

  return (
    <UserContext.Provider
      value={{
        users,
        userCount,
        loading,
        error,
        getAllUsers,
        getUserCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
