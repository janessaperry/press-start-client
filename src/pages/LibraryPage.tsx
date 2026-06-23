import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth.tsx";
import useFilterCategories from "../hooks/useFilterCategories.tsx";
import { GameOverview, SelectOption } from "../types/common.ts";
import { getCoverUrl } from "../utils/images.ts";
import GameCard from "../components/GameCard.tsx";

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
  const [ libraryGames, setLibraryGames ] = useState([]);
  const [ currentlyPlaying, setCurrentlyPlaying ] = useState([]);
  const [ libraryCounts, setLibraryCounts ] = useState<LibraryCounts[]>([]);
  const [ libraryTotalCount, setLibraryTotalCount ] = useState(0);
  const { libraryStatus = [] } = useFilterCategories();

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
  }, [ userId, libraryStatus ]);


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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              {currentlyPlaying.length > 0 ? (
                currentlyPlaying.map((game: LibraryGame) => (
                  <article key={game.gameOverview.id} className="col-span-1 space-y-2">
                    <img className="w-full rounded-xl"
                      src={getCoverUrl(game.gameOverview.coverId)}
                      alt={`${game.gameOverview.name} cover`}/>

                    <div className="flex">
                      <Listbox value={game.libraryStatus}
                        onChange={(selectedStatus) => console.log(selectedStatus)} by="id">
                        <ListboxButton className="button primary justify-between grow">
                          {game.libraryStatus.label} <CaretDownIcon weight="bold"/>
                        </ListboxButton>

                        <ListboxOptions anchor="bottom end"
                          className="p-2 mt-2 w-(--button-width) text-secondary-900 bg-grey-50 rounded-2xl focus-visible:outline-accent-700">
                          {libraryStatus?.map((item: SelectOption) => (
                            <ListboxOption key={item.id} value={item}
                              className="p-2 data-focus:bg-grey-100 data-selected:font-semibold data-selected:bg-purple-100 rounded-lg cursor-pointer"
                            >
                              {item.label}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </Listbox>
                    </div>
                  </article>
                ))
              ) : (
                <p>Empty state</p>
              )}
            </div>
          </section>
        </div>

        <div>
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
                libraryData={libraryData}/>
            })}
            {/* todo add empty state */}
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryPage;