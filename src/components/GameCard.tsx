import { ComponentProps } from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon, GameControllerIcon } from "@phosphor-icons/react";
import { GameOverview, LibraryStatusEnum, SelectOption } from "../types/common";
import { formatTimeToBeat } from "../utils/times.ts";
import { getCoverUrl } from "../utils/images.ts";
import { BadgeNumber, BadgeText } from "./Badge.tsx";
import InfoChipList from "./InfoChipList.tsx";
import LibraryControls from "./LibraryControls.tsx";

const showGameTypeBadge: Record<number, boolean> = {
  0: false, // Main Game
  1: true, // DLC
  2: true, // Expansion
  3: true, // Bundle
  4: true, // Expansion
  8: true, // Remake
  9: true, // Remaster
  10: true, // Expansion
  11: true, // Port
}

type GameCardProps = {
  gameOverview: GameOverview;
  layout: 'grid' | 'row';
  focusable?: boolean;
  inCarousel?: boolean;
  showLibraryControls?: boolean;
  libraryData?: {
    libraryPlatform: SelectOption;
    libraryFormat: SelectOption;
    libraryStatus: SelectOption;
  },
  libraryFormatOptions?: SelectOption[];
  libraryStatusOptions?: SelectOption[];
  onDelete?: (gameId: number, libraryStatus: LibraryStatusEnum) => void;
  onStatusUpdate?: (prevLibraryStatus: LibraryStatusEnum, newLibraryStatus: LibraryStatusEnum) => void;
} & ComponentProps<'a'>

const GameCard = ({
  gameOverview,
  className = "",
  layout,
  focusable = true,
  inCarousel = false,
  showLibraryControls = false,
  libraryData,
  libraryFormatOptions,
  libraryStatusOptions,
  onDelete,
  onStatusUpdate,
}: GameCardProps) => {
  return (
    <>
      <article className={`w-full flex flex-col bg-primary-700 hover:gradient-primary rounded-2xl overflow-hidden ${className}`}>
        <Link to={`/game/${gameOverview.id}/${gameOverview.slug}`} tabIndex={focusable ? 0 : -1}
          className={`flex-1 p-3 lg:p-4 grid content-start gap-4 ${layout === 'row' ? `grid-cols-4` : `grid-cols-1`}  md:grid-cols-4`}>
          <div className="col-span-1 flex flex-col items-start md:gap-3">
            <div className="relative mx-auto">
              <img className={`w-[clamp(64px,50vw,140px)] object-cover ${layout === 'grid' ? 'aspect-square' : ''} mx-auto md:aspect-auto rounded-lg`}
                src={getCoverUrl(gameOverview.coverId, 'cover_big')}
                alt={`${gameOverview.name} cover art`}
                loading="lazy"/>

              {gameOverview.inLibrary && (
                <div className="absolute bottom-0 w-full h-2/3 px-1 pb-1 flex items-end justify-center gap-1 bg-linear-to-b from-secondary-900/0 via-secondary-900/60 to-secondary-900/80 border-b-2 border-accent-500 rounded-lg">
                  <CheckCircleIcon weight="fill" className="icon-md text-accent-300"/>
                </div>
              )}
            </div>

            {showGameTypeBadge[gameOverview.gameType.id] &&
              <BadgeText label={gameOverview.gameType.label} size="xs" className="hidden md:inline-block"/>
            }
          </div>

          <div className={`${layout === 'row' ? 'col-span-3' : 'col-span-1'} md:col-span-3 flex flex-col gap-2 md:gap-4`}>
            <div className="flex items-start gap-3">
              <h4 className="grow text-primary-50 line-clamp-2">{gameOverview.name}</h4>
              <BadgeNumber label={gameOverview.totalRating !== null ? String(Math.round(gameOverview.totalRating)) : 'n/a'}
                size="xs"/>
            </div>

            {!inCarousel && gameOverview.timeToBeatNormally &&
              <div className="flex items-center gap-2 text-green-500">
                <GameControllerIcon className="icon-md"/>
                <span className="text-lg">
                  {formatTimeToBeat(gameOverview.timeToBeatNormally)}
                </span>
              </div>
            }

            {!showLibraryControls && gameOverview.platforms &&
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase text-primary-50/80">
                  Available on
                </p>
                <InfoChipList data={gameOverview.platforms.map(c => ({ id: c.id, label: c.label }))} size="xs"/>
              </div>
            }
          </div>
        </Link>
        {showLibraryControls && (
          <section className="px-2 pb-2 md:px-4 md:pb-4">
            <LibraryControls gameOverview={gameOverview}
              libraryData={libraryData}
              libraryFormatOptions={libraryFormatOptions}
              libraryStatusOptions={libraryStatusOptions}
              onDelete={onDelete}
              onStatusUpdate={onStatusUpdate}/>
          </section>
        )}
      </article>
    </>

  )
}

export default GameCard;