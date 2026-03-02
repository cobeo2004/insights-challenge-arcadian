import fs from "node:fs";
import path from "node:path";
import type {
  DailyAggregate,
  GSCRawRow,
  KeywordSummary,
  PageSummary,
} from "@/lib/types";

export const aggregateDataStep = async () => {
  "use step";

  const inputPath = path.join(
    process.cwd(),
    "public/data/processed/parsed-rows.json",
  );
  const rows: GSCRawRow[] = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

  // Daily aggregates
  const dailyMap = new Map<
    string,
    {
      clicks: number;
      impressions: number;
      ctrSum: number;
      posSum: number;
      count: number;
      keywords: Set<string>;
      pages: Set<string>;
    }
  >();

  // Keyword aggregates
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

  // Page aggregates
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

  for (const row of rows) {
    const date = row.analyticsDate;

    // Daily
    let daily = dailyMap.get(date);
    if (!daily) {
      daily = {
        clicks: 0,
        impressions: 0,
        ctrSum: 0,
        posSum: 0,
        count: 0,
        keywords: new Set(),
        pages: new Set(),
      };
      dailyMap.set(date, daily);
    }
    daily.clicks += row.clicks;
    daily.impressions += row.impressions;
    daily.ctrSum += row.ctr;
    daily.posSum += row.position;
    daily.count++;
    daily.keywords.add(row.keyword);
    daily.pages.add(row.pageUrl);

    // Keyword
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

    // Page
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

  // Build daily aggregates sorted by date
  const dailyAggregates: DailyAggregate[] = Array.from(dailyMap.entries())
    .map(([date, d]) => ({
      date,
      clicks: d.clicks,
      impressions: d.impressions,
      avgCtr: d.count > 0 ? d.ctrSum / d.count : 0,
      avgPosition: d.count > 0 ? d.posSum / d.count : 0,
      uniqueKeywords: d.keywords.size,
      uniquePages: d.pages.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Build keyword summaries (top 500 by impressions)
  const keywordSummaries: KeywordSummary[] = Array.from(keywordMap.entries())
    .map(([keyword, k]) => ({
      keyword,
      clicks: k.clicks,
      impressions: k.impressions,
      avgCtr: k.count > 0 ? k.ctrSum / k.count : 0,
      avgPosition: k.count > 0 ? k.posSum / k.count : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 500);

  // Build page summaries
  const pageSummaries: PageSummary[] = Array.from(pageMap.entries())
    .map(([pageUrl, p]) => ({
      pageUrl,
      clicks: p.clicks,
      impressions: p.impressions,
      avgCtr: p.count > 0 ? p.ctrSum / p.count : 0,
      avgPosition: p.count > 0 ? p.posSum / p.count : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions);

  const outputDir = path.join(process.cwd(), "public/data/processed");
  fs.writeFileSync(
    path.join(outputDir, "daily-aggregates.json"),
    JSON.stringify(dailyAggregates),
  );
  fs.writeFileSync(
    path.join(outputDir, "keywords-summary.json"),
    JSON.stringify(keywordSummaries),
  );
  fs.writeFileSync(
    path.join(outputDir, "pages-summary.json"),
    JSON.stringify(pageSummaries),
  );

  return { dailyCount: dailyAggregates.length };
};
