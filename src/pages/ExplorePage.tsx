import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../api/client.ts";

import { GameOverview } from "../types/common.ts";
import NintendoLogo from "/src/assets/logos/platforms/nintendo-logo-white.svg";
import XboxLogo from "/src/assets/logos/platforms/xbox-logo-white.svg"
import PlaystationLogo from "/src/assets/logos/platforms/playstation-logo-white.svg"

import GameCarousel from "../components/GameCarousel.tsx";
import SearchWithDropdown from "../components/SearchWithDropdown.tsx";

const ExplorePage = () => {
  const navigate = useNavigate();
  const [ newRelease, setNewRelease ] = useState<GameOverview[]>([]);
  const [ comingSoon, setComingSoon ] = useState<GameOverview[]>([]);

  const handleSearchSubmit = (query: string) => {
    navigate({ pathname: "/games", search: `?search=${encodeURIComponent(query)}` });
  }

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await apiClient.get(`/games?status=coming-soon,new-release`);
        const games = response.data;
        setComingSoon(games.status.comingSoon);
        setNewRelease(games.status.newRelease);
      }
      catch (e) {
        console.error(`Error fetching games: ${e}`)
      }
      finally {
        console.log("done loading");
      }
    }
    void fetchGames();
  }, [])


  return (
    <>
      <section className="px-4 md:px-10 py-12 md:py-24 bg-purple-700">
        <div className="container flex flex-col gap-6 md:gap-10">
          <h1 className="text-center">Find your next game</h1>

          <SearchWithDropdown className="flex justify-center" onSubmit={handleSearchSubmit}/>
        </div>
      </section>

      <div className="container px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-16">
        <section className="flex flex-col gap-4 md:gap-6">
          <h2>Explore by platform</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 md:gap-6">
            <Link to="/explore/xbox" className="flex items-center justify-center py-6 px-4 bg-primary-300 rounded-xl">
              <img src={XboxLogo} alt="View Xbox games" className="h-14"/>
            </Link>
            <Link to="/explore/playstation"
              className="flex items-center justify-center py-6 px-4 bg-primary-300 rounded-xl">
              <img src={PlaystationLogo} alt="View Xbox games" className="h-16"/>
            </Link>
            <Link to="/explore/nintendo"
              className="flex items-center justify-center py-6 px-4 bg-primary-300 rounded-xl">
              <img src={NintendoLogo} alt="View Xbox games" className="h-14"/>
            </Link>
            <Link to="/explore/pc" className="flex items-center justify-center py-6 px-4 bg-primary-300 rounded-xl">
              <div className="w-full text-center font-heading text-5xl sm:text-4xl lg:text-5xl">PC</div>
            </Link>
          </div>
        </section>

        {newRelease &&
          <section className="flex flex-col gap-4 md:gap-6">
            <h2>New Releases</h2>
            <GameCarousel games={newRelease}/>
          </section>
        }

        {comingSoon &&
          <section className="flex flex-col gap-4 md:gap-6">
            <h2>Coming Soon</h2>
            <GameCarousel games={comingSoon}/>
          </section>
        }
      </div>

    </>
  );
};

export default ExplorePage;