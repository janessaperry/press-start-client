import { Link } from "react-router-dom";
import { getCoverUrl } from "../utils/images.ts";
import { GameThumbnail } from "../pages/GameDetailsPage.tsx"

type Props = {
  games: GameThumbnail[]
}

const GameCoverList = ({games}: Props) => {
  return (
    <ul className="flex gap-2 flex-wrap">
      {games.map(game => (
        <li key={game.id} className="max-w-16 rounded-lg">
          <Link to={`/game/${game.id}/${game.slug}`}>
            <img src={getCoverUrl(game.coverId, "cover_big")} alt={`${game.name} cover art`}
              className="rounded-lg"/>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default GameCoverList;