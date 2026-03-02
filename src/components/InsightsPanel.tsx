"use client";

import type { UIMessage } from "ai";
import { Check, CircleX, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const toolLabels: Record<string, string> = {
  analyzeSearchData: "Analyzing search data",
};

function getToolLabel(toolName: string) {
  return toolLabels[toolName] ?? `Running ${toolName}`;
}

interface InsightsPanelProps {
  messages: UIMessage[];
  isStreaming: boolean;
}

export function InsightsPanel({ messages, isStreaming }: InsightsPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const assistantMessages = messages.filter((m) => m.role === "assistant");
  const messageCount = assistantMessages.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageCount]);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-0 pb-3">
        <CardTitle className="text-sm">AI Insights</CardTitle>
        <p className="text-xs text-muted-foreground">
          AI-powered performance analysis
        </p>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 p-0">
        <ScrollArea className="h-full px-5" ref={scrollRef}>
          {assistantMessages.length > 0 ? (
            <div className="space-y-4 py-4">
              {assistantMessages.map((message) => (
                <div key={message.id} className="flex flex-col items-start">
                  {message.parts.map((part, i) => {
                    const key = `${message.id}-part-${i}`;

                    if (part.type === "text") {
                      return (
                        <div
                          key={key}
                          className="max-w-full overflow-x-auto rounded-lg bg-muted px-3 py-2 text-sm text-foreground"
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h2: ({ children }) => (
                                <h4 className="mt-2 mb-1 font-semibold">
                                  {children}
                                </h4>
                              ),
                              h3: ({ children }) => (
                                <h5 className="mt-1.5 mb-0.5 font-medium">
                                  {children}
                                </h5>
                              ),
                              p: ({ children }) => (
                                <p className="my-0.5">{children}</p>
                              ),
                              ul: ({ children }) => (
                                <ul className="my-1 list-disc pl-4">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="my-1 list-decimal pl-4">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="my-0.5">{children}</li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold">
                                  {children}
                                </strong>
                              ),
                              code: ({ children, className }) => {
                                const isBlock =
                                  className?.includes("language-");
                                if (isBlock) {
                                  return (
                                    <code className="block overflow-x-auto rounded bg-background/50 p-2 text-xs">
                                      {children}
                                    </code>
                                  );
                                }
                                return (
                                  <code className="rounded bg-background/50 px-1 py-0.5 text-xs">
                                    {children}
                                  </code>
                                );
                              },
                              pre: ({ children }) => (
                                <pre className="my-1">{children}</pre>
                              ),
                              table: ({ children }) => (
                                <div className="my-1 overflow-x-auto">
                                  <table className="min-w-full text-xs">
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="border-b px-2 py-1 text-left font-medium">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="border-b px-2 py-1">
                                  {children}
                                </td>
                              ),
                              a: ({ children, href }) => (
                                <a
                                  href={href}
                                  className="text-primary underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {part.text}
                          </ReactMarkdown>
                        </div>
                      );
                    }

                    if (
                      part.type.startsWith("tool-") ||
                      part.type === "dynamic-tool"
                    ) {
                      const toolPart = part as {
                        type: string;
                        toolName?: string;
                        state: string;
                        errorText?: string;
                      };
                      const toolName =
                        toolPart.toolName ?? part.type.replace("tool-", "");
                      const label = getToolLabel(toolName);
                      const isRunning =
                        toolPart.state === "input-streaming" ||
                        toolPart.state === "input-available";
                      const isError = toolPart.state === "output-error";

                      return (
                        <div
                          key={key}
                          className="my-1 flex items-center gap-1.5 text-xs text-muted-foreground"
                        >
                          {isRunning ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : isError ? (
                            <CircleX className="size-3 text-destructive" />
                          ) : (
                            <Check className="size-3 text-green-600 dark:text-green-400" />
                          )}
                          <span>
                            {isRunning
                              ? `${label}...`
                              : isError
                                ? `${label} failed`
                                : `${label} done`}
                          </span>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              ))}
            </div>
          ) : isStreaming ? (
            <div className="flex h-full items-center justify-center py-20">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span>Generating insights...</span>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center py-20 text-sm text-muted-foreground">
              Click "Generate Insights" to start analysis
            </div>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
