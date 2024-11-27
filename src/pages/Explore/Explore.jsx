import { Link } from "react-router-dom";
import "./Explore.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { Sword } from "@phosphor-icons/react";

import GameCardsList from "../../components/GameCardsList/GameCardsList";
import SearchGames from "../../components/SearchGames/SearchGames";

function Explore() {
	const baseUrl = import.meta.env.VITE_API_URL;
	const [newReleases, setNewReleases] = useState([]);
	const [comingSoon, setComingSoon] = useState([]);
	const [isLoading, setIsLoading] = useState([false]);

	const getGames = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(`${baseUrl}/explore`);
			console.log(response.data);
			setNewReleases(response.data.newReleaseGames);
			setComingSoon(response.data.comingSoonGames);
			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching games", error);
		}
	};

	useEffect(() => {
		getGames();
	}, []);
	return (
		<main className="main">
			<section className="explore">
				<div className="explore__content-wrapper">
					<h1 className="explore__title">Find your next game</h1>
					<div className="explore__search-wrapper">
						<SearchGames contextClasses="search__input--large" />
					</div>
				</div>
			</section>

			<section className="browse-platforms">
				<div className="browse-platforms__content-wrapper">
					<h2 className="browse-platforms__title">Browse by Platform</h2>
					<div className="browse-platforms__cards">
						<Link className="browse-platforms__card-link" to={`/explore/xbox`}>
							<div className="browse-platforms__card">XBOX</div>
						</Link>
						<Link
							className="browse-platforms__card-link"
							to="/explore/playstation"
						>
							<div className="browse-platforms__card">PlayStation</div>
						</Link>
						<Link
							className="browse-platforms__card-link"
							to="/explore/nintendo"
						>
							<div className="browse-platforms__card">Nintendo</div>
						</Link>
						<Link className="browse-platforms__card-link" to="/explore/pc">
							<div className="browse-platforms__card">PC</div>
						</Link>
					</div>
				</div>
			</section>

			{isLoading ? (
				<div className="loading-games">
					<h2 className="loading-games__title">Gearing up...</h2>
					<Sword className="loading-games__icon" />
				</div>
			) : (
				<>
					<section className="browse-new-releases">
						<div className="browse-new-releases__content-wrapper">
							<h2 className="browse-new-releases__title">New Releases</h2>
							{newReleases && <GameCardsList gamesList={newReleases} />}
						</div>
					</section>

					<section className="browse-coming-soon">
						<div className="browse-coming-soon__content-wrapper">
							<h2 className="browse-coming-soon__title">Coming Soon</h2>
							{comingSoon && <GameCardsList gamesList={comingSoon} />}
						</div>
					</section>
				</>
			)}
		</main>
	);
}

export default Explore;
