import { NavLink } from "react-router-dom";
import "./Pagination.scss";

function Pagination({ currentPage, totalPages, onPageChange }) {
	return (
		<div className="pagination">
			{totalPages.length <= 5 ? (
				totalPages.map((page) => {
					return (
						<NavLink
							key={`${page}`}
							to={onPageChange(page)}
							className="pagination__link"
						>
							{page}
						</NavLink>
					);
				})
			) : (
				<>
					{currentPage > 1 && (
						<>
							<NavLink
								key="1"
								to={onPageChange("1")}
								className="pagination__link"
							>
								1
							</NavLink>
							<span className="pagination__truncation">...</span>
						</>
					)}

					{totalPages
						.slice(
							totalPages.length - 4 <= currentPage
								? totalPages.length - 5
								: parseInt(currentPage) - 1,
							totalPages.length - 4 <= parseInt(currentPage)
								? totalPages.length
								: parseInt(currentPage) + 4
						)
						.map((page) => (
							<NavLink
								key={page}
								to={onPageChange(page)}
								className="pagination__link"
							>
								{page}
							</NavLink>
						))}

					{currentPage < totalPages.length - 4 && (
						<>
							<span className="pagination__truncation">...</span>
							<NavLink
								key={totalPages.length}
								to={onPageChange(totalPages.length)}
								className="pagination__link"
							>
								{totalPages.length}
							</NavLink>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default Pagination;
