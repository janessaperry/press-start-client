import { useState, ReactNode } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ token, setToken ] = useState<string | null>(() => localStorage.getItem('token'));
  const isAuthenticated = !!token;

  const login = (newToken: string) => {
    console.log("login logic", newToken);
    setToken(newToken);
    localStorage.setItem('token', newToken);
  }

  const logout = () => {
    console.log("logout logic");
    setToken(null);
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
