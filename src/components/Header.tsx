import { NavLink } from "react-router-dom";
import { Button, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import PressStartLogo from "/src/assets/logos/press-start-logo--dark.svg"
import { GhostIcon, UserCircleIcon } from "@phosphor-icons/react";
import useAuth from "../hooks/useAuth.tsx";

const Header = () => {
  const { logout } = useAuth();
  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `relative text-lg flex flex-col justify-start items-center 
    ${isActive ?
      "text-accent-300" :
      "text-grey-50 hover:text-interactive-primary-hover"
    }`
  }

  return (
    <header className="container">
      <div className="max-w-xl mx-auto p-4 md:px-8 md:py-4">
        <nav className="flex items-center justify-between">
          <NavLink to="/" className="">
            <img src={PressStartLogo} alt="Press Start Logo" className="max-w-[10rem] md:max-w-[16rem]"/>
          </NavLink>

          <ul className="flex items-center gap-3 md:gap-8">
            <li>
              <NavLink to="/explore"
                className={getNavLinkClass}>
                {({ isActive }) => (
                  <>
                    Explore
                    {isActive && <GhostIcon weight="fill" size={12} className="absolute -bottom-3"/>}
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/collection"
                className={getNavLinkClass}>
                {({ isActive }) => (
                  <>
                    Collection
                    {isActive && <GhostIcon weight="fill" size={12} className="absolute -bottom-3"/>}
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <Popover>
                <PopoverButton className="button secondary p-3 md:p-2">
                  <UserCircleIcon weight="duotone" className="icon-md"/>
                </PopoverButton>

                <PopoverPanel className="bg-primary-500 p-2 mt-1 flex flex-col gap-1 rounded-xl shadow-md shadow-primary-900"
                  anchor='bottom end'>

                  <NavLink to="/settings"
                    className="px-4 py-2 rounded-md text-grey-50 hover:bg-primary-700">Settings</NavLink>

                  <Button className="button primary" onClick={logout}>Log out</Button>
                </PopoverPanel>
              </Popover>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;