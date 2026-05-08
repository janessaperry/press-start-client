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

const otherValidParams = new Set([ 'page', 'sorting', 'search' ]);

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
  const [ selectedFilterOrder, setSelectedFilterOrder ] = useState<string[]>(getInitialFilterChipOrder);

  function getInitialFilterChipOrder () {
    const initialOrder: string[] = [];

    [ ...searchParams ].forEach(param => {
      const category = param[0];
      const values = param[1].split(',');
      let compoundId = '';
      for (let i = 0; i < values.length; i++) {
        compoundId = `${category}-${values[i]}`;
        initialOrder.push(compoundId)
      }
    });
    return initialOrder;
  }

  // sanitize search params against valid filter categories and options
  useEffect(() => {
    if (Object.keys(validFilters).length === 0) return;

    let changed = false;
    const params = new URLSearchParams(searchParams);
    for (const [ key ] of params.entries()) {
      if (otherValidParams.has(key)) continue;

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

    // in order of selection
    if (selectedFilterOrder.includes(compoundId)) {
      setSelectedFilterOrder(selectedFilterOrder.filter(id => id !== compoundId));
    }
    else {
      setSelectedFilterOrder([ ...selectedFilterOrder, compoundId ]);
    }

    // by category
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

    setSelectedFilterOrder([]);

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
    selectedFilterOrder,
    handleFilterChange,
    applyFilters,
    handleClearAll
  };
}

export default useFilterSelections;