import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import PressStartLogo from "../../assets/logos/press-start-logo-light.svg";
import AvatarPlaceholder from "../../assets/images/user-avatar-placeholder.png";
import "./Header.scss";

function Header() {
	const [queryString, setQueryString] = useState("");

	return (
		<header className="header">
			<Link className="header__logo-link" to="/">
				<img
					className="header__logo"
					alt="Press Start Logo"
					src={PressStartLogo}
				/>
			</Link>

			<div className="header__search-wrapper">
				<input
					className="header__search-input"
					type="text"
					placeholder="Search games..."
					onChange={(e) => setQueryString(e.target.value)}
					value={queryString}
				/>
			</div>

			<nav className="header__nav">
				<ul className="header__nav-list">
					<li className="header__nav-item">
						<NavLink className="header__nav-link" to="/explore">
							Explore
						</NavLink>
					</li>
					<li className="header__nav-item">
						<NavLink className="header__nav-link" to="/library">
							My Library
						</NavLink>
					</li>
					<li className="header__nav-item">
						<NavLink className="header__nav-link" to="/settings">
							<img
								className="header__nav-avatar"
								src={AvatarPlaceholder}
								alt="User avatar placholder"
							/>
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default Header;
