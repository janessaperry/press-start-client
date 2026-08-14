import { Button, Input } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../api/client.ts";
import { useSearchOverlay } from "../context/SearchOverlayContext.tsx";
import SearchResultsDropdown from "./SearchResultsDropdown.tsx";
import { Result } from "../types/common.ts";

type Props = {
  onSubmit: (query: string) => void;
  className?: string;
  inputClassName?: string;
  initialQuery?: string;
  autoFocus?: boolean;
  hideButton?: boolean;
}

const SearchWithDropdown = ({
  onSubmit,
  className,
  inputClassName,
  initialQuery = '',
  autoFocus = false,
  hideButton = false
}: Props) => {
  const location = useLocation();
  const [ searchQuery, setSearchQuery ] = useState(initialQuery);
  const [ searchResults, setSearchResults ] = useState<Result[]>([]);
  const [ isSearchPending, setIsSearchPending ] = useState(false);
  const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
  const [ searchError, setSearchError ] = useState(false);
  const { closeSearch } = useSearchOverlay();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [ initialQuery ]);

  useEffect(() => {
    setIsDropdownOpen(false);
    closeSearch();
    inputRef.current?.blur();
  }, [ location.pathname ]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [ autoFocus ]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 3) return;

    const timeoutId = setTimeout(async () => {
      try {
        const response = await apiClient.get(`/games/search/${searchQuery}`);
        setSearchResults(response.data.searchResults ?? []);
        setSearchError(false);
      }
      catch {
        setSearchResults([]);
        setSearchError(true);
      }
      finally {
        setIsSearchPending(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [ searchQuery ]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length >= 3) {
      setIsSearchPending(true);
      setIsDropdownOpen(true);
      setSearchError(false);
    }
    else {
      setIsSearchPending(false);
      setIsDropdownOpen(false);
      setSearchResults([]);
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearch = searchQuery.trim();
    if (!trimmedSearch) return;
    setIsDropdownOpen(false);
    onSubmit(trimmedSearch);
  }

  return (
    <search className={className}>
      <div ref={containerRef} className="relative">
        <form className="flex items-stretch gap-3" onSubmit={handleSubmit}>
          <Input
            ref={inputRef}
            name="search"
            type="search"
            placeholder="Search..."
            autoComplete="off"
            onChange={handleInput}
            value={searchQuery}
            className={`grow md:text-xl ${inputClassName ?? ''}`}
          />
          {!hideButton && (
            <Button type="submit" className="button primary aspect-square rounded-full">
              <MagnifyingGlassIcon className="icon-md"/>
            </Button>
          )}
        </form>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-4 z-50">
            <SearchResultsDropdown results={searchResults}
              isSearchPending={isSearchPending}
              query={searchQuery}
              hasError={searchError}
            />
          </div>
        )}
      </div>
    </search>
  );
}

export default SearchWithDropdown;