import { useNavigate } from "react-router-dom";
import { useSearchOverlay } from "../context/SearchOverlayContext.tsx";
import SearchWithDropdown from "./SearchWithDropdown.tsx";

const SearchOverlay = () => {
  const { isOpen, initialQuery, closeSearch } = useSearchOverlay();
  const navigate = useNavigate();

  const handleSubmit = (query: string) => {
    navigate({ pathname: "/games", search: `?search=${encodeURIComponent(query)}` });
    closeSearch();
  };

  return (
    <div className={`md:hidden fixed top-0 left-0 right-0 h-dvh z-50 flex flex-col transition-opacity duration-300
      ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

      <div className="absolute inset-0 bg-secondary-900/80 backdrop-blur-sm" onClick={closeSearch}/>

      <div className="relative flex flex-col flex-1 p-4 pt-8 gap-4">
        <SearchWithDropdown
          className="w-full"
          onSubmit={handleSubmit}
          initialQuery={initialQuery}
          autoFocus={isOpen}
        />

        <button onClick={closeSearch} className="button ghost mt-auto">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SearchOverlay;