// services/userService.js
import { useState } from "react";
import trackerApi from "../api/tracker";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await trackerApi.get("/user");
      setUsers(response.data); // Mise à jour des utilisateurs récupérés
    } catch (error) {
      setError(error.response ? error.response.data.message : "Server error");
    } finally {
      setLoading(false);
    }
  };

  const getUserCount = async () => {
    setLoading(true);
    try {
      const response = await trackerApi.get("/user/count-users");
      setUserCount(response.data.userCount); // Mise à jour du nombre d'utilisateurs
    } catch (error) {
      setError(error.response ? error.response.data.message : "Server error");
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    userCount,
    loading,
    error,
    getAllUsers,
    getUserCount,
  };
};

export default useUsers;
