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
import React, { ReactElement, ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";
import { FormVersionsResult, QuestionVersionResult } from "@/db/types";
import { Answer, User } from "@/db/schema";
import { getBgColorFromPointValue } from "@/lib/getColorFromPointValue";
import { Card } from "@/components/ui/card";
import { getFilteredQuestionsAndAnswers } from "@/lib/responses/utils";
import { getFullName } from "@/lib/getFullName";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChangeIndicator } from "@/components/ui/percent-change-indicator";
import { Separator } from "@/components/ui/separator";
import { Player } from "@lottiefiles/react-lottie-player";
import { CompetencyScoreChart } from "@/components/(admin)/forms/responses/competency-score-chart";

// TODO Get (overall and competency and question specific) consistency score (make sure there is a minimum amount of data), growth indicator

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
              <DialogTitle className={cn("font-poppins")}>
                <p className={cn("text-4xl font-bold text-gray-800")}>
                  {COMPETENCIES[competencyName].name}
                </p>
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
                        the change expressed as a percentage of the previous
                        score.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div>
          <CompetencyScoreChart
            evaluateeId={selectedResponse.evaluatee.id}
            currentFormVersionId={selectedVersion.id}
            competencyName={competencyName}
            versions={versions}
          />
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

function QuestionPreviewCards({
  versions,
  questions,
  answers,
  evaluatorName,
}: {
  versions: FormVersionsResult;
  questions: QuestionVersionResult[] | undefined;
  answers: Answer[] | undefined;
  evaluatorName: string;
}) {
  const PointsEarned = ({ q }: { q: QuestionVersionResult }) => {
    const p = getQuestionPointsEarned(q, answers);
    const bgColor = getBgColorFromPointValue(p.percent);
    return (
      <span className={cn("text-sm font-bold")}>
        <span className={cn("text-sm")} style={{ color: bgColor }}>
          {p.pointsEarned}
        </span>
        <span className={cn("text-sm")}>/{p.pointsAvailable}</span>
      </span>
    );
  };
  return (
    <ScrollArea className={cn("h-56 w-full pb-4 pr-4")}>
      <ScrollBar />
      <div className={cn("grid grid-cols-2 gap-6 p-6 pt-0")}>
        {questions && questions.length > 0 ? (
          questions.map((q) => {
            const averageScore = calculateAverageQuestionScore(
              versions,
              q.text,
              true,
            );
            const evaluateeScore = getQuestionPointsEarned(q, answers);

            return (
              <Card
                className={cn(
                  "relative col-span-1 p-4 transition-colors duration-200 hover:bg-gray-100",
                )}
                key={q.id}
              >
                <div className={cn("absolute bottom-3 right-3")}>
                  <QuestionPreviewCardIcon
                    evaluateeScore={evaluateeScore.percent}
                    averageScore={averageScore}
                  />
                </div>
                <div
                  className={cn(
                    "flex w-full flex-row items-center justify-between",
                  )}
                >
                  <span
                    className={cn(
                      "font-poppins text-sm font-bold text-gray-300",
                    )}
                  >
                    QUESTION {q.position}.
                  </span>
                  <span className={cn("font-poppins text-xs")}>
                    <PointsEarned q={q} />
                  </span>
                </div>
                <div
                  className={cn(
                    "font-poppins flex min-h-[6rem] flex-col justify-between font-normal",
                  )}
                >
                  <div>
                    <p className={cn("text-md")}>{q.text}</p>
                  </div>
                  <div className={cn("flex flex-row items-baseline space-x-2")}>
                    <span
                      className={cn(
                        "font-poppins text-sm font-bold text-gray-300",
                      )}
                    >
                      {evaluatorName.toUpperCase()}:
                    </span>
                    <span
                      className={cn(
                        "font-forma text-lg font-bold text-primary/80",
                      )}
                    >
                      {getAnswer(q, answers)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <p className={cn("font-poppins col-span-full text-center")}>
            No questions found for this competency.
          </p>
        )}
      </div>
    </ScrollArea>
  );
}

import THUMBS_UP from "public/icons/thumb-up.json";
import THUMBS_DOWN from "public/icons/thumb-down.json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAllFormVersions } from "@/providers/all-form-versions-provider";
import { useSelectedContext } from "@/providers/selected-values-provider";
import { calculatePointsEarnedAndAvailable } from "@/lib/responses/calculatePointsEarnedAndAvailable";
import { calculateAverageQuestionScore } from "@/lib/responses/calculateAverageQuestionScore";
import { calculatePercentChange } from "@/lib/responses/calculatePercentChange";
function QuestionPreviewCardIcon({
  evaluateeScore,
  averageScore,
}: {
  evaluateeScore: number;
  averageScore: number;
}) {
  const outlierThreshold = 30; // Adjust this value as needed

  const isOutlierAbove = evaluateeScore > averageScore + outlierThreshold;
  const isOutlierBelow = evaluateeScore < averageScore - outlierThreshold;
  if (!isOutlierAbove && !isOutlierBelow) {
    return null;
  }

  const description = getPerformanceDescription(isOutlierAbove, isOutlierBelow);

  return (
    <div className={cn("font-poppins font-regular relative text-sm")}>
      <TooltipProvider delayDuration={0.4} skipDelayDuration={3}>
        <Tooltip>
          <TooltipTrigger
            className={cn(
              "size-6 items-center rounded-md bg-foreground transition-all hover:scale-125",
            )}
          >
            <div
              className={cn(
                "inline-block bg-gradient-to-br bg-clip-text text-lg font-extrabold text-transparent drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]",
                isOutlierAbove
                  ? "from-accent to-accent-secondary"
                  : "from-destructive to-orange-400",
              )}
            >
              {isOutlierAbove ? "!!" : "??"}
            </div>
          </TooltipTrigger>
          <TooltipContent
            className={cn("font-poppins flex flex-row items-center space-x-2")}
          >
            <Player
              src={isOutlierAbove ? THUMBS_UP : THUMBS_DOWN}
              autoplay
              loop={false}
              className={cn("size-4 pb-0.5")}
            />
            {description}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function getPerformanceDescription(
  isOutlierAbove: boolean,
  isOutlierBelow: boolean,
): ReactElement {
  if (isOutlierAbove) {
    return (
      <span>
        This score is considerably{" "}
        <span className="bg-gradient-to-br from-accent to-accent-secondary bg-clip-text font-bold text-transparent">
          ABOVE
        </span>{" "}
        the average.
      </span>
    );
  } else if (isOutlierBelow) {
    return (
      <span>
        This score is considerably{" "}
        <span className="bg-gradient-to-br from-destructive to-orange-400 bg-clip-text font-bold text-transparent">
          BELOW
        </span>{" "}
        the average.
      </span>
    );
  }
  return <span></span>;
}

const getAnswer = (
  question: QuestionVersionResult | undefined,
  answers: Answer[] | undefined,
) => {
  const answer = answers?.find((a) => a.questionVersionId === question?.id);
  const option = question?.options.find(
    (o) => o.id === answer?.optionVersionId,
  );
  return option?.text || ""; // Return an empty string if option is undefined
};

const getQuestionPointsEarned = (
  question: QuestionVersionResult,
  answers: Answer[] | undefined,
) => {
  const options = question.options || [];
  const pointsAvailable =
    options.length > 0
      ? Math.max(...options.map((option) => Number(option.pointValue)))
      : 0;

  const questionAnswer = answers?.find(
    (answer) => answer.questionVersionId === question.id,
  );
  const selectedOption = questionAnswer
    ? options.find((option) => option.id === questionAnswer.optionVersionId)
    : null;
  const pointsEarned = selectedOption ? Number(selectedOption.pointValue) : 0;
  const percent =
    pointsAvailable > 0 ? (pointsEarned / pointsAvailable) * 100 : 0;
  return { percent, pointsAvailable, pointsEarned };
};
