import { Button, Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CaretDownIcon, GhostIcon, SlidersIcon, TreasureChestIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import ErrorPage from "../components/ErrorPage.tsx";
import FilterChipBar from "../components/FilterChipBar.tsx";
import Filters from "../components/Filters.tsx";
import GameCard from "../components/GameCard.tsx";
import LoadingGamesMessage from "../components/LoadingGamesMessage.tsx";
import Modal from "../components/Modal.tsx";
import Pagination from "../components/Pagination.tsx";
import StatusMessage from "../components/StatusMessage.tsx";
import useAuth from "../hooks/useAuth.ts";
import useFilterCategories from "../hooks/useFilterCategories.ts";
import useFilterSelections from "../hooks/useFilterSelections.ts";
import useIsMobile from "../hooks/useIsMobile.ts";
import useLibraryResults from "../hooks/useLibraryResults.ts";
import { LibraryGame, LibraryStatusEnum, SelectOption } from "../types/common.ts";
import { LIBRARY_STATUS_ICONS } from "../utils/libraryIcons.ts";

const sortOptions = [
  { id: "createdAt-desc", label: "Date Added (newest first)" },
  { id: "createdAt-asc", label: "Date Added (oldest first)" },
  { id: "name-asc", label: "Name (a-z)" },
  { id: "name-desc", label: "Name (z-a)" },
  { id: "releaseDate-desc", label: "Release Date (newest first)" },
  { id: "releaseDate-asc", label: "Release Date (oldest first)" },
];

const LibraryPage = () => {
  const limit = 10;
  const { userId } = useAuth();
  const isMobile = useIsMobile();
  const { error: filterError, ...filterCategories } = useFilterCategories('library', Number(userId));

  const [ searchParams, setSearchParams ] = useSearchParams();
  const sorting = searchParams.get('sorting');
  const selectedSort = sortOptions.find(option => option.id === sorting) ?? sortOptions[0];

  const {
    selectedFilters, committedOrder,
    handleFilterChange, applyFilters, cancelFilters, handleClearAll
  } = useFilterSelections(filterCategories);
  const [ filterModalOpen, setFilterModalOpen ] = useState(false);
  const {
    libraryGames, setLibraryGames,
    filteredCount, setFilteredCount,
    libraryCounts, setLibraryCounts,
    libraryTotalCount, setLibraryTotalCount,
    isLoading, hasLoaded,
    error,
    refetch
  } = useLibraryResults(Number(userId), limit);


  const handleSortChange = (selectedOption: SelectOption<string>) => {
    const params = new URLSearchParams(searchParams);
    params.set('sorting', String(selectedOption.id));
    params.delete('page');
    setSearchParams(params, { replace: true });
  }

  const onStatusUpdate = (prevLibraryStatus: LibraryStatusEnum, newLibraryStatus: LibraryStatusEnum) => {
    setLibraryCounts(prev => prev.map(countEntry => {
      if (countEntry.enum === prevLibraryStatus) return { ...countEntry, count: countEntry.count - 1 };
      if (countEntry.enum === newLibraryStatus) return { ...countEntry, count: countEntry.count + 1 };
      return countEntry;
    }));
  }

  const onDelete = (gameId: number, libraryStatus: LibraryStatusEnum) => {
    const newLibraryGames = libraryGames.filter((record: LibraryGame) => record.gameOverview.id !== gameId);
    setLibraryGames(newLibraryGames);

    setLibraryTotalCount(prev => prev - 1);
    setLibraryCounts(prev => prev.map(category => (
      category.enum === libraryStatus
        ? { ...category, count: category.count - 1 }
        : category
    )));

    const newFilteredCount = filteredCount - 1;
    setFilteredCount(newFilteredCount);

    if (newLibraryGames.length === 0) {
      const newTotalPages = Math.ceil(newFilteredCount / limit);
      const currentPageNum = Number(searchParams.get('page') ?? 1);

      if (currentPageNum > newTotalPages) {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(Math.max(newTotalPages, 1)));
        setSearchParams(params, { replace: true });
      }
      else {
        refetch();
      }
    }
  }

  const location = useLocation();
  const prevSearch = useRef<string | null>(null);
  useEffect(() => {
    if (prevSearch.current === null || prevSearch.current === location.search) {
      prevSearch.current = location.search;
      return;
    }
    prevSearch.current = location.search;
    const el = document.getElementById("library-results-title");
    if (el) {
      el.scrollIntoView(true);
    }
  }, [ location.search ]);

  if (error || filterError) return <ErrorPage/>;

  const renderGameResults = () => {
    if (hasLoaded && libraryTotalCount === 0) {
      return (
        <StatusMessage icon={TreasureChestIcon}
          variant="warning"
          title="Your library is empty"
          message="Explore games and add your first title to get started.">
          <Link to="/explore" className="button primary">Explore games</Link>
        </StatusMessage>
      )
    }
    if (isLoading) return <LoadingGamesMessage/>;

    if (filteredCount === 0) {
      return (
        <StatusMessage icon={GhostIcon}
          variant="error"
          title="No games found"
          message="Try adjusting your filters to see more games."/>
      )
    }

    return (
      <>
        <div className="grid sm:grid-cols-2 gap-4">
          {libraryGames.map((game: LibraryGame) => {
            const libraryData = {
              libraryPlatform: game.libraryPlatform,
              libraryFormat: game.libraryFormat,
              libraryStatus: game.libraryStatus,
            }
            return <GameCard key={game.gameOverview.id} gameOverview={game.gameOverview} layout="row"
              showLibraryControls={true}
              libraryData={libraryData}
              libraryFormatOptions={filterCategories.libraryFormatControls}
              libraryStatusOptions={filterCategories.libraryStatus}
              onDelete={onDelete} onStatusUpdate={onStatusUpdate}/>
          })}
        </div>
        <div className="flex items-center justify-center">
          <Pagination itemsPerPage={limit} resultsCount={filteredCount}/>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="container px-4 md:px-10 py-12 md:py-24 space-y-12 md:space-y-16">
        <div className="space-y-4 md:space-y-6 lg:space-y-10">
          <header>
            <div className="flex items-center justify-between md:justify-start gap-4 md:gap-8">
              <h1>My Games</h1>
              <div className="px-4 py-2 text-accent-300 bg-accent-300/10 flex items-center gap-2 rounded-full">
                <TreasureChestIcon className="icon-sm" weight="fill"/>
                <p className="font-semibold text-sm md:text-base">{libraryTotalCount} games</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
            {libraryCounts.map(count => {
              const Icon = LIBRARY_STATUS_ICONS[count.enum];

              return (
                <div key={count.label} className="flex items-center gap-2">
                  <div className="p-1.5 md:p-2 bg-primary-100/10 rounded-full">
                    <Icon className="text-primary-100 icon-md"/>
                  </div>
                  <div className="leading-none">
                    <p className="md:text-xl font-semibold">{count.count}</p>
                    <p className="text-xs md:text-base text-secondary-100">{count.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Filters filterCategories={filterCategories}
            selectedFilters={selectedFilters}
            handleFilterChange={handleFilterChange}
            isLibrary={true}
            className="hidden lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-scroll lg:block lg:col-span-1"/>

          {isMobile &&
            createPortal(
              <Modal modalOpen={filterModalOpen}
                setModalOpen={setFilterModalOpen}
                handleSubmit={applyFilters}
                handleCancel={cancelFilters}>
                <Filters filterCategories={filterCategories}
                  selectedFilters={selectedFilters}
                  handleFilterChange={handleFilterChange}
                  isLibrary={true}/>
              </Modal>,
              document.body
            )
          }

          <div className="col-span-2 lg:col-span-3 space-y-4 lg:space-y-6">
            <div className="space-y-4">
              <section id="library-results-title"
                className="scroll-mt-28 flex flex-col lg:flex-row md:justify-between gap-4">
                <div className="flex items-baseline justify-between gap-4 lg:block lg:space-y-2">
                  <h2>Library</h2>
                  <h4 className="text-secondary-100">{filteredCount} results</h4>
                </div>

                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] md:flex md:justify-between items-center gap-4">
                  <Field className="contents md:grow-0 md:flex items-center gap-2">
                    <Label className="shrink-0">Sort by:</Label>
                    <Listbox value={selectedSort}
                      onChange={(selectedOption) => handleSortChange(selectedOption)} as="div">
                      <ListboxButton className="w-full button ghost justify-between">
                        <span className="truncate">{selectedSort?.label}</span>
                        <CaretDownIcon weight="bold" className="shrink-0"/>
                      </ListboxButton>
                      <ListboxOptions anchor="bottom" transition className="dropdown-options">
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

              <section className="col-span-2 space-y-8 md:space-y-12">
                {renderGameResults()}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryPage;

