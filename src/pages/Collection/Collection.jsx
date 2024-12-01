import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
	handlePatchUpdate,
	handleDeleteGame,
} from "../../utils/collectionDataUtils/collectionDataUtils.js";
import { Sword } from "@phosphor-icons/react";
import GameCardsList from "../../components/GameCardsList/GameCardsList.jsx";
import InputCheckbox from "../../components/InputCheckbox/InputCheckbox.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import "./Collection.scss";

function Collection() {
	const baseApiUrl = import.meta.env.VITE_API_URL;
	const accessToken = localStorage.getItem("accessToken");
	const [filters, setFilters] = useState({});
	const [collectionData, setCollectionData] = useState([]);
	const [totalPages, setTotalPages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { page } = useParams();
	const navigate = useNavigate();
	const gamesPerPage = 10;

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

			setCollectionData(response.data);

			if (response.data.filteredCount) {
				setTotalPages(
					Array(Math.ceil(response.data.filteredCount / gamesPerPage))
						.fill(0)
						.map((page, index) => index + 1)
				);
			} else {
				setTotalPages(null);
			}

			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching game collection", error);
			navigate("/not-found");
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

				<div className="collection__overview-wrapper">
					<div className="collection__stats stats">
						<div className="stats__header">
							<h3 className="stats__title">
								Stats • {collectionData.collectionStats?.totalGames} Games
							</h3>
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

					<div className="collection__currently-playing currently-playing">
						{collectionData.currentlyPlaying &&
						collectionData.currentlyPlaying.length > 0 ? (
							<>
								<h2 className="currently-playing__title">Currently Playing</h2>
								<div className="currently-playing__covers">
									{collectionData.currentlyPlaying.map((coverUrl, index) => (
										<img
											key={index}
											src={coverUrl}
											alt="Currently playing cover"
											className="currently-playing__cover"
										/>
									))}
								</div>
							</>
						) : (
							<>
								<h2 className="currently-playing__title">Currently playing</h2>
								<p className="currently-playing__message">
									No quests underway.
								</p>
							</>
						)}
					</div>
				</div>

				<div className="collection__content-wrapper">
					<div className="filters">
						<h3 className="filters__title">Filters</h3>
						<div className="filter">
							<h4 className="filter__title">Status</h4>
							<ul className="filter__options filter__options--checklist">
								{collectionData &&
									collectionData.collectionOptions?.gameStatus.map(
										(option, index) => {
											return (
												<li
													key={`status-${index}`}
													className="filter__option filter__option--checkbox"
												>
													<InputCheckbox
														id={`status-${index}`}
														name={`status-${index}`}
														value={option}
														handleChange={(e) => {
															handleInputChange(e, "gameStatus");
														}}
													/>
												</li>
											);
										}
									)}
							</ul>
						</div>

						<div className="filter">
							<h4 className="filter__title">Console</h4>
							<ul className="filter__options filter__options--checklist">
								{collectionData &&
									collectionData.collectionOptions?.gameConsole.map(
										(platform, platformIndex) => {
											return platform.consoles.map((console, index) => {
												return (
													<li
														key={index}
														className="filter__option filter__option--checkbox"
													>
														<InputCheckbox
															id={`p${platformIndex}-c${index}`}
															name={`p${platformIndex}-c${index}`}
															value={console}
															handleChange={(e) => {
																handleInputChange(e, "gameConsole");
															}}
														/>
													</li>
												);
											});
										}
									)}
							</ul>
						</div>

						<div className="filter">
							<h4 className="filter__title">Format</h4>
							<ul className="filter__options filter__options--checklist">
								{collectionData &&
									collectionData.collectionOptions?.gameFormat.map(
										(option, index) => {
											return (
												<li
													key={`format-${index}`}
													className="filter__option filter__option--checkbox"
												>
													<InputCheckbox
														id={`format-${index}`}
														name={`format-${index}`}
														value={option}
														handleChange={(e) => {
															handleInputChange(e, "gameFormat");
														}}
													/>
												</li>
											);
										}
									)}
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
								collectionOptions={collectionData?.collectionOptions}
								handleDeleteGame={handleDeleteGame}
								handlePatchUpdate={handlePatchUpdate}
								getGameCollection={getGameCollection}
								page={page}
							/>
						)}

						{totalPages && (
							<Pagination
								currentPage={page}
								totalPages={totalPages}
								onPageChange={(clickedPage) => `/collection/${clickedPage}`}
							/>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}

export default Collection;
