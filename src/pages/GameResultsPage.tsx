import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { Button, Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import {
  CaretDownIcon, GhostIcon, GridFourIcon, PencilSimpleLineIcon, RowsIcon, SlidersIcon,
} from "@phosphor-icons/react";
import ErrorPage from "../components/ErrorPage.tsx";
import FilterChipBar from "../components/FilterChipBar.tsx";
import Filters from "../components/Filters.tsx";
import GameCard from "../components/GameCard.tsx";
import LoadingGamesMessage from "../components/LoadingGamesMessage.tsx";
import Modal from "../components/Modal.tsx";
import Pagination from "../components/Pagination.tsx";
import StatusMessage from "../components/StatusMessage.tsx";
import useFilterCategories from "../hooks/useFilterCategories.ts";
import useFilterSelections from "../hooks/useFilterSelections.ts";
import useGameResults from "../hooks/useGameResults.ts";
import useIsMobile from "../hooks/useIsMobile.ts";
import { GameOverview, SelectOption } from "../types/common.ts";
import { PLATFORM_FAMILY_BY_SLUG } from "../constants/platforms.ts";
import { useSearchOverlay } from "../context/SearchOverlayContext.tsx";

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

  const { openSearch } = useSearchOverlay();
  const [ searchParams, setSearchParams ] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? undefined;
  const sorting = searchParams.get('sorting');
  const selectedSort = sortOptions.find(option => option.id === sorting) ?? sortOptions[0];
  const limit = 40;

  const isMobile = useIsMobile();
  const { games, resultsCount, isLoading, error } = useGameResults(limit);
  const { error: filterError, ...filterCategories } = useFilterCategories();
  const {
    selectedFilters, committedOrder,
    handleFilterChange, applyFilters, cancelFilters, handleClearAll
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

  const location = useLocation();
  const prevSearch = useRef<string | null>(null);
  useEffect(() => {
    if (prevSearch.current === null || prevSearch.current === location.search) {
      prevSearch.current = location.search;
      return;
    }
    prevSearch.current = location.search;
    const el = document.getElementById("game-results-container");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [ location.search ]);

  if (error || filterError) return <ErrorPage/>;

  const renderGameResults = () => {
    if (isLoading) return <LoadingGamesMessage/>
    if (resultsCount === 0) {
      return (
        <StatusMessage icon={GhostIcon}
          variant="error"
          title="No games found"
          message="Try adjusting your search or  filters to see more games."/>
      )
    }

    return (
      <>
        <div className={`grid gap-4 ${resultsView === 'grid' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
          {games.map((game: GameOverview) => {
            return (
              <GameCard key={game.id} gameOverview={game} variant={resultsView}/>
            )
          })}
        </div>
        {resultsCount !== undefined &&
          <div className="flex items-center justify-center">
            <Pagination resultsCount={resultsCount} itemsPerPage={limit}/>
          </div>
        }
      </>
    )
  }

  return (
    <>
      <div className="container px-4 md:px-10 py-12 md:py-24 space-y-4 md:space-y-16">
        <header className="flex flex-col gap-4">
          <div className="flex items-end md:items-center gap-4">
            <h1 className="">{getTitle()}</h1>

            {searchQuery && (
              <Button onClick={() => openSearch(searchQuery)} className="md:hidden button ghost">
                <PencilSimpleLineIcon weight="bold"/>
                Edit
              </Button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Filters filterCategories={filterCategories}
            selectedFilters={selectedFilters}
            handleFilterChange={handleFilterChange}
            className="hidden lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-scroll lg:block lg:col-span-1"/>

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

          <div className="col-span-2 lg:col-span-3 space-y-4 md:space-y-6">
            <div className="space-y-4">
              <section id="game-results-container" className="flex flex-col lg:flex-row md:justify-between gap-4">
                <div className="hidden md:inline-block">
                  <h2>{resultsCount} results</h2>
                </div>

                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] md:flex md:justify-between items-center gap-4">
                  <Field className="contents md:grow-0 md:flex items-center gap-2">
                    <Label className="shrink-0">Sort by:</Label>
                    <Listbox value={selectedSort}
                      onChange={(selectedOption) => handleSortChange(selectedOption)}
                      as="div">
                      <ListboxButton className="w-full button ghost justify-between">
                        <span className="truncate">{selectedSort?.label}</span>
                        <CaretDownIcon weight="bold" className="shrink-0"/>
                      </ListboxButton>
                      <ListboxOptions anchor="bottom" transition className="dropdown-options primary">
                        {sortOptions.map((option) => {
                          return (
                            <ListboxOption key={option.id} value={option} className="dropdown-option">
                              {option.label}
                            </ListboxOption>
                          )
                        })}
                      </ListboxOptions>
                    </Listbox>
                  </Field>

                  <Button onClick={() => setFilterModalOpen(true)} className="button ghost h-full lg:hidden">
                    <SlidersIcon weight="bold"/> <span className="hidden sm:block">Filters</span>
                  </Button>
                </div>
              </section>

              <FilterChipBar filterCategories={filterCategories}
                committedOrder={committedOrder}
                handleFilterChange={handleFilterChange}
                handleClearAll={handleClearAll}/>

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

            <section className="col-span-2 space-y-8 md:space-y-12">
              {renderGameResults()}
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default GameResultsPage;
