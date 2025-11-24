import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Input } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import GameCard from "../../components/GameCard.tsx";

export type GameOverview = {
  id: number,
  name: string,
  coverUrl: string,
  releaseDate: string,
  slug: string,
  totalRating: string,
  platforms: {
    id: number,
    abbreviation: string
  }[],
}

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const ExplorePage = () => {
  const [ searchQuery, setSearchQuery ] = useState('');
  const [ newRelease, setNewRelease ] = useState<GameOverview[]>([]);
  const [ comingSoon, setComingSoon ] = useState<GameOverview[]>([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${baseServerUrl}/games?search=${searchQuery}`)
      console.log(response.data);
    }
    catch (e) {
      console.error(`Error searching games: ${e}`)
    }
  }

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${baseServerUrl}/games?status=coming-soon,new-release`);
        const games = response.data;
        setComingSoon(games.status.comingSoon);
        setNewRelease(games.status.newRelease);
      }
      catch (e) {
        console.error(`Error fetching games: ${e}`)
      }
      finally {
        console.log("done loading")
      }
    }
    void fetchGames();
  }, [])


  return (
    <>
      <section className="px-4 py-20 bg-purple-700">
        <div className="container flex flex-col gap-10">
          <h1 className="text-center">Find your next game</h1>

          <form className="self-center w-full md:max-w-3/4 lg:max-w-1/2 flex gap-3" onSubmit={handleSearch}>
            <Input name="search"
              type="search"
              placeholder="Search..."
              onChange={e => setSearchQuery(e.target.value)}
              value={searchQuery}
              className="grow"/>
            <Button type="submit">
              <MagnifyingGlassIcon/>
            </Button>
          </form>
        </div>
      </section>

      <section className="container px-4 py-20 flex flex-col gap-10">
        <h2>Explore by platform</h2>
        <div>
          <Link to="/explore/xbox">Xbox Logo</Link>
          <Link to="/explore/playstation">Playstation Logo</Link>
          <Link to="/explore/nintendo">Nintendo Logo</Link>
          <Link to="/explore/pc">PC Logo</Link>
        </div>
      </section>


      <section className="container px-4 py-20 flex flex-col gap-10">
        <h2>New Releases</h2>

        <div className="grid grid-cols-2 gap-4">
          {newRelease?.map((game: GameOverview) => {
              return <GameCard key={game.id} gameOverview={game} colSpanClass="col-span-1"/>
            }
          )}
        </div>
      </section>


      {comingSoon &&
        <section className="container px-4 py-20 flex flex-col gap-10">
          <h2>Coming Soon</h2>

          <div className="grid grid-cols-2 gap-4">
            {comingSoon?.map((game: GameOverview) => {
              return <GameCard key={game.id} gameOverview={game} colSpanClass="col-span-1"/>
            })}
          </div>
        </section>
      }
    </>
  );
};

export default ExplorePage;