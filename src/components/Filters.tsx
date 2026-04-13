import { ComponentProps } from "react";
import useFilterCategories from "../hooks/useFilterCategories.tsx";
import useFilterSelections from "../hooks/useFilterSelections.tsx";
import FilterCategory from "./FilterCategory.tsx";

type Props = {
  className?: string
} & ComponentProps<'section'>

const Filters = ({ className }: Props) => {
  const filterCategories = useFilterCategories();
  const {
    selectedPlatforms,
    selectedGenres,
    selectedTimeToBeat,
    selectedTotalRating,
    selectedReleaseDate,
    selectedGameType,
    handleFilterChange,
  } = useFilterSelections();

  return (
    <section className={`${className || ''} p-4 bg-blue-500/50 border border-accent-300/20 rounded-2xl space-y-4 md:space-y-6 scrollbar-on-dark`}>
      <h4>Filters</h4>
      {filterCategories.gameType && (
        <FilterCategory title="Game Type" showTitle={false}
          filters={filterCategories.gameType}
          selectedFilters={selectedGameType}
          paramName='gameType'
          handleChange={handleFilterChange}/>
      )}

      {filterCategories.platform && (
        <FilterCategory title="Console"
          filters={filterCategories.platform}
          selectedFilters={selectedPlatforms}
          paramName='platform'
          handleChange={handleFilterChange}/>
      )}

      {filterCategories.releaseDate && (
        <FilterCategory title="Release Date"
          filters={filterCategories.releaseDate}
          selectedFilters={selectedReleaseDate}
          paramName='releaseDate'
          handleChange={handleFilterChange}/>
      )}

      {filterCategories.totalRating && (
        <FilterCategory title="Rating"
          filters={filterCategories.totalRating}
          selectedFilters={selectedTotalRating}
          paramName='totalRating'
          handleChange={handleFilterChange}/>
      )}

      {filterCategories.genres && (
        <FilterCategory title="Genres"
          filters={filterCategories.genres}
          selectedFilters={selectedGenres}
          paramName='genres'
          handleChange={handleFilterChange}/>
      )}

      {filterCategories.timeToBeat && (
        <FilterCategory title="Time to Beat" description="Based on 'normal' times."
          filters={filterCategories.timeToBeat}
          selectedFilters={selectedTimeToBeat}
          paramName='timeToBeat'
          handleChange={handleFilterChange}/>
      )}
    </section>
  )
}

export default Filters;