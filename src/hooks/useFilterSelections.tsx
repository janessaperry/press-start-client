import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterCategories, SelectedFilters } from "../types/common.ts";
import useIsMobile from "./useIsMobile.tsx";


const otherValidParams = new Set([ 'page', 'sorting', 'search' ]);

const useFilterSelections = (validFilters: FilterCategories) => {
  const isMobile = useIsMobile();

  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ selectedFilters, setSelectedFilters ] = useState<SelectedFilters>({
    platform: searchParams.get('platform')?.split(',').map(id => Number(id.trim())) ?? [],
    genres: searchParams.get('genres')?.split(',').map(id => Number(id.trim())) ?? [],
    timeToBeat: searchParams.get('timeToBeat')?.split(',').map(id => Number(id.trim())) ?? [],
    totalRating: searchParams.get('totalRating')?.split(',').map(id => Number(id.trim())) ?? [],
    releaseDate: searchParams.get('releaseDate')?.split(',').map(id => Number(id.trim())) ?? [],
    gameType: searchParams.get('gameType')?.split(',').map(id => Number(id.trim())) ?? [],
    libraryStatus: searchParams.get('libraryStatus')?.split(',').map(id => Number(id.trim())) ?? [],
    libraryFormat: searchParams.get('libraryFormat')?.split(',').map(id => Number(id.trim())) ?? [],
  });

  const [ pendingOrder, setPendingOrder ] = useState<string[]>(getInitialFilterChipOrder);
  const [ committedOrder, setCommittedOrder ] = useState<string[]>(getInitialFilterChipOrder);

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

    if (selectedFilters[category].includes(id)) {
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

    const newOrder = pendingOrder.includes(compoundId)
      ? pendingOrder.filter(id => id !== compoundId)
      : [ ...pendingOrder, compoundId ];
    setPendingOrder(newOrder);

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
      setCommittedOrder(newOrder);
    }
  }

  const cancelFilters = () => {
    setSelectedFilters({
      platform: searchParams.get('platform')?.split(',').map(id => Number(id.trim())) ?? [],
      genres: searchParams.get('genres')?.split(',').map(id => Number(id.trim())) ?? [],
      timeToBeat: searchParams.get('timeToBeat')?.split(',').map(id => Number(id.trim())) ?? [],
      totalRating: searchParams.get('totalRating')?.split(',').map(id => Number(id.trim())) ?? [],
      releaseDate: searchParams.get('releaseDate')?.split(',').map(id => Number(id.trim())) ?? [],
      gameType: searchParams.get('gameType')?.split(',').map(id => Number(id.trim())) ?? [],
      libraryStatus: searchParams.get('libraryStatus')?.split(',').map(id => Number(id.trim())) ?? [],
      libraryFormat: searchParams.get('libraryFormat')?.split(',').map(id => Number(id.trim())) ?? [],
    });
    setPendingOrder(committedOrder);
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
    params.delete('page');
    setSearchParams(params, { replace: true });
    setCommittedOrder(pendingOrder);
  }

  const handleClearAll = () => {
    setSelectedFilters({
      platform: [],
      genres: [],
      timeToBeat: [],
      totalRating: [],
      releaseDate: [],
      gameType: [],
      libraryStatus: [],
      libraryFormat: [],
    });

    setPendingOrder([]);
    setCommittedOrder([]);

    const params = new URLSearchParams(searchParams);
    params.delete('platform');
    params.delete('genres');
    params.delete('timeToBeat');
    params.delete('totalRating');
    params.delete('releaseDate');
    params.delete('gameType');
    params.delete('libraryStatus');
    params.delete('libraryFormat');
    params.delete('page');
    setSearchParams(params, { replace: true });
  }

  return {
    selectedFilters,
    committedOrder,
    handleFilterChange,
    applyFilters,
    cancelFilters,
    handleClearAll
  };
}

export default useFilterSelections;
