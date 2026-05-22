import { createContext } from "react";

type AuthContextType = {
  userId: string | null;
  token: string | null | undefined;
  isAuthenticated: boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
