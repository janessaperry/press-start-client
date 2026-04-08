import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Button, Field, Label,
  Listbox, ListboxButton, ListboxOption, ListboxOptions,
} from "@headlessui/react";
import { CaretDownIcon, GridFourIcon, PencilSimpleLineIcon, RowsIcon, SlidersIcon } from "@phosphor-icons/react";

import GameCard, { GameOverview } from "../components/GameCard.tsx";
import FilterCategory from "../components/FilterCategory.tsx";
import FilterChip from "../components/FilterChip.tsx";
import Pagination from "../components/Pagination.tsx";

import useFilterCategories from "../hooks/useFilterCategories.tsx";
import useFilterSelections from "../hooks/useFilterSelections.tsx";
import useGameResults from "../hooks/useGameResults.tsx";

const PLATFORM_FAMILY_BY_SLUG = {
  playstation: { label: "PlayStation", platformIds: [ 48, 167 ] },
  xbox: { label: "Xbox", platformIds: [ 49, 169 ] },
  pc: { label: "PC", platformIds: [ 3, 14, 6 ] },
  nintendo: { label: "Nintendo", platformIds: [ 130, 508 ] },
}

type SelectOption<T extends string | number = number> = {
  id: T,
  label: string,
}

type FilterCategories = {
  platformFamily?: SelectOption[],
  platform?: SelectOption[],
  genres?: SelectOption[],
  timeToBeat?: SelectOption[],
  totalRating?: SelectOption[]
  releaseDate?: SelectOption[]
}

const sortOptions = [
  { id: "createdAt-desc", label: "Recently Added" },
  { id: "name-asc", label: "Name (a-z)" },
  { id: "name-desc", label: "Name (z-a)" },
  { id: "releaseDate-desc", label: "Release Date (newest first)" },
  { id: "releaseDate-asc", label: "Release Date (oldest first)" },
];

