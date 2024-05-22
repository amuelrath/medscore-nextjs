"use client";
import { COMPETENCIES } from "@/db/constants";
import {
  DialogContent,
  DialogDescription,
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";
import { User } from "@/db/schema";
import { getBgColorFromPointValue } from "@/lib/getColorFromPointValue";
import { getFilteredQuestionsAndAnswers } from "@/lib/responses/utils";
import { getFullName } from "@/lib/getFullName";
import { ChangeIndicator } from "@/components/ui/percent-change-indicator";
import { Separator } from "@/components/ui/separator";
import { CompetencyScoreChart } from "@/components/(admin)/forms/responses/competency-score-chart";
import { QuestionPreviewCards } from "@/components/(admin)/forms/responses/question-preview-cards";
const TooltipProvider = dynamic(() =>
  import("@/components/ui/tooltip").then((module) => ({
    default: module.TooltipProvider,
  })),
);
const Tooltip = dynamic(() =>
  import("@/components/ui/tooltip").then((module) => ({
    default: module.Tooltip,
  })),
);
const TooltipTrigger = dynamic(() =>
  import("@/components/ui/tooltip").then((module) => ({
    default: module.TooltipTrigger,
  })),
);
const TooltipContent = dynamic(() =>
  import("@/components/ui/tooltip").then((module) => ({
    default: module.TooltipContent,
  })),
);
const InsightsButton = dynamic(() =>
  import("@/components/ui/see-more-button").then(
    (module) => module.SeeMoreButton,
  ),
);
import { calculatePointsEarnedAndAvailable } from "@/lib/responses/calculatePointsEarnedAndAvailable";
import { calculatePercentChange } from "@/lib/responses/calculatePercentChange";
import { useSelectedContext } from "@/providers/selected-values-provider";
import { useAllFormVersions } from "@/providers/all-form-versions-provider";
import dynamic from "next/dynamic";
import Counter from "@/components/ui/counter";
import { calculateScorePercentile } from "@/lib/responses/calculateScorePercentile";
import { FormVersionResult } from "@/server/actions/forms/get-one-version";

export function CompetencyScoreDialogTrigger({
  competencyName,
  children,
}: {
  competencyName: keyof typeof COMPETENCIES;
  children: ReactNode;
}) {
  const { versions } = useAllFormVersions();
  const { selectedVersion, selectedResponse } = useSelectedContext();
  const evaluatee = selectedResponse?.evaluatee;

  const percentChange = calculatePercentChange(
    evaluatee?.id || "",
    versions,
    selectedVersion?.id || "",
    competencyName,
  );

  const { filteredAnswers: answers, filteredQuestions: questions } =
    getFilteredQuestionsAndAnswers(
      competencyName,
      selectedVersion?.questions,
      selectedResponse?.answers,
    );

  const percentile = calculateScorePercentile(
    selectedVersion || ({} as FormVersionResult),
    evaluatee?.id || "",
    competencyName,
  );

  const p = useMemo(() => {
    return calculatePointsEarnedAndAvailable(questions, answers);
  }, [questions, answers]);
  const bgColor = getBgColorFromPointValue(
    (p.pointsEarned || 0) / (p.pointsEarned || 0),
  );

  if (!versions) return <>No Versions.</>;
  if (!selectedVersion) return <>Error! Form version not found.</>;
  if (!selectedVersion.questions) return <>No questions in this form!</>;
  if (!selectedResponse) return <>No responses found!</>;
  if (!selectedResponse.answers) return <>This response has no content.</>;

  return (
    <Dialog modal>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn("max-h-[95%] min-w-[1000px]")}
      >
        <DialogHeader className={cn("mb-4")}>
          <div className={cn("flex flex-col divide-y-2")}>
            <div>
              <DialogTitle
                className={cn(
                  "font-poppins flex flex-row items-start justify-between",
                )}
              >
                <p className={cn("text-4xl font-bold text-gray-800")}>
                  {COMPETENCIES[competencyName].name}
                </p>
                <InsightsButton
                  label={"See Insights"}
                  className={
                    "font-forma mr-8 bg-foreground text-xl font-extrabold text-white"
                  }
                  size={"sm"}
                  iconStyles={"size-10"}
                />
              </DialogTitle>

              <DialogDescription
                className={cn(
                  "font-poppins w-full text-sm italic tracking-wide text-gray-500",
                )}
              >
                {COMPETENCIES[competencyName].description}
              </DialogDescription>
            </div>

            <div
              className={cn(
                "font-poppins flex flex-row items-center justify-around space-x-2 pt-2 text-3xl font-semibold ",
              )}
            >
              <p className={cn("line-clamp-1 text-gray-500")}>
                {getFullName(evaluatee || ({} as User)).toUpperCase()}
              </p>
              <Separator orientation={"vertical"} />
              <p className={cn("line-clamp-1 text-gray-400")}>
                {selectedVersion.title.toUpperCase()}
              </p>
              <Separator orientation={"vertical"} />

              <div className={cn("flex items-center justify-center")}>
                <p
                  className={cn(
                    "font-poppins line-clamp-1 text-2xl font-bold tracking-wider",
                  )}
                >
                  <span style={{ color: bgColor }}>{p?.pointsEarned}</span>
                  {`/${p?.pointsAvailable}`}
                </p>
              </div>
              <Separator orientation={"vertical"} />
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className={cn("flex flex-col items-end")}>
                      <p className={cn(" text-sm font-bold text-gray-400")}>
                        &Delta; PREVIOUS
                      </p>
                      <ChangeIndicator
                        percentChange={
                          Number(
                            percentChange?.percentChangeFromPrevious.toFixed(1),
                          ) || 0
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent className={cn("w-96 font-normal")}>
                      <p>
                        This value represents the percentage change in the score
                        compared to the previous form administration. A positive
                        value indicates an increase, while a negative value
                        indicates a decrease in the score. Note that this is not
                        the actual difference between the two scores, but rather
                        the change expressed as a percentage of the previous
                        score.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Separator orientation={"vertical"} />

              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className={cn("flex flex-col items-end")}>
                      <p className={cn(" text-sm font-bold text-gray-400")}>
                        &Delta; OVERALL
                      </p>
                      <ChangeIndicator
                        percentChange={
                          Number(
                            percentChange?.percentChangeFromFirst.toFixed(1),
                          ) || 0
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent className={cn("w-96 font-normal")}>
                      <p>
                        This value represents the percentage change in the score
                        compared to the first form administration. A positive
                        value indicates an increase, while a negative value
                        indicates a decrease in the score. Note that this is not
                        the actual difference between the two scores, but rather
                        the change expressed as a percentage of the original
                        score.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className={cn("flex w-full flex-row")}>
          <CompetencyScoreChart
            evaluateeId={selectedResponse.evaluatee.id}
            currentFormVersionId={selectedVersion.id}
            competencyName={competencyName}
            versions={versions}
          />
          <div
            className={cn("flex w-1/2 flex-col items-center justify-center")}
          >
            <Counter
              className={"text-8xl font-extrabold "}
              value={percentile || 0}
              duration={0.3}
            />
            <p className={cn("text-sm font-bold text-gray-400")}>PERCENTILE</p>
          </div>
        </div>
        <hr />
        <QuestionPreviewCards
          evaluatorName={getFullName(selectedResponse.creator || ({} as User))}
          versions={versions}
          questions={questions}
          answers={answers}
        />
      </DialogContent>
    </Dialog>
  );
}
