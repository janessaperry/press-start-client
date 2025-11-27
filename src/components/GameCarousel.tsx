import { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaCarouselType } from 'embla-carousel'
import { CaretLeftIcon, CaretRightIcon, CircleIcon } from "@phosphor-icons/react";
import { GameOverview } from "../pages/ExplorePage/ExplorePage.tsx";
import GameCard from "./GameCard.tsx";
import ButtonIcon from "./ButtonIcon.tsx";
import { PacmanIcon } from "@/components/icons";

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

  const [scrollSnaps, setScrollSnaps] = useState([]);
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
    <div className="embla flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            >
              {index === selectedIndex ?
                <PacmanIcon className="icon-md"/> :
                <CircleIcon className="icon-md"/>}
            </button>
          ))}
        </div>


        <div className="flex gap-2 self-end">
          <ButtonIcon variant="ghost"
            iconSize="md" icon={CaretLeftIcon} handleClick={scrollPrev}/>
          <ButtonIcon variant="ghost"
            iconSize="md" icon={CaretRightIcon} handleClick={scrollNext}/>
        </div>
      </div>

      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {games.map(game => {
              return (
                <GameCard key={game.id} gameOverview={game} className="embla__slide"/> )
            }
          )}
        </div>
      </div>
    </div>
  )
}

export default GameCarousel;
