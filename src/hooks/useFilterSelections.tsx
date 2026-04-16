import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFilterCategories from "./useFilterCategories.tsx";
import useIsMobile from "./useIsMobile.tsx";

export type SelectedFilters = {
  platform: number[],
  genres: number[],
  timeToBeat: number[],
  totalRating: number[],
  releaseDate: number[],
  gameType: number[],
}

const useFilterSelections = () => {
  const isMobile = useIsMobile();
  const validFilters = useFilterCategories();
  const [ searchParams, setSearchParams ] = useSearchParams();

  const [ selectedFilters, setSelectedFilters ] = useState<SelectedFilters>({
    platform: searchParams.get('platform')?.split(',').map(id => Number(id.trim())) ?? [],
    genres: searchParams.get('genres')?.split(',').map(id => Number(id.trim())) ?? [],
    timeToBeat: searchParams.get('timeToBeat')?.split(',').map(id => Number(id.trim())) ?? [],
    totalRating: searchParams.get('totalRating')?.split(',').map(id => Number(id.trim())) ?? [],
    releaseDate: searchParams.get('releaseDate')?.split(',').map(id => Number(id.trim())) ?? [],
    gameType: searchParams.get('gameType')?.split(',').map(id => Number(id.trim())) ?? [],
  });

  useEffect(() => {
    if (Object.keys(validFilters).length === 0) return;

    let changed = false;

    const params = new URLSearchParams(searchParams);
    for (const [ key ] of searchParams.entries()) {
      if (!Object.hasOwn(validFilters, key)) {
        params.delete(key);
        changed = true;
        continue;
      }

      const typedKey = key as keyof SelectedFilters;
      const validOptions = validFilters[typedKey];

      if (validOptions && validOptions.length > 0) {
        const currentValues = params.get(typedKey)?.split(',').filter(Boolean) ?? [];
        const validValues = currentValues.filter(v =>
          validOptions.some((opt: { id: number }) => opt.id === Number(v))
        );

        if (validValues.length !== currentValues.length) {
          if (validValues.length > 0) {
            params.set(typedKey, validValues.join(','));
          }
          else {
            params.delete(typedKey);
          }
          changed = true;
        }
      }
    }

    if (changed) {
      setSearchParams(params, { replace: true });
    }
  }, [ validFilters ]);

  const handleFilterChange = (compoundId: string, syncUrl: boolean = false) => {
    const [ category, idStr ] = compoundId.split('-') as [ keyof SelectedFilters, string ];
    const id = Number(idStr);

    const currentSelections = selectedFilters[category];
    if (currentSelections.includes(id)) {
      setSelectedFilters(prev => ({
        ...prev,
        [category]: prev[category].filter(fId => id !== fId)
      }));
    }
    else {
      setSelectedFilters(prev => ({
        ...prev,
        [category]: [ id, ...prev[category] ]
      }))
    }

    if (!isMobile || syncUrl) {
      const params = new URLSearchParams(searchParams);
      const current = params.get(category)?.split(',').filter(Boolean) ?? [];
      const updated = current.includes(idStr) ? current.filter(s => s !== idStr) : [ ...current, idStr ];
      if (updated.length > 0) {
        params.set(category, updated.toString());
      }
      else {
        params.delete(category);
      }
      params.delete('page');
      setSearchParams(params, { replace: true });
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    for (const category in selectedFilters) {
      const selectedIds = selectedFilters[category as keyof SelectedFilters];
      if (selectedIds.length > 0) {
        params.set(category, selectedIds.toString());
      }
      else {
        params.delete(category);
      }
    }
    params.delete('page')
    setSearchParams(params, { replace: true });
  }

  const handleClearAll = () => {
    setSelectedFilters({
      platform: [],
      genres: [],
      timeToBeat: [],
      totalRating: [],
      releaseDate: [],
      gameType: [],
    });

    const params = new URLSearchParams(searchParams);
    params.delete('platform');
    params.delete('genres');
    params.delete('timeToBeat');
    params.delete('totalRating');
    params.delete('releaseDate');
    params.delete('gameType');
    params.delete('page');
    setSearchParams(params, { replace: true });
  }

  return {
    selectedFilters,
    handleFilterChange,
    applyFilters,
    handleClearAll
  };
}

export default useFilterSelections;