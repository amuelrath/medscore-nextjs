import React, { Suspense } from "react";
import { COMPETENCIES } from "@/db/constants";
import { useResponseContext } from "@/components/(admin)/forms/providers/response-provider";
import { getFullName } from "@/lib/getFullName";
import { Glass } from "@/components/ui/glass";
import { NoResponseSelected } from "@/components/(admin)/forms/responses/no-response-selected";
import { SeeMoreButton } from "@/components/ui/see-more-button";
import { LottieHover } from "@/components/ui/lottie-hover";
import ICS from "public/icons/ics-bubbles-icon.json";
import MK from "public/icons/mk-mask-icon.json";
import PC from "public/icons/pc-heart-icon.json";
import PBLI from "public/icons/pbli-icon.json";
import P from "public/icons/p-icon.json";
import SBP from "public/icons/sbp-nodes-icon.json";
import { useSuspenseQuery } from "@tanstack/react-query";
import Counter from "@/components/ui/counter";
import { uniq } from "lodash";
import { getPerformanceByForm } from "@/server/actions/views/get-question-performance-by-milestone";
import GaugeChart from "@/components/ui/gauge";
import { cn } from "@/lib/utils";
import { LineChart, ResponsiveContainer } from "recharts";

const competencyIcons = {
  ICS,
  MK,
  PC,
  PBLI,
  P,
  SBP,
};

export function ResponsePerformance() {
  const { selectedResponse } = useResponseContext();

  if (!selectedResponse) return <NoResponseSelected />;

  return (
    <Glass className="mx-3 mt-12">
      <Header />
      <Suspense fallback={<div className="h-[59.55vh]">Loading ...</div>}>
        <CompetencyScores />
      </Suspense>
    </Glass>
  );
}

function Header() {
  const { selectedResponse } = useResponseContext();

  return (
    <div className="flex flex-col space-y-1 p-2">
      <div className="flex flex-row items-center justify-between">
        <p className="text-2xl font-semibold">
          {getFullName(selectedResponse?.evaluatee || {})}
        </p>
        <div>
          <SeeMoreButton
            label="Download Full Report"
            className="bg-foreground text-white"
            size="xs"
          />
        </div>
      </div>
    </div>
  );
}

type CompetencyKey = keyof typeof COMPETENCIES;

function CompetencyScores() {
  const { selectedResponse } = useResponseContext();
  const { data } = useSuspenseQuery({
    queryKey: [
      "competency",
      selectedResponse!.id,
      selectedResponse!.evaluatee.id,
    ],
    queryFn: () =>
      getPerformanceByForm({
        responseId: selectedResponse!.id,
      }),
  });

  const includedCompetencies: CompetencyKey[] = uniq(
    data.map((d): CompetencyKey => {
      // Ensure that d.competencyName is one of the valid CompetencyKey values
      if (isValidCompetencyKey(d.competencyName)) {
        return d.competencyName;
      }
      throw new Error(`Invalid competency name: ${d.competencyName}`);
    }),
  );

  const getFilterByCompetency = (competencyName: CompetencyKey) => {
    return data.filter((d) => d.competencyName === competencyName);
  };

  return (
    <div className="flex h-[59.55vh] flex-col space-y-8 overflow-y-scroll">
      {includedCompetencies.sort().map((key) => {
        return (
          <CompetencyScoreItem
            key={key}
            competencyKey={key}
            data={calculateCompetencyScore(getFilterByCompetency(key))}
          />
        );
      })}
    </div>
  );
}

function CompetencyScoreItem({
  competencyKey,
  data,
}: {
  competencyKey: CompetencyKey;
  data: ReturnType<typeof calculateCompetencyScore>;
}) {

  return (
    <div className="flex flex-col space-y-1.5 px-2">
      <div className="flex flex-row items-center space-x-3">
        <LottieHover src={competencyIcons[competencyKey]} size={"sm"} />
        <p className="text-2xl font-light">
          {COMPETENCIES[competencyKey].name}
        </p>
      </div>
      <div className="rounded-md border border-neutral-300 bg-blue-950 bg-opacity-10 p-2 shadow-inner backdrop-blur-3xl">
        <div className="flex flex-row items-center justify-around">
        <div className="relative">
          <GaugeChart
            size={"xs"}
            bgStrokeColor={"stroke-accent/20"}
            value={data.competencyScore}
            color={"accent"}
          />
          <Counter
            duration={0.5}
            value={data.competencyScore}
            type="percent"
            className={cn(
              "absolute top-5 select-none text-md font-semibold tabular-nums text-cyan-900",
              data.competencyScore === 100 ? "left-[22px]" : "left-6",
            )}
          />
        </div>
          <ResponsiveContainer>
            <LineChart>

            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

type TCalculateCompetencyLevelParams = {
  pointsAvailable: string;
  pointsEarned: string;
  subcompetencyName: string;
  [key: string]: any;
}[];

function calculateCompetencyScore(data: TCalculateCompetencyLevelParams) {
  const subcompetencyScores: Record<
    string,
    { pointsEarned: number; pointsAvailable: number }
  > = {};

  data.forEach((item) => {
    const { subcompetencyName, pointsEarned, pointsAvailable } = item;
    if (!subcompetencyScores[subcompetencyName]) {
      subcompetencyScores[subcompetencyName] = {
        pointsEarned: 0,
        pointsAvailable: 0,
      };
    }
    subcompetencyScores[subcompetencyName].pointsEarned += Number(pointsEarned);
    subcompetencyScores[subcompetencyName].pointsAvailable +=
      Number(pointsAvailable);
  });

  let totalPointsEarned = 0;
  let totalPointsAvailable = 0;

  Object.values(subcompetencyScores).forEach((score) => {
    totalPointsEarned += score.pointsEarned;
    totalPointsAvailable += score.pointsAvailable;
  });

  const competencyScore =
    totalPointsAvailable > 0
      ? (totalPointsEarned / totalPointsAvailable) * 100
      : 0;

  return {
    subcompetencyScores,
    competencyScore: Number(competencyScore.toFixed(2)),
  };
}

// Helper function to check if a string is a valid CompetencyKey
function isValidCompetencyKey(key: string): key is CompetencyKey {
  return ["ICS", "SBP", "PBLI", "MK", "P", "PC"].includes(key as CompetencyKey);
}
