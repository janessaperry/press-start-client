import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChipList from "../ChipList/ChipList";
import { GameController, Trash } from "@phosphor-icons/react";
import "./GameCard.scss";
import ButtonDropdown from "../ButtonDropdown/ButtonDropdown";
import Button from "../Button/Button";

function GameCard({
	game,
	gameFormatOptions,
	gameStatusOptions,
	collectionData,
	handleDelete,
	handleUpdate,
}) {
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
											game.timeToBeat === "n/a" && "game-card__time-to-beat--na"
										}`}
									>
										<GameController
											weight="fill"
											className="game-card__icon game-card__icon--controller"
										/>
										{game.timeToBeat}
										{game.timeToBeat !== "n/a" && " hours"}
									</div>
								</div>
							)}
						</div>
						<div
							className={`game-card__rating-chip ${
								game.rating === "n/a" && "game-card__rating-chip--na"
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
								name="game-console"
								label={collectionData.gameConsole}
								contextClasses={"btn--outline btn--dropdown"}
								dropdownOptions={game.platforms}
								handleUpdate={(selectedOption) =>
									handleUpdate(game.id, "gameConsole", selectedOption)
								}
							/>

							<ButtonDropdown
								name="game-format"
								label={collectionData.gameFormat}
								contextClasses={"btn--outline btn--dropdown"}
								dropdownOptions={gameFormatOptions}
								handleUpdate={(selectedOption) =>
									handleUpdate(game.id, "gameFormat", selectedOption)
								}
							/>
						</div>
					</div>

					<div className="game-card__collection-actions">
						<ButtonDropdown
							name="game-status"
							label={collectionData.gameStatus}
							contextClasses={"btn--primary btn--dropdown"}
							dropdownOptions={gameStatusOptions}
							handleUpdate={(selectedOption) =>
								handleUpdate(game.id, "gameStatus", selectedOption)
							}
						/>
						<Button
							handleBtnClick={() => handleDelete(game.id)}
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
