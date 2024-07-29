"use client";
import {
  PolarAngleAxis,
  PolarGrid, PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetResponseCompetencyScores } from "@/hooks/queries/use-get-response-competency-scores";
import { TCompetencyScores, ZCompetencyScoresSchema } from "@/db/schema";
import { useAtomValue } from "jotai";
import { selectedResponseIdAtom } from "@/store/form-atoms";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, m } from "framer-motion";

const chartConfig = {
  ICS: {
    label: "ICS",
    color: "black",
  },
  SBP: {
    label: "SBP",
    color: "black",
  },
  MK: {
    label: "MK",
    color: "black",
  },
  PROF: {
    label: "PROF",
    color: "black",
  },
  PC: {
    label: "PC",
    color: "black",
  },
  PBLI: {
    label: "PBLI",
    color: "black",
  },
} satisfies ChartConfig;

type ChartData = {
  competencyName: string;
  date: Date;
  score: number;
}[];

function extractChartData(data: TCompetencyScores): ChartData {
  return data.competencies.map((competency) => ({
    competencyName: competency.name,
    date: data.responseCreatedAt,
    score: calculateScore(competency.pointsEarned, competency.pointsAvailable),
  }));
}

function calculateScore(pointsEarned: number, pointsAvailable: number): number {
  if (pointsAvailable === 0) return 0;
  return (pointsEarned / pointsAvailable) * 100;
}

export function CompetencyRadarChart() {
  const selectedResponseId = useAtomValue(selectedResponseIdAtom);
  const { responseCompetencyScores, isLoading } =
    useGetResponseCompetencyScores();

  if (!selectedResponseId) return <>no selected responseId</>;
  const selectedResponseScores = responseCompetencyScores?.find(
    (rcs) => rcs.responseId === selectedResponseId,
  );

  if (isLoading) return <RadarChartSkeleton />;

  if (!selectedResponseScores) return <>no data</>;

  const parsedData = {
    responseId: selectedResponseId,
    responseCreatedAt: selectedResponseScores.responseCreatedAt,
    competencies: ZCompetencyScoresSchema.parse(
      selectedResponseScores.competencyScores,
    ).competencies,
  };

  const chartData = extractChartData(parsedData);

  return (
    <AnimatePresence mode="wait">
      <m.div
        className="mx-auto h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <RadarChart data={chartData} width={200} height={200}>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => {
                      const percent = Number(value).toFixed(1) + "%";
                      return (
                        <div className="flex flex-row items-center space-x-2">
                          <span className="size-3 rounded bg-lavender"></span>
                          <p className="font-mono">{percent}</p>
                        </div>
                      );
                    }}
                  />
                }
              />
              <PolarGrid
                className="fill-neutral-500 opacity-10"
                gridType="circle"
              />
              <PolarAngleAxis dataKey="competencyName" />
              <PolarRadiusAxis className="opacity-0" domain={[0, 100]} />
              <Radar
                dataKey="score"
                fill="hsl(var(--lavender))"
                fillOpacity={0.6}
                animationDuration={300}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </m.div>
    </AnimatePresence>
  );
}

const RadarChartSkeleton = () => (
  <div className="p-5">
    <Skeleton className="mx-auto size-[8.4rem] rounded-full" />
  </div>
);
