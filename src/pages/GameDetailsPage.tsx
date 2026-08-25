import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CircleIcon } from "@phosphor-icons/react";
import apiClient from "../api/client.ts";
import useAuth from "../hooks/useAuth.ts";
import LibraryControls from "../components/LibraryControls.tsx";
import useFilterCategories from "../hooks/useFilterCategories.ts";
import { GameDetails } from "../types/common";
import { getCoverUrl, getEsrbThumbnailUrl } from "../utils/images";
import { formatTimeToBeat } from "../utils/times.ts";
import NotFoundPage from "./NotFoundPage.tsx";
import ErrorPage from "../components/ErrorPage.tsx";
import ImageCarousel from "../components/ImageCarousel.tsx";
import InfoChipList from "../components/InfoChipList.tsx";
import GameCoverList from "../components/GameCoverList.tsx";
import { BadgeNumber, BadgeText } from "../components/Badge.tsx";

const GameDetailsPage = () => {
  const { gameId } = useParams();
  const { isAuthenticated } = useAuth();
  const [ loading, setLoading ] = useState<boolean>(true);

  const [ gameDetails, setGameDetails ] = useState<GameDetails | null>(null);
  const [ hasRelatedContent, setHasRelatedContent ] = useState<boolean>(false);
  const [ pageError, setPageError ] = useState(false);
  const { libraryStatus, libraryFormatControls } = useFilterCategories('library');

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
      setLoading(true);
      try {
        const response = await apiClient.get(`/games/${gameId}`);
        setGameDetails(response.data.gameDetails);
        window.scrollTo(0, 0);

        const relatedContent = response.data.gameDetails.relatedContent.dlcs.length > 0
          || response.data.gameDetails.relatedContent.expansions.length > 0
          || response.data.gameDetails.franchises.length > 0
          || response.data.gameDetails.collections.length > 0;
        setHasRelatedContent(relatedContent);
      }
      catch {
        setPageError(true);
      }
      finally {
        setLoading(false);
      }
    }

    void fetchGameDetails();
  }, [ gameId ]);

  if (loading) return <GameDetailsSkeleton/>;
  if (pageError) return <ErrorPage/>;
  if (!gameDetails) return <NotFoundPage/>;

  return (
    <>
      <div className="md:px-4 py-6 md:py-20 bg-purple-700">
        <section className="md:container md:mx-auto p-4 md:p-6 lg:p-12 bg-primary-500 flex flex-col md:flex-row gap-6 lg:gap-12 md:rounded-4xl">
          <div className="md:basis-1/4">
            <img src={getCoverUrl(gameDetails.coverId)} alt={`${gameDetails.name} cover art`}
              className="mx-auto rounded-2xl max-w-1/2 w-full md:max-w-none"/>
          </div>

          <div className="md:basis-3/4 space-y-10">
            <div className="flex items-start gap-4 md:gap-8 lg:gap-10">
              <div className="grow space-y-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl">{gameDetails.name}</h1>

                <div className="w-full text-secondary-100 flex items-center gap-x-4 gap-y-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
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

                <figure className={`flex ${gameDetails.esrbDescriptions.length > 0 ? 'items-start' : 'items-center'} gap-2 md:gap-3`}>
                  <img src={getEsrbThumbnailUrl(gameDetails.esrbThumbnailId)}
                    alt={`ESRB Rating: ${gameDetails.esrbRating}`}
                    className="w-6 rounded-xs"/>

                  <figcaption className="leading-none">
                    <p className="text-sm leading-none font-semibold">{gameDetails.esrbRating}</p>
                    {gameDetails.esrbDescriptions.length > 0 && (
                      <span className="text-xs leading-none italic">
                        {gameDetails.esrbDescriptions.join(", ")}
                      </span>
                    )}
                  </figcaption>
                </figure>
              </div>

              <BadgeNumber label={gameDetails.totalRating !== null ? String(Math.round(gameDetails.totalRating)) : 'n/a'}
                size="md"/>
            </div>

            <section className="p-4 md:p-6 -ml-4 -mr-4 md:m-0  bg-primary-300 md:rounded-3xl space-y-4">
              {isAuthenticated ? (
                <LibraryControls gameOverview={gameDetails}
                  libraryData={gameDetails.libraryData ?? undefined}
                  libraryFormatOptions={libraryFormatControls}
                  libraryStatusOptions={libraryStatus}
                  showTitle={true}/>
              ) : (
                <div className="space-y-4">
                  <header className="space-y-2">
                    <h3>Start your game library</h3>
                    <p>
                      Sign up to keep track of the games you own, across every platform and format, all in one place.
                    </p>
                  </header>
                  <div className="flex gap-2">
                    <Link to="/sign-up" className="button primary flex-1 justify-center">Create an account</Link>
                    <Link to="/sign-in" className="button ghost flex-1 justify-center">Sign in</Link>
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>

      <section className="container px-4 md:px-10 py-12 md:py-24 space-y-4">
        <h2>Description</h2>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
          <div className="flex-1 space-y-4">
            {gameDetails.summary !== null ?
              <p className="text-lg whitespace-pre-line">{gameDetails.summary}</p>
              :
              <p>
                No details available yet. Check back later or <a href={`https://igdb.com/games/${gameDetails.slug}`}
                target="_blank" rel="noopener noreferrer" className="link-primary">submit updates to IGDB</a>.
              </p>
            }
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-6">
            <section className="flex-1 space-y-2">
              <h4>Available on</h4>
              {gameDetails.platforms.length > 0 ? (
                <InfoChipList data={gameDetails.platforms} variant="secondary"/>
              ) : (
                <p className="text-secondary-100">TDB</p>
              )}
            </section>

            <section className="flex-1 space-y-2">
              <h4>Genres</h4>
              {gameDetails.genres.length > 0 ? (
                <InfoChipList data={gameDetails.genres} variant="secondary"/>
              ) : (
                <p className="text-secondary-100">TDB</p>
              )}
            </section>
          </div>
        </div>
      </section>

      <div className="container px-4 md:px-10 pb-12 md:pb-20 flex flex-col lg:flex-row gap-12">
        <section className="flex-1 space-y-2">
          <h4>Time to beat</h4>
          {gameDetails.timeToBeat ?
            <>
              <div className="grid grid-cols-3 gap-2">
                {gameDetails.timeToBeat.times.map(time => {
                    return (
                      <div key={time.label}
                        className="col-span-1 p-4 text-primary-50 bg-blue-500 border border-primary-300 flex flex-col items-center justify-end rounded-lg">
                        <p className={`${time.value === null ? 'opacity-50 text-lg' : 'text-2xl font-semibold'}`}>{formatTimeToBeat(time.value)}</p>
                        <p className="text-sm font-bold text-primary-50/80 uppercase">{time.label}</p>
                      </div>)
                  }
                )}
              </div>
              <p className="text-xs italic text-secondary-100">
                Want more accurate results? <a href={`https://igdb.com/games/${gameDetails.slug}`}
                target="_blank" rel="noopener noreferrer" className="link-neutral">Submit updates to
                IGDB</a>.
              </p>
            </>
            :
            <p>
              No details available yet. Check back later or <a href={`https://igdb.com/games/${gameDetails.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-primary">submit updates to IGDB</a>.
            </p>
          }
        </section>

        {hasRelatedContent &&
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-12">
            {gameDetails.collections.length > 0 && (
              <section className="space-y-10">
                <h4 className="mb-2">Series</h4>
                {gameDetails.collections.map(collection => (
                  <div key={collection.id} className="space-y-2">
                    <p className="font-bold">{collection.name}</p>
                    <GameCoverList games={collection.games}/>
                  </div>
                ))}
              </section>
            )}

            {gameDetails.franchises.length > 0 &&
              <section className="space-y-10">
                <h4 className="mb-2">Franchise</h4>
                {gameDetails.franchises.map(franchise => {
                  return (
                    <div key={franchise.id} className="space-y-2">
                      <p className="font-bold">{franchise.name}</p>
                      <GameCoverList games={franchise.games}/>
                    </div>
                  )
                })}
              </section>
            }

            {gameDetails.relatedContent.expansions.length > 0 && (
              <section className="space-y-2">
                <h4>Expansions</h4>
                <div className="flex flex-wrap gap-3">
                  <GameCoverList games={gameDetails.relatedContent.expansions}/>
                </div>
              </section>
            )}

            {gameDetails.relatedContent.dlcs.length > 0 && (
              <section className="space-y-2">
                <h4>DLCs</h4>
                <div className="flex flex-wrap gap-3">
                  <GameCoverList games={gameDetails.relatedContent.dlcs}/>
                </div>
              </section>
            )}
          </div>
        }

        <div className="flex-1 block space-y-12 md:grid md:grid-cols-3 md:gap-6 lg:block">
          <section className="space-y-2">
            <h4>Release date</h4>
            <p>{formatReleaseDate(gameDetails.releaseDate)}</p>
          </section>

          {gameDetails.publishers.length > 0 && (
            <section className="space-y-2">
              <h4>Publishers</h4>
              {gameDetails.publishers.map((publisher, index) => (
                <p key={`game-publisher-${index}`}>{publisher}</p>
              ))}
            </section>
          )}

          {gameDetails.developers.length > 0 && (
            <section className="space-y-2">
              <h4>Developers</h4>
              {gameDetails.developers.map((developer, index) => (
                <p key={`game-developer-${index}`}>{developer}</p>
              ))}
            </section>
          )}

          {gameDetails.gameType.id !== 0 && (
            <section className="space-y-2">
              <BadgeText label={gameDetails.gameType.label}/>

              {gameDetails.baseGame &&
                <div className="flex items-center gap-4">
                  <Link to={`/game/${gameDetails.baseGame.id}/${gameDetails.baseGame.slug}`}>
                    <img className="max-w-16 rounded-sm"
                      src={getCoverUrl(gameDetails.baseGame.coverId, "cover_small")}
                      alt={`${gameDetails.baseGame.name} cover art`}
                      loading="lazy"/>
                  </Link>

                  <div className="space-y-1">
                    <p className="text-sm uppercase text-secondary-100">Main Game</p>
                    <p>{gameDetails.baseGame.name}</p>
                  </div>
                </div>
              }
            </section>
          )}
        </div>
      </div>

      {gameDetails.screenshotIds.length > 0 &&
        <section className="container px-4 md:px-10 pb-12 md:pb-20 space-y-4 md:space-y-6">
          <h4>Screenshots</h4>
          <ImageCarousel gameTitle={gameDetails.name} imageIds={gameDetails.screenshotIds}/>
        </section>
      }
    </>
  )
}

export default GameDetailsPage;

const GameDetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="md:px-4 py-10 md:py-20 bg-purple-700 md:h-[70vh]">
        <section className="md:container md:mx-auto p-4 md:p-12 bg-primary-500/60 flex flex-col md:flex-row gap-6 md:gap-12 md:rounded-4xl md:h-full">
          <div className="md:basis-1/4 shrink-0 flex flex-col items-stretch gap-6">
            <div className="bg-purple-700/60 aspect-3/4 self-center rounded-2xl max-w-1/2 w-full md:max-w-none"></div>

            <div className="flex gap-2 w-full h-12 rounded-xl">
              <div className="bg-purple-700/60 w-16 aspect-3/4 rounded-lg"></div>
              <div className="grow flex flex-col gap-2">
                <div className="bg-secondary-100/40 w-1/3 h-3 rounded-full"/>
                <div className="bg-secondary-100/40 w-1/6 h-3 rounded-full"/>
              </div>
            </div>
          </div>
          <div className="md:basis-3/4 shrink-0 flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <div className="bg-secondary-100/40 w-full h-8 rounded-full"/>
              <div className="bg-secondary-100/40 w-1/4 h-8 rounded-full"/>
            </div>
            <div className="bg-purple-300/60 w-full grow rounded-xl"></div>
          </div>
        </section>
      </div>
    </div>
  )
}