import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  className?: string
}

const Pagination = ({ className }: Props) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentPage = params.get('page') ?? '1';

  const handleNavigation = (itemClicked: string) => {
    const params = new URLSearchParams(location.search);
    if (itemClicked === 'back') {
      const page = Number(currentPage) <= 1 ? '1' : String((Number(currentPage) - 1));
      params.set('page', page)
    }
    else if (itemClicked === 'next') {
      params.set('page', String((Number(currentPage) + 1)))
    }
    else {
      params.set('page', itemClicked)
    }

    return `?${params.toString()}`;
  }

  return (
    <>
      <nav className={`flex gap-2 ${className}`}>
        <Link to={handleNavigation('back')} className="button ghost muted p-2 size-11">
          <CaretLeftIcon aria-hidden={true} className="icon-md"/>
          <span className="sr-only">Previous page</span>
        </Link>

        <Link to={handleNavigation('1')}
          aria-pressed={currentPage === '1'}
          className="button ghost muted p-2 size-11 text-lg aria-pressed:bg-accent-500/10">1</Link>
        <Link to={handleNavigation('2')}
          aria-pressed={currentPage === '2'}
          className="button ghost muted size-11 text-lg aria-pressed:bg-accent-500/10">2</Link>

        <Link to={handleNavigation('next')} className="button ghost muted p-2 size-11">
          <CaretRightIcon aria-hidden={true} className="icon-md"/>
          <span className="sr-only">Next page</span>
        </Link>
      </nav>
    </>
  )
}

export default Pagination;