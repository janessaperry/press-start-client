import JpLogo from "../../assets/logos/jp-logo.svg"
import { GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import styles from "./Footer.module.css";


const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        Designed & developed by <a href="https://janessaperry.com"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className={styles.link}>Janessa
        Perry</a>
      </div>

      <div className="flex items-center gap-4">
        <a className={`${styles.link} flex`}
           href="https://janessaperry.com"
           target="_blank"
           rel="noopener noreferrer">
          <img src={JpLogo} alt="JP Logo" className="icon-lg"/>
        </a>
        <a className={`${styles.link} flex`}
           href="https://github.com/janessaperry"
           target="_blank"
           rel="noopener noreferrer">
          <GithubLogoIcon size={24}/>
        </a>
        <a className={`${styles.link} flex`}
           href="https://www.linkedin.com/in/janessa-perry/"
           target="_blank"
           rel="noopener noreferrer">
          <LinkedinLogoIcon size={24}/>
        </a>
      </div>
    </footer>
  )
}

export default Footer;