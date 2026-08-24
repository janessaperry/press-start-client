import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  resultsCount: number;
  itemsPerPage: number;
  className?: string;
}

const Pagination = ({ resultsCount, itemsPerPage, className }: Props) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentPage = params.get('page') ?? '1';
  const currentPageIndex = Number(currentPage) - 1;
  const totalPages = Math.ceil(resultsCount / itemsPerPage) || 0;
  const pages = Array(totalPages).fill(0).map((_, i) => String(i + 1));
  const visiblePageLinks = getPageLinks(totalPages, pages, currentPageIndex);

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

  if (totalPages <= 1) return null;

  return (
    <>
      <nav className={`flex gap-2 ${className ?? ""}`}>
        <Link to={handleNavigation('back')}
          className={`button ghost muted size-10 md:size-11 ${currentPage === '1' ? 'disabled' : ''}`}>
          <CaretLeftIcon aria-hidden={true} className="icon-sm"/>
          <span className="sr-only">Previous page</span>
        </Link>

        {visiblePageLinks.map((page, i) => {
          if (page === "...") {
            return <div key={`p-break-${i}`}
              className="flex items-center justify-center w-2 h-11 md:text-lg">{page}</div>
          }
          else {
            return (
              <Link key={`p-${page}`} to={handleNavigation(page)}
                aria-current={currentPage === page}
                className="button ghost muted size-10 md:size-11 md:text-lg aria-current:bg-accent-300/10 aria-current:border-accent-300/40">
                {page}
              </Link>
            )
          }
        })}

        <Link to={handleNavigation('next')}
          className={`button ghost muted size-10 md:size-11 ${currentPage === String(totalPages) ? 'disabled' : ''}`}>
          <CaretRightIcon aria-hidden={true} className="icon-sm"/>
          <span className="sr-only">Next page</span>
        </Link>
      </nav>
    </>
  )
}

export default Pagination;

function getPageLinks (totalPages: number, pages: string[], currentPageIndex: number) {
  if (totalPages <= 5) {
    return pages;
  }
  if (currentPageIndex < 3) {
    return [ ...pages.slice(0, 4), '...', pages[pages.length - 1] ];
  }
  if (currentPageIndex >= 3 && currentPageIndex < (pages.length - 4)) {
    return [ pages[0], '...', ...pages.slice(currentPageIndex - 1, currentPageIndex + 2), '...', pages[pages.length - 1] ];
  }
  if (currentPageIndex >= (pages.length - 4)) {
    return [ pages[0], '...', ...pages.slice(-4) ];
  }
  return pages;
}