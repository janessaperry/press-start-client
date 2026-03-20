import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  resultsCount: number,
  itemsPerPage?: number,
  className?: string,
}

const Pagination = ({ resultsCount, itemsPerPage = 40, className }: Props) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentPage = params.get('page') ?? '1';
  const totalPages = Math.ceil(resultsCount / itemsPerPage) || 0;
  const pages = Array(totalPages).fill(0).map((_, i) => String(i + 1));

  const handleNavigation = (itemClicked: string) => {
    const params = new URLSearchParams(location.search);
    if (itemClicked === 'back') {
      let prevPage = Number(currentPage) - 1;
      if (prevPage <= 0) prevPage = 1;
      params.set('page', String(prevPage));
    }
    else if (itemClicked === 'next') {
      let nextPage = Number(currentPage) + 1;
      if (nextPage > totalPages) nextPage = totalPages;
      params.set('page', String(nextPage));
    }
    else {
      params.set('page', itemClicked);
    }

    return `?${params.toString()}`;
  }

  useEffect(() => {
    window.scrollTo({ top: 100, left: 100, behavior: "smooth" })
  }, [ location.search ]);

  return (
    <>
      <nav className={`flex gap-2 ${className}`}>
        <Link to={handleNavigation('back')}
          className={`button ghost muted p-2 size-11 ${currentPage === '1' ? 'disabled' : ''}`}>
          <CaretLeftIcon aria-hidden={true} className="icon-md"/>
          <span className="sr-only">Previous page</span>
        </Link>

        {pages.map((page) => {
          return (
            <Link key={page} to={handleNavigation(page)}
              aria-current={currentPage === page}
              className="button ghost muted p-2 size-11 text-lg aria-current:bg-accent-500/10">
              {page}
            </Link>
          )
        })}

        <Link to={handleNavigation('next')}
          className={`button ghost muted p-2 size-11 ${currentPage === String(totalPages) ? 'disabled' : ''}`}>
          <CaretRightIcon aria-hidden={true} className="icon-md"/>
          <span className="sr-only">Next page</span>
        </Link>
      </nav>
    </>
  )
}

export default Pagination;