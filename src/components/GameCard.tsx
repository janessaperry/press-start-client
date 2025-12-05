import { ComponentProps } from "react";
import { GameOverview } from "../pages/ExplorePage/ExplorePage.tsx";
import InfoChipList from "./InfoChipList.tsx";
import InfoChip from "./InfoChip.tsx";

type GameCardProps = {
  gameOverview: GameOverview,
} & ComponentProps<'article'>

const GameCard = ({gameOverview, className = "", ...rest}: GameCardProps) => {
  return (
    <article className={`p-4 bg-primary-700 rounded-2xl flex gap-4 overflow-hidden ${className}`} {...rest}>
      <div className="basis-1/4 shrink-0 flex flex-col gap-2">
        <img className="rounded-xl" src={gameOverview.coverUrl} alt={`${gameOverview.name} cover`}/>

        {/*todo add game type here*/}
        <InfoChip label={gameOverview.gameType}/>
      </div>

      <div className="basis-3/4 grow flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <h4 className="grow text-primary-50">{gameOverview.name}</h4>
          <p className="shrink-0 w-12 h-12 flex items-center justify-center text-xl font-black text-success border-2 border-success rounded-full">{gameOverview.totalRating}</p>
        </div>

        {gameOverview.platforms &&
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase text-primary-50/80">
              Platforms
            </p>
            <div className="flex flex-wrap gap-3">
              <InfoChipList data={gameOverview.platforms.map(p => ({id: p.id, label: p.abbreviation}))}/>
            </div>
          </div>
        }
      </div>
    </article>
  )
}

export default GameCard;