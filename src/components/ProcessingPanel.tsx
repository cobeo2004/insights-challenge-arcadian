"use client";

import {
  AlertCircle,
  Calendar,
  Database,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProcessingStatus } from "@/hooks/useProcessingStatus";

export function ProcessingPanel() {
  const { data: status } = useProcessingStatus();
  const queryClient = useQueryClient();
  const [starting, setStarting] = useState(false);

  const handleProcess = async () => {
    setStarting(true);
    try {
      await fetch("/api/process", { method: "POST" });
      await queryClient.invalidateQueries({ queryKey: ["processing-status"] });
    } catch {
      setStarting(false);
    }
  };

  const isProcessing = status?.status === "processing";
  const isCompleted = status?.status === "completed";
  const isLoading = starting || isProcessing;

  if (isCompleted) return null;

  return (
    <Card className="mx-auto w-full max-w-md overflow-hidden border-t-2 border-t-primary shadow-lg">
      <CardContent className="flex flex-col items-center gap-5 px-8 py-10 text-center">
        <div className="rounded-xl bg-primary/10 p-4">
          <Database className="size-7 text-primary" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold tracking-tight">
            Google Search Console Data
          </h2>
          <p className="text-sm text-muted-foreground">
            Process raw GSC keyword and page data for Arcadian Digital
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-normal">
            <FileSpreadsheet className="size-3" />
            431K Rows
          </Badge>
          <Badge variant="outline" className="text-xs font-normal">
            <Database className="size-3" />
            Keywords & Pages
          </Badge>
          <Badge variant="outline" className="text-xs font-normal">
            <Calendar className="size-3" />
            12 Months
          </Badge>
        </div>

        {isLoading ? (
          <div className="w-full space-y-3">
            <Progress value={undefined} className="h-1.5" />
            <p className="text-sm text-muted-foreground">
              <Loader2 className="mr-1.5 inline size-3.5 animate-spin align-text-bottom" />
              {isProcessing ? "Processing CSV data..." : "Starting..."}
            </p>
          </div>
        ) : (
          <Button
            size="lg"
            className="mt-1 w-full"
            onClick={handleProcess}
          >
            Process Data
          </Button>
        )}

        {status?.error && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-left text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{status.error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
