import { Link } from "react-router-dom";
import "./Explore.scss";

function Explore() {
	return (
		<main className="main">
			<section className="explore-search">
				<h1 className="explore-search__title">Find your next game</h1>
				<input
					className="explore-search__input"
					type="text"
					placeholder="Search games..."
				/>
			</section>

			<section className="browse-platforms">
				<div className="browse-platforms__content-wrapper">
					<h2 className="browse-platforms__title">Browse by Platform</h2>
					<div className="browse-platforms__cards">
						<Link className="browse-platforms__card-link" to={`/explore/xbox`}>
							<div className="browse-platforms__card">XBOX</div>
						</Link>
						<Link
							className="browse-platforms__card-link"
							to="/explore/playstation"
						>
							<div className="browse-platforms__card">PlayStation</div>
						</Link>
						<Link
							className="browse-platforms__card-link"
							to="/explore/nintendo"
						>
							<div className="browse-platforms__card">Nintendo</div>
						</Link>
						<Link className="browse-platforms__card-link" to="/explore/pc">
							<div className="browse-platforms__card">PC</div>
						</Link>
					</div>
				</div>
			</section>

			<section className="browse-new-releases">
				<h2 className="browse-new-releases__title">New Releases</h2>
			</section>

			<section className="browse-coming-soon">
				<h2 className="browse-coming-soon__title">Coming Soon</h2>
			</section>
		</main>
	);
}

export default Explore;
