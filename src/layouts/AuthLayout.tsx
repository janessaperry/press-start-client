import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.tsx";

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if ( isAuthenticated ) {
    return <Navigate to="/"/>;
  }

  return <Outlet/>
}

export default AuthLayout;