import { Link } from "react-router-dom";
import { ComponentProps } from "react";
import { GameOverview, SelectOption } from "../types/common";
import InfoChipList from "./InfoChipList.tsx";
import { BadgeNumber, BadgeText } from "./Badge.tsx";
import { getCoverUrl } from "../utils/images.ts";
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
  variant?: 'grid' | 'row';
  focusable?: boolean;
  showLibraryControls?: boolean;
  libraryData?: {
    libraryPlatform: SelectOption;
    libraryFormat: SelectOption;
    libraryStatus: SelectOption;
  },
  onDelete?: (gameId: number, libraryStatus: string) => void;
} & ComponentProps<'a'>

const GameCard = ({
  gameOverview,
  className = "",
  variant = 'grid',
  focusable = true,
  showLibraryControls = false,
  libraryData,
  onDelete,
}: GameCardProps) => {

  return (
    <Link to={`/game/${gameOverview.id}/${gameOverview.slug}`} tabIndex={focusable ? 0 : -1}
      className={`block p-2 md:p-4 bg-primary-700 hover:gradient-primary rounded-2xl overflow-hidden ${className}`}>
      <article className={`grid gap-4 ${variant === 'row' ? 'grid-cols-4' : 'grid-cols-1 md:grid-cols-4'}`}>
        <div className="col-span-1 flex flex-col items-start gap-3">
          <img className="self-stretch rounded-lg object-cover aspect-square md:aspect-auto"
            src={getCoverUrl(gameOverview.coverId, 'cover_big')}
            alt={`${gameOverview.name} cover art`}/>

          {showGameTypeBadge[gameOverview.gameType.id] &&
            <BadgeText label={gameOverview.gameType.label} size="xs" className="hidden md:inline-block"/>
          }
        </div>

        <div className={`${variant === 'row' ? 'col-span-3' : 'col-span-1'} md:col-span-3 flex flex-col gap-2 md:gap-4`}>
          <div className="flex items-start gap-3">
            <h4 className="grow text-primary-50 line-clamp-2">{gameOverview.name}</h4>
            <BadgeNumber label={gameOverview.totalRating !== null ? String(Math.round(gameOverview.totalRating)) : 'n/a'}
              size="xs"/>
          </div>

          {!showLibraryControls && gameOverview.platforms &&
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase text-primary-50/80">
                Available on
              </p>
              <InfoChipList data={gameOverview.platforms.map(c => ({id: c.id, label: c.label}))} size="xs"/>
            </div>
          }

          {showLibraryControls && (
            <section onClick={(e) => e.preventDefault()}>
              <LibraryControls gameOverview={gameOverview} libraryData={libraryData} onDelete={onDelete}/>
            </section>
          )}
        </div>
      </article>
    </Link>
  )
}

export default GameCard;