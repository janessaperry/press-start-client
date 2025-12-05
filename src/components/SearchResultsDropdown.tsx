import { ComponentPropsWithoutRef } from "react";

type Props = {
  results: {
    id: number,
    name: string,
    coverUrl: string
  }[],
} & ComponentPropsWithoutRef<'div'>

const SearchResultsDropdown = ({results}: Props) => {
  return (
    <div className={`p-1 bg-grey-50 w-full max-h-80 overflow-y-auto scrollbar-on-light rounded-2xl`}>
      {results.map(result => {
        return (
          <div key={result.id} className="p-2 flex items-center gap-4 rounded-lg hover:bg-grey-100">
            <img src={result.coverUrl}
              alt={`${result.name} cover`}
              className="max-w-12 w-full object-cover rounded-md"/>
            <p className="text-secondary-900 font-medium">{result.name}</p>
          </div>
        )
      })}
    </div>
  )
}

export default SearchResultsDropdown;