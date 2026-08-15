import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import apiClient from "../api/client.ts";
import { GameOverview } from "../types/common.ts";
import { PLATFORM_FAMILY_BY_SLUG } from "../constants/platforms.ts";
import useAuth from "./useAuth.ts";
import useIsMobile from "./useIsMobile.ts";

type GameResults = {
  games: GameOverview[],
  resultsCount: number | undefined,
  isLoading: boolean,
  error: boolean,
}

const useGameResults = (limit: number): GameResults => {
  const { userId } = useAuth();
  const { platformFamilySlug } = useParams();
  const [ searchParams ] = useSearchParams();
  const isMobile = useIsMobile();

  const currentPage = searchParams.get('page') ?? 1;
  const offset = (Number(currentPage) - 1) * limit;
  const debouncedParams = [
    searchParams.get('platform'),
    searchParams.get('genres'),
    searchParams.get('releaseDate'),
    searchParams.get('timeToBeat'),
    searchParams.get('totalRating'),
    searchParams.get('gameType'),
  ].join(',');
  const immediateParams = [
    searchParams.get('page'),
    searchParams.get('sorting'),
    searchParams.get('search')
  ].join(',')

  const [ games, setGames ] = useState<GameOverview[]>([]);
  const [ resultsCount, setResultsCount ] = useState<number | undefined>(undefined);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(false);
  const prevDebouncedParams = useRef(debouncedParams);

  const getGames = async (signal: AbortSignal) => {
    const apiParams = new URLSearchParams(searchParams);
    if (!apiParams.has('sorting')) apiParams.set('sorting', apiParams.has('search') ? 'relevance-desc' : 'createdAt-desc');
    if (platformFamilySlug) apiParams.set('platformFamily', String(PLATFORM_FAMILY_BY_SLUG[platformFamilySlug as keyof typeof PLATFORM_FAMILY_BY_SLUG]?.id));
    if (apiParams.has('page')) apiParams.delete('page');
    apiParams.set('limit', String(limit));
    apiParams.set('offset', String(offset));
    if (userId) apiParams.set('userId', userId)

    try {
      const response = await apiClient.get(`/games?${apiParams}`, { signal });
      setGames(response.data.filteredResults.games);
      setResultsCount(response.data.filteredResults.count)
    }
    catch (e) {
      if (axios.isCancel(e)) return;
      setError(true);
    }
    finally {
      if (!signal.aborted) setIsLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(false);

    void getGames(controller.signal);
    return () => controller.abort();
  }, [ platformFamilySlug, immediateParams ]);

  useEffect(() => {
    if (prevDebouncedParams.current === debouncedParams) return;
    prevDebouncedParams.current = debouncedParams;

    const controller = new AbortController();
    setIsLoading(true);

    if (isMobile) {
      void getGames(controller.signal);
    }
    else {
      const timeoutId = setTimeout(() => {
        void getGames(controller.signal);
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
        controller.abort();
      };
    }

    return () => controller.abort();
  }, [ debouncedParams ]);

  return { games, resultsCount, isLoading, error };
}

export default useGameResults;