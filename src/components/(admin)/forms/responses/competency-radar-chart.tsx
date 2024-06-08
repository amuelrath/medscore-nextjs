"use client";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  RadialLinearScale,
  LineOptions,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { CompetencyScoreData } from "@/lib/responses/calculateCompetencyScoreData";
import { COMPETENCIES } from "@/db/constants";
import { formatDate } from "@/components/(admin)/forms/responses/score-chart";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  RadialLinearScale,
);

interface SortedScores {
  [key: string]: CompetencyScoreData[] | undefined;
}

export function CompetencyRadarChart() {
  // Helper function to sort scores by versionCreatedAt date
  const sortScoresByDate = (scores: CompetencyScoreData[] | undefined) =>
    scores?.sort(
      (a, b) =>
        new Date(b.versionCreatedAt).getTime() -
        new Date(a.versionCreatedAt).getTime(),
    );

  // Get sorted scores for each competency
  const sortedScores: SortedScores = Object.keys(COMPETENCIES).reduce(
    (acc, key) => {
      acc[key] = sortScoresByDate(
        allScores.find((s) => s.name === key)?.scores,
      );
      return acc;
    },
    {} as SortedScores,
  );

  const data = {
    labels: Object.keys(COMPETENCIES),
    datasets: allScores
      .flatMap((competency) => {
        const { scores } = competency;
        return (
          scores?.map((score, index) => ({
            label: `${COMPETENCIES[competency.name].name}  (${formatDate(scores[index].versionCreatedAt)})`,
            data: Object.keys(COMPETENCIES).map((key) => {
              const competencyScore =
                // @ts-ignore
                allScores?.find((c) => (c?.name || "") === key)?.scores[
                  index
                ] || { pointsEarned: 0, pointsAvailable: 0 };
              const pointsEarned = competencyScore.pointsEarned || 0;
              const pointsAvailable = competencyScore.pointsAvailable || 0;
              return pointsAvailable !== 0
                ? (pointsEarned / pointsAvailable) * 100
                : 0;
            }),
            fill: true,
            backgroundColor: `hsla(204, ${95 - index ** 4}%, ${43 + index * 10}%, 0.2)`,
            borderColor: `hsl(204, ${95 - index ** 4}%, ${43 + index * 25}%)`,
            pointBorderColor: "#fff",
            pointBackgroundColor: `hsl(204, ${95 - (index + 1) ** 4}%, ${43 + index * 10}%)`,
          })) || []
        );
      })
      .slice(0, 3),
  };

  return (
    <Radar
      options={{
        datasets: {
          radar: {
            // Adjust the radar options here if needed
          },
        },
        plugins: {
          tooltip: {
            mode: "point",
            intersect: true,
            enabled: true,
            callbacks: {
              title: (context) => {
                const selectedItem = context[0];
                return selectedItem.dataset.label;
              },
              label: (context) => {
                const selectedItem = context.dataset.data[context.dataIndex];
                return `${selectedItem?.toFixed(2)}%`;
              },
            },
          },
        },
        scales: {
          r: {
            max: 100,
            ticks: {
              display: false, // Remove the number labels
            },
          },
        },
      }}
      data={data}
    />
  );
}
