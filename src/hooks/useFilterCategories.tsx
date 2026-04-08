import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PLATFORM_FAMILY_BY_SLUG = {
  playstation: { label: "PlayStation", platformIds: [ 48, 167 ] },
  xbox: { label: "Xbox", platformIds: [ 49, 169 ] },
  pc: { label: "PC", platformIds: [ 3, 14, 6 ] },
  nintendo: { label: "Nintendo", platformIds: [ 130, 508 ] },
}

type SelectOption<T extends string | number = number> = {
  id: T,
  label: string,
}

type FilterCategories = {
  platformFamily?: SelectOption[],
  platform?: SelectOption[],
  genres?: SelectOption[],
  timeToBeat?: SelectOption[],
  totalRating?: SelectOption[]
  releaseDate?: SelectOption[]
}

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const useFilterCategories = () => {
  const { platformFamilySlug } = useParams();
  const platformFamily = PLATFORM_FAMILY_BY_SLUG[platformFamilySlug as keyof typeof PLATFORM_FAMILY_BY_SLUG];

  const [ filterCategories, setFilterCategories ] = useState<FilterCategories>({});

  useEffect(() => {
    const getFilterCategories = async () => {
      const response = await axios.get(`${baseServerUrl}/filters`);
      const filtersData = response.data;
      let platformFilters = filtersData.platform;

      if (platformFamily) {
        platformFilters = platformFilters.filter((p: SelectOption) => platformFamily.platformIds.includes(p.id));
      }
      setFilterCategories({ ...filtersData, platform: platformFilters });
    }

    void getFilterCategories();
  }, [ platformFamily ]);

  return filterCategories;
}

export default useFilterCategories;