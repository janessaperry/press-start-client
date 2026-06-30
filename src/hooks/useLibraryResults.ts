import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LibraryGame } from "../types/common.ts";

type LibraryCounts = {
  label: string;
  count: number;
}

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const useLibraryResults = (userId: number, limit: number) => {
  const [ libraryGames, setLibraryGames ] = useState<LibraryGame[]>([]);
  const [ currentlyPlaying, setCurrentlyPlaying ] = useState<LibraryGame[]>([]);
  const [ libraryCounts, setLibraryCounts ] = useState<LibraryCounts[]>([]);
  const [ libraryTotalCount, setLibraryTotalCount ] = useState(0);

  const [ searchParams ] = useSearchParams();
  const currentPage = searchParams.get('page') ?? 1;
  const offset = (Number(currentPage) - 1) * limit;

  useEffect(() => {
    const getLibrary = async () => {
      const apiParams = new URLSearchParams(searchParams);
      apiParams.set('limit', String(limit));
      apiParams.set('offset', String(offset));

      const response = await axios.get(`${baseServerUrl}/users/${userId}/library?${apiParams}`);
      const libraryGames = response.data.library;
      setLibraryGames(libraryGames);

      const playing = libraryGames.filter((game: LibraryGame) => game.libraryStatus?.enum === 'PLAYING');
      setCurrentlyPlaying(playing);

      setLibraryCounts(response.data.libraryStatusCounts);
      setLibraryTotalCount(response.data.libraryTotalCount)
    }

    void getLibrary();
  }, [ userId ]);

  return {
    libraryGames, setLibraryGames,
    currentlyPlaying, setCurrentlyPlaying,
    libraryCounts, setLibraryCounts,
    libraryTotalCount, setLibraryTotalCount
  }
}

export default useLibraryResults;