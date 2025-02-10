import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Evita doble llamada a localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    const syncAuth = (event) => {
      if (event.key === "token") {
        setIsAuthenticated(!!event.newValue);
      }
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const login = (token) => {
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Guardando token:", token);
    }
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔴 Eliminando token de localStorage");
    }
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
