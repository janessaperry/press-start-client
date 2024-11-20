import { CaretDown, Heart } from "@phosphor-icons/react";
import "./GameDetails.scss";

function GameDetails() {
	return (
		<main className="main">
			<section className="game-details">
				<div className="game-details__wrapper game-details__wrapper--cover-actions">
					<div className="game-details__image-placeholder"></div>
					<div className="game-details__library-actions">
						<button className="btn btn--primary" type="button">
							Add to Library <CaretDown className="btn__icon" weight="bold" />
						</button>
						<button className="btn btn--outline" type="button">
							<Heart className="btn__icon" weight="bold" />
						</button>
					</div>
				</div>

				<div className="game-details__wrapper game-details__wrapper--info">
					<div className="game-details__header-section">
						<div className="game-details__title-wrapper">
							<h1 className="game-details__title">Game Title</h1>
							<p className="game-details__meta">Developer • Release date</p>
						</div>

						<div className="game-details__rating-chip">
							<span className="game-details__rating-label">92</span>
						</div>
					</div>

					<div className="game-details__content-section">
						<div className="game-details__content-wrapper">
							<h2 className="game-details__content-title">Description</h2>
							<p className="game-details__content-body">
								Lorem ipsum dolor sit amet consectetur adipisicing elit.
								Aliquid, magnam dolorum modi dolor quam facilis quasi voluptatem
								id omnis corrupti maiores accusamus dolores veritatis ipsum
								repudiandae totam dolore quo debitis.
							</p>
						</div>

						<div className="game-details__content-wrapper">
							<h4 className="game-details__title">Platforms</h4>
							<ul className="game-details__chips">
								<li className="game-details__chip">Chip label</li>
							</ul>
						</div>

						<div className="game-details__content-wrapper">
							<h4 className="game-details__content-title">Genres</h4>
							<ul className="game-details__chips">
								<li className="game-details__chip">Chip label</li>
								<li className="game-details__chip">Chip label</li>
								<li className="game-details__chip">Chip label</li>
								<li className="game-details__chip">Chip label</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section className="similar-games">
				<h2 className="similar-games__title">Similar Games</h2>
			</section>

			<section className="franchise-games">
				<h2 className="franchise-games__title">Other Games in Franchise</h2>
			</section>
		</main>
	);
}

export default GameDetails;
