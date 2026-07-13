import PressStartLogo from "/src/assets/logos/press-start-logo--dark.svg";
import { InfoIcon } from "@phosphor-icons/react";
import { Link, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.ts";

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/my-games"/>;
  }

  return (
    <main className="h-screen">
      <div className="h-full flex">
        <div className="hidden md:flex md:flex-col md:items-start md:justify-between flex-1 p-12 bg-[url(/src/assets/images/sign-up-bg-v3.jpg)] bg-cover bg-no-repeat bg-right">
          <Link to="/">
            <img src={PressStartLogo}
              alt="Press Start logo"
              className="h-8 drop-shadow-xl drop-shadow-secondary-900"/>
          </Link>
          <div className="lg:max-w-1/2 flex items-start gap-1.5 bg-primary-900/60 p-2 text-sm rounded-sm"><InfoIcon
            className="icon-sm shrink-0"/> AI generated image - if you have a gaming related image you'd like you
            contribute, please reach out!
          </div>
        </div>

        <Outlet/>
      </div>
    </main>

  )
}

export default AuthLayout;