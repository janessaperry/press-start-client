import GameCard from "../GameCard/GameCard";
import "./GameCardsList.scss";

function GameCardsList({
	gamesList,
	gameStatusOptions,
	handleDeleteGame,
	handlePatchUpdate,
	getGameCollection,
	page,
}) {
	return (
		<div className="game-cards">
			{gamesList?.map((game) => {
				return (
					<GameCard
						key={game.id}
						game={game}
						gameStatusOptions={gameStatusOptions}
						collectionData={game.collectionData}
						handleDeleteGame={handleDeleteGame}
						handlePatchUpdate={handlePatchUpdate}
						getGameCollection={getGameCollection}
						page={page}
					/>
				);
			})}
		</div>
	);
}

export default GameCardsList;
