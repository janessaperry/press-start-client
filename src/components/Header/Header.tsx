import React from 'react';
import styles from './Header.module.css';
import ReactLogo from '../../assets/react.svg';

const Header: React.FC = () => {
  return (
    <header className="bg-dark">
      <div className={styles.container}>
        <nav className="flex items-center justify-between">
          <img src={ReactLogo} alt="React Logo" className={styles.logo}/>

          <ul className="flex items-center gap-8 m-0 p-0">
            <li className="m-0 p-0">
              <a href="/" className={styles.navLink}>Home</a>
            </li>
            <li className="m-0 p-0">
              <a href="/about" className={styles.navLink}>About</a>
            </li>
            <li className="m-0 p-0">
              <a href="/contact" className={styles.navLink}>Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;