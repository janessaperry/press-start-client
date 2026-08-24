import { createContext, useContext, useState, ReactNode } from "react";
import { usePreventScroll } from "@react-aria/overlays";

type SearchOverlayContextType = {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchOverlayContext = createContext<SearchOverlayContextType | null>(null);

export const SearchOverlayProvider = ({ children }: { children: ReactNode }) => {
  const [ isOpen, setIsOpen ] = useState(false);

  const openSearch = () => setIsOpen(true);
  const closeSearch = () => setIsOpen(false);

  usePreventScroll({ isDisabled: !isOpen });

  return (
    <SearchOverlayContext.Provider value={{ isOpen, openSearch, closeSearch }}>
      {children}
    </SearchOverlayContext.Provider>
  );
};

export const useSearchOverlay = () => {
  const context = useContext(SearchOverlayContext);

  if (!context) throw new Error('useSearchOverlay must be used within SearchOverlayProvider');
  return context;
};