import fs from "node:fs";
import path from "node:path";
import type { GSCRawRow } from "@/lib/types";

function parseCSVRow(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        fields.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  fields.push(current);
  return fields;
}

export const parseCSVStep = async () => {
  "use step";

  const csvPath = path.join(process.cwd(), "public/data/arckeywords.csv");
  const outputPath = path.join(
    process.cwd(),
    "public/data/processed/parsed-rows.json",
  );

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split(/\r?\n/);

  const rows: GSCRawRow[] = [];
  // Line 0 = header, line 1 = duplicate header, start from line 2
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCSVRow(line);
    if (fields.length < 14) continue;

    rows.push({
      id: fields[0],
      analyticsType: fields[1],
      device: fields[2],
      clicks: Number(fields[3]) || 0,
      impressions: Number(fields[4]) || 0,
      analyticsDate: fields[5],
      ctr: Number.parseFloat(fields[6]) || 0,
      position: Number.parseFloat(fields[7]) || 0,
      keyword: fields[8],
      pageId: fields[9],
      pageUrl: fields[10],
      pageDate: fields[11],
      trackedPage: fields[12],
      googleSearchConsoleSitesId: fields[13],
    });
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(rows));

  return { totalRows: rows.length };
};
