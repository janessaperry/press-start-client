import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.ts";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const [ wasAuthenticated ] = useState(isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={wasAuthenticated ? "/explore" : "/sign-in"}/>;
  }

  return <Outlet/>
}

export default ProtectedRoute;