'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  points: {
    label: 'Points',
  },
  1: {
    label: 'Level 1 Subcompetencies',
    color: 'hsl(170, 40%, 70%)',
  },
  2: {
    label: 'Level 2 Subcompetencies',
    color: 'hsl(170, 50%, 60%)',
  },
  3: {
    label: 'Level 3 Subcompetencies',
    color: 'hsl(170, 60%, 50%)',
  },
  4: {
    label: 'Level 4 Subcompetencies',
    color: 'hsl(170, 70%, 45%)',
  },
  5: {
    label: 'Level 5 Subcompetencies',
    color: 'hsl(170, 79%, 39%)', // full accent-secondary color
  },
} satisfies ChartConfig;

interface LevelBarChartProps {
  data: Record<number, number>;
}

export function LevelBarChart({ data }: LevelBarChartProps) {
  const transformedData = Object.entries(data).map((e) => ({
    competencyLevel: e[0],
    points: e[1],
    // @ts-ignore no idea what is causing this but it works
    fill: chartConfig[e[0] as keyof typeof chartConfig].color,
  }));

  return (
    <ChartContainer
      className="mx-auto max-h-[125px] w-[90%]" // max-h-[163.9px]
      config={chartConfig}
    >
      <BarChart accessibilityLayer data={transformedData}>
        <XAxis
          dataKey="competencyLevel"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent  />}
        />
        <CartesianGrid vertical={false} />
        <Bar dataKey="points" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
