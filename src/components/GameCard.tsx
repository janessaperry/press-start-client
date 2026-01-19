import { Link } from "react-router-dom";
import { ComponentProps } from "react";
import { GameOverview } from "../pages/ExplorePage/ExplorePage.tsx";
import InfoChipList from "./InfoChipList.tsx";
import { BadgeNumber, BadgeText } from "./Badge.tsx";
import { NO_COVER_PLACEHOLDER_URL } from "../constants/placeholders.ts";

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

  return (
    <Link to={`/game/${gameOverview.id}/${gameOverview.slug}`}
      className={`p-4 bg-primary-700 rounded-2xl overflow-hidden ${className}`}>
      <article className="flex gap-4">
        <div className="basis-1/4 shrink-0 flex flex-col gap-3">
          <img className="rounded-lg"
            src={gameOverview.coverUrl || NO_COVER_PLACEHOLDER_URL}
            alt={`${gameOverview.name} cover`}/>

          {showGameTypeBadge[gameOverview.gameType.id] &&
            <BadgeText label={gameOverview.gameType.label}/>
          }
        </div>

        <div className="basis-3/4 grow flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <h4 className="grow text-primary-50">{gameOverview.name}</h4>
            <BadgeNumber
              label={gameOverview.totalRating !== null ? String(Math.round(gameOverview.totalRating)) : 'n/a'}
              size="sm"/>
          </div>

          {gameOverview.consoles &&
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase text-primary-50/80">
                Available on
              </p>
              <div className="flex flex-wrap gap-3">
                <InfoChipList data={gameOverview.consoles.map(c => ({id: c.id, label: c.label}))} size="sm"/>
              </div>
            </div>
          }
        </div>
      </article>
    </Link>

  )
}

export default GameCard;