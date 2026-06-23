export type SelectOption = {
  id: number;
  label: string;
  enum?: string;
}

export type FilterCategories = {
  platformFamily?: SelectOption[];
  platform?: SelectOption[];
  genres?: SelectOption[];
  timeToBeat?: SelectOption[];
  totalRating?: SelectOption[];
  releaseDate?: SelectOption[];
  gameType?: SelectOption[];
  libraryStatus?: SelectOption[];
  libraryFormat?: SelectOption[];
}

export type Result = {
  id: number,
  name: string,
  coverId: string | null
}

//******** GAME TYPES ********//
export type GameOverview = {
  id: number;
  name: string;
  coverId: string | null;
  slug: string;
  totalRating: number | null;
  platforms: {
    id: number;
    label: string;
  }[];
  gameType: {
    id: number;
    label: string;
  }
}

export type GameThumbnail = {
  id: number;
  name: string;
  slug: string;
  coverId: string | null;
}

export type GameDetails = {
  id: number;
  name: string;
  coverId: string | null;
  releaseDate: string | null;
  slug: string;
  summary: string;
  totalRating: number | null;
  gameType: {
    id: number;
    label: string;
  };
  developers: string[];
  publishers: string[];
  timeToBeat: {
    times: {
      label: string;
      value: number | null;
    }[];
    count: number | null;
  } | null;
  screenshotIds: string[];
  esrbRating: string;
  esrbThumbnailId: string;
  esrbDescriptions: string[];
  platforms: {
    id: number;
    label: string;
  }[];
  genres: SelectOption[];
  collections: {
    id: number;
    name: string;
    games: GameThumbnail[];
  }[];
  franchises: {
    id: number;
    name: string;
    games: GameThumbnail[];
  }[];
  baseGame: GameThumbnail;
  relatedContent: {
    expansions: GameThumbnail[];
    dlcs: GameThumbnail[];
  }
}