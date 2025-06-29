import React from 'react';
import { NavLink } from "react-router-dom";
import { Button, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import PressStartLogo from "../../assets/logos/press-start-logo--dark.svg"
import { GhostIcon, UserCircleIcon } from "@phosphor-icons/react";
import styles from './Header.module.css';
import useAuth from "../../hooks/useAuth.tsx";

const Header: React.FC = () => {
  const { logout } = useAuth();
  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    return `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
  }

  return (
    <header className="bg-primary">
      <div className={styles.container}>
        <nav className="flex items-center justify-between">
          <NavLink to="/" className={styles.logoLink}>
            <img src={PressStartLogo} alt="Press Start Logo" className={styles.logo}/>
          </NavLink>

          <ul className="flex items-center gap-8 m-0 p-0">
            <li className="m-0 p-0">
              <NavLink to="/explore"
                       className={({ isActive }) =>
                         `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
                {({ isActive }) => (
                  <>
                    Explore
                    {isActive && <GhostIcon weight="fill" size={12} className={styles.navLinkActiveIcon}/>}
                  </>
                )}
              </NavLink>
            </li>
            <li className="m-0 p-0">
              <NavLink to="/collection"
                       className={getNavLinkClass}>
                {({ isActive }) => (
                  <>
                    Collection
                    {isActive && <GhostIcon weight="fill" size={12} className={styles.navLinkActiveIcon}/>}
                  </>
                )}
              </NavLink>
            </li>
            <li className="m-0 p-0">
              <Popover className={styles.popover}>
                <PopoverButton className={styles.popoverButton}>
                  <UserCircleIcon weight="duotone"
                                  className={styles.popoverButtonIcon}/>
                </PopoverButton>
                <PopoverPanel className={styles.popoverPanel} anchor={{ to: 'bottom end', gap: 'var(--spacing-1)' }}>
                  <NavLink to="/settings" className={styles.popoverLink}>Settings</NavLink>
                  <Button className={styles.popoverLink} onClick={logout}>Log out</Button>
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