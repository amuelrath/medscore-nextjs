import { COMPETENCIES } from "@/db/constants";
import { TCompetencyScores } from "@/db/schema";
import { useGetSubcompetenciesInEditor } from "@/hooks/queries/use-get-form-subcompetencies";
import useGetSelectedResponse from "@/hooks/queries/use-get-selected-response";
import React, { useCallback, useMemo, useRef } from "react";
import { AnswerDistribution } from "@/components/(admin)/forms/responses/competency/answer-distribution";
import { AssessmentScoreLineChart } from "@/components/(admin)/forms/responses/common/assessment-score-line-chart";
import { GaugeChart } from "@/components/ui/charts/gauge-chart";
import { ResponseResult } from "@/server/actions/responses/get-response";
import { SubcompetencyResult } from "@/server/actions/forms/get-subcompetencies";
import { getColorFromNormal } from "@/lib/helpers/get-color-from-normal";
import { SubcompetencyQuestions } from "@/components/(admin)/forms/responses/competency/subcompetency-questions";
import { cn } from "@/lib/helpers/utils";
import { AnimatePresence, m } from "framer-motion";
import {
  ActivityIcon,
  MinusIcon,
  SquareChevronUp,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import { analyzeTrend } from "@/lib/analyze-trend";
import { Card } from "@/components/ui/card";
import { addHours, isBefore } from "date-fns";

export const getRowsByCompetencyId = (
  competencyId: string,
  scores: TCompetencyScores[],
): TCompetencyScores[] => {
  const result = scores.filter((row) =>
    row.competencies.some((c) => c.id === competencyId),
  );

  if (result.length === 0) {
    throw new Error(`Couldn't find competency of id '${competencyId}'`);
  }

  return result;
};
const getCompetencyById = (competencyId: string) => {
  const result = Object.values(COMPETENCIES).find((c) => c.id === competencyId);
  if (!result)
    throw new Error(`Couldn't find competency of id '${competencyId}'`);
  return result;
};

interface CompetencyScoreSectionProps {
  competencyId: string;
  competencyScores: TCompetencyScores[];
  selectedResponseId: string;
  onNameClick: (ref: React.RefObject<HTMLDivElement>) => void;
}
export function CompetencyScores({
  competencyId,
  competencyScores,
  selectedResponseId,
  onNameClick,
}: CompetencyScoreSectionProps) {
  const competencyRef = useRef<HTMLDivElement>(null);

  const handleNameClick = useCallback(() => {
    onNameClick(competencyRef);
  }, [onNameClick]);

  const competency = getCompetencyById(competencyId);
  const Icon = competency.icon;
  // get the subcompetencies
  const { subcompetencies, isLoading: isSubcompetenciesLoading } =
    useGetSubcompetenciesInEditor();

  // get the answers so we know what the evaluator said & map milestones
  const { response, isLoading: isSelectedResponseAnswersLoading } =
    useGetSelectedResponse();

  // find this response
  const selectedResponseScoreData = competencyScores.find(
    (row) => row.responseId === selectedResponseId,
  );

  // get the number of correct, incorrect, and unanswered questions
  const { numCorrect, numIncorrect, numUnanswered } = useMemo(() => {
    if (!response) return { numCorrect: 0, numIncorrect: 0, numUnanswered: 0 };
    return analyzeResponse({ response, subcompetencies, competencyId });
  }, [competencyId, response, subcompetencies]);

  if (!selectedResponseScoreData || !response)
    return <>couldnt locate this response</>;

  // get the scores for this competency
  const competencyRow = selectedResponseScoreData.competencies.find(
    (c) => c.id === competencyId,
  );
  if (!competencyRow) return <>competency data not found</>;

  // get the score for this competency for this response
  const competencyPercentScore =
    competencyRow.pointsEarned / competencyRow.pointsAvailable;

  // now get the percent scores for each subcompetency
  // we can also use this to get the relevant subcompetencyIds
  const subcompetencyScores = competencyRow.subcompetencies.map((sc) => ({
    id: sc.id,
    name: sc.name,
    abbrevName: sc.abbrevName,
    percentScore: sc.pointsEarned / sc.pointsAvailable,
  }));

  // extract trend data
  const competencyScoresToTrendData = competencyScores
    .filter((row) =>
      isBefore(row.responseCreatedAt, addHours(response.createdAt, 1)),
    )
    .map((row) => {
      const competencyData = row.competencies.find(
        (c) => c.id === competencyId,
      );
      if (!competencyData) return null;
      return {
        date: row.responseCreatedAt,
        score:
          (competencyData.pointsEarned / competencyData.pointsAvailable) * 100,
        responseId: row.responseId,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div ref={competencyRef} className="relative space-y-2 rounded-sm pb-4">
      <div
        onMouseDown={handleNameClick}
        className={cn(
          "sticky top-[-1px] z-30 flex select-none items-center space-x-2 bg-white py-1.5 ",
        )}
      >
        <p className="text-2xl font-semibold">{competency.name}</p>
        <Icon size={24} className="text-neutral-500" />
        <SquareChevronUp
          size={12}
          className={cn("cursor-pointer text-neutral-400")}
        />
      </div>

      <div className="flex h-[320px] flex-row space-x-4 ">
        <div className="grid w-full basis-2/3  grid-cols-2 gap-4 rounded-sm bg-primary/5 p-4">
          <div className="col-span-1 flex h-full w-full flex-col">
            <div className="h-2/5">
              <AnswerDistribution
                numCorrect={numCorrect}
                numIncorrect={numIncorrect}
                numUnanswered={numUnanswered}
              />
            </div>
            <div className="h-4/5 w-full shadow-sm">
              <AssessmentScoreLineChart
                chartData={competencyScoresToTrendData}
                label={`${competency.abbrev} Score`}
              />
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-center">
            <GaugeChart
              score={competencyPercentScore}
              label={competency.abbrev}
              fill={getColorFromNormal(competencyPercentScore)}
            />
          </div>
        </div>
        <PerformanceCard
          trendData={competencyScoresToTrendData}
          percentScore={competencyPercentScore}
          competencyName={competency.abbrev}
        />
      </div>
      <div>
        {subcompetencyScores.map((scc) => (
          <SubcompetencyQuestions
            key={scc.id}
            subcompetencyId={scc.id}
            subcompetencies={subcompetencies}
            response={response}
          />
        ))}
      </div>
    </div>
  );
}

const PerformanceCard = ({
  trendData,
  percentScore,
  competencyName,
}: {
  trendData: { date: Date; score: number; responseId: string }[];
  percentScore: number;
  competencyName: string;
}) => {
  const { remark, color } = getPerformanceRemarks(percentScore);
  const {
    trendDescription,
    trend,
  } = analyzeTrend(trendData);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "sharp upward":
      case "gradual upward":
        return <TrendingUpIcon className="size-6 opacity-50" />;
      case "sharp downward":
      case "gradual downward":
        return <TrendingDownIcon className="size-6 opacity-50" />;
      default:
        return <MinusIcon className="size-6 opacity-50" />;
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="flex flex-col justify-between basis-1/3 text-md">
      <AnimatePresence mode="wait">
        <m.div
          key="performance"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full rounded-sm p-4 ">
            <div className="flex flex-col items-center justify-center text-center">
              <ActivityIcon className={`size-5 ${color} mb-2`} />
              <p>
                Performance in <strong>{competencyName}</strong>{" "}
                is <strong className={color}>{remark}</strong>
              </p>
            </div>
          </Card>
        </m.div>

        <m.div
          key="trend"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="w-full rounded-sm p-4">
            <div className="flex flex-col items-center justify-center text-center">
              {getTrendIcon(trend)}
              <p className="mt-2">
                Scores show a <strong>{trend}</strong> trend, {trendDescription}.
              </p>
            </div>
          </Card>
        </m.div>

      </AnimatePresence>
    </div>
  );
};

function analyzeResponse({
                           response,
                           subcompetencies,
                           competencyId
                         }: {
  response: ResponseResult | undefined;
  subcompetencies: SubcompetencyResult | undefined;
  competencyId: string;
}) {
  let numCorrect = 0;
  let numIncorrect = 0;
  let numUnanswered = 0;

  const milestonesForCompetency = subcompetencies
    ?.filter((sc) => sc.competencyId === competencyId)
    .map((sc) => sc.milestones.map((m) => m.id))
    .flat();

  response?.answers.forEach((answer) => {
    const { formItem, selectedOptionIds, textValue } = answer;

    const milestoneIds = formItem.milestones.map((m) => m.milestoneId);

    const isForThisCompetency = !!milestoneIds.find((id) =>
      milestonesForCompetency?.includes(id)
    );

    if (!isForThisCompetency) return;

    switch (formItem.type) {
      case "MULTIPLE_CHOICE":
        if (
          !selectedOptionIds ||
          selectedOptionIds.length !== formItem.options.length
        ) {
          numUnanswered++;
        } else if (formItem.isScored) {
          const selectedOptions = formItem.options.filter((option) =>
            selectedOptionIds.includes(option.id)
          );
          const isCorrect = selectedOptions.every(
            (option) => (Number(option.pointValue) || 0) > 0
          );
          isCorrect ? numCorrect++ : numIncorrect++;
        }
        break;

      case "SINGLE_CHOICE":
        if (!selectedOptionIds || selectedOptionIds.length === 0) {
          numUnanswered++;
        } else if (formItem.isScored) {
          const selectedOptions = formItem.options.filter((option) =>
            selectedOptionIds.includes(option.id)
          );
          const isCorrect = selectedOptions.every(
            (option) => (Number(option.pointValue) || 0) > 0
          );
          isCorrect ? numCorrect++ : numIncorrect++;
        }
        break;

      case "WRITTEN":
        if (!textValue || textValue.trim() === "") {
          numUnanswered++;
        } else {
          // For text inputs, we can't automatically determine correctness
          // You might want to implement a separate scoring mechanism for these
          // For now, we'll count all answered text questions as "correct"
          numCorrect++;
        }
        break;

      // Add cases for other question types as needed

      default:
        console.warn(`Unhandled question type: ${formItem.type}`);
        break;
    }
  });

  return { numCorrect, numIncorrect, numUnanswered };
}

function getPerformanceRemarks(score: number) {
  if (score >= 0.8) return { remark: "outstanding", color: "text-emerald-500" };
  if (score < 0.8 && score > 0.6)
    return { remark: "advanced", color: "text-blue-400" };
  if (score <= 0.6 && score >= 0.4)
    return { remark: "proficient", color: "text-yellow-500" };
  if (score < 0.4 && score > 0.2)
    return { remark: "satisfactory", color: "text-orange-500" };
  if (score <= 0.2) return { remark: "developing", color: "text-red-400" };
  throw new Error("Score isn't in range.");
}
