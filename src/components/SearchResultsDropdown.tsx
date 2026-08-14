import { Link } from "react-router-dom";
import { Result } from "../types/common.ts";
import { getCoverUrl } from "../utils/images.ts";

type Props = {
  results: Result[];
  isSearchPending: boolean;
  query: string;
  hasError?: boolean;
}

const SearchResultsDropdown = ({ results, isSearchPending, query, hasError }: Props) => {
  const renderContent = () => {
    if (isSearchPending) {
      return <p className="p-3 text-grey-600 text-lg italic">Searching...</p>;
    }
    if (hasError) {
      return <p className="p-3 text-grey-600 text-lg italic">Something went wrong. Please try again.</p>;
    }
    if (results.length === 0) {
      return <p className="p-3 text-grey-600 text-lg italic">No games found for "{query}"</p>;
    }
    return results.map(result => (
      <Link key={result.id} to={`/game/${result.id}/${result.name}`}
        className="p-2 flex items-center gap-4 rounded-lg hover:bg-grey-100">
        <img src={getCoverUrl(result.coverId, 'thumb')}
          alt={`${result.name} cover art`}
          className="max-w-12 w-full object-cover rounded-md"/>
        <p className="text-secondary-900 text-lg font-medium">{result.name}</p>
      </Link>
    ));
  }

  return (
    <div className="p-1 bg-grey-50 w-full max-h-[min(20rem,60dvh)] overflow-y-auto scrollbar-on-light rounded-2xl">
      {renderContent()}
    </div>
  )
}

export default SearchResultsDropdown;