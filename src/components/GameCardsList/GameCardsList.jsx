import GameCard from "../GameCard/GameCard";
import "./GameCardsList.scss";

function GameCardsList({ gamesList, gameFormatOptions, gameStatusOptions }) {
	return (
		<div className="game-cards">
			{gamesList.map((game) => {
				return (
					<GameCard
						key={game.id}
						game={game}
						gameFormatOptions={gameFormatOptions}
						gameStatusOptions={gameStatusOptions}
						collectionData={game.collectionData}
					/>
				);
			})}
		</div>
	);
}

export default GameCardsList;
