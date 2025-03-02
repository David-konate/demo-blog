import React, { createContext, useContext } from "react";
import useAuth from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const {
    user,
    loading,
    error,
    userCount,
    getUserFromStorage,
    getUserCount,
    register,
    login,
    loginWithGoogle,
    checkAuth,
    logout,
    isLoggedIn,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        userCount,
        getUserFromStorage,
        getUserCount,
        register,
        login,
        loginWithGoogle,
        checkAuth,
        logout,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
