import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FilterCategory from "../components/FilterCategory.tsx";
import GameCard from "../components/GameCard.tsx";
import { GameOverview } from "../components/GameCard.tsx";
import { debounce } from "lodash";

type SelectOption = {
  id: number,
  label: string
}

type FilterCategories = {
  platformFamily?: SelectOption[],
  platform?: SelectOption[],
  genres?: SelectOption[],
}

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const GameResultsPage = () => {
  const {platformFamilySlug} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedPlatformFamilies = searchParams.get('platformFamily')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedPlatforms = searchParams.get('platform')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedGenres = searchParams.get('genres')?.split(',').map(id => Number(id.trim())) ?? [];

  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [filterCategories, setFilterCategories] = useState<FilterCategories>({});

  const getGames = async (params: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseServerUrl}/games?${params}`);
      setGames(response.data.filteredResults);
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (platformFamilySlug) searchParams.set('platformFamily', platformFamilySlug);
    const params = searchParams.toString();
    void getGames(params);
  }, [platformFamilySlug]);

  useEffect(() => {
    const getFilters = async () => {
      const response = await axios.get(`${baseServerUrl}/filters`);
      console.log("getFilters", response.data);
      setFilterCategories(response.data);
    }

    void getFilters();
  }, []);

  const handleFilterChange = (category: string, id: number) => {
    const current = searchParams.get(category)?.split(',').filter(Boolean) ?? [];
    const updated = current.includes(String(id)) ? current.filter(s => s !== String(id)) : [...current, String(id)];
    if (updated.length === 0) {
      searchParams.delete(category);
    }
    else {
      searchParams.set(category, updated.toString());
    }
    navigate(`/games?${searchParams}`, {replace: true});

    handleFilter(searchParams);
  }

  const handleFilter = useCallback(debounce((searchParams) => {
    console.log(`Send request to filter for ${searchParams.toString()}`);
    void getGames(searchParams);
  }, 2000), []);


  // if (isLoading) return <h1>Loading</h1>;
  if (games.length === 0) return <h1>No games</h1>;

  return (
    <div className="container grid grid-cols-4 gap-8 px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-6">
      <section className="col-span-1 p-4 bg-blue-500/50 border border-accent-300/20 rounded-2xl  space-y-4 md:space-y-6">
        <h2>Filters</h2>
        {filterCategories.platformFamily && (
          <FilterCategory title="Platform Family"
            filters={filterCategories.platformFamily}
            selectedFilters={selectedPlatformFamilies}
            paramName='platformFamily'
            handleChange={handleFilterChange}/>
        )}

        {filterCategories.platform && (
          <FilterCategory title="Console"
            filters={filterCategories.platform}
            selectedFilters={selectedPlatforms}
            paramName='platform'
            handleChange={handleFilterChange}/>
        )}

        {filterCategories.genres && (
          <FilterCategory title="Genres"
            filters={filterCategories.genres}
            selectedFilters={selectedGenres}
            paramName='genres'
            handleChange={handleFilterChange}/>
        )}
      </section>

      <section className="col-span-3 space-y-4 md:space-y-6">
        <h1 className="">{platformFamilySlug} Games</h1>
        {isLoading ? (
          <><h1>Loading</h1></>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {games.map((game: GameOverview) => {
              return (
                <GameCard key={game.id} gameOverview={game}/>
              )
            })}
          </div>
        )}

      </section>
    </div>
  )
}

export default GameResultsPage;