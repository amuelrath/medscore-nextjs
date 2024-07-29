import React from "react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import Counter from "@/components/ui/counter";

const chartConfig = {
} satisfies ChartConfig;

export function GaugeChart({ fill, score, label }: { fill: string; score: number; label?: string }) {
  const chartData = [{ score, fill }];

  return (
    <ChartContainer config={chartConfig} className="mx-auto drop-shadow-xl size-52">
      <RadialBarChart
        data={chartData}
        endAngle={chartData[0].score * 360}
        innerRadius={80}
        outerRadius={140}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar
          dataKey="score"
          color={fill}
          animationDuration={500}
          className="shadow-inner"
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <g>
                    <foreignObject
                      x={(viewBox.cx || 0) - 50}
                      y={(viewBox.cy || 0) - 20}
                      width="100"
                      height="40"
                    >
                      <div className="fill-foreground text-center text-3xl font-bold">
                        <Counter
                          animationOptions={{ times: [0, 0.1] }}
                          from={0}
                          to={chartData[0].score * 100}
                        />
                      </div>
                    </foreignObject>
                    <text
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      textAnchor="middle"
                      className="fill-muted-foreground"
                    >
                      {label}
                    </text>
                  </g>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}