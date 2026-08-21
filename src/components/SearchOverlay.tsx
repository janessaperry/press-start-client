import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSearchOverlay } from "../context/SearchOverlayContext.tsx";
import SearchWithDropdown from "./SearchWithDropdown.tsx";

const SearchOverlay = () => {
  const { isOpen, closeSearch } = useSearchOverlay();
  const navigate = useNavigate();
  const location = useLocation();
  const [ searchParams ] = useSearchParams();
  const currentSearchQuery = location.pathname === '/games' ? (searchParams.get('search') ?? '') : '';

  const handleSubmit = (query: string) => {
    navigate({ pathname: "/games", search: `?search=${encodeURIComponent(query)}` });
    closeSearch();
  };

  return (
    <div className={`md:hidden fixed top-0 left-0 right-0 h-dvh z-50 flex flex-col transition-opacity duration-300
      ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

      <div className="absolute inset-0 bg-secondary-900/80 backdrop-blur-sm" onClick={closeSearch}/>

      <div className="relative flex p-4 pt-8 gap-4">
        <SearchWithDropdown
          className="grow"
          onSubmit={handleSubmit}
          initialQuery={currentSearchQuery}
          autoFocus={isOpen}
          hideButton
        />

        <button onClick={closeSearch} className="button ghost">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SearchOverlay;