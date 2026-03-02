import fs from "node:fs";
import path from "node:path";
import type { GSCRawRow } from "@/lib/types";

export const splitDailyStep = async () => {
  "use step";

  const inputPath = path.join(
    process.cwd(),
    "public/data/processed/parsed-rows.json",
  );
  const rows: GSCRawRow[] = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

  const byDate = new Map<string, GSCRawRow[]>();
  for (const row of rows) {
    const date = row.analyticsDate;
    let arr = byDate.get(date);
    if (!arr) {
      arr = [];
      byDate.set(date, arr);
    }
    arr.push(row);
  }

  const rawDir = path.join(process.cwd(), "public/data/processed/raw");
  fs.mkdirSync(rawDir, { recursive: true });

  for (const [date, dateRows] of byDate) {
    fs.writeFileSync(
      path.join(rawDir, `${date}.json`),
      JSON.stringify(dateRows),
    );
  }

  return { dateFiles: byDate.size };
};
