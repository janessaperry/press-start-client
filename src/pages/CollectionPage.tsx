import axios from "axios";
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard.tsx";
import useAuth from "../hooks/useAuth.tsx";

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const CollectionPage = () => {
  const { userId } = useAuth();
  const [ collectionGames, setCollectionGames ] = useState([]);


  useEffect(() => {
    const getCollectionGames = async () => {
      const response = await axios.get(`${baseServerUrl}/users/${userId}/collection`);
      setCollectionGames(response.data.collection);
    }

    void getCollectionGames();
  }, [ userId ]);


  return (
    <>
      <div className="container px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-16">
        <header className="flex items-center gap-4">
          <h1 className="">Collection</h1>
        </header>

        <div>
          <h2>Games</h2>
          <div>
            {collectionGames.map(game => (
              <div key={game.igdbGameId}>{game.igdbGameId} {game.status}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionPage;