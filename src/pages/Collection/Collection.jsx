import { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import axios from "axios";
import {
	handlePatchUpdate,
	handleDeleteGame,
} from "../../utils/collectionDataUtils/collectionDataUtils.js";
import GameCardsList from "../../components/GameCardsList/GameCardsList.jsx";
import "./Collection.scss";

function Collection() {
	const accessToken = localStorage.getItem("accessToken");
	const baseApiUrl = import.meta.env.VITE_API_URL;
	const [collectionStats, setCollectionStats] = useState([]);
	const [totalPages, setTotalPages] = useState([]);
	const [gameCollection, setGameCollection] = useState([]);
	const { page } = useParams();
	const gamesPerPage = 10;

	const gameStatusOptions = [
		"Want to play",
		"Playing",
		"Played",
		"On pause",
		"Wishlist",
	];

	const getGameCollection = async (page) => {
		try {
			const response = await axios.get(
				`${baseApiUrl}/collection/page/${page}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setGameCollection(response.data.gameData);
			setCollectionStats(response.data.collectionStats);
			setTotalPages(
				Array(
					Math.ceil(response.data.collectionStats.totalGames / gamesPerPage)
				)
					.fill(0)
					.map((page, index) => index + 1)
			);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getGameCollection(page);
		window.scrollTo(0, 0);
	}, [page, handleDeleteGame]);

	return (
		<main className="main">
			<section className="collection">
				<div className="title-wrapper">
					<h1 className="title">My Collection</h1>
				</div>

				<div className="collection__wrapper">
					<div className="filters">
						<h2 className="filters__title">Filters</h2>
						<div className="filter">
							<p className="filter__title">Status</p>
							<ul className="filter__options filter__options--checklist">
								<li className="filter__option filter__option--checkbox">
									<input
										type="checkbox"
										id="status-wishlist"
										name="status-wishlist"
										className="input-checkbox"
									/>
									<div className="input-checkbox__custom"></div>
									<label htmlFor="status-wishlist">Wishlist</label>
								</li>
							</ul>
						</div>
					</div>

					<div className="collection-games">
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
