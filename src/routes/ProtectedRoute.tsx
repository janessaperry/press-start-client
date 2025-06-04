import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.tsx";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);

  if ( !isAuthenticated ) {
    return <Navigate to="/sign-up"/>;
  }

  return <Outlet/>
}

export default ProtectedRoute;