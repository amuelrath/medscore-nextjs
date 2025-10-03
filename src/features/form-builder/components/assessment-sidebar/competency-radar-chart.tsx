'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

const chartConfig = {
  points: {
    label: 'Points',
  },
  MK: {
    label: 'Medical Knowledge',
  },
  PC: {
    label: 'Patient Care',
  },
  ICS: {
    label: 'Interpersonal & Communication Skills',
  },
  PBLI: {
    label: 'Practice-Based Learning & Improvement',
  },
  SBP: {
    label: 'Systems-Based Practice',
  },
  PROF: {
    label: "Professionalism"
  }
} satisfies ChartConfig;

type CompetencyRadarChartProps = {
  data: Record<string, number>;
};

export function CompetencyRadarChart({ data }: CompetencyRadarChartProps) {
  // if (isLoading) return <RadarChartSkeleton />;

  const transformedData = Object.entries(data).map((e) => ({
    competencyName: e[0],
    points: e[1],
  }));

  const maxValue = Math.max(...transformedData.map((row) => row.points));

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[175px]" // max-h-[163.9px]
    >
      <RadarChart accessibilityLayer data={transformedData}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="competencyName" domain={[0, maxValue]} />
        <PolarGrid />
        <Radar
          dataKey="points"
          animationDuration={200}
          fill="hsl(var(--accent-secondary))"
          fillOpacity={0.5}
          dot={{
            r: 3,
            fillOpacity: 1,
          }}
        />
      </RadarChart>
    </ChartContainer>
  );
}

function RadarChartSkeleton() {
  return (
    <div className="p-5">
      <Skeleton className="mx-auto size-[8.4rem] rounded-full" />
    </div>
  );
}
