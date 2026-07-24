import { Button, Input } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import apiClient from "../api/client.ts";
import SearchResultsDropdown from "./SearchResultsDropdown.tsx";
import { Result } from "../types/common.ts";

type Props = {
  onSubmit: (query: string) => void;
  className?: string;
}

const SearchWithDropdown = ({ onSubmit, className }: Props) => {
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ searchResults, setSearchResults ] = useState<Result[]>([]);
  const [ isSearchPending, setIsSearchPending ] = useState(false);
  const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

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
      }
      catch (e) {
        console.error(`Error searching games: ${e}`);
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
    }
    else {
      setIsSearchPending(false);
      setIsDropdownOpen(false);
      setSearchResults([]);
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(searchQuery);
  }

  return (
    <search className={className}>
      <div ref={containerRef} className="w-full md:max-w-3/4 lg:max-w-1/2 flex flex-col gap-3">
        <form className="flex items-stretch gap-3" onSubmit={handleSubmit}>
          <Input
            name="search"
            type="search"
            placeholder="Search..."
            autoComplete="off"
            onChange={handleInput}
            value={searchQuery}
            className="grow md:text-xl"
          />
          <Button type="submit" className="button primary aspect-square rounded-full">
            <MagnifyingGlassIcon className="icon-md"/>
          </Button>
        </form>
        {isDropdownOpen && (
          <SearchResultsDropdown results={searchResults} isSearchPending={isSearchPending} query={searchQuery}/>
        )}
      </div>
    </search>
  );
}

export default SearchWithDropdown;