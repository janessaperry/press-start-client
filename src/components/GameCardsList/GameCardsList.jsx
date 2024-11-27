import { Ghost } from "@phosphor-icons/react";
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
			{gamesList && gamesList.length > 0 ? (
				gamesList.map((game) => (
					<GameCard
						key={game.id}
						game={game}
						gameStatusOptions={gameStatusOptions}
						// collectionData={game.collectionData}
						handleDeleteGame={handleDeleteGame}
						handlePatchUpdate={handlePatchUpdate}
						getGameCollection={getGameCollection}
						page={page}
					/>
				))
			) : (
				<div className="no-games">
					<h2 className="no-games__title">
						Achievement unlocked! No results found.
					</h2>
					<p className="no-games__message">
						Try adjusting your filters or adding games to your collection.
					</p>
					<Ghost className="no-games__icon" />
				</div>
			)}
		</div>
	);
}

export default GameCardsList;
