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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { ReactNode, Suspense, useMemo } from "react";
import { cn } from "@/lib/utils";
import { User } from "@/db/schema";
import { getBgColorFromPointValue } from "@/lib/getColorFromPointValue";
import { getFilteredQuestionsAndAnswers } from "@/lib/responses/utils";
import { getFullName } from "@/lib/getFullName";
import { ChangeIndicator } from "@/components/ui/percent-change-indicator";
import { Separator } from "@/components/ui/separator";
import { QuestionPreviewCards } from "@/components/(admin)/forms/responses/question-preview-cards";
import { SeeMoreButton } from "@/components/ui/see-more-button";
import { calculatePointsEarnedAndAvailable } from "@/lib/responses/calculatePointsEarnedAndAvailable";
import { calculatePercentChange } from "@/lib/responses/calculatePercentChange";
import { useSelectedContext } from "@/providers/selected-values-provider";
import dynamic from "next/dynamic";
import Loading from "@/components/ui/loading";
import { FeedbackSummaryCard } from "@/components/(admin)/forms/responses/feedback-summary-card";
import { Card } from "@/components/ui/card";
import { useAllFormVersionsSuspenseQueryResult } from "@/hooks/useAllFormVersionsSuspenseQueryResult";
const DynamicCompetencyScoreChart = dynamic(
  () =>
    import("@/components/(admin)/forms/responses/score-chart").then(
      (module) => module.ScoreChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className={cn("h-48 w-1/2")}>
        <span className={cn("pb-12")}>
          <Loading />
        </span>
      </div>
    ),
  },
);
export function CompetencyScoreDialogTrigger({
  competencyName,
  children,
}: {
  competencyName: keyof typeof COMPETENCIES;
  children: ReactNode;
}) {
  const { versions } = useAllFormVersionsSuspenseQueryResult();
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
        className={cn("max-h-[95%] min-w-[90%]")}
      >
        <DialogHeader>
          <div className={cn("flex flex-col divide-y-2")}>
            <div>
              <DialogTitle
                className={cn("flex flex-row items-start justify-between")}
              >
                <p className={cn("text-4xl font-bold text-gray-800")}>
                  {COMPETENCIES[competencyName].name}
                </p>
                <SeeMoreButton
                  label={"See Insights"}
                  className={
                    "mr-8 bg-foreground text-xl font-extrabold text-white"
                  }
                  size={"sm"}
                  iconStyles={"size-10"}
                />
              </DialogTitle>

              <DialogDescription
                className={cn(
                  "w-full text-sm italic tracking-wide text-gray-500",
                )}
              >
                {COMPETENCIES[competencyName].description}
              </DialogDescription>
            </div>

            <div
              className={cn(
                "flex flex-row items-center justify-around space-x-2 pt-2 text-3xl font-bold ",
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
                    "line-clamp-1 text-2xl font-bold tracking-wider",
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
        <div className={cn("flex flex-row space-x-4")}>
          <div className={cn("w-1/2")}>
            <DynamicCompetencyScoreChart
              evaluateeId={selectedResponse.evaluatee.id}
              currentFormVersionId={selectedVersion.id}
              competencyName={competencyName}
              versions={versions}
            />
          </div>
          <div className={cn("w-1/2")}>
            <Suspense
              fallback={
                <Card className="h-52 w-full animate-pulse bg-gradient-to-b from-foreground/70 to-black/70">
                  <Loading />
                </Card>
              }
            >
              <FeedbackSummaryCard
                percentImprovementFromPreviousAttempt={
                  percentChange?.percentChangeFromPrevious || 0
                }
                percentImprovementFromFirstAttempt={
                  percentChange?.percentChangeFromFirst || 0
                }
                competencyName={competencyName}
              />
            </Suspense>
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
