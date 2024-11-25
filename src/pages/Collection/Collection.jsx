import { useEffect, useState } from "react";
import axios from "axios";
import GameCardsList from "../../components/GameCardsList/GameCardsList.jsx";
import "./Collection.scss";
import {
	handlePatchUpdate,
	handleDeleteGame,
} from "../../utils/collectionDataUtils/collectionDataUtils.js";

function Collection() {
	const accessToken = localStorage.getItem("accessToken");
	const baseApiUrl = import.meta.env.VITE_API_URL;
	const [gameCollection, setGameCollection] = useState([]);

	const gameStatusOptions = [
		"Want to play",
		"Playing",
		"Played",
		"On pause",
		"Wishlist",
	];

	const getGameCollection = async () => {
		try {
			const response = await axios.get(`${baseApiUrl}/collection`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			setGameCollection(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getGameCollection();
	}, []);

	return (
		<main className="main">
			<section className="collection">
				<div className="title-wrapper">
					<h1 className="title">My Collection</h1>
				</div>

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
						setGameCollection={setGameCollection}
					/>
				</div>
			</section>
		</main>
	);
}

export default Collection;
