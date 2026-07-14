import { useState } from "react";
import FeatureCard from "./FeatureCard.tsx";
import explorePageImg from "../assets/images/screenshots/explore-page.png";
import addToLibraryImg from "../assets/images/screenshots/add-to-library.png";
import libraryPageImg from "../assets/images/screenshots/library-page.png";
import filterLibraryImg from "../assets/images/screenshots/filter-library.png";

type Feature = {
  id: string;
  title: string;
  description: string;
  imgSrc: string;
}

const features: Feature[] = [
  {
    id: "discover",
    title: "Discover games",
    description: `Explore games across PlayStation, Xbox, Nintendo, and PC and add to your collection.`,
    imgSrc: explorePageImg
  },
  {
    id: "organize",
    title: "Organize your collection",
    description: `Keep track of physical and digital games across platforms in one place.`,
    imgSrc: addToLibraryImg
  },
  {
    id: "backlog",
    title: "Manage your backlog",
    description: `Update play status in your collection so you always know what's next.`,
    imgSrc: libraryPageImg
  },
  {
    id: "filter",
    title: "Decide what to play next",
    description: `Filter your collection by platform, genre, play time, rating, and more to find what you're in the mood for.`,
    imgSrc: filterLibraryImg
  },
]

const FeatureShowcase = () => {
  const [ selectedFeature, setSelectedFeature ] = useState(features[0].id);
  const activeFeature = features.find(f => f.id === selectedFeature)!;

  return (
    <>
      <div className="space-y-4">
        <h2>Everything you need to manage your collection</h2>
        <p className="text-lg lg:text-xl">
          From discovering new games to organizing your backlog, Press Start keeps everything in one place.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="order-last lg:order-first flex flex-row overflow-x-auto lg:flex-col lg:overflow-visible lg:w-1/3 gap-4"
          role="tablist">
          {features.map(feature => (
            <FeatureCard
              key={feature.id}
              id={feature.id}
              role="tab"
              title={feature.title}
              description={feature.description}
              aria-selected={selectedFeature === feature.id}
              aria-controls={`panel-${feature.id}`}
              className="shrink-0 w-72 lg:w-auto lg:flex-1"
              onClick={() => setSelectedFeature(feature.id)}
            />
          ))}
        </div>

        <div
          id={`panel-${activeFeature.id}`}
          role="tabpanel"
          aria-labelledby={activeFeature.id}
          className="order-first lg:order-last p-4 bg-secondary-900 border border-secondary-100/20 rounded-3xl">
          <img src={activeFeature.imgSrc} alt={`Screenshot of ${activeFeature.title}`}/>
        </div>
      </div>
    </>
  )
}

export default FeatureShowcase;