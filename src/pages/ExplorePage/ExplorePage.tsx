import axios from "axios";
import { Link } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Input } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import GameCarousel from "../../components/GameCarousel.tsx";
import SearchResultsDropdown from "../../components/SearchResultsDropdown.tsx";

export type GameOverview = {
  id: number,
  name: string,
  coverUrl: string | null,
  slug: string,
  totalRating: number | null,
  consoles: {
    id: number,
    label: string
  }[],
  gameType: {
    id: number,
    label: string
  }
}

export type Result = {
  id: number,
  name: string,
  coverUrl: string | null
}

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [newRelease, setNewRelease] = useState<GameOverview[]>([]);
  const [comingSoon, setComingSoon] = useState<GameOverview[]>([]);

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await axios.get(`${baseServerUrl}/games?search=${query}`);
      return response.data.searchResults;
    }
    catch (e) {
      console.error(`Error searching games: ${e}`);
    }
  }

  const handleSearchInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  }

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        const results = await fetchSearchResults(searchQuery);
        setSearchResults(results);
        setShowSearchResults(true);
      }
      else {
        setShowSearchResults(false);
        setSearchResults([]);
      }
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    }
  }, [searchQuery]);


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
      <section className="px-4 py-20 bg-purple-700">
        <div className="container flex flex-col gap-10">
          <h1 className="text-center">Find your next game</h1>

          <search className="flex flex-col gap-4">
            <form className="self-center w-full md:max-w-3/4 lg:max-w-1/2 flex gap-3"
              onSubmit={() => console.log("submit - go to full results page")}>
              <Input name="search"
                type="search"
                placeholder="Search..."
                onChange={e => handleSearchInput(e)}
                value={searchQuery}
                className="grow"/>
              <Button type="button" onClick={() => console.log("submit - go to full results page")}>
                <MagnifyingGlassIcon/>
              </Button>
            </form>
            {showSearchResults &&
              <SearchResultsDropdown results={searchResults}/>
            }
          </search>

        </div>
      </section>

      <section className="container px-4 py-20 flex flex-col gap-10">
        <h2>Explore by platform</h2>
        <div>
          <Link to="/explore/xbox">Xbox Logo</Link>
          <Link to="/explore/playstation">Playstation Logo</Link>
          <Link to="/explore/nintendo">Nintendo Logo</Link>
          <Link to="/explore/pc">PC Logo</Link>
        </div>
      </section>

      {newRelease &&
        <section className="container px-4 py-20 flex flex-col gap-10">
          <h2>New Releases</h2>
          <GameCarousel games={newRelease}/>
        </section>
      }

      {comingSoon &&
        <section className="container px-4 py-20 flex flex-col gap-10">
          <h2>Coming Soon</h2>
          <GameCarousel games={comingSoon}/>
        </section>
      }
    </>
  );
};

export default ExplorePage;