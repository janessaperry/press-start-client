import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ArrowRightIcon, CaretDownIcon, CircleIcon } from "@phosphor-icons/react";
import InfoChipList from "../components/InfoChipList.tsx";
import { BadgeNumber, BadgeText } from "../components/Badge.tsx";
import { NO_COVER_PLACEHOLDER_URL } from "../constants/placeholders.ts";

type ListboxOption = {
  id: number,
  label: string
}

type GameDetails = {
  id: number,
  name: string,
  coverUrl: string | null,
  releaseDate: string | null,
  slug: string,
  summary: string[],
  totalRating: number | null,
  gameType: {
    id: number,
    label: string
  },
  developers: string[],
  publishers: string[],
  esrbRating: string,
  esrbThumbnailUrl: string,
  esrbDescriptions: string[],
  platforms: {
    id: number,
    label: string,
  }[],
  genres: ListboxOption[],
  baseGame: {
    id: number,
    name: string,
    slug: string,
    coverUrl: string
  },
  relatedContent: {
    expansions: {
      id: number,
      name: string,
      coverUrl: string | null,
      slug: string
    }[],
    dlcs: {
      id: number,
      name: string,
      coverUrl: string | null,
      slug: string
    }[]
  }
}

const formats = [
  {id: 1, label: "Digital"},
  {id: 2, label: "Physical"},
]

const baseServerUrl = import.meta.env.VITE_SERVER_URL;

