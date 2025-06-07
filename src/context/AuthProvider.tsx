import { useState, ReactNode, useMemo, useCallback } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ token, setToken ] = useState<string | null>(() => localStorage.getItem('token'));

  const login = useCallback((newToken: string) => {
    console.log("login logic", newToken);
    setToken(newToken);
    localStorage.setItem('token', newToken);
  }, [])

  const logout = useCallback(() => {
    console.log("logout logic");
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const authValue = useMemo(() => {
    const isAuthenticated = !!token;
    return {
      token,
      isAuthenticated,
      login,
      logout
    };
  }, [ token, login, logout ]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}
