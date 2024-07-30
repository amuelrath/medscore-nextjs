"use client";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { differenceInMonths, differenceInYears, formatDate } from "date-fns";
import { cn } from "@/lib/helpers/utils";
import { AnimatePresence, m } from "framer-motion";
import { useGetFormAssessments } from "@/hooks/queries/use-get-form-assessments";
import { AssessmentsResult } from "@/server/actions/responses/get-all-assessments-for-form";

type ChartData = {
  date: Date;
  score: number;
  responseId: string;
}[];

interface AssessmentScoreLineChartProps {
  h?: string;
  w?: string;
  fill?: string;
  label?: string;
  chartData: ChartData;
}

export function AssessmentScoreLineChart({
  h,
  w,
  fill,
  label = "Score",
  chartData,
}: AssessmentScoreLineChartProps) {
  const chartConfig = {
    score: {
      label,
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const { assessments, isLoading } = useGetFormAssessments();

  if (isLoading) return <>Loading...</>;

  const sortedChartData = chartData.sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  return (
    <AnimatePresence mode="wait">
      <m.div
        className={cn(h ? h : "h-full", w ? w : "w-full", "rounded bg-white")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChartContainer
          className={cn(h ? h : "h-full", w ? w : "w-full")}
          config={chartConfig}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedChartData}
              margin={{
                top: 20,
                right: 25,
                left: 25,
                bottom: 10,
              }}
            >
              <CartesianGrid vertical={false} />
              <YAxis
                dataKey="score"
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                hide
              />
              <XAxis
                dataKey="date"
                tickLine
                axisLine={false}
                tickMargin={12}
                tickSize={2}
                className="text-2xs"
                tickFormatter={(value: Date) =>
                  formatDate(value, getDateFormat(chartData))
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, _, props) => {
                      const assessmentTitle = getAssessmentTitleFromResponseId({
                        assessments,
                        selectedResponseId: props.payload.responseId
                      });
                      const percent = Number(value).toFixed(1) + "%";
                      return (
                        <div className="flex flex-col items-start space-y-1">
                          <div className="flex flex-row items-center space-x-2">
                            <span
                              className={cn(
                                "size-3 rounded",
                                fill ? `bg-${fill}` : "bg-primary",
                              )}
                            ></span>
                            <p className="font-mono">{percent}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {assessmentTitle}
                          </p>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Line
                dataKey="score"
                type="natural"
                stroke={cn(
                  fill ? `hsl(var(--${fill}))` : "hsl(var(--primary))",
                )}
                strokeWidth={2}
                animationDuration={300}
                dot={{
                  fill: cn(
                    fill ? `hsl(var(--${fill}))` : "hsl(var(--primary))",
                  ),
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </m.div>
    </AnimatePresence>
  );
}

function getAssessmentTitleFromResponseId({
  assessments,
  selectedResponseId,
}: {
  assessments: AssessmentsResult | undefined;
  selectedResponseId: string | undefined;
}) {
  if (!assessments || !selectedResponseId) return "Assessment Not Found.";
  return assessments.find((a) =>
    a.responses.find((r) => r.id === selectedResponseId),
  )?.title;
}
function getDateFormat(chartData: ChartData) {
  if (chartData.length < 2) {
    return "MMM d";
  }

  const sortedDates = chartData
    .map((item) => item.date)
    .sort((a, b) => a.getTime() - b.getTime());
  const firstDate = sortedDates[0];
  const lastDate = sortedDates[sortedDates.length - 1];

  const monthsDiff = differenceInMonths(lastDate, firstDate);
  const yearsDiff = differenceInYears(lastDate, firstDate);

  if (monthsDiff === 0) {
    return "MMM d";
  } else if (yearsDiff === 0) {
    return "MMM";
  } else {
    return "MMM yyyy";
  }
}
