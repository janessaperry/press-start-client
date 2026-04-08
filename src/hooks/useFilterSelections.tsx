import { useSearchParams } from "react-router-dom";

const useFilterSelections = () => {
  const [ searchParams, setSearchParams ] = useSearchParams();

  const selectedPlatforms = searchParams.get('platform')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedGenres = searchParams.get('genres')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedTimeToBeat = searchParams.get('timeToBeat')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedTotalRating = searchParams.get('totalRating')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedReleaseDate = searchParams.get('releaseDate')?.split(',').map(id => Number(id.trim())) ?? [];
  const selectedGameType = searchParams.get('gameType')?.split(',').map(id => Number(id.trim())) ?? [];

  const handleFilterChange = (compoundId: string) => {
    const [ category, id ] = compoundId.split('-');

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

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('platform');
    params.delete('genres');
    params.delete('timeToBeat');
    params.delete('totalRating');
    params.delete('releaseDate');
    params.delete('gameType');
    setSearchParams(params, { replace: true })
  }

  return {
    selectedPlatforms,
    selectedGenres,
    selectedTimeToBeat,
    selectedTotalRating,
    selectedReleaseDate,
    selectedGameType,
    handleFilterChange,
    handleClearAll
  };
}

export default useFilterSelections;