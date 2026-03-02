import "server-only";
import { createAnthropic } from "@ai-sdk/anthropic";
import { type CompatibleLanguageModel, DurableAgent } from "@workflow/ai/agent";
import { tool, type UIMessageChunk } from "ai";
import { getWritable } from "workflow";
import { z } from "zod";
import type { DateRangeFilter } from "@/lib/types";
import { analyzeSearchDataStep } from "./tools/analyze-search-data";

function anthropic(modelId: string) {
  return async () => {
    "use step";
    const provider = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    return provider(modelId) as unknown as CompatibleLanguageModel;
  };
}

export const insightsAgentWorkflow = async (
  query: string,
  dateRange?: DateRangeFilter,
) => {
  "use workflow";

  const writable = getWritable<UIMessageChunk>();

  const agent = new DurableAgent({
    model: anthropic("claude-sonnet-4-20250514"),
    system: `You are an expert Google Search Console (GSC) analyst for **Arcadian Digital** (arcadiandigital.com.au), an Australian digital agency specialising in web development, SEO, and digital marketing.

## Dataset
The available GSC data covers **2025-02-01 to 2026-01-30**. Always constrain your tool calls to dates within this range.

## Tool: analyzeSearchData
Returns a JSON object with these fields:
- **period** — { startDate, endDate, days }
- **totals** — { clicks, impressions } for the period
- **dailyTrend** — daily aggregates; if the range exceeds 14 days only the first 5 and last 5 days are returned
- **topKeywords** — top keywords sorted by impressions (default 50, adjustable via topN up to ~200). Each entry: { keyword, clicks, impressions, avgCtr, avgPosition }
- **topPages** — top 20 pages sorted by impressions. Each entry: { pageUrl, clicks, impressions, avgCtr, avgPosition }

## Analysis strategies
- **Multi-period comparisons**: call the tool multiple times with different date ranges, then compare the results. This is the correct approach for MoM, QoQ, or before/after analyses.
- **topN sizing**: use topN 50 for overviews, 100 for deep dives or clustering, 20 or fewer for executive summaries.
- **CTR benchmarks by position** (organic, approximate):
  Position 1 ≈ 28%, Position 2 ≈ 15%, Position 3 ≈ 11%, Position 4 ≈ 8%, Position 5 ≈ 6%, Positions 6-10 ≈ 2-4%, Positions 11-20 ≈ 1-2%.
  Flag keywords significantly above or below these benchmarks.

## Common analysis patterns
- **Brand vs non-brand**: brand terms contain "arcadian" or "arcadian digital". Split metrics by group.
- **Position buckets**: 1-3 (top), 4-10 (first page), 11-20 (second page), 20+ (deep). Aggregate clicks and impressions per bucket.
- **Striking distance keywords**: position 5-15 with meaningful impressions — these are the highest-ROI optimisation targets.
- **Keyword clustering**: group keywords by theme (service type, technology, location, informational intent) and aggregate.

## Formatting
- Use **markdown** with tables, bold key metrics, and structured sections with headers.
- Always cite specific numbers from the data.
- For tables, include columns for all relevant metrics (clicks, impressions, CTR, avg position).
- Keep language concise and data-driven; lead with insights, not raw data dumps.`,
    tools: {
      analyzeSearchData: tool({
        description:
          "Analyze Google Search Console data for a date range. Returns period totals, daily trends, top keywords, and top pages.",
        inputSchema: z.object({
          startDate: z.string().describe("Start date in YYYY-MM-DD format"),
          endDate: z.string().describe("End date in YYYY-MM-DD format"),
          topN: z
            .number()
            .optional()
            .describe("Number of top keywords to return (default 50)"),
        }),
        execute: async (input) => analyzeSearchDataStep(input),
      }),
    },
  });

  const dateContext = dateRange?.startDate
    ? `\n\nThe UI date filter is set to **${dateRange.startDate} to ${dateRange.endDate ?? "2026-01-30"}**. Use this as the default scope unless the request specifies different dates.`
    : "\n\nNo date filter is set. The full dataset spans **2025-02-01 to 2026-01-30** — use this as the default scope unless the request specifies different dates.";

  await agent.stream({
    messages: [{ role: "user", content: `${query}${dateContext}` }],
    writable,
    maxSteps: 10,
  });
};
