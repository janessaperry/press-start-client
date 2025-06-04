import { createContext } from "react";

type AuthContextType = {
  token: string | null | undefined;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
