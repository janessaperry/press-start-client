import { Button } from "@headlessui/react";
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
    <div className={`md:hidden fixed inset-0 z-50 flex flex-col
      ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

      <div className="absolute inset-0 bg-secondary-900/80 backdrop-blur-sm" onClick={closeSearch}/>

      <div className="p-4 pt-8 relative">
        <SearchWithDropdown
          className="w-full"
          inputClassName="mr-22"
          onSubmit={handleSubmit}
          initialQuery={currentSearchQuery}
          autoFocus={isOpen}
          hideButton
        />

        <Button onClick={closeSearch} className="button ghost muted absolute right-4 top-8">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SearchOverlay;