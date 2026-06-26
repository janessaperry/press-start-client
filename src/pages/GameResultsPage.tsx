import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CaretDownIcon, GridFourIcon, PencilSimpleLineIcon, RowsIcon, SlidersIcon } from "@phosphor-icons/react";
import Filters from "../components/Filters.tsx";
import GameCard from "../components/GameCard.tsx";
import FilterChip from "../components/FilterChip.tsx";
import Modal from "../components/Modal.tsx";
import Pagination from "../components/Pagination.tsx";
import useFilterCategories from "../hooks/useFilterCategories.tsx";
import useFilterSelections from "../hooks/useFilterSelections.tsx";
import useGameResults from "../hooks/useGameResults.tsx";
import useIsMobile from "../hooks/useIsMobile.tsx";
import { FilterCategories, GameOverview } from "../types/common.ts";

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
  const limit = 20;

  const isMobile = useIsMobile();
  const { games, resultsCount, isLoading } = useGameResults(limit);
  const filterCategories = useFilterCategories();
  const {
    selectedFilters,
    committedOrder,
    handleFilterChange,
    applyFilters,
    cancelFilters,
    handleClearAll
  } = useFilterSelections(filterCategories);
  const [ filterModalOpen, setFilterModalOpen ] = useState(false);
  const [ resultsView, setResultsView ] = useState<'row' | 'grid'>('row');

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

  const filterChips: SelectOption<string>[] = useMemo(() => {
    const chips = new Set<SelectOption<string>>();

    for (let i = 0; i < committedOrder.length; i++) {
      const currentId = committedOrder[i];
      const [ category, value ] = currentId.split('-');
      const categoryOptions: SelectOption[] | undefined = filterCategories[category as keyof FilterCategories];

      const foundFilter = categoryOptions?.find((option) => option.id === Number(value));
      if (foundFilter) {
        chips.add({ id: committedOrder[i], label: foundFilter.label })
      }
    }
    return [ ...chips ];
  }, [ filterCategories, committedOrder ]);

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
          <Filters filterCategories={filterCategories}
            selectedFilters={selectedFilters}
            handleFilterChange={handleFilterChange}
            className="hidden md:sticky md:top-4 md:max-h-[calc(100dvh-2rem)] md:overflow-y-scroll md:block md:col-span-1"/>

          {isMobile &&
            createPortal(
              <Modal modalOpen={filterModalOpen}
                setModalOpen={setFilterModalOpen}
                handleSubmit={applyFilters}
                handleCancel={cancelFilters}>
                <Filters filterCategories={filterCategories}
                  selectedFilters={selectedFilters}
                  handleFilterChange={handleFilterChange}/>
              </Modal>,
              document.body
            )
          }

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

                <Button onClick={() => setFilterModalOpen(true)} className="button ghost md:hidden">
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
                    onClick={() => setResultsView('row')} aria-pressed={resultsView === 'row'}>
                    <RowsIcon size={24}/>
                  </button>
                </div>
              </section>
            </div>

            <section className="col-span-2 space-y-4 md:space-y-6">
              {isLoading && <TestingLoading/>}
              {!isLoading && games?.length === 0 && <TestingNoGames/>}

              {!isLoading &&
                <div className={`grid gap-4 ${resultsView === 'grid' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {games.map((game: GameOverview) => {
                    return (
                      <GameCard key={game.id} gameOverview={game} variant={resultsView}/>
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