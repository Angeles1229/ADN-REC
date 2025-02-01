import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const login = (token) => {
    console.log("✅ Guardando token en localStorage:", token);
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    console.log("🔴 Eliminando token de localStorage");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
