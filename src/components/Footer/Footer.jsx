import "./Footer.scss";

function Footer() {
	return (
		<div className="footer">
			<div className="footer__content-wrapper">
				<p className="footer__data-attribution">
					Video game data sourced from{" "}
					<a href="https://api-docs.igdb.com/" target="_blank">
						IGDB
					</a>
				</p>
			</div>
		</div>
	);
}

export default Footer;
