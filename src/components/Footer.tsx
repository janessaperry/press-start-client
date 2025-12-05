import JpLogo from "../assets/logos/jp-logo.svg"
import { GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";

const Footer = () => {
  return (
    <footer className="container p-4 text-grey-50 flex flex-col gap-4 items-center md:flex-row md:justify-between md:px-8 md:py-4">
      <div>
        Designed & developed by <a href="https://janessaperry.com"
        target="_blank"
        rel="noopener noreferrer"
        className="">Janessa Perry</a>
      </div>

      <div className="flex items-center gap-4">
        <a className="flex"
          href="https://janessaperry.com"
          target="_blank"
          rel="noopener noreferrer">
          <img src={JpLogo as string} alt="JP Logo" className="icon-lg"/>
        </a>
        <a className="flex"
          href="https://github.com/janessaperry"
          target="_blank"
          rel="noopener noreferrer">
          <GithubLogoIcon size={24}/>
        </a>
        <a className="flex"
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