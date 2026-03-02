import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import type { DailyAggregate, DataMetadata } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "public/data/processed");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  const metadataPath = path.join(DATA_DIR, "metadata.json");
  if (!fs.existsSync(metadataPath)) {
    return NextResponse.json(
      { error: "Data not processed yet" },
      { status: 404 },
    );
  }

  const metadata: DataMetadata = JSON.parse(
    fs.readFileSync(metadataPath, "utf-8"),
  );
  const dailyAggregates: DailyAggregate[] = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, "daily-aggregates.json"), "utf-8"),
  );

  let filtered = dailyAggregates;
  if (startDate) {
    filtered = filtered.filter((d) => d.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter((d) => d.date <= endDate);
  }

  return NextResponse.json({ daily: filtered, metadata });
}
