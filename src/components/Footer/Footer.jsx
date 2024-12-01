import "./Footer.scss";

function Footer() {
	return (
		<div className="footer">
			<div className="footer__content-wrapper">
				<p className="footer__attribution">
					Video game data sourced from{" "}
					<a href="https://api-docs.igdb.com/" target="_blank">
						IGDB
					</a>
				</p>
				<p className="footer__attribution">
					Designed and developed by{" "}
					<a href="https://janessaperry.com" target="_blank">
						Janessa Perry
					</a>
				</p>
			</div>
		</div>
	);
}

export default Footer;
