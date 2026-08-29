import { useEffect, useState, useCallback } from "react";
import { login, register } from "../api/auth";
import { getMe, deleteUser } from "../api/users";
import { clearAuth, isAuthenticated, saveAuth } from "../lib/auth";
import { AuthContext } from "./AuthContextObject";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    if (!isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const userData = await getMe();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || "Failed to fetch user details.");
      if (err.status === 401 || err.status === 403) {
        clearAuth();
        setUser(null);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogin = async (credentials) => {
    const authData = await login(credentials);
    saveAuth(authData);
    const fullUser = await fetchUser();
    return fullUser || authData;
  };

  const handleRegister = async (values) => {
    const authData = await register(values);
    saveAuth(authData);
    const fullUser = await fetchUser();
    return fullUser || authData;
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setError(null);
  };

  const handleDeleteUser = async (id) => {
    const targetId = id || user?.id;
    if (!targetId) {
      throw new Error("No user ID provided for deletion.");
    }

    await deleteUser(targetId);

    // If deleted current user, log them out
    if (String(targetId) === String(user?.id)) {
      handleLogout();
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user) || isAuthenticated(),
    refetchUser: fetchUser,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    deleteUser: handleDeleteUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
