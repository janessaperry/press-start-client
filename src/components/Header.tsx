import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@headlessui/react";
import {
  GhostIcon, HouseIcon, MagnifyingGlassIcon, SignInIcon, TreasureChestIcon, UserIcon,
} from "@phosphor-icons/react";
import PressStartLogo from "/src/assets/logos/press-start-logo--dark.svg"
import useAuth from "../hooks/useAuth.ts";
import { TelescopeIcon } from "./icons";
import { useSearchOverlay } from "../context/SearchOverlayContext.tsx";
import SearchWithDropdown from "./SearchWithDropdown.tsx";

const Header = () => {
  const { userId, logout } = useAuth();
  const { openSearch } = useSearchOverlay();
  const navigate = useNavigate();
  const location = useLocation();
  const [ searchParams ] = useSearchParams();
  const desktopInitialQuery = location.pathname === '/games' ? (searchParams.get('search') ?? '') : '';

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `relative text-lg flex flex-col justify-start items-center
    ${isActive ?
      "text-accent-300" :
      "text-grey-50 hover:text-interactive-primary-hover"
    }`
  }

  const getMobileNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `w-full flex flex-col items-center gap-0.5 text-sm font-bold text-center
    ${isActive ? "text-accent-300" : "text-grey-50 hover:text-interactive-primary-hover"}`
  }

  return (
    <>
      <header className="sticky top-0 bg-secondary-900/80 backdrop-blur-lg z-20">
        <div className="container mx-auto px-4 py-6 md:px-8 md:py-4">
          <nav className="flex items-center justify-center md:justify-between md:gap-6 lg:gap-10">
            <NavLink to="/explore">
              <img src={PressStartLogo} alt="Press Start Logo" className="max-w-[16rem]"/>
            </NavLink>

            <SearchWithDropdown
              className="flex-1 hidden md:block"
              inputClassName="bg-transparent border-primary-100/20 text-grey-50"
              onSubmit={(q) => navigate(`/games?search=${encodeURIComponent(q)}`)}
              initialQuery={desktopInitialQuery}
              hideButton
            />

            <ul className="hidden md:flex items-center gap-6 lg:gap-10">
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
              {userId && (
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
              )}
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
          </nav>
        </div>
      </header>

      {/* ----- MOBILE NAV ----- */}
      <nav className="fixed md:hidden bottom-4 inset-x-4 px-4 py-3 bg-blue-500 border border-accent-300/40 rounded-full z-20">
        <ul className="flex gap-2">
          {userId === null && (
            <li className="flex-1">
              <NavLink to="/" className={getMobileNavLinkClass}>
                <HouseIcon className="icon-lg"/>
                Home
              </NavLink>
            </li>
          )}

          <li className="flex-1">
            <NavLink to="/explore" className={getMobileNavLinkClass}>
              <TelescopeIcon className="icon-lg"/>
              Explore
            </NavLink>
          </li>
          {userId && (
            <li className="flex-1">
              <NavLink to="/my-games" className={getMobileNavLinkClass}>
                <TreasureChestIcon className="icon-lg"/>
                My Games
              </NavLink>
            </li>
          )}
          <li className="flex-1">
            <button onClick={() => openSearch()} className={getMobileNavLinkClass({ isActive: false })}>
              <MagnifyingGlassIcon className="icon-lg"/>
              Search
            </button>
          </li>
          {userId && (
            <>
              <li className="flex-1">
                <NavLink to="/account-settings" className={getMobileNavLinkClass}>
                  <UserIcon className="icon-lg"/>
                  Account
                </NavLink>
              </li>
            </>
          )}
          {userId === null &&
            <>
              <li className="flex-1">
                <NavLink to="/sign-in" className={getMobileNavLinkClass}>
                  <SignInIcon className="icon-lg"/>
                  Sign In
                </NavLink>
              </li>
            </>
          }
        </ul>
      </nav>
    </>
  );
};

export default Header;