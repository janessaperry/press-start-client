import { ComponentProps } from "react";
import { FilterCategories, SelectedFilters } from "../types/common.ts";
import FilterCategory from "./FilterCategory.tsx";

type Props = {
  filterCategories: FilterCategories;
  selectedFilters: SelectedFilters;
  handleFilterChange: (compoundId: string, syncUrl?: boolean) => void;
  isLibrary?: boolean;
  className?: string;
} & ComponentProps<'section'>

const Filters = ({ className, filterCategories, selectedFilters, handleFilterChange, isLibrary = false }: Props) => {

  const {
    gameType,
    platform,
    releaseDate,
    totalRating,
    genres,
    timeToBeat,
    libraryStatus,
    libraryFormat
  } = filterCategories;

  return (
    <section className={`${className || ''} p-4 bg-blue-500/50 border border-accent-300/20 rounded-2xl space-y-4 md:space-y-6 scrollbar-on-dark`}>
      <h4>Filters</h4>
      {isLibrary && libraryStatus && (
        <FilterCategory title="Play Status"
          filters={libraryStatus}
          selectedFilters={selectedFilters.libraryStatus}
          paramName='libraryStatus'
          handleChange={handleFilterChange}/>
      )}

      {isLibrary && libraryFormat && (
        <FilterCategory title="Game Format"
          filters={libraryFormat}
          selectedFilters={selectedFilters.libraryFormat}
          paramName='libraryFormat'
          handleChange={handleFilterChange}/>
      )}


      {gameType && (
        <FilterCategory title="Game Type" showTitle={isLibrary}
          filters={gameType}
          selectedFilters={selectedFilters.gameType}
          paramName='gameType'
          handleChange={handleFilterChange}/>
      )}

      {platform && (
        <FilterCategory title="Console"
          filters={platform}
          selectedFilters={selectedFilters.platform}
          paramName='platform'
          handleChange={handleFilterChange}/>
      )}

      {releaseDate && (
        <FilterCategory title="Release Date"
          filters={releaseDate}
          selectedFilters={selectedFilters.releaseDate}
          paramName='releaseDate'
          handleChange={handleFilterChange}/>
      )}

      {totalRating && (
        <FilterCategory title="Rating"
          filters={totalRating}
          selectedFilters={selectedFilters.totalRating}
          paramName='totalRating'
          handleChange={handleFilterChange}/>
      )}

      {genres && (
        <FilterCategory title="Genres"
          filters={genres}
          selectedFilters={selectedFilters.genres}
          paramName='genres'
          handleChange={handleFilterChange}/>
      )}

      {timeToBeat && (
        <FilterCategory title="Time to Beat" description="Based on 'normal' times."
          filters={timeToBeat}
          selectedFilters={selectedFilters.timeToBeat}
          paramName='timeToBeat'
          handleChange={handleFilterChange}/>
      )}
    </section>
  )
}

export default Filters;