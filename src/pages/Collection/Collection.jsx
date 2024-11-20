import { useEffect, useState } from "react";
import axios from "axios";
import { CaretDown, GameController, Trash } from "@phosphor-icons/react";
import "./Collection.scss";
import { useParams } from "react-router-dom";

function Collection() {
	const { userId } = useParams();
	const baseApiUrl = import.meta.env.VITE_API_URL;
	const [isOpen, setIsOpen] = useState(null);
	const [gameConsole, setGameConsole] = useState("Xbox X|S");
	const [gameFormat, setGameFormat] = useState("Digital");

	const toggleDropdown = (optionsId) => {
		setIsOpen(optionsId);
	};

	const gameConsoleOptions = [
		{ label: "Xbox X|S", value: "xbox-xs" },
		{ label: "Xbox One", value: "xbox-one" },
		{ label: "Xbox 360", value: "xbox-360" },
	];

	const gameFormatOptions = [
		{ label: "Digital", value: "digital" },
		{ label: "Physical", value: "physical" },
	];

	const getGameCollection = async () => {
		try {
			const response = await axios.get(`${baseApiUrl}/collection/${userId}`);
			console.log(response.data);
		} catch (error) {}
	};

	useEffect(() => {
		getGameCollection();
	}, []);

	return (
		<main className="main">
			<section className="collection">
				<div className="title-wrapper">
					<h1 className="title">My Collection</h1>
				</div>

				<div className="filters">
					<h2 className="filters__title">Filters</h2>
					<div className="filter">
						<p className="filter__title">Status</p>
						<ul className="filter__options filter__options--checklist">
							<li className="filter__option filter__option--checkbox">
								<input
									type="checkbox"
									id="status-wishlist"
									name="status-wishlist"
									className="input-checkbox"
								/>
								<div className="input-checkbox__custom"></div>
								<label htmlFor="status-wishlist">Wishlist</label>
							</li>
						</ul>
					</div>
				</div>

				<div className="collection-games">
					<div className="game-cards">
						<div className="game-card">
							<div className="game-card__info-wrapper">
								<div className="game-card__cover-wrapper">
									<div className="game-card__image-placeholder"></div>
								</div>

								<div className="game-card__content-wrapper">
									<div className="game-card__title-wrapper">
										<p className="game-card__title">Game name</p>
										<div className="game-card__rating-chip">
											<span className="game-card__rating-label">92</span>
										</div>
									</div>

									<div className="game-card__meta-wrapper">
										<p className="game-card__meta">Developer • Release date</p>

										<div className="game-card__time-to-beat">
											<GameController
												weight="fill"
												className="game-card__icon game-card__icon--controller"
											/>{" "}
											44 hours
										</div>
									</div>

									<div className="game-card__genres">
										<h4 className="game-card__genres-title">Genres</h4>
										<ul className="game-card__chips">
											<li className="game-card__chip">Chip label</li>
											<li className="game-card__chip">Chip label</li>
											<li className="game-card__chip">Chip label</li>
										</ul>
									</div>
								</div>
							</div>

							<div className="game-card__collection-actions-wrapper">
								<div className="game-card__platforms">
									<h4 className="game-card__platforms-title">
										Owned / Wishlisted On
									</h4>

									<div className="game-card__ownership-details">
										<div className="dropdown">
											<button
												className="btn btn--outline btn--dropdown"
												name="game-console"
												onClick={() => toggleDropdown("gameConsoleOptions")}
												type="button"
												value={gameConsole}
											>
												{gameConsole} <CaretDown />
											</button>

											<ul
												className={`dropdown__options dropdown__options--${
													isOpen === "gameConsoleOptions" ? "show" : "hide"
												}`}
											>
												{gameConsoleOptions?.map((gameConsole) => {
													return (
														<li
															key={gameConsole.value}
															className="dropdown__option"
															onClick={(e) => {
																setGameConsole(gameConsole.label);
																setIsOpen(false);
															}}
														>
															{gameConsole.label}
														</li>
													);
												})}
											</ul>
										</div>

										<div className="dropdown">
											<button
												className="btn btn--outline btn--dropdown"
												name="game-format"
												onClick={() => toggleDropdown("gameFormatOptions")}
												type="button"
												value={gameFormat}
											>
												{gameFormat} <CaretDown />
											</button>

											<ul
												className={`dropdown__options dropdown__options--${
													isOpen === "gameFormatOptions" ? "show" : "hide"
												}`}
											>
												{gameFormatOptions?.map((gameFormat) => {
													return (
														<li
															key={gameFormat.value}
															className="dropdown__option"
															onClick={(e) => {
																setGameFormat(gameFormat.label);
																setIsOpen(false);
															}}
														>
															{gameFormat.label}
														</li>
													);
												})}
											</ul>
										</div>
									</div>
								</div>

								<div className="game-card__collection-actions">
									<button className="btn btn--primary" type="button">
										Want to play{" "}
										<CaretDown className="btn__icon" weight="bold" />
									</button>
									<button className="btn btn--outline btn--warn" type="button">
										<Trash className="btn__icon" weight="bold" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default Collection;
