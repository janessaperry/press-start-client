import { Button } from "@headlessui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GameThumbnail } from "../types/common.ts";
import { getCoverUrl } from "../utils/images.ts";

type Props = {
  games: GameThumbnail[]
}

const GameCoverList = ({ games }: Props) => {
  const [ showAllGames, setShowAllGames ] = useState(false);
  const visibleGames = games.slice(0, 10);
  const hiddenGames = games.slice(10);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 items-center gap-2">
        {visibleGames.map(game => (
          <div key={game.id} className="w-full rounded-lg">
            <Link to={`/game/${game.id}/${game.slug}`} className="link-primary block">
              <img src={getCoverUrl(game.coverId, "cover_big")} alt={`${game.name} cover art`}
                className="rounded-sm md:rounded-lg" loading="lazy"/>
            </Link>
          </div>
        ))}

        {hiddenGames.length > 0 && (
          <div className={`col-span-5 grid ${showAllGames ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-[grid-template-rows] duration-500 overflow-hidden`}>
            <div className="grid grid-cols-5 items-center gap-2 min-h-0">
              {hiddenGames.map(game => (
                <div key={game.id} className="w-full rounded-lg">
                  <Link to={`/game/${game.id}/${game.slug}`} className="link-primary block">
                    <img src={getCoverUrl(game.coverId, "cover_big")} alt={`${game.name} cover art`}
                      className="rounded-lg" loading="lazy"/>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {hiddenGames.length > 0 && (
        <Button className="text-left link-neutral no-underline"
          onClick={() => setShowAllGames(!showAllGames)}>
          {showAllGames ? 'Show less' : `Show ${hiddenGames.length} more`}
        </Button>
      )}
    </div>
  )
}

export default GameCoverList;