import axios from "axios";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Filters from "../components/Filters.tsx";
import GameCard from "../components/GameCard.tsx";
import Modal from "../components/Modal.tsx";
import useAuth from "../hooks/useAuth.tsx";
import useFilterCategories from "../hooks/useFilterCategories.tsx";
import useFilterSelections from "../hooks/useFilterSelections.tsx";
import useIsMobile from "../hooks/useIsMobile.tsx";
import { GameOverview, SelectOption } from "../types/common.ts";
import { getCoverUrl } from "../utils/images.ts";

type LibraryStatusEnum = 'WANT_TO_PLAY' | 'PLAYING' | 'PLAYED' | 'ON_PAUSE' | 'WISHLIST';
type LibraryFormatEnum = 'DIGITAL' | 'PHYSICAL';
type LibraryGame = {
  libraryStatus: SelectOption & { enum: LibraryStatusEnum };
  libraryFormat: SelectOption & { enum: LibraryFormatEnum };
  libraryPlatform: SelectOption;
  gameOverview: GameOverview;
}
type LibraryCounts = {
  label: string;
  count: number;
}

const baseServerUrl = import.meta.env.VITE_SERVER_URL;

const LibraryPage = () => {
  const { userId } = useAuth();
  const isMobile = useIsMobile();
  const { libraryFormat, libraryStatus } = useFilterCategories('library', Number(userId));

  const {
    selectedFilters,
    handleFilterChange,
    applyFilters,
    cancelFilters,
  } = useFilterSelections();
  const [ filterModalOpen, setFilterModalOpen ] = useState(false);

  const [ libraryGames, setLibraryGames ] = useState<LibraryGame[]>([]);
  const [ currentlyPlaying, setCurrentlyPlaying ] = useState<LibraryGame[]>([]);
  const [ libraryCounts, setLibraryCounts ] = useState<LibraryCounts[]>([]);
  const [ libraryTotalCount, setLibraryTotalCount ] = useState(0);

  useEffect(() => {
    const getLibrary = async () => {
      const response = await axios.get(`${baseServerUrl}/users/${userId}/library`);
      const libraryGames = response.data.library;
      setLibraryGames(libraryGames);

      const playing = libraryGames.filter((game: LibraryGame) => game.libraryStatus?.enum === 'PLAYING');
      setCurrentlyPlaying(playing);

      setLibraryCounts(response.data.libraryStatusCounts);
      setLibraryTotalCount(response.data.libraryTotalCount)
    }

    void getLibrary();
  }, [ userId ]);

  // todo refactor to use enum instead of label
  const onStatusUpdate = (gameId: number, prevLibraryStatus: string, newLibraryStatus: string) => {
    setLibraryCounts(prev => prev.map(countEntry => {
      if (countEntry.label === prevLibraryStatus) return { ...countEntry, count: countEntry.count - 1 };
      if (countEntry.label === newLibraryStatus) return { ...countEntry, count: countEntry.count + 1 };
      return countEntry;
    }));

    if (prevLibraryStatus === 'Playing') {
      setCurrentlyPlaying(prev => (
        prev.filter((game) => game.gameOverview.id !== gameId)
      ));
    }

    if (newLibraryStatus === 'Playing') {
      const addedGame = libraryGames.find((game) => game.gameOverview.id === gameId);
      if (addedGame) {
        setCurrentlyPlaying(prev => [ ...prev, addedGame ]);
      }
    }
  }

  const onDelete = (gameId: number, libraryStatus: string) => {
    setLibraryGames((prev) => (
      prev.filter((record: LibraryGame) => record.gameOverview.id !== gameId)
    ));

    setCurrentlyPlaying(prev => (
      prev.filter((libraryGame) => libraryGame.gameOverview.id !== gameId)
    ));

    setLibraryTotalCount(prev => prev - 1);

    setLibraryCounts(prev => prev.map(category => (
      category.label === libraryStatus
        ? { ...category, count: category.count - 1 }
        : category
    )));
  }

  return (
    <>
      <div className="container px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-16">
        <header className="flex items-center gap-4">
          <h1 className="">My Games</h1>
        </header>

        <div className="flex flex-col md:flex-row gap-4 md:gap-10">
          <section className="md:w-1/4">
            <h4>My Library • {libraryTotalCount} Games</h4>
            <ul>
              {libraryCounts.map(count => (
                <li key={count.label} className="flex justify-between gap-4">
                  <span>{count.label}</span>
                  <span>{count.count}</span>
                </li>
              ))}
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <section>
            <Filters selectedFilters={selectedFilters} handleFilterChange={handleFilterChange}
              className="hidden md:sticky md:top-4 md:max-h-[calc(100dvh-2rem)] md:overflow-y-scroll md:block md:col-span-1"/>
            {isMobile &&
              createPortal(
                <Modal modalOpen={filterModalOpen}
                  setModalOpen={setFilterModalOpen}
                  handleSubmit={applyFilters}
                  handleCancel={cancelFilters}>
                  <Filters selectedFilters={selectedFilters} handleFilterChange={handleFilterChange}/>
                </Modal>,
                document.body
              )
            }
          </section>

          <div className="col-span-2 md:col-span-3 space-y-4 md:space-y-6">
            <section>
              <h2>My Games</h2>
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
                    libraryFormatOptions={libraryFormat}
                    libraryStatusOptions={libraryStatus}
                    onDelete={onDelete}
                    onStatusUpdate={onStatusUpdate}/>
                })}

                {/* todo add empty state */}
              </div>
            </section>
          </div>

        </div>
      </div>
    </>
  );
};

export default LibraryPage;