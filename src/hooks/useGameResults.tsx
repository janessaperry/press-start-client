import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const PLATFORM_BY_SLUG = {
  playstation: { id: 1, name: 'PlayStation' },
  xbox: { id: 2, name: 'Xbox' },
  pc: { id: 4, name: 'PC' },
  nintendo: { id: 5, name: 'Nintendo' },
}

type GameResults = {
  games: any[],
  resultsCount: number | undefined,
  isLoading: boolean
}

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const useGameResults = (): GameResults => {
  const { platformFamilySlug } = useParams();
  const [ searchParams ] = useSearchParams();

  const currentPage = searchParams.get('page') ?? 1;
  const limit = 20;
  const offset = (Number(currentPage) - 1) * limit;
  const debouncedParams = [
    searchParams.get('platform'),
    searchParams.get('genres'),
    searchParams.get('releaseDate'),
    searchParams.get('timeToBeat'),
    searchParams.get('totalRating'),
  ].join(',');
  const immediateParams = [
    searchParams.get('page'),
    searchParams.get('sorting'),
    searchParams.get('search')
  ].join(',')

  const [ games, setGames ] = useState([]);
  const [ resultsCount, setResultsCount ] = useState<number | undefined>(undefined);
  const [ isLoading, setIsLoading ] = useState(false);

  const getGames = async () => {
    const apiParams = new URLSearchParams(searchParams);
    if (!apiParams.has('sorting')) apiParams.set('sorting', 'createdAt-desc');
    if (platformFamilySlug) apiParams.set('platformFamily', String(PLATFORM_BY_SLUG[platformFamilySlug as keyof typeof PLATFORM_BY_SLUG]?.id));
    if (apiParams.has('page')) apiParams.delete('page');
    apiParams.set('limit', String(limit));
    apiParams.set('offset', String(offset));

    try {
      const response = await axios.get(`${baseServerUrl}/games?${apiParams}`);
      setGames(response.data.filteredResults.games);
      setResultsCount(response.data.filteredResults.count)
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    void getGames();
  }, [ platformFamilySlug, immediateParams ]);

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      void getGames();
    }, 1000);
    return () => clearTimeout(timeoutId);

  }, [ debouncedParams ]);

  return { games, resultsCount, isLoading };
}

export default useGameResults;