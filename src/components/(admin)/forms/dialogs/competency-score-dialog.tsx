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
import { ReactElement, ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TFormVersion, TQuestionRelate } from "@/db/types";
import {
  Answer,
  answers,
  formVersions,
  questions,
  responses,
  User,
} from "@/db/schema";
import { getBgColorFromPointValue } from "@/lib/getColorFromPointValue";
import { Card } from "@/components/ui/card";
import {
  getFilteredQuestionsAndAnswers,
  getPointsEarnedAndAvailable,
} from "@/lib/responses/utils";
import { useCurrentResponseAndForm } from "@/hooks/useCurrentResponseAndForm";
import { getFullName } from "@/lib/getFullName";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChangeIndicator } from "@/components/ui/percent-change-indicator";
import {
  getPercentChange,
  getQuestionConsistencyScore,
} from "@/lib/responses/percentChangeCalculator";
import { useAllFormVersions } from "@/hooks/useAllFormVersions";
import { Separator } from "@/components/ui/separator";
import { Player } from "@lottiefiles/react-lottie-player";
// TODO Get (overall and competency and question specific) consistency score (make sure there is a minimum amount of data), growth indicator

export function CompetencyScoreDialogTrigger({
  competencyName,
  children,
}: {
  competencyName: keyof typeof COMPETENCIES;
  children: ReactNode;
}) {
  const { allVersions } = useAllFormVersions();
  const { formVersion: selectedVersion, response } =
    useCurrentResponseAndForm();
  const evaluatee = response?.evaluatee;

  const percentChange = getPercentChange(
    evaluatee?.id || "",
    allVersions as unknown as TFormVersion[],
    selectedVersion?.id || "",
    competencyName,
  );

  const { filteredAnswers: answers, filteredQuestions: questions } =
    getFilteredQuestionsAndAnswers(
      competencyName,
      selectedVersion?.questions as unknown as TQuestionRelate[],
      response?.answers as unknown as Answer[],
    );

  const p = useMemo(() => {
    return getPointsEarnedAndAvailable(questions, answers);
  }, [questions, answers]);
  const bgColor = getBgColorFromPointValue(
    (p.pointsEarned || 0) / (p.pointsEarned || 0),
  );

  if (!allVersions) return <>No Versions.</>;
  if (!selectedVersion) return <>Error! Form version not found.</>;
  if (!selectedVersion.questions) return <>No questions in this form!</>;
  if (!response) return <>No responses found!</>;
  if (!response.answers) return <>This response has no content.</>;

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className={cn("min-w-[900px]")}>
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

              <div className={cn("flex flex-col items-end")}>
                <p
                  className={cn("font-poppins text-sm font-bold text-gray-400")}
                >
                  &Delta; PREVIOUS
                </p>
                <ChangeIndicator
                  percentChange={
                    Number(
                      percentChange?.percentChangeFromPrevious.toFixed(1),
                    ) || 0
                  }
                />
              </div>
              <Separator orientation={"vertical"} />

              <div className={cn("flex flex-col items-end")}>
                <p
                  className={cn("font-poppins text-sm font-bold text-gray-400")}
                >
                  &Delta; OVERALL
                </p>
                <ChangeIndicator
                  percentChange={
                    Number(percentChange?.percentChangeFromFirst.toFixed(1)) ||
                    0
                  }
                />
              </div>
            </div>
          </div>
        </DialogHeader>
        <QuestionPreviewCards
          evaluatorName={getFullName(response.creator || ({} as User))}
          allVersions={allVersions as unknown as TFormVersion[]}
          questions={questions}
          answers={answers}
        />
      </DialogContent>
    </Dialog>
  );
}

