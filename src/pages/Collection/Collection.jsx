import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
	handlePatchUpdate,
	handleDeleteGame,
} from "../../utils/collectionDataUtils/collectionDataUtils.js";
import { Sword } from "@phosphor-icons/react";
import GameCardsList from "../../components/GameCardsList/GameCardsList.jsx";
import InputCheckbox from "../../components/InputCheckbox/InputCheckbox.jsx";
import "./Collection.scss";

function Collection() {
	const { page } = useParams();
	const navigate = useNavigate();
	const accessToken = localStorage.getItem("accessToken");
	const baseApiUrl = import.meta.env.VITE_API_URL;
	const gamesPerPage = 10;
	const [filters, setFilters] = useState({});
	const [collectionData, setCollectionData] = useState([]);
	const [totalPages, setTotalPages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const gameStatusOptions = [
		"Want to play",
		"Playing",
		"Played",
		"On pause",
		"Wishlist",
	];

	const handleInputChange = (e, category) => {
		setFilters((prevFilters) => {
			const newFilters = { ...prevFilters };
			newFilters[category] ||= [];

			if (e.target.checked) {
				newFilters[category] = [...newFilters[category], e.target.value];
			} else {
				newFilters[category] = newFilters[category].filter(
					(value) => value !== e.target.value
				);
			}

			return newFilters;
		});

		if (page !== 1) {
			navigate("/collection/1");
		}
	};

	const getGameCollection = async () => {
		setIsLoading(true);
		try {
			const response = await axios.post(
				`${baseApiUrl}/collection/page/${page}`,
				{
					filters,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			setCollectionData(response?.data);

			if (response.data.filteredCount) {
				setTotalPages(
					Array(Math.ceil(response.data.filteredCount / gamesPerPage))
						.fill(0)
						.map((page, index) => index + 1)
				);
			}
			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching game collection", error);
		}
	};

	useEffect(() => {
		const fetchCollectionData = async () => {
			await getGameCollection();
			window.scrollTo(0, 0);
		};
		fetchCollectionData();
	}, [page, handleDeleteGame, filters]);

	return (
		<main className="main">
			<section className="collection">
				<div className="title-wrapper">
					<h1 className="title">Collection</h1>
				</div>

				<div className="collection__stats">
					<div className="stats__header">
						<h2 className="stats__title">
							Stats • {collectionData.collectionStats?.totalGames} Games Total
						</h2>
					</div>

					<div className="stats__cards">
						{collectionData.collectionStats?.gameStatusStats.map((stat) => {
							return (
								<div key={stat.status} className="stats__card">
									<h4 className="stats__card-title">{stat.status}</h4>
									<p className="stats__card-content">{stat.count}</p>
								</div>
							);
						})}
					</div>
				</div>

				<div className="collection__wrapper">
					<div className="filters">
						<h2 className="filters__title">Filters</h2>
						<div className="filter">
							<h4 className="filter__title">Status</h4>
							<ul className="filter__options filter__options--checklist">
								<li className="filter__option filter__option--checkbox">
									<InputCheckbox
										id="status-want-to-play"
										name="status-want-to-play"
										value="Want to play"
										handleChange={(e) => {
											handleInputChange(e, "gameStatus");
										}}
									/>
								</li>

								<li className="filter__option filter__option--checkbox">
									<InputCheckbox
										id="status-playing"
										name="status-playing"
										value="Playing"
										handleChange={(e) => {
											handleInputChange(e, "gameStatus");
										}}
									/>
								</li>

								<li className="filter__option filter__option--checkbox">
									<InputCheckbox
										id="status-played"
										name="status-played"
										value="Played"
										handleChange={(e) => {
											handleInputChange(e, "gameStatus");
										}}
									/>
								</li>

								<li className="filter__option filter__option--checkbox">
									<InputCheckbox
										id="status-on-pause"
										name="status-on-pause"
										value="On pause"
										handleChange={(e) => {
											handleInputChange(e, "gameStatus");
										}}
									/>
								</li>

								<li className="filter__option filter__option--checkbox">
									<InputCheckbox
										id="status-wishlist"
										name="status-wishlist"
										value="Wishlist"
										handleChange={(e) => {
											handleInputChange(e, "gameStatus");
										}}
									/>
								</li>
							</ul>
						</div>

						<div className="filter">
							<h4 className="filter__title">Console</h4>
							<ul className="filter__options filter__options--checklist">
								<li className="filter__option filter__option--checkbox">
									<InputCheckbox
										id="console-PS4"
										name="console-PS4"
										value="PS4"
										handleChange={(e) => {
											handleInputChange(e, "gameConsole");
										}}
									/>
								</li>

								<li className="filter__option filter__option--checkbox">
									<InputCheckbox
										id="console-PS5"
										name="console-PS5"
										value="PS5"
										handleChange={(e) => {
											handleInputChange(e, "gameConsole");
										}}
									/>
								</li>

								<li className="filter__option filter__option--checkbox">
									<InputCheckbox
										id="console-xbox-one"
										name="console-xbox-one"
										value="Xbox One"
										handleChange={(e) => {
											handleInputChange(e, "gameConsole");
										}}
									/>
								</li>

								<li className="filter__option filter__option--checkbox">
									<InputCheckbox
										id="console-xbox-xs"
										name="console-xbox-xs"
										value="Xbox X|S"
										handleChange={(e) => {
											handleInputChange(e, "gameConsole");
										}}
									/>
								</li>

								<li className="filter__option filter__option--checkbox">
									<InputCheckbox
										id="console-switch"
										name="console-switch"
										value="Switch"
										handleChange={(e) => {
											handleInputChange(e, "gameConsole");
										}}
									/>
								</li>
							</ul>
						</div>

						<div className="filter">
							<h4 className="filter__title">Format</h4>
							<ul className="filter__options filter__options--checklist">
								<li className="filter__option filter__option--checkbox">
									<InputCheckbox
										id="format-digital"
										name="format-digital"
										value="Digital"
										handleChange={(e) => {
											handleInputChange(e, "gameFormat");
										}}
									/>
								</li>

								<li className="filter__option filter__option--checkbox">
									<InputCheckbox
										id="format-physical"
										name="format-physical"
										value="Physical"
										handleChange={(e) => {
											handleInputChange(e, "gameFormat");
										}}
									/>
								</li>
							</ul>
						</div>
					</div>

					<div className="collection-games">
						<h3>{collectionData?.filteredCount || "No"} Results</h3>

						{isLoading ? (
							<div className="loading-games">
								<h2 className="loading-games__title">Gearing up...</h2>
								<Sword className="loading-games__icon" />
							</div>
						) : (
							<GameCardsList
								gamesList={collectionData?.gameData}
								gameStatusOptions={gameStatusOptions}
								handleDeleteGame={handleDeleteGame}
								handlePatchUpdate={handlePatchUpdate}
								getGameCollection={getGameCollection}
								page={page}
							/>
						)}

						<div className="pagination">
							{totalPages?.map((page) => {
								return (
									<NavLink
										key={`${page}`}
										to={`/collection/${page}`}
										className="pagination__link"
									>
										{page}
									</NavLink>
								);
							})}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default Collection;