const GameDetailsPage = () => {
  const {gameId} = useParams();

  const [selectedPlatform, setSelectedPlatform] = useState<ListboxOption>({id: 0, label: "Select a console"});
  const [selectedFormat, setSelectedFormat] = useState<ListboxOption>({id: 0, label: "Select a format"});
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);

  function formatReleaseDate (dateIso: string | null): string {
    if (!dateIso) return 'Release date unknown';
    return new Date(dateIso).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatReleaseYear (dateIso: string | null): string {
    if (!dateIso) return 'Release date unknown';
    return new Date(dateIso).getFullYear().toString();
  }

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`${baseServerUrl}/games/${gameId}`);
        setGameDetails(response.data.gameDetails);
        console.log(response.data);
      }
      catch (e) {
        console.error(e)
      }
    }

    void fetchGameDetails();
  }, [gameId]);

  if (!gameDetails) return <GameDetailsSkeleton/>;

  return (
    <>
      <div className="px-4 py-20 bg-purple-700">
        <section className="container p-12 bg-primary-500 flex gap-12 rounded-4xl">
          <div className="basis-1/4 flex flex-col gap-6">
            <img src={gameDetails.coverUrl || NO_COVER_PLACEHOLDER_URL}
              alt={`${gameDetails.name} cover art`}
              className="rounded-2xl"/>

            <figure className="flex items-start gap-3">
              <img src={gameDetails.esrbThumbnailUrl}
                alt={`ESRB Rating: ${gameDetails.esrbRating}`}
                className="w-10 rounded-xs"/>
              <figcaption className="leading-none space-y-1">
                <p className="font-semibold">{gameDetails.esrbRating}</p>

                {gameDetails.esrbDescriptions &&
                  <span className="text-sm italic">
                    {gameDetails.esrbDescriptions.join(", ")}
                  </span>
                }
              </figcaption>
            </figure>
          </div>

          <div className="basis-3/4 space-y-10">
            <div className="flex items-start gap-10">
              <div className="grow space-y-3">
                <h1>{gameDetails.name}</h1>


                <div className="text-secondary-100 flex items-center gap-2">
                  {gameDetails.publishers.length > 0 && (
                    <>
                      <p>{gameDetails.publishers[0]}</p>
                      <CircleIcon weight="fill" size="6"/>
                    </>
                  )}
                  <p>{formatReleaseYear(gameDetails.releaseDate)}</p>
                </div>

                {gameDetails.gameType.id !== 0 && (
                  <BadgeText label={gameDetails.gameType.label}/>
                )}
              </div>

              <BadgeNumber
                label={gameDetails.totalRating !== null ? String(Math.round(gameDetails.totalRating)) : 'n/a'}
                size="md"/>
            </div>

            <section className="p-6 bg-primary-300 rounded-3xl space-y-4">
              <header className="space-y-4">
                <h2>Add to / Manage collection</h2>
                <p className="text-sm italic">Select the console and format you own the game in and add to you
                  collection, or just add it to your wishlist.
                </p>
              </header>

              <form className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <Listbox
                    value={selectedPlatform}
                    onChange={setSelectedPlatform}
                    by="id"
                  >
                    <ListboxButton className="flex-1 ghost justify-between">
                      {selectedPlatform.label} <CaretDownIcon weight="bold"/>
                    </ListboxButton>

                    <ListboxOptions anchor="bottom end"
                      className="p-2 mt-2 w-(--button-width) text-secondary-900 bg-grey-50 rounded-2xl focus-visible:outline-accent-700">
                      {gameDetails.platforms.map((item) => (
                        <ListboxOption
                          key={item.id}
                          value={item}
                          className="p-2 data-focus:bg-grey-100 data-selected:font-semibold data-selected:bg-purple-100 rounded-lg"
                        >
                          {item.label}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Listbox>

                  <Listbox
                    value={selectedFormat}
                    onChange={setSelectedFormat}
                    by="id"
                  >
                    <ListboxButton className="flex-1 ghost justify-between">
                      {selectedFormat.label} <CaretDownIcon weight="bold"/>
                    </ListboxButton>

                    <ListboxOptions anchor="bottom end"
                      className="p-2 mt-2 w-(--button-width) text-secondary-900 bg-grey-50 rounded-2xl focus-visible:outline-accent-700">
                      {formats.map((item: ListboxOption) => (
                        <ListboxOption
                          key={item.id}
                          value={item}
                          className="p-2 data-focus:bg-grey-100 data-selected:font-semibold data-selected:bg-purple-100 rounded-lg"
                        >
                          {item.label}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Listbox>
                </div>

                <Button>Add Game</Button>
              </form>
            </section>
          </div>
        </section>
      </div>

      <section className="container px-10 pt-24 pb-12 space-y-6">
        <h2>Description</h2>

        <div className="flex gap-12">
          <div className="flex-1 space-y-4">
            {gameDetails.summary.length > 0 ?
              gameDetails.summary.map((p, i) => (
                <p key={`game-details-${i}`} className="text-lg">{p}</p>
              ))
              :
              <p>
                No details available yet. Check back later or <a href={`https://igdb.com/games/${gameDetails.slug}`}
                target="_blank" rel="noopener noreferrer">submit updates to IGDB</a>.
              </p>
            }
          </div>

          <div className="flex-1 flex gap-6">
            <section className="flex-1 space-y-2">
              <h3>Available on</h3>
              <InfoChipList data={gameDetails.platforms} variant="secondary"/>
            </section>

            <section className="flex-1 space-y-2">
              <h3>Genres</h3>
              <InfoChipList data={gameDetails.genres} variant="secondary"/>
            </section>
          </div>
        </div>
      </section>

      <div className="container px-10 pb-20 flex gap-12">
        <section className="flex-1 space-y-4">
          <h4>Time to beat</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1 p-4 text-primary-50 bg-accent-700 flex flex-col items-center justify-center rounded-lg">
              <p className="text-2xl font-semibold">90H</p>
              <p className="text-sm font-semibold text-primary-50/80 uppercase">Hastily</p>
            </div>

            <div className="col-span-1 p-4 text-primary-50 bg-accent-700 flex flex-col items-center justify-center rounded-lg">
              <p className="text-2xl font-semibold">90H</p>
              <p className="text-sm font-semibold text-primary-50/80 uppercase">Normally</p>
            </div>

            <div className="col-span-1 p-4 text-primary-50 bg-accent-700 flex flex-col items-center justify-center rounded-lg">
              <p className="text-2xl font-semibold">90H</p>
              <p className="text-sm font-semibold text-primary-50/80 uppercase">Completely</p>
            </div>
          </div>
        </section>

        <div className="flex-1 space-y-12">
          <section>
            <h4>Series</h4>
            <div className="">
              <p>The Witcher <ArrowRightIcon/></p>
              <div>image row</div>
            </div>
          </section>

          <section>
            <h4>Franchise</h4>
            <div className="">
              <p>The Witcher <ArrowRightIcon/></p>
              <div>image row</div>
            </div>
          </section>

          {gameDetails.relatedContent.expansions.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <h4>Expansions</h4>
                <ArrowRightIcon className="icon-sm"/>
              </div>

              <div className="flex flex-wrap gap-3">
                {gameDetails.relatedContent.expansions.map(game => (
                  <Link key={`expansion-${game.id}`} to={`/game/${game.id}/${game.slug}`}>
                    <img className="max-w-16 rounded-sm"
                      src={game.coverUrl || NO_COVER_PLACEHOLDER_URL}
                      alt={`${game.name} cover`}/>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {gameDetails.relatedContent.dlcs.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <h4>DLCs</h4>
                <ArrowRightIcon className="icon-sm"/>
              </div>

              <div className="flex flex-wrap gap-3">
                {gameDetails.relatedContent.dlcs.map(game => (
                  <Link key={`dlc-${game.id}`} to={`/game/${game.id}/${game.slug}`}>
                    <img className="max-w-16 rounded-sm"
                      src={game.coverUrl || NO_COVER_PLACEHOLDER_URL}
                      alt={`${game.name} cover`}/>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex-1 space-y-12">
          <section className="space-y-3">
            <h4>Release date</h4>
            <p>{formatReleaseDate(gameDetails.releaseDate)}</p>
          </section>

          {gameDetails.publishers.length > 0 && (
            <section className="space-y-3">
              <h4>Publishers</h4>
              {gameDetails.publishers.map((publisher, index) => (
                <p key={`game-publisher-${index}`}>{publisher}</p>
              ))}
            </section>
          )}

          {gameDetails.developers.length > 0 && (
            <section className="space-y-3">
              <h4>Developers</h4>
              {gameDetails.developers.map((developer, index) => (
                <p key={`game-developer-${index}`}>{developer}</p>
              ))}
            </section>
          )}

          {gameDetails.gameType.id !== 0 && (
            <section className="space-y-3">
              <BadgeText label={gameDetails.gameType.label}/>

              {gameDetails.baseGame &&
                <div className="flex items-center gap-4">
                  <Link to={`/game/${gameDetails.baseGame.id}/${gameDetails.baseGame.slug}`}>
                    <img className="max-w-16 rounded-sm"
                      src={gameDetails.baseGame.coverUrl}
                      alt={`${gameDetails.baseGame.name} cover`}/>
                  </Link>

                  <div className="space-y-1">
                    <p className="text-sm uppercase text-primary-100">Main Game</p>
                    <p className="font-bold text-primary-100">{gameDetails.baseGame.name}</p>
                  </div>
                </div>
              }
            </section>
          )}
        </div>
      </div>
    </>
  )
}

export default GameDetailsPage;

const GameDetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="px-4 py-20 bg-purple-700">
        <section className="container p-12 bg-primary-500 flex gap-12 rounded-4xl">
          {/* skeleton content */}
        </section>
      </div>
    </div>
  )
}