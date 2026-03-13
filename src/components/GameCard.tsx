import { Link } from "react-router-dom";
import { ComponentProps } from "react";
import InfoChipList from "./InfoChipList.tsx";
import { BadgeNumber, BadgeText } from "./Badge.tsx";
import { getCoverUrl } from "../utils/images.ts";

export type GameOverview = {
  id: number,
  name: string,
  coverId: string | null,
  slug: string,
  totalRating: number | null,
  platforms: {
    id: number,
    label: string
  }[],
  gameType: {
    id: number,
    label: string
  }
}

type GameCardProps = {
  gameOverview: GameOverview,
} & ComponentProps<'a'>

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

const GameCard = ({gameOverview, className = ""}: GameCardProps) => {

  // todo tab index show only be -1 if in carousel
  return (
    <Link to={`/game/${gameOverview.id}/${gameOverview.slug}`} tabIndex={-1}
      className={`block p-2 md:p-4 bg-primary-700 hover:gradient-primary rounded-2xl overflow-hidden ${className}`}>
      <article className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 flex flex-col items-start gap-3">
          <img className="rounded-lg object-cover aspect-square md:aspect-auto"
            src={getCoverUrl(gameOverview.coverId, 'cover_big')}
            alt={`${gameOverview.name} cover art`}/>

          {showGameTypeBadge[gameOverview.gameType.id] &&
            <BadgeText label={gameOverview.gameType.label} size="xs" className="hidden md:inline-block"/>
          }
        </div>

        <div className="col-span-1 md:col-span-3 flex flex-col gap-2 md:gap-4">
          <div className="flex items-start gap-3">
            <h4 className="grow text-primary-50 line-clamp-2">{gameOverview.name}</h4>
            <BadgeNumber
              label={gameOverview.totalRating !== null ? String(Math.round(gameOverview.totalRating)) : 'n/a'}
              size="xs"/>
          </div>

          {gameOverview.platforms &&
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase text-primary-50/80">
                Available on
              </p>
              <InfoChipList data={gameOverview.platforms.map(c => ({id: c.id, label: c.label}))} size="xs"/>
            </div>
          }
        </div>
      </article>
    </Link>
  )
}

export default GameCard;