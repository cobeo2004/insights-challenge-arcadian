import { getQueryClient } from "@/lib/query";
import { SearchDataService } from "@/services/search-data-service";
import { TrendsView } from "@/views/TrendsView";

export async function TrendsScreen() {
  const qc = getQueryClient();
  await Promise.all([
    qc.prefetchQuery(SearchDataService.getProcessingStatus()),
    qc.prefetchQuery(SearchDataService.getSearchData()),
  ]);
  return <TrendsView />;
}
