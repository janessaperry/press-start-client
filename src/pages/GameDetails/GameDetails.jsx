import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Heart, PlusCircle, Trash, Sword } from "@phosphor-icons/react";
import {
	handleAddGameToCollection,
	handlePatchUpdate,
	handleDeleteGame,
} from "../../utils/collectionDataUtils/collectionDataUtils.js";
import GameCardsList from "../../components/GameCardsList/GameCardsList.jsx";
import ChipList from "../../components/ChipList/ChipList.jsx";
import Button from "../../components/Button/Button.jsx";
import ButtonDropdown from "../../components/ButtonDropdown/ButtonDropdown.jsx";
import "./GameDetails.scss";

function GameDetails() {
	const baseApiUrl = import.meta.env.VITE_API_URL;
	const accessToken = localStorage.getItem("accessToken");
	const [currentGame, setCurrentGame] = useState([]);
	const [similarGames, setSimilarGames] = useState([]);
	const [collectionSelections, setCollectionSelections] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { gameId } = useParams();

	const handleDropdownChange = (field, selectedOption) => {
		setCollectionSelections((prevCollectionSelections) => ({
			...prevCollectionSelections,
			[field]: selectedOption,
		}));
	};

	const getGameDetails = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(`${baseApiUrl}/game-details/${gameId}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			setCurrentGame(response.data);
			setSimilarGames(response.data.similarGames);
			window.scrollTo(0, 0);
			setIsLoading(false);
		} catch (error) {
			console.error("Error fetching game details:", error);
			navigate("/not-found");
		}
	};

	useEffect(() => {
		if (!currentGame || currentGame.id !== gameId) {
			getGameDetails();
		}
	}, [gameId]);

	return (
		<main className="main main--backdrop">
			<section className="game-details">
				<div className="game-details__wrapper game-details__wrapper--cover-actions">
					<img className="game-details__cover" src={currentGame?.cover} />

					<div className="collection-card">
						<div className="collection-card__header">
							<h2 className="collection-card__title">
								{currentGame?.collectionData
									? "Manage Collection"
									: "Add to Collection"}
							</h2>
							<p className="collection-card__description">
								Select the console and format you own the game in and add to you
								collection, or just add it to your wishlist.
							</p>
						</div>

						<div className="collection-card__ownership-details">
							<ButtonDropdown
								label={currentGame?.collectionData?.gameConsole || "Console..."}
								contextClasses={"btn--outline btn--dropdown"}
								dropdownOptions={currentGame.collectionOptions?.gameConsole}
								handlePatchUpdate={
									currentGame?.collectionData
										? (selectedOption) =>
												handlePatchUpdate(
													currentGame?.id,
													"gameConsole",
													selectedOption
												)
										: undefined
								}
								handleDropdownChange={(selectedOption) =>
									handleDropdownChange("gameConsole", selectedOption)
								}
							/>

							<ButtonDropdown
								label={currentGame?.collectionData?.gameFormat || "Format..."}
								contextClasses={"btn--outline btn--dropdown"}
								dropdownOptions={currentGame.collectionOptions?.gameFormat}
								handlePatchUpdate={
									currentGame?.collectionData
										? (selectedOption) =>
												handlePatchUpdate(
													currentGame?.id,
													"gameFormat",
													selectedOption
												)
										: undefined
								}
								handleDropdownChange={(selectedOption) =>
									handleDropdownChange("gameFormat", selectedOption)
								}
							/>
						</div>

						<div className="collection-card__actions">
							{currentGame?.collectionData && (
								<>
									<ButtonDropdown
										label={
											currentGame.collectionData.gameStatus || "Want to play"
										}
										contextClasses={"btn--primary btn--dropdown"}
										dropdownOptions={currentGame.collectionOptions?.gameStatus}
										handlePatchUpdate={(selectedOption) =>
											handlePatchUpdate(
												currentGame.id,
												"gameStatus",
												selectedOption
											)
										}
									/>
									<Button
										handleBtnClick={() => {
											handleDeleteGame(currentGame.id);
											setCurrentGame({
												...currentGame,
												collectionData: null,
											});
											setCollectionSelections({});
										}}
										iconLeft={<Trash className="btn__icon" weight="bold" />}
										contextClasses="btn--outline btn--warn"
									/>
								</>
							)}

							{!currentGame.collectionData && (
								<>
									<Button
										handleBtnClick={() => {
											handleAddGameToCollection(
												currentGame?.id,
												collectionSelections
											);

											setCurrentGame({
												...currentGame,
												collectionData: collectionSelections,
											});
										}}
										contextClasses={"btn--primary"}
										iconLeft={
											<PlusCircle className="btn__icon" weight="bold" />
										}
										label="Add to collection"
									/>
									<Button
										contextClasses={"btn--outline"}
										iconLeft={<Heart className="btn__icon" weight="bold" />}
									/>
								</>
							)}
						</div>
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

						<div
							className={`game-details__rating-chip ${
								currentGame?.rating === "n/a" && "game-details__rating-chip--na"
							}`}
						>
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

			{similarGames && (
				<section className="similar-games">
					{isLoading ? (
						<div className="loading-games">
							<h2 className="loading-games__title">Gearing up...</h2>
							<Sword className="loading-games__icon" />
						</div>
					) : (
						<>
							<h2 className="similar-games__title">Similar Games</h2>
							<GameCardsList gamesList={similarGames} />
						</>
					)}
				</section>
			)}
		</main>
	);
}

export default GameDetails;
