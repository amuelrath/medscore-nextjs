"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/app/_trpc/client";
import { useSelectedContext } from "@/providers/selected-values-provider";
import { getFullName } from "@/lib/getFullName";
import { User } from "@/db/schema";
import { COMPETENCIES } from "@/db/constants";
import { getFilteredQuestionsAndAnswers } from "@/lib/responses/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getQuestionPointsEarned } from "@/components/(admin)/forms/responses/question-preview-cards";
import { calculateAverageQuestionScore } from "@/lib/responses/calculateAverageQuestionScore";
import { useAllFormVersions } from "@/providers/all-form-versions-provider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeedbackSummaryCardProps {
  competencyName: keyof typeof COMPETENCIES;
  percentImprovementFromPreviousAttempt: number;
  percentImprovementFromFirstAttempt: number;
}

export function FeedbackSummaryCard({
  competencyName,
  percentImprovementFromPreviousAttempt,
  percentImprovementFromFirstAttempt,
}: FeedbackSummaryCardProps) {
  const { versions } = useAllFormVersions();
  const { selectedVersion, selectedResponse } = useSelectedContext();

  const transformer = () => {
    const { filteredAnswers, filteredQuestions } =
      getFilteredQuestionsAndAnswers(
        competencyName,
        selectedVersion?.questions,
        selectedResponse?.answers,
      );

    return filteredQuestions?.flatMap((q) => {
      if (q.text === undefined || q.text === null) {
        return [];
      }
      const { percent: percentScore } = getQuestionPointsEarned(
        q,
        filteredAnswers,
      );
      const averageScore = calculateAverageQuestionScore(versions, q.text);
      return {
        desiredBehavior: q.text,
        evaluatorComments:
          filteredAnswers?.find((a) => a.questionVersionId === q.id)
            ?.feedback || "",
        percentScore,
        averageScoreForAllPeople: averageScore,
      };
    });
  };

  const transformedQuestions = transformer();

  const summary = trpc.ai.summarizeCompetencyPerformance.useSuspenseQuery({
    data: {
      type: "Objective Structured Clinical Exam",
      examQuestions: transformedQuestions || [],
    },
    context: {
      competencyName: COMPETENCIES[competencyName].name,
      evaluateeName: getFullName(selectedResponse?.evaluatee || ({} as User)),
      examTitle: selectedVersion?.title || "No Title",
      percentImprovementFromFirstAttempt,
      percentImprovementFromPreviousAttempt,
    },
    meta: {
      evaluateeId: selectedResponse?.evaluatee.id || "",
      formVersionId: selectedVersion?.id || "",
      competencyId: COMPETENCIES[competencyName].id,
    },
  })[1].data;

  return (
    <Carousel className={"px-4"}>
      <CarouselContent className="">
        <CarouselItem className="h-52">
          <FeedbackCard
            title="Summary"
            content={summary?.feedback || "No Feedback Found."}
          />
        </CarouselItem>
        <CarouselItem>
          <FeedbackCard
            title="Strengths"
            content={summary?.strengths || "No Strengths Identified."}
          />
        </CarouselItem>
        <CarouselItem>
          <FeedbackCard
            title="Weaknesses"
            content={summary?.weaknesses || "No Weaknesses Identified."}
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className={"ml-7"} />
      <CarouselNext className={"mr-7"} />
    </Carousel>
  );
}

interface FeedbackCardProps {
  title: string;
  content: string;
}

function FeedbackCard({ title, content }: FeedbackCardProps) {
  return (
    <Card className="h-52 ">
      <CardContent className="mb-1 flex h-52 flex-col items-start space-y-2 rounded-md border bg-gradient-to-b from-foreground to-black p-4 text-white">
        <div className={cn("flex w-full flex-row items-center space-x-2")}>
          <span className="text-center text-xl font-semibold">{title}</span>
          <Badge variant={"outline"} className="text-extrabold tracking-widest">
            AI
          </Badge>
        </div>
        <ScrollArea className="pr-4 text-justify text-sm">
          <ScrollBar />
          {content}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