function QuestionPreviewCards({
  allVersions,
  questions,
  answers,
  evaluatorName,
}: {
  allVersions: TFormVersion[] | undefined;
  questions: TQuestionRelate[] | undefined;
  answers: Answer[] | undefined;
  evaluatorName: string;
}) {
  const evaluateeIds = allVersions?.flatMap((v) =>
    v.responses.flatMap((r) => r.evaluatee.id),
  );

  return (
    <ScrollArea className={cn("h-80 w-full pb-4 pr-4")}>
      <ScrollBar />
      <div className={cn("grid grid-cols-2 gap-6 p-6 pt-0")}>
        {questions && questions.length > 0 ? (
          questions.map((q) => {
            const c = getQuestionConsistencyScore(
              allVersions as unknown as TFormVersion[],
              evaluateeIds || [""],
              q.id,
              0.8, // Example goodThreshold (80%)
              0.6, // Example badThreshold (60%)
            );

            return (
              <Card
                className={cn(
                  "relative col-span-1 p-4 transition-colors duration-200 hover:bg-gray-100",
                )}
                key={q.id}
              >
                <div className={cn("absolute bottom-2 right-2")}>
                  <QuestionPreviewCardIcon
                    consistentlyGoodPercentage={c.consistentlyGoodPercentage}
                    consistentlyBadPercentage={c.consistentlyBadPercentage}
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
                    {getQuestionPointsEarned(q, answers)}
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
                  <div className={cn("flex flex-row space-x-2 items-baseline")} >
                      <span className={cn("font-poppins font-bold text-sm text-gray-300")} >
                      {evaluatorName.toUpperCase()}:
                      </span>
                      <span className={cn("font-forma font-bold text-primary/80 text-lg")} >
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
import { InfoIcon } from "lucide-react";
function QuestionPreviewCardIcon({
  consistentlyGoodPercentage,
  consistentlyBadPercentage,
}: {
  consistentlyGoodPercentage: number;
  consistentlyBadPercentage: number;
}) {
  const description = getPerformanceDescription(
    consistentlyGoodPercentage,
    consistentlyBadPercentage,
  );
  const isGood = consistentlyGoodPercentage > consistentlyBadPercentage;
  const isBalanced = consistentlyBadPercentage === consistentlyGoodPercentage;
  return (
    <div className={cn("font-poppins font-regular relative text-sm")}>
      {!isBalanced && (
        <TooltipProvider delayDuration={0.4} skipDelayDuration={3}>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon size={20} />
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "font-poppins flex flex-row items-center space-x-2",
              )}
            >
              <Player
                src={isGood ? THUMBS_UP : THUMBS_DOWN}
                autoplay
                loop={false}
                className={cn("mb-1 size-4")}
              />
              {description}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
function getPerformanceDescription(
  consistentlyGoodPercentage: number,
  consistentlyBadPercentage: number,
): ReactElement {
  const majorityThreshold = 50;
  const significantThreshold = 80;

  if (consistentlyGoodPercentage === 100) {
    return (
      <span>
        <span className="font-bold">ALL</span> residents consistently perform{" "}
        <span className="font-bold text-emerald-500">WELL</span> on this
        question.
      </span>
    );
  } else if (consistentlyBadPercentage === 100) {
    return (
      <span>
        <span className="font-bold">ALL</span> residents consistently{" "}
        <span className="font-bold text-destructive">STRUGGLE</span> with this
        question
      </span>
    );
  } else if (
    consistentlyGoodPercentage >= significantThreshold &&
    consistentlyBadPercentage < majorityThreshold
  ) {
    return (
      <span>
        A significant <span className="font-bold">MAJORITY</span> of residents
        consistently perform{" "}
        <span className="font-bold text-emerald-500">WELL</span> on this
        question.
      </span>
    );
  } else if (
    consistentlyBadPercentage >= significantThreshold &&
    consistentlyGoodPercentage < majorityThreshold
  ) {
    return (
      <span>
        A significant <span className="font-bold">MAJORITY</span> of residents
        consistently{" "}
        <span className="font-bold text-destructive">STRUGGLE</span> with this
        question.
      </span>
    );
  } else if (
    consistentlyGoodPercentage >= majorityThreshold &&
    consistentlyBadPercentage < majorityThreshold
  ) {
    return (
      <span>
        <span className="font-bold">MOST</span> residents consistently perform{" "}
        <span className="font-bold text-emerald-500">WELL</span> on this
        question.
      </span>
    );
  } else if (
    consistentlyBadPercentage >= majorityThreshold &&
    consistentlyGoodPercentage < majorityThreshold
  ) {
    return (
      <span>
        <span className="font-bold">MOST</span> residents consistently{" "}
        <span className="font-bold text-destructive">STRUGGLE</span> with this
        question.
      </span>
    );
  } else {
    return (
      <span>
        Resident performance is{" "}
        <span className="font-bold text-yellow-600">BALANCED</span> on this
        question.
      </span>
    );
  }
}

const getAnswer = (
  question: TQuestionRelate | undefined,
  answers: Answer[] | undefined,
) => {
  const answer = answers?.find((a) => a.questionVersionId === question?.id);
  const option = question?.options.find(
    (o) => o.id === answer?.optionVersionId,
  );
  return option?.text || ""; // Return an empty string if option is undefined
};

const getQuestionPointsEarned = (
  question: TQuestionRelate,
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

  const bgColor = getBgColorFromPointValue(pointsEarned / pointsAvailable);

  return (
    <p className={cn("text-sm font-bold tracking-widest")}>
      <span style={{ color: bgColor }}>{pointsEarned}</span>
      {`/${pointsAvailable}`}
    </p>
  );
};
