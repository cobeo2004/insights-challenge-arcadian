import fs from "node:fs";
import path from "node:path";
import type { DailyAggregate, DataMetadata, GSCRawRow } from "@/lib/types";

export const writeMetadataStep = async () => {
  "use step";

  const outputDir = path.join(process.cwd(), "public/data/processed");

  const dailyAggregates: DailyAggregate[] = JSON.parse(
    fs.readFileSync(path.join(outputDir, "daily-aggregates.json"), "utf-8"),
  );

  const parsedRows: GSCRawRow[] = JSON.parse(
    fs.readFileSync(path.join(outputDir, "parsed-rows.json"), "utf-8"),
  );

  const allKeywords = new Set<string>();
  const allPages = new Set<string>();
  let totalClicks = 0;
  let totalImpressions = 0;
  let ctrSum = 0;
  let posSum = 0;

  for (const row of parsedRows) {
    allKeywords.add(row.keyword);
    allPages.add(row.pageUrl);
    totalClicks += row.clicks;
    totalImpressions += row.impressions;
    ctrSum += row.ctr;
    posSum += row.position;
  }

  const metadata: DataMetadata = {
    startDate: dailyAggregates[0]?.date ?? "",
    endDate: dailyAggregates[dailyAggregates.length - 1]?.date ?? "",
    totalRows: parsedRows.length,
    totalClicks,
    totalImpressions,
    avgCtr: parsedRows.length > 0 ? ctrSum / parsedRows.length : 0,
    avgPosition: parsedRows.length > 0 ? posSum / parsedRows.length : 0,
    uniqueKeywords: allKeywords.size,
    uniquePages: allPages.size,
    processedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(outputDir, "metadata.json"),
    JSON.stringify(metadata, null, 2),
  );

  return metadata;
};
