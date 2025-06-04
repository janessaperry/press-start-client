import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("useAuth", context);

  if ( !context ) {
    throw new Error("useAuth must be used within the AuthProvider");
  }

  return context;
};

export default useAuth;