import { queryOptions } from "@tanstack/react-query";
import type {
  DateRangeFilter,
  ProcessingStatusData,
  SearchDataResponse,
} from "@/lib/types";

// biome-ignore lint/complexity/noStaticOnlyClass: convention for service classes
export class SearchDataService {
  static getSearchData(dateRange?: DateRangeFilter) {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.set("startDate", dateRange.startDate);
    if (dateRange?.endDate) params.set("endDate", dateRange.endDate);

    return queryOptions({
      queryKey: ["search-data", dateRange],
      queryFn: async () => {
        const response = await fetch(`/api/search-data?${params.toString()}`);
        return response.json() as Promise<SearchDataResponse>;
      },
    });
  }

  static getProcessingStatus() {
    return queryOptions({
      queryKey: ["processing-status"],
      queryFn: async () => {
        const response = await fetch("/api/process");
        return response.json() as Promise<ProcessingStatusData>;
      },
    });
  }
}
