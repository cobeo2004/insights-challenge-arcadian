"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { DailyAggregate } from "@/lib/types";

const chartConfig = {
  impressions: {
    label: "Impressions",
    color: "hsl(221, 83%, 53%)",
  },
  clicks: {
    label: "Clicks",
    color: "hsl(142, 71%, 45%)",
  },
} satisfies ChartConfig;

interface SearchTrendsChartProps {
  data: DailyAggregate[];
}

export function SearchTrendsChart({ data }: SearchTrendsChartProps) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-AU", { month: "short", day: "numeric" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Search Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ComposedChart data={data} margin={{ left: 0, right: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={30}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
              }
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    if (payload?.[0]?.payload?.date) {
                      return new Date(
                        payload[0].payload.date,
                      ).toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    }
                    return "";
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <defs>
              <linearGradient id="fillImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-impressions)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-impressions)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <Area
              yAxisId="left"
              dataKey="impressions"
              type="monotone"
              fill="url(#fillImpressions)"
              stroke="var(--color-impressions)"
              strokeWidth={1.5}
            />
            <Line
              yAxisId="right"
              dataKey="clicks"
              type="monotone"
              stroke="var(--color-clicks)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
