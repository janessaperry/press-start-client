import { useState, ReactNode, useMemo, useCallback } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ userId, setUserId ] = useState<string | null>(() => localStorage.getItem('userId'));
  const [ token, setToken ] = useState<string | null>(() => localStorage.getItem('token'));

  const login = useCallback((newToken: string, newUserId: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);

    setUserId(newUserId);
    localStorage.setItem('userId', newUserId);
  }, [])

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');

    setUserId(null);
    localStorage.removeItem('userId')
  }, []);

  const authValue = useMemo(() => {
    const isAuthenticated = !!token;
    return {
      userId,
      token,
      isAuthenticated,
      login,
      logout
    };
  }, [ userId, token, login, logout ]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}
