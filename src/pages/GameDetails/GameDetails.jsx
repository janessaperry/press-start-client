import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CaretDown, Heart } from "@phosphor-icons/react";
import GameCardsList from "../../components/GameCardsList/GameCardsList.jsx";
import ChipList from "../../components/ChipList/ChipList.jsx";
import Button from "../../components/Button/Button.jsx";
import "./GameDetails.scss";

function GameDetails() {
	const baseApiUrl = import.meta.env.VITE_API_URL;
	const [currentGame, setCurrentGame] = useState([]);
	const [similarGames, setSimilarGames] = useState([]);
	const [franchises, setFranchises] = useState([]);
	const { gameId } = useParams();

	const getGameDetails = async () => {
		try {
			const response = await axios.get(`${baseApiUrl}/game-details/${gameId}`);
			setCurrentGame(response.data);
			setSimilarGames(response.data.similarGames);
			window.scrollTo(0, 0);
			console.log(response.data);
		} catch (error) {}
	};

	useEffect(() => {
		getGameDetails();
	}, [gameId]);

	return (
		<main className="main main--backdrop">
			<section className="game-details">
				<div className="game-details__wrapper game-details__wrapper--cover-actions">
					<img className="game-details__cover" src={currentGame?.cover} />
					<div className="game-details__library-actions">
						<Button
							contextClasses={"btn--primary"}
							iconLeft={<CaretDown className="btn__icon" weight="bold" />}
							iconRight={<CaretDown className="btn__icon" weight="bold" />}
							label="Add to Library"
						/>
						<Button
							contextClasses={"btn--outline"}
							iconLeft={<Heart className="btn__icon" weight="bold" />}
						/>
					</div>
				</div>

				<div className="game-details__wrapper game-details__wrapper--info">
					<div className="game-details__header-section">
						<div className="game-details__title-wrapper">
							<h1 className="game-details__title">{currentGame?.name}</h1>
							<p className="game-details__meta">
								{currentGame?.developer} • {currentGame?.releaseDate}
							</p>
						</div>

						<div className="game-details__rating-chip">
							<span className="game-details__rating-label">
								{currentGame?.rating}
							</span>
						</div>
					</div>

					<div className="game-details__content-section">
						<div className="game-details__content-wrapper">
							<h2 className="game-details__content-title">Description</h2>
							<p className="game-details__content-body">
								{currentGame?.summary}
							</p>
						</div>

						<div className="game-details__content-wrapper">
							<h4 className="game-details__title">Platforms</h4>
							<ChipList chipData={currentGame?.platforms} />
						</div>

						<div className="game-details__content-wrapper">
							<h4 className="game-details__content-title">Genres</h4>
							<ChipList chipData={currentGame?.genres} />
						</div>
					</div>
				</div>
			</section>

			<section className="similar-games">
				<h2 className="similar-games__title">Similar Games</h2>
				<GameCardsList gamesList={similarGames} />
			</section>

			<section className="franchise-games">
				<h2 className="franchise-games__title">Other Games in Franchise</h2>
			</section>
		</main>
	);
}

export default GameDetails;
