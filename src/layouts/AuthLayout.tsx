import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.ts";

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if ( isAuthenticated ) {
    return <Navigate to="/my-games"/>;
  }

  return <Outlet/>
}

export default AuthLayout;