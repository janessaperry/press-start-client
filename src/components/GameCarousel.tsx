import { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaCarouselType } from 'embla-carousel'
import { CaretLeftIcon, CaretRightIcon, CircleIcon } from "@phosphor-icons/react";
import { PacmanIcon } from "@/components/icons";
import { GameOverview } from "../pages/ExplorePage/ExplorePage.tsx";
import GameCard from "./GameCard.tsx";
import ButtonIcon from "./ButtonIcon.tsx";

type GameOverviewData = {
  games: GameOverview[]
}

const GameCarousel = ({games}: GameOverviewData) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    loop: true
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi])

  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [])

  const onDotButtonClick = (index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index)
  }

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);

    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="grow flex flex-wrap items-center gap-1">
          {scrollSnaps.map((_, index) => (
            <button key={index} onClick={() => onDotButtonClick(index)}
              className={`bg-transparent p-0 flex items-center justify-center rounded-full touch-manipulation 
              ${index === selectedIndex ? `text-success` : `text-interactive-primary/20 hover:text-interactive-primary-hover/60`}`}
            >
              {index === selectedIndex ?
                <PacmanIcon className="icon-md"/> :
                <CircleIcon className="icon-md"/>
              }
            </button>
          ))}
        </div>


        <div className="flex gap-2 self-end">
          <ButtonIcon variant="ghost" iconSize="md" icon={CaretLeftIcon} handleClick={scrollPrev}/>
          <ButtonIcon variant="ghost" iconSize="md" icon={CaretRightIcon} handleClick={scrollNext}/>
        </div>
      </div>

      <div className="overflow-hidden relative" ref={emblaRef}>
        <div className="flex -ml-4">
          {games.map(game => {
            return (
              <div key={game.id} className="flex-[0_0_42%] min-w-0 pl-4 flex">
                <GameCard gameOverview={game}/>
              </div>
            )
          })}
        </div>

        {/* gradient overlay */}
        <span className="block absolute top-0 right-0 h-full w-1/5 bg-linear-to-r from-blue-900/0 to-blue-900/60"
          aria-hidden="true"></span>
      </div>
    </div>
  )
}

export default GameCarousel;
