import { useState } from "react";
import { createPortal } from "react-dom";
import Filters from "../components/Filters.tsx";
import GameCard from "../components/GameCard.tsx";
import Modal from "../components/Modal.tsx";
import Pagination from "../components/Pagination.tsx";
import { LibraryGame, LibraryStatusEnum } from "../types/common.ts";
import useAuth from "../hooks/useAuth.tsx";
import useFilterCategories from "../hooks/useFilterCategories.tsx";
import useFilterSelections from "../hooks/useFilterSelections.tsx";
import useIsMobile from "../hooks/useIsMobile.tsx";
import useLibraryResults from "../hooks/useLibraryResults.ts";
import { getCoverUrl } from "../utils/images.ts";
import { LIBRARY_STATUS_ICONS } from "../utils/libraryIcons.ts";

const LibraryPage = () => {
  const limit = 4;
  const { userId } = useAuth();
  const isMobile = useIsMobile();
  const filterCategories = useFilterCategories('library', Number(userId));

  const {
    selectedFilters,
    handleFilterChange, applyFilters, cancelFilters,
  } = useFilterSelections(filterCategories);
  const [ filterModalOpen, setFilterModalOpen ] = useState(false);
  const {
    libraryGames, setLibraryGames,
    filteredCount,
    currentlyPlaying, setCurrentlyPlaying,
    libraryCounts, setLibraryCounts,
    libraryTotalCount, setLibraryTotalCount
  } = useLibraryResults(Number(userId), limit)

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
    setLibraryGames((prev) => (
      prev.filter((record: LibraryGame) => record.gameOverview.id !== gameId)
    ));

    setCurrentlyPlaying(prev => (
      prev.filter((libraryGame) => libraryGame.gameOverview.id !== gameId)
    ));

    setLibraryTotalCount(prev => prev - 1);

    setLibraryCounts(prev => prev.map(category => (
      category.enum === libraryStatus
        ? { ...category, count: category.count - 1 }
        : category
    )));
  }

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <section>
            <Filters filterCategories={filterCategories}
              selectedFilters={selectedFilters}
              handleFilterChange={handleFilterChange}
              isLibrary={true}
              className="hidden md:sticky md:top-4 md:max-h-[calc(100dvh-2rem)] md:overflow-y-scroll md:block md:col-span-1"/>

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
          </section>

          <div className="col-span-2 md:col-span-3 space-y-4 md:space-y-6">
            <section className="space-y-4">
              <h2>Library</h2>
              <div className="grid grid-cols-2 gap-4">
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
              <div>
                {/*todo update results count to be based on filtered results count*/}
                <Pagination itemsPerPage={limit} resultsCount={filteredCount}/>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryPage;