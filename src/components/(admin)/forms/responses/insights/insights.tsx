"use client";

import { CompetencyRadarChart } from "@/components/(admin)/forms/responses/common/competency-radar-chart";
import { useGetResponseCompetencyScores } from "@/hooks/queries/use-get-response-competency-scores";
import { selectedResponseIdAtom } from "@/store/form-atoms";
import { useAtomValue } from "jotai";
import { ResponseCompetencyScoresOverTimeResult } from "@/server/actions/responses/get-response-competency-scores-over-time";
import { ZCompetencyScoresSchema } from "@/db/schema";
import { useMemo } from "react";
import { AssessmentScoreLineChart } from "@/components/(admin)/forms/responses/common/assessment-score-line-chart";
import { isBefore } from "date-fns";
import { GaugeChart } from "@/components/ui/gauge-chart";
import { getColorFromNormal } from "@/lib/helpers/get-color-from-normal";

export function Insights() {
  const selectedResponseId = useAtomValue(selectedResponseIdAtom);
  const { responseCompetencyScores, isLoading } =
    useGetResponseCompetencyScores();

  // parse the jsonb data
  const evaluateeCompetencyScores = useMemo(() => {
    return transformResponseCompetencyScoreData(responseCompetencyScores);
  }, [responseCompetencyScores]);

  const responseScoreChartData = useMemo(() => {
    return transformToResponseScoreData(
      evaluateeCompetencyScores,
      selectedResponseId,
    );
  }, [evaluateeCompetencyScores, selectedResponseId]);

  const selectedResponseScore = Number(
    (
      (responseScoreChartData.find(
        (row) => row.responseId === selectedResponseId,
      )?.score || 0) / 100 || 0
    ),
  );

  if (isLoading) return <>Loading...</>;
  if (!responseCompetencyScores) return <>nothing</>;

  return (
    <div className="relative ml-[4px] mr-[2px] mt-[2px] h-[78vh] overflow-y-scroll px-4 pt-4">
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-4">
        <div className="col-span-2 row-span-1 flex flex-row justify-between rounded border border-neutral-200 p-4">
          <div className="w-1/2 flex flex-col justify-center rounded bg-primary/5">
            <GaugeChart
              label="Overall Score"
              fill={getColorFromNormal(selectedResponseScore)}
              score={selectedResponseScore}
            />
          </div>
          <div className="flex-grow ">
            <AssessmentScoreLineChart chartData={responseScoreChartData} />
          </div>
        </div>
        <div className="col-span-2 row-span-1 flex flex-row justify-between rounded border border-neutral-200 p-4">
          <div className="w-1/2">
            <CompetencyRadarChart />
          </div>
          <div className="flex-grow rounded bg-primary/5">

          </div>
        </div>
      </div>
    </div>
  );
}

function transformResponseCompetencyScoreData(
  data: ResponseCompetencyScoresOverTimeResult | undefined,
) {
  if (!data) return [];
  return data
    .map((row) => ({
      responseId: row.responseId,
      responseCreatedAt: row.responseCreatedAt,
      competencyScores: ZCompetencyScoresSchema.parse(row.competencyScores),
    }))
    .flat();
}

function transformToResponseScoreData(
  data: ReturnType<typeof transformResponseCompetencyScoreData>,
  selectedResponseId: string | undefined,
) {
  if (!selectedResponseId || !(data.length > 0)) return [];
  const allRows = data.map((row) => {
    const responseScorePointsEarned = row.competencyScores.competencies.reduce(
      (total, competency) => {
        const score = competency.pointsEarned;
        return total + score;
      },
      0,
    );

    const responseScorePointsAvailable =
      row.competencyScores.competencies.reduce((total, competency) => {
        const score = competency.pointsAvailable;
        return total + score;
      }, 0);

    return {
      responseId: row.responseId,
      date: row.responseCreatedAt,
      score: (responseScorePointsEarned / responseScorePointsAvailable) * 100, // get it as a percent
    };
  });

  const selectedResponseCreatedAt = allRows.find(
    (row) => row.responseId === selectedResponseId,
  )?.date;
  if (!selectedResponseCreatedAt)
    throw new Error("Couldn't locate the selected response or it's createdAt");

  // return all rows up to this response's creation
  return allRows.filter(
    (row) =>
      isBefore(row.date, selectedResponseCreatedAt) ||
      row.responseId == selectedResponseId,
  );
}

// const { selectedResponse, percentageChange } = useMemo(() => {
//   const sortedData = [...chartData].sort(
//     (a, b) => a.date.getTime() - b.date.getTime(),
//   );
//   const selectedResponse = sortedData.find(
//     (row) => row.responseId === selectedResponseId,
//   );
//   const selectedIndex = sortedData.findIndex(
//     (row) => row.responseId === selectedResponseId,
//   );
//   const previousResponse =
//     selectedIndex > 0 ? sortedData[selectedIndex - 1] : null;
//   const percentageChange =
//     selectedResponse && previousResponse
//       ? ((selectedResponse.score - previousResponse.score) /
//         previousResponse.score) *
//       100
//       : null;
//   return { selectedResponse, percentageChange };
// }, [chartData, selectedResponseId]);
