import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/client.ts";
import { getRetryAfterMessage } from "../utils/rateLimiting.ts";
import { FilterCategories, SelectOption } from "../types/common.ts";

const PLATFORM_FAMILY_BY_SLUG = {
  playstation: { label: "PlayStation", platformIds: [ 48, 167 ] },
  xbox: { label: "Xbox", platformIds: [ 49, 169 ] },
  pc: { label: "PC", platformIds: [ 3, 14, 6 ] },
  nintendo: { label: "Nintendo", platformIds: [ 130, 508 ] },
}

const useFilterCategories = (context?: string, userId?: number): FilterCategories & { error: string } => {
  const { platformFamilySlug } = useParams();
  const platformFamily = PLATFORM_FAMILY_BY_SLUG[platformFamilySlug as keyof typeof PLATFORM_FAMILY_BY_SLUG];

  const [ filterCategories, setFilterCategories ] = useState<FilterCategories>({});
  const [ error, setError ] = useState('');
  const query = context === 'library' ? `?context=${context}&userId=${userId}` : '';

  useEffect(() => {
    const getFilterCategories = async () => {
      try {
        const response = await apiClient.get(`/filters${query}`);
        const filtersData = response.data;
        let platformFilters = filtersData.platform;

        if (platformFamily) {
          platformFilters = platformFilters.filter((p: SelectOption) => platformFamily.platformIds.includes(p.id));
        }
        setFilterCategories({ ...filtersData, platform: platformFilters });
      }
      catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 429) {
          setError(getRetryAfterMessage(e.response.headers));
        }
        else {
          console.error('failed to fetch filter categories', e);
        }
      }
    }

    void getFilterCategories();
  }, [ platformFamilySlug ]);

  return { ...filterCategories, error };
}

export default useFilterCategories;
