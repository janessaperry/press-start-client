import { GameOverview } from "../pages/ExplorePage/ExplorePage.tsx";
import InfoChipList from "./InfoChipList.tsx";

type GameCardProps = {
  gameOverview: GameOverview,
  colSpanClass?: string
}

const GameCard = ({ gameOverview, colSpanClass = "" }: GameCardProps) => {
  return (
    <article className={`p-4 bg-primary-700 rounded-2xl flex gap-4 overflow-hidden ${colSpanClass}`}>
      <div className="basis-1/4 shrink-0">
        <img className="rounded-xl" src={gameOverview.coverUrl} alt={`${gameOverview.name} cover`}/>
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
              <InfoChipList data={gameOverview.platforms}/>
            </div>
          </div>
        }
      </div>
    </article>
  )
}

export default GameCard;