import PressStartLogo from "/src/assets/logos/press-start-logo--dark.svg";
import { GameControllerIcon, ListIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
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
        <div className="hidden md:flex md:flex-col md:items-start md:justify-between flex-1 p-12 bg-[url(/src/assets/images/blue-purple-logo-pattern-1024x1280.png)] bg-cover bg-no-repeat bg-right">
          <Link to="/">
            <img src={PressStartLogo}
              alt="Press Start logo"
              className="h-8 drop-shadow-xl drop-shadow-secondary-900"/>
          </Link>
          <div className="px-4 py-12 space-y-12 w-full">
            <h2 className="text-center">Keep your game collection organized.</h2>
            <div className="grid grid-cols-3 gap-12">
              <div className="flex flex-col items-center gap-6">
                <div className="p-4 border-2 border-accent-300/40 rounded-full">
                  <MagnifyingGlassIcon className="icon-lg lg:icon-xl text-accent-300"/></div>
                <h3 className="text-accent-300">Explore</h3>
              </div>
              <div className="flex flex-col items-center gap-6">
                <div className="p-4 border-2 border-primary-200/40 rounded-full">
                  <ListIcon className="icon-lg lg:icon-xl text-primary-200"/></div>
                <h3 className="text-primary-200">Collect</h3>
              </div>
              <div className="flex flex-col items-center gap-6">
                <div className="p-4 border-2 border-green-500/40 rounded-full">
                  <GameControllerIcon className="icon-lg lg:icon-xl text-green-500"/></div>
                <h3 className="text-green-500">Play</h3>
              </div>
            </div>
          </div>
        </div>

        <Outlet/>
      </div>
    </main>

  )
}

export default AuthLayout;