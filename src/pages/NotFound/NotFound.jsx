import { useNavigate } from "react-router-dom";
import NotFoundGraphic from "../../assets/images/not-found-graphic.svg";
import Button from "../../components/Button/Button";
import "./NotFound.scss";

function NotFound() {
	const navigate = useNavigate();
	return (
		<main className="main">
			<section className="not-found">
				<div className="not-found__message">
					<img
						className="not-found__image"
						alt="404 page not found"
						src={NotFoundGraphic}
					/>
					<h1 className="not-found__title">Page Not Found</h1>
				</div>

				<div className="not-found__action-wrapper">
					<Button
						handleBtnClick={() => navigate("/collection/1")}
						contextClasses="btn--primary not-found__btn"
						label="Back to Collection"
					/>
				</div>
			</section>
		</main>
	);
}

export default NotFound;
