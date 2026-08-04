import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../api/client.ts";
import { getRetryAfterMessage } from "../utils/rateLimiting.ts";
import { LibraryGame, LibraryStatusEnum } from "../types/common.ts";
import useIsMobile from "./useIsMobile.ts";

type LibraryCounts = {
  enum: LibraryStatusEnum;
  label: string;
  count: number;
}

const useLibraryResults = (userId: number, limit: number) => {
  const isMobile = useIsMobile();
  const [ libraryGames, setLibraryGames ] = useState<LibraryGame[]>([]);
  const [ filteredCount, setFilteredCount ] = useState<number>(0);
  const [ currentlyPlaying, setCurrentlyPlaying ] = useState<LibraryGame[]>([]);
  const [ libraryCounts, setLibraryCounts ] = useState<LibraryCounts[]>([]);
  const [ libraryTotalCount, setLibraryTotalCount ] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ hasLoaded, setHasLoaded ] = useState(false);
  const [ error, setError ] = useState('');
  const isFirstRender = useRef(true);

  const [ searchParams ] = useSearchParams();
  const currentPage = searchParams.get('page') ?? 1;
  const offset = (Number(currentPage) - 1) * limit;

  const debouncedParams = [
    searchParams.get('libraryStatus'),
    searchParams.get('libraryFormat'),
    searchParams.get('gameType'),
    searchParams.get('platform'),
    searchParams.get('releaseDate'),
    searchParams.get('totalRating'),
    searchParams.get('genres'),
    searchParams.get('timeToBeat'),
  ].join(',');

  const immediateParams = [
    searchParams.get('page'),
    searchParams.get('sorting'),
  ].join(',')


  const getLibrary = async (signal: AbortSignal) => {
    const apiParams = new URLSearchParams(searchParams);
    if (!apiParams.has('sorting')) apiParams.set('sorting', 'createdAt-desc');
    if (apiParams.has('page')) apiParams.delete('page');

    apiParams.set('limit', String(limit));
    apiParams.set('offset', String(offset));

    try {
      const response = await apiClient.get(`/users/${userId}/library?${apiParams}`, {
        signal
      });
      const libraryGames = response.data.library;
      setLibraryGames(libraryGames);
      setFilteredCount(response.data.filteredCount);

      const playing = response.data.currentlyPlaying;
      setCurrentlyPlaying(playing);

      setLibraryCounts(response.data.libraryStatusCounts);
      setLibraryTotalCount(response.data.libraryTotalCount)
    }
    catch (e) {
      if (axios.isCancel(e)) return;
      if (axios.isAxiosError(e) && e.response?.status === 429) {
        setError(getRetryAfterMessage(e.response.headers));
      }
      else {
        console.error("Error fetching library games:", e);
      }
    }
    finally {
      if (!signal.aborted) {
        setIsLoading(false);
        setHasLoaded(true);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError('');
    void getLibrary(controller.signal);
    return () => controller.abort();
  }, [ userId, immediateParams ]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    if (isMobile) {
      void getLibrary(controller.signal);
    }
    else {
      const timeoutId = setTimeout(() => {
        void getLibrary(controller.signal);
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
        controller.abort();
      };
    }

    return () => controller.abort();
  }, [ userId, debouncedParams ]);

  const refetch = () => {
    const controller = new AbortController();
    setIsLoading(true);
    setError('');
    void getLibrary(controller.signal);
  };

  return {
    libraryGames, setLibraryGames,
    filteredCount, setFilteredCount,
    currentlyPlaying, setCurrentlyPlaying,
    libraryCounts, setLibraryCounts,
    libraryTotalCount, setLibraryTotalCount,
    isLoading, setIsLoading, hasLoaded,
    error,
    refetch
  }
}

export default useLibraryResults;