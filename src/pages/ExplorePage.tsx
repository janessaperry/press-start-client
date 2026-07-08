import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Button, Input } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

import { GameOverview, Result } from "../types/common.ts";
import NintendoLogo from "/src/assets/logos/platforms/nintendo-logo-white.svg";
import XboxLogo from "/src/assets/logos/platforms/xbox-logo-white.svg"
import PlaystationLogo from "/src/assets/logos/platforms/playstation-logo-white.svg"

import GameCarousel from "../components/GameCarousel.tsx";
import SearchResultsDropdown from "../components/SearchResultsDropdown.tsx";

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const ExplorePage = () => {
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();

  const [ searchQuery, setSearchQuery ] = useState<string>('');
  const [ searchResults, setSearchResults ] = useState<Result[]>([]);
  const [ isSearchPending, setIsSearchPending ] = useState<boolean>(false);
  const [ isDropdownOpen, setIsDropdownOpen ] = useState<boolean>(false);
  const [ newRelease, setNewRelease ] = useState<GameOverview[]>([]);
  const [ comingSoon, setComingSoon ] = useState<GameOverview[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      search: searchQuery
    });

    navigate({
      pathname: "/games",
      search: `?${params}`
    });
  }

  const fetchSearchResults = async (searchQuery: string) => {
    try {
      const response = await axios.get(`${baseServerUrl}/games/search/${searchQuery}`);
      return response.data.searchResults;
    }
    catch (e) {
      console.error(`Error searching games: ${e}`);
    }
  }

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    if (searchQuery.length < 3) return;

    const timeoutId = setTimeout(async () => {
      const results = await fetchSearchResults(searchQuery);
      setSearchResults(results ?? []);
      setIsSearchPending(false);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [ searchQuery ]);


  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${baseServerUrl}/games?status=coming-soon,new-release`);
        const games = response.data;
        setComingSoon(games.status.comingSoon);
        setNewRelease(games.status.newRelease);
      }
      catch (e) {
        console.error(`Error fetching games: ${e}`)
      }
      finally {
        console.log("done loading");
      }
    }
    void fetchGames();
  }, [])


  return (
    <>
      <section className="px-4 md:px-10 py-12 md:py-24 bg-purple-700">
        <div className="container flex flex-col gap-6 md:gap-10">
          <h1 className="text-center">Find your next game</h1>

          <search className="flex justify-center">
            <div ref={searchContainerRef} className="w-full md:max-w-3/4 lg:max-w-1/2 flex flex-col gap-3">
              <form className="flex items-stretch gap-3" onSubmit={handleSearchSubmit}>
                <Input name="search"
                  type="search"
                  placeholder="Search..."
                  autoComplete="off"
                  onChange={e => handleSearchInput(e)}
                  value={searchQuery}
                  className="grow md:text-xl"/>
                <Button type="submit" className="button primary aspect-square rounded-full">
                  <MagnifyingGlassIcon className="icon-md"/>
                </Button>
              </form>
              {isDropdownOpen &&
                <SearchResultsDropdown results={searchResults} isSearchPending={isSearchPending} query={searchQuery}/>
              }
            </div>
          </search>
        </div>
      </section>

      <div className="container px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-16">
        <section className="flex flex-col gap-4 md:gap-6">
          <h2>Explore by platform</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 md:gap-6">
            <Link to="/explore/xbox" className="flex items-center justify-center py-6 px-4 bg-primary-300 rounded-xl">
              <img src={XboxLogo} alt="View Xbox games" className="h-14"/>
            </Link>
            <Link to="/explore/playstation"
              className="flex items-center justify-center py-6 px-4 bg-primary-300 rounded-xl">
              <img src={PlaystationLogo} alt="View Xbox games" className="h-16"/>
            </Link>
            <Link to="/explore/nintendo"
              className="flex items-center justify-center py-6 px-4 bg-primary-300 rounded-xl">
              <img src={NintendoLogo} alt="View Xbox games" className="h-14"/>
            </Link>
            <Link to="/explore/pc" className="flex items-center justify-center py-6 px-4 bg-primary-300 rounded-xl">
              <div className="w-full text-center font-heading text-5xl sm:text-4xl lg:text-5xl">PC</div>
            </Link>
          </div>
        </section>

        {newRelease &&
          <section className="flex flex-col gap-4 md:gap-6">
            <h2>New Releases</h2>
            <GameCarousel games={newRelease}/>
          </section>
        }

        {comingSoon &&
          <section className="flex flex-col gap-4 md:gap-6">
            <h2>Coming Soon</h2>
            <GameCarousel games={comingSoon}/>
          </section>
        }
      </div>

    </>
  );
};

export default ExplorePage;