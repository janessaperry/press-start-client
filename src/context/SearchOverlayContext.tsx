import { createContext, useContext, useState, ReactNode } from "react";

type SearchOverlayContextType = {
  isOpen: boolean;
  initialQuery: string;
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
}

const SearchOverlayContext = createContext<SearchOverlayContextType | null>(null);

export const SearchOverlayProvider = ({ children }: { children: ReactNode }) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ initialQuery, setInitialQuery ] = useState('');

  const openSearch = (query = '') => {
    setInitialQuery(query);
    setIsOpen(true);
  };

  const closeSearch = () => {
    setIsOpen(false);
    setInitialQuery('');
  };

  return (
    <SearchOverlayContext.Provider value={{ isOpen, initialQuery, openSearch, closeSearch }}>
      {children}
    </SearchOverlayContext.Provider>
  );
};

export const useSearchOverlay = () => {
  const context = useContext(SearchOverlayContext);

  if (!context) throw new Error('useSearchOverlay must be used within SearchOverlayProvider');
  return context;
};