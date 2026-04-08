import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useFilterCategories from "./useFilterCategories.tsx";

type SelectOption<T extends string | number = number> = {
  id: T,
  label: string,
}

type FilterCategories = {
  platformFamily?: SelectOption[],
  platform?: SelectOption[],
  genres?: SelectOption[],
  timeToBeat?: SelectOption[],
  totalRating?: SelectOption[]
  releaseDate?: SelectOption[]
}

const useFilterSelections = () => {
  const filterCategories = useFilterCategories();

  const [ searchParams, setSearchParams ] = useSearchParams();

  const selectedPlatforms = searchParams.get('platform')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedGenres = searchParams.get('genres')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedTimeToBeat = searchParams.get('timeToBeat')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedTotalRating = searchParams.get('totalRating')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedReleaseDate = searchParams.get('releaseDate')?.split(',').map(id => Number(id.trim())) ?? [];

  const handleFilterChange = (compoundId: string) => {
    const [ category, id ] = compoundId.split('-')

    const params = new URLSearchParams(searchParams);
    const current = params.get(category)?.split(',').filter(Boolean) ?? [];
    const updated = current.includes(String(id)) ? current.filter(s => s !== String(id)) : [ ...current, String(id) ];
    if (updated.length === 0) {
      params.delete(category);
    }
    else {
      params.set(category, updated.toString());
    }
    params.delete('page');
    setSearchParams(params, { replace: true });
  }

  const filterChips: SelectOption<string>[] = useMemo(() => {
    const selectedFilters = new Set<SelectOption<string>>();

    for (const [ key, valueString ] of searchParams.entries()) {
      valueString.split(",").forEach(value => {
        const compoundId = `${key}-${value}`;
        const category: SelectOption[] | undefined = filterCategories[key as keyof FilterCategories];
        const foundFilter = category?.find((filterItem) => filterItem.id === Number(value));

        if (foundFilter) {
          selectedFilters.add({ id: compoundId, label: foundFilter.label })
        }
      });
    }

    return [ ...selectedFilters ];
  }, [ filterCategories, searchParams ]);

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('platform');
    params.delete('genres');
    params.delete('timeToBeat');
    params.delete('totalRating');
    params.delete('releaseDate');
    setSearchParams(params, { replace: true })
  }

  return {
    selectedPlatforms,
    selectedGenres,
    selectedTimeToBeat,
    selectedTotalRating,
    selectedReleaseDate,
    filterChips,
    handleFilterChange,
    handleClearAll
  };
}

export default useFilterSelections;