const GameResultsPage = () => {
  const { platformFamilySlug } = useParams();
  const platformFamily = PLATFORM_FAMILY_BY_SLUG[platformFamilySlug as keyof typeof PLATFORM_FAMILY_BY_SLUG];

  const [ searchParams, setSearchParams ] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? undefined;
  const sorting = searchParams.get('sorting');
  const selectedSort = sortOptions.find(option => option.id === sorting) ?? sortOptions[0];
  const selectedPlatforms = searchParams.get('platform')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedGenres = searchParams.get('genres')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedTimeToBeat = searchParams.get('timeToBeat')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedTotalRating = searchParams.get('totalRating')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedReleaseDate = searchParams.get('releaseDate')?.split(',').map(id => Number(id.trim())) ?? [];
  const limit = 20;

  const { games, resultsCount, isLoading } = useGameResults();
  const filterCategories = useFilterCategories();
  const {
    selectedPlatforms,
    selectedGenres,
    selectedTimeToBeat,
    selectedTotalRating,
    selectedReleaseDate,
    filterChips,
    handleFilterChange,
    handleClearAll
  } = useFilterSelections();
  const [ resultsView, setResultsView ] = useState<'rows' | 'grid'>('rows');

  console.log("useGameResults hook", games, resultsCount, isLoading)

  useEffect(() => {
    const getFilterCategories = async () => {
      const response = await axios.get(`${baseServerUrl}/filters`);
      const filtersData = response.data;
      let platformFilters = filtersData.platform;

      if (platformFamily) {
        platformFilters = platformFilters.filter((p: SelectOption) => platformFamily.platformIds.includes(p.id));
      }
      setFilterCategories({ ...filtersData, platform: platformFilters });
    }

    void getFilterCategories();
  }, [ platformFamily ]);


  const handleFilterChange = (compoundId: string) => {
    const [ category, id ] = compoundId.split('-')

    const params = new URLSearchParams(searchParams);
    const current = params.get(category)?.split(',').filter(Boolean) ?? [];
    const updated = current.includes(String(id)) ? current.filter(s => s !== String(id)) : [ ...current, String(id) ];
    if (updated.length === 0) {
      params.delete(category);
    }
    else {
      params.set(category, updated.toString());
    }
    params.delete('page');
    setSearchParams(params, { replace: true });
  }

  const filterChips: SelectOption<string>[] = useMemo(() => {
    const selectedFilters = new Set<SelectOption<string>>();

    for (const [ key, valueString ] of searchParams.entries()) {
      valueString.split(",").forEach(value => {
        const compoundId = `${key}-${value}`;
        const category: SelectOption[] | undefined = filterCategories[key as keyof FilterCategories];
        const foundFilter = category?.find((filterItem) => filterItem.id === Number(value));

        if (foundFilter) {
          selectedFilters.add({ id: compoundId, label: foundFilter.label })
        }
      });
    }

    return [ ...selectedFilters ];
  }, [ filterCategories, searchParams ]);

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('platform');
    params.delete('genres');
    params.delete('timeToBeat');
    params.delete('totalRating');
    params.delete('releaseDate');
    setSearchParams(params, { replace: true })
  }

  const handleSortChange = (selectedOption: SelectOption<string>) => {
    const params = new URLSearchParams(searchParams);
    params.set('sorting', String(selectedOption.id));
    params.delete('page');
    setSearchParams(params, { replace: true });
  }

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <section className="hidden md:sticky md:top-4 md:max-h-[calc(100dvh-2rem)] md:overflow-y-scroll md:block md:col-span-1 p-4 bg-blue-500/50 border border-accent-300/20 rounded-2xl space-y-4 md:space-y-6 scrollbar-on-dark">
            <h4>Filters</h4>
            {/*{filterCategories.gameType && (*/}
            {/*  <FilterCategory title="Console"*/}
            {/*    filters={filterCategories.platform}*/}
            {/*    selectedFilters={selectedPlatforms}*/}
            {/*    paramName='platform'*/}
            {/*    handleChange={handleFilterChange}/>*/}
            {/*)}*/}

            {filterCategories.platform && (
              <FilterCategory title="Console"
                filters={filterCategories.platform}
                selectedFilters={selectedPlatforms}
                paramName='platform'
                handleChange={handleFilterChange}/>
            )}

            {filterCategories.releaseDate && (
              <FilterCategory title="Release Date"
                filters={filterCategories.releaseDate}
                selectedFilters={selectedReleaseDate}
                paramName='releaseDate'
                handleChange={handleFilterChange}/>
            )}

            {filterCategories.totalRating && (
              <FilterCategory title="Rating"
                filters={filterCategories.totalRating}
                selectedFilters={selectedTotalRating}
                paramName='totalRating'
                handleChange={handleFilterChange}/>
            )}

            {filterCategories.genres && (
              <FilterCategory title="Genres"
                filters={filterCategories.genres}
                selectedFilters={selectedGenres}
                paramName='genres'
                handleChange={handleFilterChange}/>
            )}

            {filterCategories.timeToBeat && (
              <FilterCategory title="Time to Beat" description="Based on 'normal' times."
                filters={filterCategories.timeToBeat}
                selectedFilters={selectedTimeToBeat}
                paramName='timeToBeat'
                handleChange={handleFilterChange}/>
            )}
          </section>


          <div className="col-span-2 md:col-span-3 space-y-4 md:space-y-6">
            <div className="space-y-4">
              <section className="flex md:justify-between gap-4">
                <div className="hidden md:block">
                  <h2>{resultsCount} results</h2>
                </div>

                <Field className="grow md:grow-0 flex items-center gap-2">
                  <Label>Sort by:</Label>
                  <Listbox value={selectedSort}
                    onChange={(selectedOption) => handleSortChange(selectedOption)}>
                    <ListboxButton className="grow md:grow-0 button ghost justify-between">
                      {selectedSort?.label}
                      <CaretDownIcon weight="bold"/>
                    </ListboxButton>
                    <ListboxOptions anchor="bottom" transition className="dropdown-options primary">
                      {sortOptions.map((option) => {
                        return (
                          <ListboxOption key={option.id} value={option} className="dropdown-option ">
                            {option.label}
                          </ListboxOption>
                        )
                      })}
                    </ListboxOptions>
                  </Listbox>
                </Field>

                <Button onClick={() => console.log("open filters on mobile")} className="button ghost md:hidden">
                  <SlidersIcon weight="bold"/>Filters
                </Button>
              </section>

              <section className={`grid ${filterChips.length > 0 ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"} transition-[grid-template-rows] duration-250`}>
                <div className="overflow-hidden min-h-0">
                  <h3 className="sr-only">Selected Filters</h3>
                  <div className="p-4 bg-blue-500 border border-accent-300/20 rounded-2xl">
                    <ul className="flex gap-3 flex-wrap">
                      {filterChips?.map(filter => (
                        <FilterChip key={filter.id}
                          chipId={filter.id}
                          label={filter.label}
                          handleChange={handleFilterChange}/>
                      ))}
                      <li>
                        <button onClick={handleClearAll} className="py-1 px-3 button danger">
                          Clear all
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="flex items-center justify-between md:hidden">
                <h2>{resultsCount} results</h2>

                <div role="group"
                  aria-label="View"
                  className="flex items-stretch border border-accent-300/20 rounded-lg overflow-hidden">
                  <button className={`p-1 aria-pressed:bg-accent-500/50`}
                    onClick={() => setResultsView('grid')} aria-pressed={resultsView === 'grid'}>
                    <GridFourIcon size={24}/>
                  </button>
                  <button className={`p-1 aria-pressed:bg-accent-500/50`}
                    onClick={() => setResultsView('rows')} aria-pressed={resultsView === 'rows'}>
                    <RowsIcon size={24}/>
                  </button>
                </div>
              </section>
            </div>

            <section className="col-span-2 space-y-4 md:space-y-6">
              {isLoading && <TestingLoading/>}
              {!isLoading && games?.length === 0 && <TestingNoGames/>}

              {!isLoading &&
                <div className="grid grid-cols-2 gap-4">
                  {games.map((game: GameOverview) => {
                    return (
                      <GameCard key={game.id} gameOverview={game}/>
                    )
                  })}
                </div>
              }

              {resultsCount !== undefined &&
                <Pagination resultsCount={resultsCount} itemsPerPage={limit} className="justify-self-center"/>
              }
            </section>
          </div>
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