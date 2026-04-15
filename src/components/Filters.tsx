import { ComponentProps } from "react";
import useFilterCategories from "../hooks/useFilterCategories.tsx";
import { SelectedFilters } from "../hooks/useFilterSelections.tsx";
import FilterCategory from "./FilterCategory.tsx";

type Props = {
  selectedFilters: SelectedFilters,
  handleFilterChange: (compoundId: string, syncUrl?: boolean) => void,
  className?: string
} & ComponentProps<'section'>

const Filters = ({ className, selectedFilters, handleFilterChange }: Props) => {
  const filterCategories = useFilterCategories();

  return (
    <section className={`${className || ''} p-4 bg-blue-500/50 border border-accent-300/20 rounded-2xl space-y-4 md:space-y-6 scrollbar-on-dark`}>
      <h4>Filters</h4>
      {filterCategories.gameType && (
        <FilterCategory title="Game Type" showTitle={false}
          filters={filterCategories.gameType}
          selectedFilters={selectedFilters.gameType}
          paramName='gameType'
          handleChange={handleFilterChange}/>
      )}

      {filterCategories.platform && (
        <FilterCategory title="Console"
          filters={filterCategories.platform}
          selectedFilters={selectedFilters.platform}
          paramName='platform'
          handleChange={handleFilterChange}/>
      )}

      {filterCategories.releaseDate && (
        <FilterCategory title="Release Date"
          filters={filterCategories.releaseDate}
          selectedFilters={selectedFilters.releaseDate}
          paramName='releaseDate'
          handleChange={handleFilterChange}/>
      )}

      {filterCategories.totalRating && (
        <FilterCategory title="Rating"
          filters={filterCategories.totalRating}
          selectedFilters={selectedFilters.totalRating}
          paramName='totalRating'
          handleChange={handleFilterChange}/>
      )}

      {filterCategories.genres && (
        <FilterCategory title="Genres"
          filters={filterCategories.genres}
          selectedFilters={selectedFilters.genres}
          paramName='genres'
          handleChange={handleFilterChange}/>
      )}

      {filterCategories.timeToBeat && (
        <FilterCategory title="Time to Beat" description="Based on 'normal' times."
          filters={filterCategories.timeToBeat}
          selectedFilters={selectedFilters.timeToBeat}
          paramName='timeToBeat'
          handleChange={handleFilterChange}/>
      )}
    </section>
  )
}

export default Filters;