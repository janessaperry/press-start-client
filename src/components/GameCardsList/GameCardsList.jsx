import GameCard from "../GameCard/GameCard";
import "./GameCardsList.scss";

function GameCardsList({
	gamesList,
	gameFormatOptions,
	gameStatusOptions,
	handleDelete,
	handleUpdate,
}) {
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
						handleDelete={handleDelete}
						handleUpdate={handleUpdate}
					/>
				);
			})}
		</div>
	);
}

export default GameCardsList;
