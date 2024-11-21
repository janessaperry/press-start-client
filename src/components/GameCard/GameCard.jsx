import { Link } from "react-router-dom";
import ChipList from "../ChipList/ChipList";
import "./GameCard.scss";

function GameCard({ game }) {
	return (
		<Link className="game-card__link" to={`/game-details/${game.id}`}>
			<div className="game-card">
				<div className="game-card__cover-wrapper">
					<img
						className="game-card__cover"
						alt={`${game.name} cover`}
						src={game.cover}
					/>
				</div>

				<div className="game-card__content-wrapper">
					<div className="game-card__title-wrapper">
						<p className="game-card__title">{game.name}</p>
						<div
							className={`game-card__rating-chip ${
								game.rating === "n/a" && "game-card__rating-chip--na"
							}`}
						>
							<span className="game-card__rating-label">{game.rating}</span>
						</div>
					</div>

					<div className="game-card__platforms">
						<h4 className="game-card__platforms-title">Platforms</h4>
						<ChipList chipData={game.platforms} />
					</div>
				</div>
			</div>
		</Link>
	);
}

export default GameCard;
