"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DateRangeFilter as DateRangeFilterType } from "@/lib/types";

interface DateRangeFilterProps {
  dateRange: DateRangeFilterType;
  minDate?: string;
  maxDate?: string;
  onApply: (dateRange: DateRangeFilterType) => void;
}

export function DateRangeFilter({
  dateRange,
  minDate,
  maxDate,
  onApply,
}: DateRangeFilterProps) {
  const [start, setStart] = useState(dateRange.startDate ?? minDate ?? "");
  const [end, setEnd] = useState(dateRange.endDate ?? maxDate ?? "");

  const handleApply = () => {
    onApply({ startDate: start || undefined, endDate: end || undefined });
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <label
          htmlFor="start-date"
          className="text-xs font-medium text-muted-foreground"
        >
          Start Date
        </label>
        <Input
          id="start-date"
          type="date"
          value={start}
          min={minDate}
          max={maxDate}
          onChange={(e) => setStart(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor="end-date"
          className="text-xs font-medium text-muted-foreground"
        >
          End Date
        </label>
        <Input
          id="end-date"
          type="date"
          value={end}
          min={minDate}
          max={maxDate}
          onChange={(e) => setEnd(e.target.value)}
          className="w-40"
        />
      </div>
      <Button onClick={handleApply} size="sm">
        Apply
      </Button>
    </div>
  );
}
