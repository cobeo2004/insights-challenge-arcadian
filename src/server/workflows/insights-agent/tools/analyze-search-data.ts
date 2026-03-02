import fs from "node:fs";
import path from "node:path";
import type {
  DailyAggregate,
  GSCRawRow,
  KeywordSummary,
  PageSummary,
} from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "public/data/processed");

export const analyzeSearchDataStep = async (input: {
  startDate: string;
  endDate: string;
  topN?: number;
}) => {
  "use step";

  const { startDate, endDate, topN = 50 } = input;

  // Read daily aggregates and filter by date range
  const dailyAggregates: DailyAggregate[] = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, "daily-aggregates.json"), "utf-8"),
  );
  const filteredDaily = dailyAggregates.filter(
    (d) => d.date >= startDate && d.date <= endDate,
  );

  if (filteredDaily.length === 0) {
    const availableStart = dailyAggregates[0]?.date;
    const availableEnd = dailyAggregates[dailyAggregates.length - 1]?.date;
    return {
      error: `No data found for range ${startDate} to ${endDate}. Available data range: ${availableStart ?? "unknown"} to ${availableEnd ?? "unknown"}. Please retry with dates within this range.`,
    };
  }

  // Read per-day raw JSON files and re-aggregate keywords/pages for the period
  const keywordMap = new Map<
    string,
    {
      clicks: number;
      impressions: number;
      ctrSum: number;
      posSum: number;
      count: number;
    }
  >();
  const pageMap = new Map<
    string,
    {
      clicks: number;
      impressions: number;
      ctrSum: number;
      posSum: number;
      count: number;
    }
  >();

  let totalClicks = 0;
  let totalImpressions = 0;

  const rawDir = path.join(DATA_DIR, "raw");
  for (const day of filteredDaily) {
    const dayPath = path.join(rawDir, `${day.date}.json`);
    if (!fs.existsSync(dayPath)) continue;

    const rows: GSCRawRow[] = JSON.parse(fs.readFileSync(dayPath, "utf-8"));
    for (const row of rows) {
      totalClicks += row.clicks;
      totalImpressions += row.impressions;

      // Keyword aggregation
      let kw = keywordMap.get(row.keyword);
      if (!kw) {
        kw = { clicks: 0, impressions: 0, ctrSum: 0, posSum: 0, count: 0 };
        keywordMap.set(row.keyword, kw);
      }
      kw.clicks += row.clicks;
      kw.impressions += row.impressions;
      kw.ctrSum += row.ctr;
      kw.posSum += row.position;
      kw.count++;

      // Page aggregation
      let pg = pageMap.get(row.pageUrl);
      if (!pg) {
        pg = { clicks: 0, impressions: 0, ctrSum: 0, posSum: 0, count: 0 };
        pageMap.set(row.pageUrl, pg);
      }
      pg.clicks += row.clicks;
      pg.impressions += row.impressions;
      pg.ctrSum += row.ctr;
      pg.posSum += row.position;
      pg.count++;
    }
  }

  const topKeywords: KeywordSummary[] = Array.from(keywordMap.entries())
    .map(([keyword, k]) => ({
      keyword,
      clicks: k.clicks,
      impressions: k.impressions,
      avgCtr: k.count > 0 ? k.ctrSum / k.count : 0,
      avgPosition: k.count > 0 ? k.posSum / k.count : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, topN);

  const topPages: PageSummary[] = Array.from(pageMap.entries())
    .map(([pageUrl, p]) => ({
      pageUrl,
      clicks: p.clicks,
      impressions: p.impressions,
      avgCtr: p.count > 0 ? p.ctrSum / p.count : 0,
      avgPosition: p.count > 0 ? p.posSum / p.count : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20);

  // Summarize daily trends (first 5, last 5 for context)
  const dailySummary =
    filteredDaily.length <= 14
      ? filteredDaily
      : [...filteredDaily.slice(0, 5), ...filteredDaily.slice(-5)];

  return {
    period: { startDate, endDate, days: filteredDaily.length },
    totals: { clicks: totalClicks, impressions: totalImpressions },
    dailyTrend: dailySummary,
    topKeywords,
    topPages,
  };
};
