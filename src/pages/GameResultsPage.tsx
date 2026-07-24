import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { Button, Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import {
  CaretDownIcon,
  GhostIcon,
  GridFourIcon,
  PencilSimpleLineIcon,
  RowsIcon,
  SlidersIcon, XIcon
} from "@phosphor-icons/react";
import FilterChipBar from "../components/FilterChipBar.tsx";
import Filters from "../components/Filters.tsx";
import GameCard from "../components/GameCard.tsx";
import LoadingGamesMessage from "../components/LoadingGamesMessage.tsx";
import Modal from "../components/Modal.tsx";
import Pagination from "../components/Pagination.tsx";
import SearchGamesInput from "../components/SearchGamesInput.tsx";
import StatusMessage from "../components/StatusMessage.tsx";
import useFilterCategories from "../hooks/useFilterCategories.ts";
import useFilterSelections from "../hooks/useFilterSelections.ts";
import useGameResults from "../hooks/useGameResults.ts";
import useIsMobile from "../hooks/useIsMobile.ts";
import { GameOverview, SelectOption } from "../types/common.ts";

const PLATFORM_FAMILY_BY_SLUG = {
  playstation: { label: "PlayStation", platformIds: [ 48, 167 ] },
  xbox: { label: "Xbox", platformIds: [ 49, 169 ] },
  pc: { label: "PC", platformIds: [ 3, 14, 6 ] },
  nintendo: { label: "Nintendo", platformIds: [ 130, 508 ] },
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

  const [ showSearchInput, setShowSearchInput ] = useState(false);
  const [ searchParams, setSearchParams ] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? undefined;
  const sorting = searchParams.get('sorting');
  const selectedSort = sortOptions.find(option => option.id === sorting) ?? sortOptions[0];
  const limit = 20;

  const isMobile = useIsMobile();
  const { games, resultsCount, isLoading } = useGameResults(limit);
  const filterCategories = useFilterCategories();
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
    if (showSearchInput) setShowSearchInput(false);
  }, [ location.search ]);

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
          <Pagination resultsCount={resultsCount} itemsPerPage={limit} className="justify-self-center"/>
        }
      </>
    )
  }

  return (
    <>
      <div className="container px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-16">
        <header className="flex flex-col gap-4">
          <div className="flex items-end md:items-center gap-4">
            <h1 className="">{getTitle()}</h1>

            {searchQuery && (
              <Button onClick={() => setShowSearchInput(!showSearchInput)} className="button ghost">
                {showSearchInput ? (
                  <>
                    <XIcon weight="bold"/>
                    Cancel
                  </>
                ) : (
                  <>
                    <PencilSimpleLineIcon weight="bold"/>
                    Edit
                  </>
                )}
              </Button>
            )}

          </div>
          {showSearchInput && (
            <SearchGamesInput className=""/>
          )}
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

            <section className="col-span-2 space-y-4 md:space-y-6">
              {renderGameResults()}
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default GameResultsPage;
