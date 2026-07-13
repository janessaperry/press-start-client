import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@headlessui/react";
import { GhostIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import PressStartLogo from "/src/assets/logos/press-start-logo--dark.svg"
import useAuth from "../hooks/useAuth.ts";

const Header = () => {
  const { userId, logout } = useAuth();
  const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `relative text-lg flex flex-col justify-start items-center
    ${isActive ?
      "text-accent-300" :
      "text-grey-50 hover:text-interactive-primary-hover"
    }`
  }

  const getMobileNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `text-lg font-medium ${isActive ? "text-accent-300" : "text-grey-50 hover:text-interactive-primary-hover"}`
  }

  return (
    <>
      <header className="sticky top-0 bg-secondary-900/80 backdrop-blur-lg z-20">
        <div className="container mx-auto p-4 md:px-8 md:py-4">
          <nav className="flex items-center justify-between">
            <NavLink to={`${userId ? '/explore' : '/'}`}>
              <img src={PressStartLogo} alt="Press Start Logo" className="max-w-[10rem] md:max-w-[16rem]"/>
            </NavLink>

            <ul className="hidden md:flex items-center gap-3 md:gap-8">
              <li>
                <NavLink to="/explore" className={getNavLinkClass}>
                  {({ isActive }) => (
                    <>
                      Explore
                      {isActive && <GhostIcon weight="fill" size={12} className="absolute -bottom-3"/>}
                    </>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-games" className={getNavLinkClass}>
                  {({ isActive }) => (
                    <>
                      My Games
                      {isActive && <GhostIcon weight="fill" size={12} className="absolute -bottom-3"/>}
                    </>
                  )}
                </NavLink>
              </li>
              {userId && (
                <>
                  <li>
                    <NavLink to="/account-settings" className={getNavLinkClass}>
                      {({ isActive }) => (
                        <>
                          Account
                          {isActive && <GhostIcon weight="fill" size={12} className="absolute -bottom-3"/>}
                        </>
                      )}
                    </NavLink>
                  </li>

                  <li>
                    <Button className="button ghost muted" onClick={logout}>Log out</Button>
                  </li>
                </>
              )
              }
              {userId === null &&
                <>
                  <li>
                    <NavLink to="/sign-in" className="button primary">Sign in</NavLink>
                  </li>
                  <li>
                    <NavLink to="/sign-up" className="link-primary">Create Account</NavLink>
                  </li>
                </>
              }
            </ul>

            <button className="md:hidden button ghost p-2" onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu">
              <ListIcon size={24}/>
            </button>
          </nav>
        </div>
      </header>

      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300
        ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>

        <div className="absolute inset-0 bg-secondary-900/70" onClick={closeMobileMenu}/>

        <div className={`absolute right-0 top-0 h-full w-72 bg-primary-700 flex flex-col p-6
          transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>

          <div className="flex justify-end mb-8">
            <button className="button ghost p-2" onClick={closeMobileMenu} aria-label="Close menu">
              <XIcon size={24}/>
            </button>
          </div>

          <ul className="flex flex-col gap-6">
            <li>
              <NavLink to="/explore" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
                Explore
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-games" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
                My Games
              </NavLink>
            </li>
          </ul>

          <div className="mt-auto flex flex-col gap-4">
            {userId &&
              <div className="flex flex-col gap-3">
                <p className="text-sm uppercase tracking-widest text-primary-100">Account</p>
                <NavLink to="/account-settings" className={getMobileNavLinkClass} onClick={closeMobileMenu}>
                  Settings
                </NavLink>
                <button className="text-lg font-medium text-grey-50 hover:text-interactive-primary-hover text-left"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}>
                  Log out
                </button>
              </div>
            }
            {userId === null &&
              <div className="flex flex-col gap-3">
                <NavLink to="/sign-in" className="button primary text-center" onClick={closeMobileMenu}>
                  Sign in
                </NavLink>
                <NavLink to="/sign-up" className="link-primary text-center" onClick={closeMobileMenu}>
                  Create Account
                </NavLink>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;