import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import { Button, Field, Label, Select } from "@headlessui/react";
import { PencilSimpleLineIcon, SlidersIcon } from "@phosphor-icons/react";
import { GameOverview } from "../components/GameCard.tsx";
import GameCard from "../components/GameCard.tsx";
import FilterCategory from "../components/FilterCategory.tsx";

const PLATFORM_MAP = {
  'playstation': {id: 1, name: 'PlayStation'},
  'xbox': {id: 2, name: 'Xbox'},
  'pc': {id: 4, name: 'PC'},
  'nintendo': {id: 5, name: 'Nintendo'},
}

const PLATFORM_FAMILY_PLATFORMS = {
  nintendo: {label: "Nintendo", platformIds: [130, 508]},
  pc: {label: "PC", platformIds: [3, 14, 6]},
  playstation: {label: "PlayStation", platformIds: [48, 167]},
  xbox: {label: "Xbox", platformIds: [49, 169]},
}

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

  const platformFamily = PLATFORM_FAMILY_PLATFORMS[platformFamilySlug as keyof typeof PLATFORM_FAMILY_PLATFORMS];
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') ?? undefined;
  // const selectedPlatformFamilies = searchParams.get('platformFamily')?.split(',').map(id => Number(id.trim())) ?? [];
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
    if (platformFamilySlug) {
      searchParams.set('platformFamily', String(PLATFORM_MAP[platformFamilySlug as keyof typeof PLATFORM_MAP]?.id));
    }
    else {
      searchParams.delete('platformFamily');
    }

    void getGames(searchParams.toString());
  }, [platformFamilySlug]);

  useEffect(() => {
    const getFilterCategories = async () => {
      const response = await axios.get(`${baseServerUrl}/filters`);
      const filtersData = response.data;
      let platformFilters = filtersData.platform;

      if (platformFamily) {
        platformFilters = platformFilters.filter((p: SelectOption) => platformFamily.platformIds.includes(p.id));
      }
      setFilterCategories({...filtersData, platform: platformFilters});
    }

    void getFilterCategories();
  }, [platformFamilySlug]);

  const handleFilterChange = (category: string, id: number) => {
    const current = searchParams.get(category)?.split(',').filter(Boolean) ?? [];
    const updated = current.includes(String(id)) ? current.filter(s => s !== String(id)) : [...current, String(id)];
    if (updated.length === 0) {
      searchParams.delete(category);
    }
    else {
      searchParams.set(category, updated.toString());
    }
    navigate(`?${searchParams}`, {replace: true});

    handleFilter(searchParams);
  }

  const handleFilter = useCallback(debounce((searchParams) => {
    console.log(`Send request to filter for ${searchParams.toString()}`);
    void getGames(searchParams);
  }, 1400), []);

  const getTitle = () => {
    if (platformFamily) {return `${platformFamily.label} games`;}
    if (searchQuery) {return `Results for "${searchQuery}"`;}
    return `Explore games`;
  }

  return (
    <>
      <div className="container px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-16">
        <header className="flex items-center gap-4">
          <h1 className="">{getTitle()}</h1>
          {searchQuery &&
            <Button onClick={() => console.log("edit search query")} className="button ghost">
              <PencilSimpleLineIcon weight="bold"/>Edit
            </Button>
          }
        </header>

        <section className="flex gap-6">
          <Field className="grow flex items-center gap-2">
            <Label>Sort by:</Label>
            <Select className="grow">
              <option>Recently added</option>
              <option>Name (A-Z)</option>
              <option>Name (Z-A)</option>
              <option>Release Date (newest first)</option>
              <option>Release Date (oldest first)</option>
            </Select>
          </Field>

          <Button onClick={() => console.log("open filters on mobile")} className="button ghost md:hidden">
            <SlidersIcon weight="bold"/>Filters
          </Button>
        </section>

        <div className="grid grid-cols-4 gap-8">
          <section className="col-span-1 p-4 bg-blue-500/50 border border-accent-300/20 rounded-2xl  space-y-4 md:space-y-6">
            <h4>Filters</h4>
            {/*{!platformFamilySlug && filterCategories.platformFamily && (*/}
            {/*  <FilterCategory title="Platform"*/}
            {/*    filters={filterCategories.platformFamily}*/}
            {/*    selectedFilters={selectedPlatformFamilies}*/}
            {/*    paramName='platformFamily'*/}
            {/*    handleChange={handleFilterChange}/>*/}
            {/*)}*/}

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
            {isLoading && <TestingLoading/>}
            {games.length === 0 && <TestingNoGames/>}

            <div className="grid grid-cols-2 gap-4">
              {games.map((game: GameOverview) => {
                return (
                  <GameCard key={game.id} gameOverview={game}/>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default GameResultsPage;

const TestingNoGames = () => {
  return (
    <div className="p-4 bg-blue-500/20 border border-accent-300/20 rounded-2xl">
      <h2>No games</h2>
      <p>Add no games message and button to clear filters or change search</p>
    </div>
  )
}

const TestingLoading = () => {
  return (
    <div className="p-4 bg-blue-500/20 border border-accent-300/20 rounded-2xl">
      <h2>Loading games...</h2>
      <p>Add loading message and animation</p>
    </div>
  )
}