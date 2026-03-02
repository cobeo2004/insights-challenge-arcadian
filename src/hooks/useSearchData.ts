import { useQuery } from "@tanstack/react-query";
import type { DateRangeFilter } from "@/lib/types";
import { SearchDataService } from "@/services/search-data-service";

export const useSearchData = (dateRange?: DateRangeFilter) =>
  useQuery(SearchDataService.getSearchData(dateRange));
