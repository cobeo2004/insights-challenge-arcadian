import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { start } from "workflow/api";
import { processCSVWorkflow } from "@/server/workflows/process-csv";

const METADATA_PATH = path.join(
  process.cwd(),
  "public/data/processed/metadata.json",
);

export async function POST() {
  if (fs.existsSync(METADATA_PATH)) {
    return NextResponse.json({ status: "already_completed" });
  }

  await start(processCSVWorkflow, []);

  return NextResponse.json({ status: "started" });
}

export async function GET() {
  if (fs.existsSync(METADATA_PATH)) {
    return NextResponse.json({
      status: "completed",
      total: 1,
      processed: 1,
      error: null,
    });
  }

  return NextResponse.json({
    status: "pending",
    total: 0,
    processed: 0,
    error: null,
  });
}
