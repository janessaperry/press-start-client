import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.ts";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if ( !isAuthenticated ) {
    return <Navigate to="/sign-in"/>;
  }

  return <Outlet/>
}

export default ProtectedRoute;