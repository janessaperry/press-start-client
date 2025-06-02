import React from 'react';
import { NavLink } from "react-router-dom";
import PressStartLogo from "../../assets/logos/press-start-logo--dark.svg"
import AvatarPlaceholder from "../../assets/images/avatar-placeholder.png"
import styles from './Header.module.css';
import { GhostIcon } from "@phosphor-icons/react";

const Header: React.FC = () => {
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
              <a href="/settings" className={styles.navLink}>
                <img className={`${styles.avatar}`} src={AvatarPlaceholder} alt="User avatar"/>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;