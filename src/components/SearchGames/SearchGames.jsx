import { useState, useEffect, useDeferredValue, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./SearchGames.scss";

function SearchGames({ contextClasses }) {
	const baseUrl = import.meta.env.VITE_API_URL;
	const [queryValue, setQueryValue] = useState("");
	const deferredQueryString = useDeferredValue(queryValue);
	const [searchResults, setSearchResults] = useState([]);
	const searchResultsList = useRef(null);
	const [isOpen, setIsOpen] = useState(false);

	const getSearchResults = async (queryString) => {
		try {
			const response = await axios.post(`${baseUrl}/search`, {
				query: queryString,
			});
			setSearchResults(response.data);
			setIsOpen(true);
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

	useEffect(() => {
		const handleSearchResultsList = (e) => {
			if (isOpen && !searchResultsList.current?.contains(e.target)) {
				setQueryValue("");
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleSearchResultsList);
		return () => {
			document.removeEventListener("mousedown", handleSearchResultsList);
		};
	}, [isOpen]);

	return (
		<div className="search__wrapper">
			<input
				className={`search__input ${contextClasses}`}
				type="text"
				placeholder="Search games..."
				onChange={(e) => setQueryValue(e.target.value)}
				value={queryValue}
			/>

			{searchResults.length > 0 && (
				<ul className="search__results-list" ref={searchResultsList}>
					{searchResults?.map((result) => {
						return (
							<li key={result.id} className="search__result-item">
								<Link
									to={`/game-details/${result.id}`}
									className="search__result-link"
									onClick={() => setQueryValue("")}
								>
									{result?.cover && (
										<img
											src={result.cover}
											alt="Cover"
											className="search__result-cover"
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
	);
}

export default SearchGames;
