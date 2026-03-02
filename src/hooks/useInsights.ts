import { useChat } from "@ai-sdk/react";
import { WorkflowChatTransport } from "@workflow/ai";
import { useCallback, useRef } from "react";

import type { DateRangeFilter } from "@/lib/types";

function buildAutoPrompt(dateRange?: DateRangeFilter): string {
  const start = dateRange?.startDate ?? "the earliest available date";
  const end = dateRange?.endDate ?? "the latest available date";

  return `Analyze the date range ${start} to ${end}. Provide a comprehensive SEO report:

1. Full-Period Performance Summary: Total clicks, impressions, notable daily patterns, best/worst days.
2. Quick Wins: Keywords at position 4-10 with high impressions (push to top 3), keywords at position 1-3 with low CTR (improve titles/descriptions).
3. Top Performers: Top keywords and pages by clicks, trending direction.

Use the analyzeSearchData tool with topN=100. Present with clear sections, tables where appropriate.`;
}

export const useInsights = (dateRange?: DateRangeFilter) => {
  const dateRangeRef = useRef(dateRange);
  dateRangeRef.current = dateRange;

  const transportRef = useRef(
    new WorkflowChatTransport({
      api: "/api/insights",
      prepareSendMessagesRequest: ({ messages, api, trigger, messageId }) => ({
        api,
        body: { messages, dateRange: dateRangeRef.current },
        trigger,
        messageId,
      }),
    }),
  );

  const chat = useChat({ transport: transportRef.current });

  const isStreaming =
    chat.status === "streaming" || chat.status === "submitted";

  const generate = useCallback(() => {
    chat.setMessages([]);
    const prompt = buildAutoPrompt(dateRange);
    // Use setTimeout to avoid React batching issues
    setTimeout(() => {
      chat.sendMessage({ text: prompt });
    }, 0);
  }, [chat.setMessages, chat.sendMessage, dateRange]);

  const reset = useCallback(() => {
    chat.setMessages([]);
  }, [chat.setMessages]);

  return {
    messages: chat.messages,
    status: chat.status,
    generate,
    reset,
    isStreaming,
  };
};
