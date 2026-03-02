import { createUIMessageStreamResponse, type UIMessage } from "ai";
import { start } from "workflow/api";
import type { DateRangeFilter } from "@/lib/types";
import { insightsAgentWorkflow } from "@/server/workflows/insights-agent";

export async function POST(request: Request) {
  const { messages, dateRange } = (await request.json()) as {
    messages: UIMessage[];
    dateRange?: DateRangeFilter;
  };

  const lastUserMessage = messages.findLast((m) => m.role === "user");
  const query =
    lastUserMessage?.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("") ?? "";

  const run = await start(insightsAgentWorkflow, [query, dateRange]);

  return createUIMessageStreamResponse({
    stream: run.readable,
    headers: {
      "x-workflow-run-id": run.runId,
    },
  });
}
