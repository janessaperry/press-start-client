import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LibraryGame, LibraryStatusEnum } from "../types/common.ts";
import useIsMobile from "./useIsMobile.tsx";

type LibraryCounts = {
  enum: LibraryStatusEnum;
  label: string;
  count: number;
}

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const useLibraryResults = (userId: number, limit: number) => {
  const isMobile = useIsMobile();
  const [ libraryGames, setLibraryGames ] = useState<LibraryGame[]>([]);
  const [ filteredCount, setFilteredCount ] = useState<number>(0);
  const [ currentlyPlaying, setCurrentlyPlaying ] = useState<LibraryGame[]>([]);
  const [ libraryCounts, setLibraryCounts ] = useState<LibraryCounts[]>([]);
  const [ libraryTotalCount, setLibraryTotalCount ] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false);

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


  const getLibrary = async () => {
    const apiParams = new URLSearchParams(searchParams);
    if (!apiParams.has('sorting')) apiParams.set('sorting', 'createdAt-desc');
    if (apiParams.has('page')) apiParams.delete('page');

    apiParams.set('limit', String(limit));
    apiParams.set('offset', String(offset));

    try {
      const response = await axios.get(`${baseServerUrl}/users/${userId}/library?${apiParams}`);
      const libraryGames = response.data.library;
      setLibraryGames(libraryGames);
      setFilteredCount(response.data.filteredCount);

      const playing = response.data.currentlyPlaying;
      setCurrentlyPlaying(playing);

      setLibraryCounts(response.data.libraryStatusCounts);
      setLibraryTotalCount(response.data.libraryTotalCount)
    }
    catch (e) {
      console.error("Error fetching library games:", e)
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void getLibrary();
  }, [ userId, immediateParams ]);

  useEffect(() => {
    setIsLoading(true);

    if (isMobile) {
      void getLibrary();
    }
    else {
      const timeoutId = setTimeout(() => {
        void getLibrary()
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [ userId, debouncedParams, isMobile ]);

  return {
    libraryGames, setLibraryGames,
    filteredCount, setFilteredCount,
    currentlyPlaying, setCurrentlyPlaying,
    libraryCounts, setLibraryCounts,
    libraryTotalCount, setLibraryTotalCount,
    isLoading, setIsLoading
  }
}

export default useLibraryResults;