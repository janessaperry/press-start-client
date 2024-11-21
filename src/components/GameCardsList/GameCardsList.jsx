import GameCard from "../GameCard/GameCard";
import "./GameCardsList.scss";

function GameCardsList({ gamesList }) {
	return (
		<div className="game-cards">
			{gamesList.map((game) => {
				return <GameCard key={game.id} game={game} />;
			})}
		</div>
	);
}

export default GameCardsList;
