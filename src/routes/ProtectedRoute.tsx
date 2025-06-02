import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const authenticated = true;

  if ( !authenticated ) {
    return <Navigate to="/sign-up"/>;
  }

  return <Outlet/>
}

export default ProtectedRoute;