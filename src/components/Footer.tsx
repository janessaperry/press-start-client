import PressStartLogo from "/src/assets/logos/press-start-logo--dark.svg";
import JpLogo from "../assets/logos/jp-logo.svg"
import { Link } from "react-router-dom";
import { Button } from "@headlessui/react";
import { GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import useAuth from "../hooks/useAuth.ts";

const Footer = () => {
  const { userId, logout } = useAuth();
  const year = new Date().getFullYear();

  return (
    <div className="bg-[url(/src/assets/images/blue-purple-logo-pattern-1280x1024.png)] bg-cover">
      <footer className="container px-4 py-16 text-grey-50 md:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          <div className="space-y-3 col-span-1 md:col-span-2">
            <img src={PressStartLogo} alt="Press Start Logo" className="h-5"/>
            <div className="space-y-1">
              <p>Keep track of the games you own across platforms and spend less time
                deciding what to play next.
              </p>
              <span className="text-sm text-secondary-100">&copy; {year} Press Start</span>
            </div>
          </div>

          <div className="col-span-1 space-y-2">
            <h5>Explore Games</h5>
            <ul className="space-y-2">
              <li><Link to="/explore/nintendo" className="hover:text-interactive-primary-hover">Nintendo</Link></li>
              <li><Link to="/explore/playstation" className="hover:text-interactive-primary-hover">PlayStation</Link>
              </li>
              <li><Link to="/explore/xbox" className="hover:text-interactive-primary-hover">Xbox</Link></li>
              <li><Link to="/explore/pc" className="hover:text-interactive-primary-hover">PC</Link></li>
            </ul>
          </div>

          <div className="col-span-1 space-y-2">
            <h5>Account</h5>
            {userId ? (
              <ul className="space-y-2">
                <li><Link to="/account-settings" className="hover:text-interactive-primary-hover">Settings</Link></li>
                <li><Button onClick={logout} className="hover:text-interactive-primary-hover">Log out</Button></li>
              </ul>
            ) : (
              <ul className="space-y-2">
                <li><Link to="/sign-in" className="hover:text-interactive-primary-hover">Sign in</Link></li>
                <li><Link to="/sign-up" className="hover:text-interactive-primary-hover">Create account</Link></li>
              </ul>
            )}
          </div>
        </div>

        <hr className="border-t border-secondary-200/10"/>

        <div className="flex flex-col md:flex-row items-center md:justify-between space-y-4">
          <div>
            Designed & developed by <a href="https://janessaperry.com"
            target="_blank"
            rel="noopener"
            className="link-primary">Janessa Perry</a>
          </div>

          <div className="flex items-center gap-4">
            <a className="flex"
              href="https://janessaperry.com"
              target="_blank">
              <img src={JpLogo} alt="JP Logo" className="icon-lg"/>
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
        </div>
      </footer>
    </div>
  )
}

export default Footer;