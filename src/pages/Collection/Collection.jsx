import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import GameCardsList from "../../components/GameCardsList/GameCardsList.jsx";
import "./Collection.scss";

function Collection() {
	const { userId } = useParams();
	const baseApiUrl = import.meta.env.VITE_API_URL;
	const [gameCollection, setGameCollection] = useState([]);

	const gameFormatOptions = ["Digital", "Physical"];
	const gameStatusOptions = [
		"Want to play",
		"Playing",
		"Played",
		"On pause",
		"Wishlist",
	];

	const getGameCollection = async () => {
		try {
			const response = await axios.get(`${baseApiUrl}/collection/${userId}`);
			console.log(response.data);
			setGameCollection(response.data);
		} catch (error) {}
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
						gameFormatOptions={gameFormatOptions}
						gameStatusOptions={gameStatusOptions}
					/>
				</div>
			</section>
		</main>
	);
}

export default Collection;
