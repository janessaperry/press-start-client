import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GameCard from "../components/GameCard.tsx";
import { GameOverview } from "../components/GameCard.tsx";

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const GameResultsPage = () => {
  const {platform} = useParams();
  const [games, setGames] = useState([]);

  useEffect(() => {
    const getGames = async () => {
      const response = await axios.get(`${baseServerUrl}/games?platform=${platform}`);
      console.log(response.data);
      setGames(response.data.gamesByPlatform);
    }

    void getGames();
  }, [platform]);

  return (
    <>
      <section className="container px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-6">
        <h1 className="">GameResultsPage</h1>
        {games.map((game: GameOverview) => {
          return (
            <GameCard key={game.id} gameOverview={game}/>
          )
        })}
      </section>
    </>
  )
}

export default GameResultsPage;