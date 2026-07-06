export type SelectOption<T extends string | number = number> = {
  id: T;
  label: string;
}

export type LibraryFormatOption = SelectOption & { enum?: LibraryFormatEnum; }
export type LibraryStatusOption = SelectOption & { enum?: LibraryStatusEnum; }

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
  libraryFormatControls?: SelectOption[];
}

export type SelectedFilters = {
  platform: number[];
  genres: number[];
  timeToBeat: number[];
  totalRating: number[];
  releaseDate: number[];
  gameType: number[];
  libraryStatus: number[];
  libraryFormat: number[];
}

export type Result = {
  id: number;
  name: string;
  coverId: string | null;
}

//******************************//
//********* GAME TYPES *********//
//******************************//

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

//*******************************//
//******** LIBRARY TYPES ********//
//*******************************//

export type LibraryStatusEnum = 'WANT_TO_PLAY' | 'PLAYING' | 'PLAYED' | 'ON_PAUSE' | 'WISHLIST';
export type LibraryFormatEnum = 'DIGITAL' | 'PHYSICAL';
export type LibraryGame = {
  libraryStatus: LibraryStatusOption;
  libraryFormat: LibraryFormatOption;
  libraryPlatform: SelectOption;
  gameOverview: GameOverview;
}