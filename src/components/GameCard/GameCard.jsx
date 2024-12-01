import { Link } from "react-router-dom";
import { GameController, Trash } from "@phosphor-icons/react";
import ChipList from "../ChipList/ChipList";
import ButtonDropdown from "../ButtonDropdown/ButtonDropdown";
import Button from "../Button/Button";
import "./GameCard.scss";

function GameCard({
	game,
	collectionOptions,
	handleDeleteGame,
	handlePatchUpdate,
	getGameCollection,
	page,
}) {
	const collectionData = game.collectionData;

	const handleDeleteClick = async () => {
		await handleDeleteGame(game.id);
		await getGameCollection(page);
	};

	const handlePatchClick = async (field, selectedOption) => {
		await handlePatchUpdate(game.id, field, selectedOption);
	};

	return (
		<div className="game-card">
			<Link className="game-card__link" to={`/game-details/${game.id}`}>
				<div className="game-card__cover-wrapper">
					<img
						className="game-card__cover"
						alt={`${game.name} cover`}
						src={game.cover}
					/>
				</div>

				<div className="game-card__content-wrapper">
					<div className="game-card__header-wrapper">
						<div className="game-card__title-wrapper">
							<p className="game-card__title">{game.name}</p>

							{collectionData && (
								<div className="game-card__meta-wrapper">
									<p className="game-card__meta">
										{game.developer} • {game.releaseDate}
									</p>

									<div
										className={`game-card__time-to-beat ${
											game.timeToBeat === "TBD"
												? "game-card__time-to-beat--na"
												: ""
										}`}
									>
										<GameController
											weight="fill"
											className="game-card__icon game-card__icon--controller"
										/>
										{game.timeToBeat}
									</div>
								</div>
							)}
						</div>

						<div
							className={`game-card__rating-chip ${
								game.rating === "n/a" ? "game-card__rating-chip--na" : ""
							}`}
						>
							<span className="game-card__rating-label">{game.rating}</span>
						</div>
					</div>

					{!collectionData && (
						<div className="game-card__platforms">
							<h4 className="game-card__platforms-title">Platforms</h4>
							<ChipList chipData={game.platforms} />
						</div>
					)}

					{collectionData && (
						<div className="game-card__genres">
							<h4 className="game-card__genres-title">Genres</h4>
							<ChipList chipData={game.genres} />
						</div>
					)}
				</div>
			</Link>

			{collectionData && (
				<div className="game-card__collection-actions-wrapper">
					<div className="game-card__platforms">
						<h4 className="game-card__platforms-title">
							{collectionData.gameStatus !== "Wishlist"
								? "Owned on"
								: "Wishlisted on"}
						</h4>

						<div className="game-card__ownership-details">
							<ButtonDropdown
								label={collectionData.gameConsole || "Console..."}
								contextClasses={"btn--outline btn--dropdown"}
								dropdownOptions={game.platforms}
								handlePatchUpdate={(selectedOption) =>
									handlePatchClick("gameConsole", selectedOption)
								}
							/>

							<ButtonDropdown
								label={collectionData.gameFormat || "Format..."}
								contextClasses={"btn--outline btn--dropdown"}
								dropdownOptions={collectionOptions.gameFormat}
								handlePatchUpdate={(selectedOption) =>
									handlePatchClick("gameFormat", selectedOption)
								}
							/>
						</div>
					</div>

					<div className="game-card__collection-actions">
						<ButtonDropdown
							label={collectionData.gameStatus || "Collection status..."}
							contextClasses={"btn--primary btn--dropdown"}
							dropdownOptions={collectionOptions.gameStatus}
							handlePatchUpdate={(selectedOption) =>
								handlePatchClick("gameStatus", selectedOption)
							}
						/>
						<Button
							handleBtnClick={handleDeleteClick}
							iconLeft={<Trash className="btn__icon" weight="bold" />}
							contextClasses="btn--outline btn--warn"
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default GameCard;
