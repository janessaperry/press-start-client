import axios from "axios";
import { useEffect, useState } from "react";
import { LibraryGame } from "../types/common.ts";

type LibraryCounts = {
  label: string;
  count: number;
}

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const useLibraryResults = (userId: number) => {
  const [ libraryGames, setLibraryGames ] = useState<LibraryGame[]>([]);
  const [ currentlyPlaying, setCurrentlyPlaying ] = useState<LibraryGame[]>([]);
  const [ libraryCounts, setLibraryCounts ] = useState<LibraryCounts[]>([]);
  const [ libraryTotalCount, setLibraryTotalCount ] = useState(0);

  useEffect(() => {
    const getLibrary = async () => {
      const response = await axios.get(`${baseServerUrl}/users/${userId}/library`);
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
    libraryGames,
    setLibraryGames,
    currentlyPlaying,
    setCurrentlyPlaying,
    libraryCounts,
    setLibraryCounts,
    libraryTotalCount,
    setLibraryTotalCount
  }
}

export default useLibraryResults;