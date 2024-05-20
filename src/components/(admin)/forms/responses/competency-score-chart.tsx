import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FormVersionsResult } from "@/db/types";
import { COMPETENCIES } from "@/db/constants";
import { cn } from "@/lib/utils";
import { calculateCompetencyScoreData } from "@/lib/responses/calculateCompetencyScoreData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

interface CompetencyScoreChartProps {
  evaluateeId: string;
  currentFormVersionId: string;
  competencyName: keyof typeof COMPETENCIES;
  versions: FormVersionsResult | undefined;
}

export function CompetencyScoreChart({
  evaluateeId,
  currentFormVersionId,
  competencyName,
  versions,
}: CompetencyScoreChartProps) {
  const data = calculateCompetencyScoreData(
    currentFormVersionId,
    evaluateeId,
    competencyName,
    versions,
  );

  const chartData = useMemo(() => {
    const labels =
      data?.map((item) => formatDate(new Date(item.versionCreatedAt))) || [];
    const scores =
      data?.map((item) =>
        item.pointsEarned && item.pointsAvailable
          ? (item.pointsEarned / item.pointsAvailable) * 100
          : 0,
      ) || [];

    return {
      labels,
      datasets: [
        {
          data: scores,
          borderColor: "rgb(0, 0, 0)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      ],
    };
  }, [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },

      scales: {
        y: {
          ticks: {
            font: {
              family: "Poppins",
              size: 12,
            },
          },
        },
        x: {
          ticks: {
            font: {
              family: "Poppins",
              size: 12,
            },
          },
        },
      },

      plugins: {
        tooltip: {
          callbacks: {
            label: (context: { parsed: { y: any } }) => {
              const score = context.parsed.y;
              return `Score: ${score.toFixed(1)}%`;
            },
          },
          titleFont: {
            family: "Poppins",
            size: 14,
          },
          bodyFont: {
            family: "Poppins",
            size: 12,
          },
        },
      },
    }),
    [],
  );

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className={cn("h-48 w-1/2")}>
      <Line data={chartData} options={options} />
    </div>
  );
}

function formatDate(date: Date): string {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthName = monthNames[date.getMonth()];
  const dayNumber = date.getDate();

  return `${monthName} ${dayNumber}`;
}
