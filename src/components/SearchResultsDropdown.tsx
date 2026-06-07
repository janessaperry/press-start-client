import { Link } from "react-router-dom";
import { Result } from "../pages/ExplorePage.tsx";
import { getCoverUrl } from "../utils/images.ts";

type Props = {
  results: Result[],
}

const SearchResultsDropdown = ({results}: Props) => {
  return (
    <div className="p-1 bg-grey-50 w-full max-h-80 overflow-y-auto scrollbar-on-light rounded-2xl">
      {results.map(result => {
        return (
          <Link key={result.id} to={`/game/${result.id}/${result.name}`}
            className="p-2 flex items-center gap-4 rounded-lg hover:bg-grey-100">
            <img src={getCoverUrl(result.coverId, 'thumb')}
              alt={`${result.name} cover art`}
              className="max-w-12 w-full object-cover rounded-md"/>
            <p className="text-secondary-900 font-medium">{result.name}</p>
          </Link>
        )
      })}
    </div>
  )
}

export default SearchResultsDropdown;