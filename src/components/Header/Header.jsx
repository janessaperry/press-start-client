import { useDeferredValue, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import PressStartLogo from "../../assets/logos/press-start-logo-light.svg";
import AvatarPlaceholder from "../../assets/images/user-avatar-placeholder.png";
import "./Header.scss";

function Header() {
	const baseUrl = import.meta.env.VITE_API_URL;
	const [queryValue, setQueryValue] = useState("");
	const deferredQueryString = useDeferredValue(queryValue);
	const [searchResults, setSearchResults] = useState([]);

	const getSearchResults = async (queryString) => {
		try {
			const response = await axios.post(`${baseUrl}/search`, {
				query: queryString,
			});
			setSearchResults(response.data);
		} catch (error) {
			console.error("Error getting search results", error);
		}
	};

	useEffect(() => {
		if (deferredQueryString?.length >= 3) {
			const debounceTimeout = setTimeout(() => {
				getSearchResults(deferredQueryString);
			}, 250);
			return () => clearTimeout(debounceTimeout);
		} else {
			setSearchResults([]);
		}
	}, [deferredQueryString]);

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
					onChange={(e) => setQueryValue(e.target.value)}
					value={queryValue}
				/>
				{searchResults.length > 0 && (
					<ul className="header__search-results-list">
						{searchResults?.map((result) => {
							return (
								<li key={result.id} className="header__search-result-item">
									<Link
										to={`/game-details/${result.id}`}
										className="header__search-result-link"
										onClick={() => setQueryValue("")}
									>
										{result?.cover && (
											<img
												src={result.cover}
												alt="Cover"
												className="header__search-result-cover"
											/>
										)}
										{result.name}
									</Link>
								</li>
							);
						})}
					</ul>
				)}
			</div>

			<nav className="header__nav">
				<ul className="header__nav-list">
					<li className="header__nav-item">
						<NavLink className="header__nav-link" to="/explore">
							Explore
						</NavLink>
					</li>
					<li className="header__nav-item">
						<NavLink className="header__nav-link" to="/collection">
							My Collection
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
