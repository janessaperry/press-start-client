import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
	handlePatchUpdate,
	handleDeleteGame,
} from "../../utils/collectionDataUtils/collectionDataUtils.js";
import GameCardsList from "../../components/GameCardsList/GameCardsList.jsx";
import InputCheckbox from "../../components/InputCheckbox/InputCheckbox.jsx";
import "./Collection.scss";

function Collection() {
	const accessToken = localStorage.getItem("accessToken");
	const baseApiUrl = import.meta.env.VITE_API_URL;
	const [collectionStats, setCollectionStats] = useState([]);
	const [totalPages, setTotalPages] = useState([]);
	const [gameCollection, setGameCollection] = useState([]);
	const [allData, setAllData] = useState([]);
	const { page } = useParams();
	const gamesPerPage = 10;
	const [filters, setFilters] = useState({});

	const navigate = useNavigate();

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

			if (e.target.checked) {
				if (!newFilters[category]) {
					newFilters[category] = [];
				}

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
		try {
			console.log(filters);
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
			// console.log(response.data.gameData);
			setGameCollection(response?.data.gameData);
			setCollectionStats(response?.data.collectionStats);
			setAllData(response?.data);

			//todo this throws error if no results
			if (response.data.filteredCount) {
				setTotalPages(
					Array(Math.ceil(response.data.filteredCount / gamesPerPage))
						.fill(0)
						.map((page, index) => index + 1)
				);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getGameCollection();
		window.scrollTo(0, 0);
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
							Stats • {collectionStats?.totalGames} Games Total
						</h2>
					</div>

					<div className="stats__cards">
						{collectionStats?.gameStatusStats?.map((stat) => {
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
							<p className="filter__title">Status</p>
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
							<p className="filter__title">Console</p>
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
							<p className="filter__title">Console</p>
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
						<h3>
							{allData?.filteredCount ? allData?.filteredCount : "No"} Results
						</h3>
						<GameCardsList
							gamesList={gameCollection}
							gameStatusOptions={gameStatusOptions}
							handleDeleteGame={handleDeleteGame}
							handlePatchUpdate={handlePatchUpdate}
							getGameCollection={getGameCollection}
							page={page}
						/>

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
