"use client";

import { BarChart3, Eye, MousePointerClick, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyAggregate } from "@/lib/types";

interface MetricCardsProps {
  data: DailyAggregate[];
}

export function MetricCards({ data }: MetricCardsProps) {
  const totalImpressions = data.reduce((sum, d) => sum + d.impressions, 0);
  const totalClicks = data.reduce((sum, d) => sum + d.clicks, 0);
  const avgCtr =
    data.length > 0
      ? data.reduce((sum, d) => sum + d.avgCtr, 0) / data.length
      : 0;
  const avgPosition =
    data.length > 0
      ? data.reduce((sum, d) => sum + d.avgPosition, 0) / data.length
      : 0;

  const metrics = [
    {
      label: "Total Impressions",
      value: totalImpressions.toLocaleString(),
      icon: Eye,
    },
    {
      label: "Total Clicks",
      value: totalClicks.toLocaleString(),
      icon: MousePointerClick,
    },
    {
      label: "Avg CTR",
      value: `${(avgCtr * 100).toFixed(2)}%`,
      icon: BarChart3,
    },
    {
      label: "Avg Position",
      value: avgPosition.toFixed(1),
      icon: Target,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{m.label}</CardTitle>
            <m.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{m.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
