import React, { createContext, useState, useContext } from "react";
import useAuth from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const {
    user,
    token,
    loading,
    error,
    alert,
    register,
    login,
    loginWithGoogle,
    loginWithFacebook,
    checkAuth,
    logout,
    isLoggedIn,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        alert,
        register,
        login,
        loginWithGoogle,
        loginWithFacebook,
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
