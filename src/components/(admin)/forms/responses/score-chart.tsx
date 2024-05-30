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
import { calculateCompetencyScoreData } from "@/lib/responses/calculateCompetencyScoreData";
import { calculateFormScoreData } from "@/lib/responses/calculateFormScoreData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
);

interface ScoreChartProps {
  evaluateeId: string;
  currentFormVersionId: string;
  competencyName?: keyof typeof COMPETENCIES;
  versions: FormVersionsResult | undefined;
}

export function ScoreChart({
  evaluateeId,
  currentFormVersionId,
  competencyName,
  versions,
}: ScoreChartProps) {
  const data = useMemo(() => {
    if (competencyName) {
      return calculateCompetencyScoreData(
        currentFormVersionId,
        evaluateeId,
        competencyName,
        versions,
      );
    } else {
      return calculateFormScoreData(evaluateeId, versions);
    }
  }, [competencyName, currentFormVersionId, evaluateeId, versions]);

  const chartData = useMemo(() => {
    // Sort the data by versionCreatedAt
    const sortedData = [...(data || [])].sort(
      (a, b) =>
        new Date(a.versionCreatedAt).getTime() -
        new Date(b.versionCreatedAt).getTime(),
    );

    const labels = sortedData.map((item) =>
      formatDate(new Date(item.versionCreatedAt)),
    );
    const scores = sortedData.map((item) =>
      item.pointsEarned && item.pointsAvailable
        ? (item.pointsEarned / item.pointsAvailable) * 100
        : 0,
    );

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
              size: 12,
            },
          },
        },
        x: {
          ticks: {
            font: {
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
            size: 14,
          },
          bodyFont: {
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

  return <Line data={chartData} options={options} />;
}

export function formatDate(date: Date): string {
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
