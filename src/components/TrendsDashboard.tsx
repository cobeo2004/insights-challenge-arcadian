"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useInsights } from "@/hooks/useInsights";
import { useProcessingStatus } from "@/hooks/useProcessingStatus";
import { useSearchData } from "@/hooks/useSearchData";
import type { DateRangeFilter as DateRangeFilterType } from "@/lib/types";
import { DateRangeFilter } from "./DateRangeFilter";
import { InsightsPanel } from "./InsightsPanel";
import { MetricCards } from "./MetricCards";
import { ProcessingPanel } from "./ProcessingPanel";
import { SearchTrendsChart } from "./SearchTrendsChart";

export function TrendsDashboard() {
  const { data: status } = useProcessingStatus();
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<DateRangeFilterType>({});
  const [showInsights, setShowInsights] = useState(false);
  const { data: searchData, isLoading } = useSearchData(dateRange);
  const { messages, generate, reset, isStreaming } = useInsights(dateRange);

  const isCompleted = status?.status === "completed";
  const prevCompletedRef = useRef(isCompleted);

  useEffect(() => {
    if (isCompleted && !prevCompletedRef.current) {
      queryClient.invalidateQueries({ queryKey: ["search-data"] });
    }
    prevCompletedRef.current = isCompleted;
  }, [isCompleted, queryClient]);

  if (!isCompleted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <ProcessingPanel />
      </div>
    );
  }

  const handleInsightsToggle = () => {
    if (showInsights) {
      reset();
      setShowInsights(false);
    } else {
      generate();
      setShowInsights(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <DateRangeFilter
          dateRange={dateRange}
          minDate={searchData?.metadata?.startDate}
          maxDate={searchData?.metadata?.endDate}
          onApply={setDateRange}
        />
        <Button
          variant={showInsights ? "secondary" : "default"}
          onClick={handleInsightsToggle}
          disabled={isStreaming}
        >
          {isStreaming ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 size-4" />
          )}
          {isStreaming
            ? "Generating..."
            : showInsights
              ? "Hide Insights"
              : "Generate Insights"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <MetricCards data={searchData?.daily ?? []} />

          <div
            className={
              showInsights ? "grid grid-cols-1 gap-6 lg:grid-cols-5" : undefined
            }
          >
            <div className={showInsights ? "lg:col-span-3" : undefined}>
              <SearchTrendsChart data={searchData?.daily ?? []} />
            </div>
            {showInsights && (
              <div className="lg:col-span-2">
                <InsightsPanel messages={messages} isStreaming={isStreaming} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
