import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("devvolt_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("devvolt_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get("/auth/me");
        setUser(data.data);
        localStorage.setItem("devvolt_user", JSON.stringify(data.data));
      } catch (error) {
        localStorage.removeItem("devvolt_token");
        localStorage.removeItem("devvolt_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    const { token, ...userData } = data.data;

    localStorage.setItem("devvolt_token", token);
    localStorage.setItem("devvolt_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password) => {
    const { data } = await API.post("/auth/register", {
      username,
      email,
      password,
    });
    const { token, ...userData } = data.data;

    localStorage.setItem("devvolt_token", token);
    localStorage.setItem("devvolt_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("devvolt_token");
    localStorage.removeItem("devvolt_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {" "}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
