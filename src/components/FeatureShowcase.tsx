import { useState } from "react";
import explorePageImg from "../assets/images/screenshots/explore-page.png";
import addToLibraryImg from "../assets/images/screenshots/add-to-library.png";
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
    description: `Explore games across PlayStation, Xbox, Nintendo, and PC and add them to your library.`,
    imgSrc: explorePageImg
  },
  {
    id: "manage",
    title: "Manage your games",
    description: `Track the console, format, and play status for every game in your library.`,
    imgSrc: addToLibraryImg
  },
  {
    id: "filter",
    title: "Decide what to play", //better title here?
    description: `Filter your library by console, genre, play time, rating, and more.`,
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
            <button
              key={feature.id}
              id={feature.id}
              role="tab"
              aria-selected={selectedFeature === feature.id}
              aria-controls={`panel-${feature.id}`}
              onClick={() => setSelectedFeature(feature.id)}
              className={`flex flex-col p-4 text-left bg-secondary-500 border border-secondary-200/20 hover:border-accent-300/40 aria-selected:border-accent-300/80 transition-colors space-y-2 rounded-2xl shrink-0 w-72 lg:w-auto lg:flex-1`}
            >
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </button>
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