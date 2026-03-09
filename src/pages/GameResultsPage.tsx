import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import GameCard from "../components/GameCard.tsx";
import { GameOverview } from "../components/GameCard.tsx";

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const GameResultsPage = () => {
  const {platformFamilySlug} = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [games, setGames] = useState([]);

  useEffect(() => {
    const params = platformFamilySlug ? new URLSearchParams({
      ...Object.entries(searchParams),
      platformFamily: platformFamilySlug
    }) : searchParams.toString();

    const getGames = async () => {
      const response = await axios.get(`${baseServerUrl}/games?${params}`);
      setGames(response.data.filteredResults);
    }

    void getGames();
  }, [platformFamilySlug, searchParams, setSearchParams]);

  if (games.length === 0) return <h1>Loading</h1>;

  return (
    <>
      <section className="container px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-6">
        <h1 className="">{platformFamilySlug} Games</h1>
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