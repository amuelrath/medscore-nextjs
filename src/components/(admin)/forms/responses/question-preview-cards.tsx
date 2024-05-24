import {
  AnswerResult,
  FormVersionsResult,
  QuestionVersionResult,
} from "@/db/types";
import THUMBS_UP from "public/icons/thumb-up.json";
import THUMBS_DOWN from "public/icons/thumb-down.json";
const TooltipProvider = dynamic(
  () =>
    import("@/components/ui/tooltip").then((module) => ({
      default: module.TooltipProvider,
    })),
  { ssr: false },
);
const Tooltip = dynamic(
  () =>
    import("@/components/ui/tooltip").then((module) => ({
      default: module.Tooltip,
    })),
  { ssr: false },
);
const TooltipTrigger = dynamic(
  () =>
    import("@/components/ui/tooltip").then((module) => ({
      default: module.TooltipTrigger,
    })),
  { ssr: false },
);
const TooltipContent = dynamic(
  () =>
    import("@/components/ui/tooltip").then((module) => ({
      default: module.TooltipContent,
    })),
  { ssr: false },
);
import { calculateAverageQuestionScore } from "@/lib/responses/calculateAverageQuestionScore";
import { cn } from "@/lib/utils";
import { ReactElement } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getBgColorFromPointValue } from "@/lib/getColorFromPointValue";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";
import Lottie from "lottie-react";
export function QuestionPreviewCards({
  versions,
  questions,
  answers,
  evaluatorName,
}: {
  versions: FormVersionsResult;
  questions: QuestionVersionResult[] | undefined;
  answers: AnswerResult[] | undefined;
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
            );
            const evaluateeScore = getQuestionPointsEarned(q, answers);
            const answerData = getAnswer(q, answers);

            return (
              <Card
                className={cn(
                  "relative col-span-1 p-4 transition-colors duration-200 hover:bg-gray-100",
                )}
                key={q.id}
              >
                <div className={cn("")}></div>
                <div
                  className={cn(
                    "flex w-full flex-row items-center justify-between",
                  )}
                >
                  <span className={cn("text-sm font-bold text-gray-300")}>
                    QUESTION {q.position}.
                  </span>
                  <div className={cn("flex flex-row items-center space-x-2")}>
                    <span className={cn("text-xs")}>
                      <PointsEarned q={q} />
                    </span>
                    <QuestionPreviewCardIcon
                      evaluateeScore={evaluateeScore.percent}
                      averageScore={averageScore}
                    />
                  </div>
                </div>
                <div
                  className={cn(
                    "flex min-h-[6rem] flex-col justify-items-stretch font-normal",
                  )}
                >
                  <div>
                    <p className={cn("text-md")}>{q.text}</p>
                  </div>
                  <div className={cn("flex flex-row items-baseline mb-2 space-x-2")}>
                    <span className={cn("text-sm font-bold text-gray-300")}>
                      {evaluatorName.toUpperCase()}:
                    </span>
                    <span className={cn("text-lg font-semibold text-primary/80")}>
                      {answerData.answer}
                    </span>
                  </div>
                  {answerData.feedback && (
                    <>
                      <hr />
                      <div
                        className={cn(
                          "flex mt-1 flex-col items-start justify-start",
                        )}
                      >
                        <span className={cn("text-sm italic text-primary/80")}>
                          &quot;{answerData.feedback}&quot;
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            );
          })
        ) : (
          <p className={cn("col-span-full text-center")}>
            No questions found for this competency.
          </p>
        )}
      </div>
    </ScrollArea>
  );
}

export function QuestionPreviewCardIcon({
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
    <div className={cn("font-regular relative text-sm")}>
      <TooltipProvider delayDuration={0.4} skipDelayDuration={3}>
        <Tooltip>
          <TooltipTrigger
            className={cn(
              "size-6 items-center rounded-md bg-foreground transition-all aspect-square hover:scale-110",
            )}
          >
            <div
              className={cn(
                "bg-gradient-to-br bg-clip-text text-lg font-extrabold text-transparent",
                isOutlierAbove
                  ? "from-accent to-accent-secondary"
                  : "from-destructive to-orange-400",
              )}
            >
              {isOutlierAbove ? (
                <p className="-mt-[1px]">!!</p>
              ) : (
                <p className="-mt-[1px] pl-[1px]">??</p>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent
            className={cn("flex flex-row items-center space-x-2")}
          >
            <Lottie
              animationData={isOutlierAbove ? THUMBS_UP : THUMBS_DOWN}
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
  answers: AnswerResult[] | undefined,
) => {
  const answer = answers?.find((a) => a.questionVersionId === question?.id);
  const option = question?.options.find(
    (o) => o.id === answer?.optionVersionId,
  );
  return { answer: option?.text, feedback: answer?.feedback } || "Err"; // Return an empty string if option is undefined
};

export const getQuestionPointsEarned = (
  question: QuestionVersionResult,
  answers: AnswerResult[] | undefined,
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
