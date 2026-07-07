import { Button, Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CaretDownIcon, SlidersIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useSearchParams } from "react-router-dom";

import FilterChip from "../components/FilterChip.tsx";
import Filters from "../components/Filters.tsx";
import GameCard from "../components/GameCard.tsx";
import Modal from "../components/Modal.tsx";
import Pagination from "../components/Pagination.tsx";

import { FilterCategories, LibraryGame, LibraryStatusEnum, SelectOption } from "../types/common.ts";
import useAuth from "../hooks/useAuth.ts";
import useFilterCategories from "../hooks/useFilterCategories.ts";
import useFilterSelections from "../hooks/useFilterSelections.ts";
import useIsMobile from "../hooks/useIsMobile.ts";
import useLibraryResults from "../hooks/useLibraryResults.ts";
import { getCoverUrl } from "../utils/images.ts";
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
  const filterCategories = useFilterCategories('library', Number(userId));

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
    currentlyPlaying, setCurrentlyPlaying,
    libraryCounts, setLibraryCounts,
    libraryTotalCount, setLibraryTotalCount,
    getLibrary
  } = useLibraryResults(Number(userId), limit);

  const handleSortChange = (selectedOption: SelectOption<string>) => {
    const params = new URLSearchParams(searchParams);
    params.set('sorting', String(selectedOption.id));
    params.delete('page');
    setSearchParams(params, { replace: true });
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

  const onStatusUpdate = (gameId: number, prevLibraryStatus: LibraryStatusEnum, newLibraryStatus: LibraryStatusEnum) => {
    setLibraryCounts(prev => prev.map(countEntry => {
      if (countEntry.enum === prevLibraryStatus) return { ...countEntry, count: countEntry.count - 1 };
      if (countEntry.enum === newLibraryStatus) return { ...countEntry, count: countEntry.count + 1 };
      return countEntry;
    }));

    if (prevLibraryStatus === 'PLAYING') {
      setCurrentlyPlaying(prev => (
        prev.filter((game) => game.gameOverview.id !== gameId)
      ));
    }

    if (newLibraryStatus === 'PLAYING') {
      const addedGame = libraryGames.find((game) => game.gameOverview.id === gameId);
      if (addedGame) {
        setCurrentlyPlaying(prev => [ ...prev, addedGame ]);
      }
    }
  }

  const onDelete = (gameId: number, libraryStatus: LibraryStatusEnum) => {
    const newLibraryGames = libraryGames.filter((record: LibraryGame) => record.gameOverview.id !== gameId);
    setLibraryGames(newLibraryGames);

    setCurrentlyPlaying(prev => (
      prev.filter((libraryGame) => libraryGame.gameOverview.id !== gameId)
    ));

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
        void getLibrary();
      }
    }
  }

  const location = useLocation();
  useEffect(() => {
    const el = document.getElementById("library-container");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: "smooth" })
    }
  }, [ location.search ]);

  return (
    <>
      <div className="container px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-16">
        <div className="space-y-4 md:space-y-6 lg:space-y-10">
          <header className="flex items-center gap-4">
            <h1 className="">My Games</h1>
          </header>

          <div className="flex flex-col md:flex-row gap-4 md:gap-10">
            <section className="md:w-1/4 space-y-2">
              <h4>Overview • {libraryTotalCount} Games</h4>
              <ul className="space-y-1">
                {libraryCounts.map(count => {
                  const Icon = LIBRARY_STATUS_ICONS[count.enum];

                  return <li key={count.label} className="flex justify-between gap-2">
                    <span className="flex items-center gap-1.5"><Icon className="text-secondary-100"/> {count.label}</span>
                    <span>{count.count}</span>
                  </li>
                })}
              </ul>
            </section>

            <section className="md:w-3/4 p-4 space-y-4 md:p-6 border border-accent-300/20 rounded-2xl">
              <h2>Currently Playing</h2>
              <div className="grid grid-cols-4 gap-4 md:gap-6">
                {currentlyPlaying.length > 0 ? (
                  currentlyPlaying.map((game: LibraryGame) => (
                    <article key={game.gameOverview.id} className="col-span-1 space-y-2">
                      <img className="w-full rounded-md md:rounded-xl"
                        src={getCoverUrl(game.gameOverview.coverId)}
                        alt={`${game.gameOverview.name} cover`}/>
                    </article>
                  ))
                ) : (
                  <p>Empty state</p>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          <Filters filterCategories={filterCategories}
            selectedFilters={selectedFilters}
            handleFilterChange={handleFilterChange}
            isLibrary={true}
            className="hidden lg:sticky lg:top-4 lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-scroll lg:block lg:col-span-1"/>

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
              <section id="library-container"
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <h2>Library</h2>

                <div className="flex flex-row md:justify-between gap-4">
                  <Field className="grow md:grow-0 flex items-center gap-2">
                    <Label>Sort by:</Label>
                    <Listbox value={selectedSort}
                      onChange={(selectedOption) => handleSortChange(selectedOption)}>
                      <ListboxButton className="grow lg:grow-0 button ghost justify-between">
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

                  <Button onClick={() => setFilterModalOpen(true)} className="button ghost lg:hidden">
                    <SlidersIcon weight="bold"/> <span className="hidden sm:block">Filters</span>
                  </Button>
                </div>
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

              <div className="grid sm:grid-cols-2 gap-4">
                {libraryGames.map((game: LibraryGame) => {
                  const libraryData = {
                    libraryPlatform: game.libraryPlatform,
                    libraryFormat: game.libraryFormat,
                    libraryStatus: game.libraryStatus,
                  }
                  return <GameCard key={game.gameOverview.id}
                    gameOverview={game.gameOverview}
                    showLibraryControls={true}
                    libraryData={libraryData}
                    libraryFormatOptions={filterCategories.libraryFormatControls}
                    libraryStatusOptions={filterCategories.libraryStatus}
                    onDelete={onDelete}
                    onStatusUpdate={onStatusUpdate}/>
                })}

                {/* todo add empty state */}
              </div>

              <div className="flex items-center justify-center">
                {/*todo update results count to be based on filtered results count*/}
                <Pagination itemsPerPage={limit} resultsCount={filteredCount}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryPage;