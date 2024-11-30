import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Sword } from "@phosphor-icons/react";
import GameCardsList from "../../components/GameCardsList/GameCardsList";
import InputCheckbox from "../../components/InputCheckbox/InputCheckbox.jsx";
import "./Results.scss";

function Results() {
	const baseUrl = import.meta.env.VITE_API_URL;
	const { platform, page } = useParams();
	const [gamesData, setGamesData] = useState([]);
	const [totalPages, setTotalPages] = useState([]);
	const [resultsCount, setResultsCount] = useState([]);
	const [filters, setFilters] = useState({});
	const [filterOptions, setFilterOptions] = useState({});
	const [isLoading, setIsLoading] = useState([false]);
	const navigate = useNavigate();
	const gamesPerPage = 40;

	const pageTitleMap = {
		xbox: "Xbox",
		playstation: "PlayStation",
		nintendo: "Nintendo",
		pc: "PC",
	};

	const handleInputChange = (e, category) => {
		setFilters((prevFilters) => {
			const newFilters = { ...prevFilters };
			newFilters[category] ||= [];

			const targetId = e.target.id.split("-").pop();
			if (e.target.checked) {
				newFilters[category] = [...newFilters[category], targetId];
			} else {
				newFilters[category] = newFilters[category].filter(
					(value) => value !== targetId
				);
			}

			return newFilters;
		});

		if (page !== 1) {
			navigate(`/explore/${platform}/1`);
		}
	};

	const getGamesByPlatform = async () => {
		setIsLoading(true);
		try {
			const response = await axios.post(
				`${baseUrl}/explore/${platform}/${page}`,
				{
					filters,
				}
			);

			setResultsCount(response.data.count);
			setGamesData(response.data.games);
			setTotalPages(
				Array(Math.ceil(response.data.count / gamesPerPage))
					.fill(0)
					.map((page, index) => index + 1)
			);

			setFilterOptions(response.data.filters);
			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching games by platform:", error);
			navigate("/not-found");
		}
	};

	useEffect(() => {
		getGamesByPlatform();
	}, [platform, page, filters]);

	return (
		<main className="main">
			<section className="results">
				<div className="results__header">
					<h1 className="results__title">{pageTitleMap[platform]} Games</h1>
				</div>

				<div className="results__wrapper">
					<div className="results__filters">
						<div className="filters">
							<h2>Filters</h2>
							<div className="filter">
								<h4 className="filter__title">Console</h4>
								<ul className="filter__options filter__options--checklist">
									{filterOptions.console &&
										Object.entries(filterOptions.console[platform]).map(
											([id, console]) => (
												<li
													key={id}
													className="filter__option filter__option--checkbox"
												>
													<InputCheckbox
														id={`console-${id}`}
														name={`console-${id}`}
														value={console}
														handleChange={(e) => {
															handleInputChange(e, "console");
														}}
													/>
												</li>
											)
										)}
								</ul>
							</div>

							<div className="filter">
								<h4 className="filter__title">Genres</h4>
								<ul className="filter__options filter__options--checklist">
									{filterOptions.genres &&
										Object.entries(filterOptions.genres).map(
											([index, genre]) => (
												<li
													key={genre.id}
													className="filter__option filter__option--checkbox"
												>
													<InputCheckbox
														id={`genre-${genre.id}`}
														name={`genre-${genre.id}`}
														value={genre.name}
														handleChange={(e) => {
															handleInputChange(e, "genres");
														}}
													/>
												</li>
											)
										)}
								</ul>
							</div>
						</div>
					</div>

					{isLoading ? (
						<div className="loading-games">
							<h2 className="loading-games__title">Gearing up...</h2>
							<Sword className="loading-games__icon" />
						</div>
					) : (
						<>
							<section className="results__games-section">
								<div className="results__content-wrapper">
									<h3 className="results__title">
										{resultsCount.toLocaleString()} Results
									</h3>
									{gamesData && <GameCardsList gamesList={gamesData} />}
								</div>

								<div className="pagination">
									{totalPages.length <= 5 ? (
										totalPages.map((page) => {
											return (
												<NavLink
													key={`${page}`}
													to={`/explore/${platform}/${page}`}
													className="pagination__link"
												>
													{page}
												</NavLink>
											);
										})
									) : (
										<>
											{page > 1 && (
												<>
													<NavLink
														key="1"
														to={`/explore/${platform}/1`}
														className="pagination__link"
													>
														1
													</NavLink>
													<span className="pagination__truncation">...</span>
												</>
											)}

											{totalPages
												.slice(
													totalPages.length - 4 <= page
														? totalPages.length - 5
														: parseInt(page) - 1,
													totalPages.length - 4 <= parseInt(page)
														? totalPages.length
														: parseInt(page) + 4
												)
												.map((currentPage) => (
													<NavLink
														key={currentPage}
														to={`/explore/${platform}/${currentPage}`}
														className="pagination__link"
													>
														{currentPage}
													</NavLink>
												))}

											{page < totalPages.length - 4 && (
												<>
													<span className="pagination__truncation">...</span>
													<NavLink
														key={totalPages.length}
														to={`/explore/${platform}/${totalPages.length}`}
														className="pagination__link"
													>
														{totalPages.length}
													</NavLink>
												</>
											)}
										</>
									)}
								</div>
							</section>
						</>
					)}
				</div>
			</section>
		</main>
	);
}

export default Results;
