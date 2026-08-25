import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "../api/client.ts";

import { GameOverview } from "../types/common.ts";
import NintendoLogo from "/src/assets/logos/platforms/nintendo-logo-white.svg";
import XboxLogo from "/src/assets/logos/platforms/xbox-logo-white.svg"
import PlaystationLogo from "/src/assets/logos/platforms/playstation-logo-white.svg"

import ErrorPage from "../components/ErrorPage.tsx";
import GameCarousel from "../components/GameCarousel.tsx";
import SearchWithDropdown from "../components/SearchWithDropdown.tsx";

const ExplorePage = () => {
  const navigate = useNavigate();
  const [ newRelease, setNewRelease ] = useState<GameOverview[]>([]);
  const [ comingSoon, setComingSoon ] = useState<GameOverview[]>([]);
  const [ pageError, setPageError ] = useState(false);

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
      catch {
        setPageError(true);
      }
    }
    void fetchGames();
  }, [])


  if (pageError) return <ErrorPage/>;

  return (
    <>
      <section className="px-4 md:px-10 py-12 md:py-24 bg-purple-700 bg-[url(/src/assets/images/purple-logo-pattern-1280x1024.png)] bg-cover">
        <div className="container flex flex-col gap-6 md:gap-10">
          <h1 className="text-center">Find your next game</h1>

          <SearchWithDropdown className="w-full md:max-w-3/4 lg:max-w-1/2 mx-auto" onSubmit={handleSearchSubmit}/>
        </div>
      </section>

      <div className="container px-4 md:px-10 py-12 md:py-24 space-y-12 md:space-y-16">
        <section className="flex flex-col gap-4 md:gap-6">
          <div className="contents md:flex items-end justify-between gap-4">
            <h2>Explore by platform</h2>
            <Link to="/games" className="order-2 link-primary md:text-lg flex items-center gap-2 whitespace-nowrap">
              Explore All Games <ArrowRightIcon className="icon-sm"/>
            </Link>
          </div>
          <div className="order-1 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            <Link to="/explore/xbox" className="flex items-center justify-center py-6 px-4 bg-primary-300 rounded-xl">
              <img src={XboxLogo} alt="View Xbox games" className="h-10 md:h-14"/>
            </Link>
            <Link to="/explore/playstation"
              className="flex items-center justify-center py-6 px-4 bg-primary-300 rounded-xl">
              <img src={PlaystationLogo} alt="View PlayStation games" className="h-12 md:h-16"/>
            </Link>
            <Link to="/explore/nintendo"
              className="flex items-center justify-center py-6 px-4 bg-primary-300 rounded-xl">
              <img src={NintendoLogo} alt="View Nintendo games" className="h-10 md:h-14"/>
            </Link>
            <Link to="/explore/pc" className="flex items-center justify-center py-6 px-4 bg-primary-300 rounded-xl">
              <div className="w-full text-center font-heading text-4xl lg:text-5xl">PC</div>
            </Link>
          </div>
        </section>

        {newRelease &&
          <section className="space-y-2">
            <div className="flex items-end justify-between gap-4">
              <h2>New Releases</h2>
              <Link to="/games?releaseDate=1"
                className="order-2 link-primary md:text-lg flex items-center gap-2 whitespace-nowrap">
                See all <ArrowRightIcon className="icon-sm"/>
              </Link>
            </div>
            <GameCarousel games={newRelease}/>
          </section>
        }

        {comingSoon &&
          <section className="space-y-2">
            <div className="flex items-end justify-between gap-4">
              <h2>Coming Soon</h2>
              <Link to="/games?releaseDate=2"
                className="order-2 link-primary md:text-lg flex items-center gap-2 whitespace-nowrap">
                See all <ArrowRightIcon className="icon-sm"/>
              </Link>
            </div>
            <GameCarousel games={comingSoon}/>
          </section>
        }
      </div>
    </>
  );
};

export default ExplorePage;