import { useQuery } from "@tanstack/react-query";
import { SearchDataService } from "@/services/search-data-service";

export const useProcessingStatus = () =>
  useQuery({
    ...SearchDataService.getProcessingStatus(),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "processing" || status === "pending") return 2000;
      return false;
    },
  });
