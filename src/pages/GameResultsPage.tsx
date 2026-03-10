import { Checkbox, Field, Label } from "@headlessui/react";
import { CheckIcon } from "@phosphor-icons/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import GameCard from "../components/GameCard.tsx";
import { GameOverview } from "../components/GameCard.tsx";

type SelectOption = {
  id: number,
  label: string
}

type FilterCategories = {
  platformFamily?: SelectOption[],
  platform?: SelectOption[],
  genres?: SelectOption[],
}

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const GameResultsPage = () => {
  const {platformFamilySlug} = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [filterCategories, setFilterCategories] = useState<FilterCategories>({});
  // const {search, platformFamily, platform, genres, limit, offset} = filters;

  useEffect(() => {
    const params = platformFamilySlug ? new URLSearchParams({
      ...Object.entries(searchParams),
      platformFamily: platformFamilySlug
    }) : searchParams.toString();

    const getGames = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseServerUrl}/games?${params}`);
        setGames(response.data.filteredResults);
      }
      catch (e) {
        console.error(e);
      }
      finally {
        setIsLoading(false);
      }
    }

    void getGames();
  }, [platformFamilySlug, searchParams, setSearchParams]);

  useEffect(() => {
    const getFilters = async () => {
      const response = await axios.get(`${baseServerUrl}/filters`);
      console.log("getFilters", response.data);
      setFilterCategories(response.data);
    }

    void getFilters();
  }, []);

  if (isLoading) return <h1>Loading</h1>;
  if (games.length === 0) return <h1>No games</h1>;

  return (
    <>
      <section className="container px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-6">
        <h2>Filters</h2>
        {filterCategories.platformFamily && (
          <div className="space-y-2">
            <h3>PlatformFamily</h3>
            <div className="space-y-1">
              {filterCategories.platformFamily.map((item: SelectOption) => {
                return (
                  <Field key={item.id} className="flex items-center gap-2">
                    <Checkbox className="group checkbox">
                      <CheckIcon size={14}
                        weight="bold"
                        className="hidden group-data-checked:block"/>
                    </Checkbox>
                    <Label>{item.label}</Label>
                  </Field>
                )
              })}
            </div>
          </div>
        )}

        {filterCategories.platform && (
          <>
            <div className="space-y-2">
              <h3>Platform</h3>
              <div className="space-y-1">
                {filterCategories.platform.map((item: SelectOption) => {
                  return <Field key={item.id} className="flex items-center gap-2">
                    <Checkbox className="group checkbox">
                      <CheckIcon size={14}
                        weight="bold"
                        className="hidden group-data-checked:block"/>
                    </Checkbox>
                    <Label>{item.label}</Label>
                  </Field>
                })}
              </div>
            </div>
          </>
        )}

        {filterCategories.genres && (
          <>
            <div className="space-y-2">
              <h3>Genres</h3>
              <div className="space-y-1">
                {filterCategories.genres.map((item: SelectOption) => {
                  return <Field key={item.id} className="flex items-center gap-2">
                    <Checkbox className="group checkbox">
                      <CheckIcon size={14}
                        weight="bold"
                        className="hidden group-data-checked:block"/>
                    </Checkbox>
                    <Label>{item.label}</Label>
                  </Field>
                })}
              </div>
            </div>
          </>
        )}
      </section>

      <section className="container px-4 md:px-10 pt-12 md:pt-24 pb-6 md:pb-12 space-y-4 md:space-y-6">
        <h1 className="">{platformFamilySlug} Games</h1>
        <div className="grid grid-cols-2 gap-4">
          {games.map((game: GameOverview) => {
            return (
              <GameCard key={game.id} gameOverview={game}/>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default GameResultsPage;