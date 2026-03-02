export interface GSCRawRow {
  id: string;
  analyticsType: string;
  device: string;
  clicks: number;
  impressions: number;
  analyticsDate: string;
  ctr: number;
  position: number;
  keyword: string;
  pageId: string;
  pageUrl: string;
  pageDate: string;
  trackedPage: string;
  googleSearchConsoleSitesId: string;
}

export interface DailyAggregate {
  date: string;
  clicks: number;
  impressions: number;
  avgCtr: number;
  avgPosition: number;
  uniqueKeywords: number;
  uniquePages: number;
}

export interface KeywordSummary {
  keyword: string;
  clicks: number;
  impressions: number;
  avgCtr: number;
  avgPosition: number;
}

export interface PageSummary {
  pageUrl: string;
  clicks: number;
  impressions: number;
  avgCtr: number;
  avgPosition: number;
}

export interface DataMetadata {
  startDate: string;
  endDate: string;
  totalRows: number;
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
  uniqueKeywords: number;
  uniquePages: number;
  processedAt: string;
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface SearchDataResponse {
  daily: DailyAggregate[];
  metadata: DataMetadata;
}

export interface ProcessingStatusData {
  status: "pending" | "processing" | "completed" | "failed";
  total: number;
  processed: number;
  error: string | null;
}
