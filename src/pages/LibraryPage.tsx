import axios from "axios";
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard.tsx";
import useAuth from "../hooks/useAuth.tsx";

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const LibraryPage = () => {
  const { userId } = useAuth();
  const [ libraryGames, setLibraryGames ] = useState([]);


  useEffect(() => {
    const getLibrary = async () => {
      const response = await axios.get(`${baseServerUrl}/users/${userId}/library`);
      setLibraryGames(response.data.library);
      console.log("LIBRARY RESPONSE", response.data)
    }

    void getLibrary();
  }, [ userId ]);


  return (
    <>
      <div className="container px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-16">
        <header className="flex items-center gap-4">
          <h1 className="">My Games</h1>
        </header>

        <div>
          <section>
            <h2>Stats • 24 Games</h2>
            <ul>
              <li>Playing</li>
              <li>Want to Play</li>
              <li>Played</li>
              <li>On Pause</li>
              <li>Wishlist</li>
            </ul>
          </section>

          <section>
            <h2>Currently Playing</h2>
            <div>
              <article>
                <img className="max-w-24 rounded-xl" src="https://placecats.com/louie/229/305" alt="UPDATE"/>
                <h3>Simplified Game Card</h3>
                Dropdown for status here
              </article>
            </div>
          </section>
        </div>

        <div>
          <h2>My Games</h2>
          <div>
            {libraryGames.map((game) => (
              <div key={game.igdbGameId}>{game.igdbGameId} {game.status} {game.gameDetails.name} | {game.libraryPlatform?.abbreviation}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryPage;