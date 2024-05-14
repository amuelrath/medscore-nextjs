"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import EYE_BLINKING from "public/icons/wired-flat-69-eye.json";
import { cn } from "@/lib/utils";
import { TQuestionRelate } from "@/db/types";
import { QuestionResponseCard } from "@/components/(admin)/forms/responses/question-response-card";
import { Answer, Option } from "@/db/schema";
import { memo, Suspense, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { List, AutoSizer, ListRowRenderer } from "react-virtualized";

export const ResponseEditor = memo(() => {
  const searchParams = useSearchParams();
  const selectedVersionId = searchParams.get("versionId");
  const selectedResponseId = searchParams.get("responseId");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    data: formVersion,
    isLoading: isFormVersionLoading,
    isError: isFormVersionError,
  } = trpc.forms.versionById.useQuery(
    { formVersionId: selectedVersionId as string },
    { enabled: !!selectedVersionId },
  );

  const response = useMemo(
    () => formVersion?.responses.find((r) => r.id === selectedResponseId),
    [formVersion?.responses, selectedResponseId],
  );

  const sortedQuestions = useMemo(() => {
    if (formVersion?.questions) {
      return [...formVersion.questions].sort((a, b) => a.position - b.position);
    }
    return [];
  }, [formVersion?.questions]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [selectedResponseId]);

  if (isFormVersionError) {
    return <div>Error loading form.</div>;
  }

  if (!selectedVersionId || !selectedResponseId || isFormVersionLoading) {
    return (
      <div className={cn("flex h-full w-full justify-center")}>
        <div
          className={cn(
            "flex h-full w-full flex-col items-center justify-center",
          )}
        >
          <Suspense fallback={<div className="size-24" />}>
            <Player
              src={EYE_BLINKING}
              autoplay
              loop
              speed={0.7}
              className={cn("size-24 drop-shadow-lg")}
            />
          </Suspense>
          <p className={"font-poppins"}>Select a response to view details.</p>
        </div>
      </div>
    );
  }

  if (!formVersion?.questions || !response) {
    return (
      <div className={cn("flex h-full w-full justify-center")}>
        <div
          className={cn(
            "flex h-full w-full flex-col items-center justify-center",
          )}
        >
          <Suspense fallback={<div className="size-24" />}>
            <Player
              src={EYE_BLINKING}
              autoplay
              loop
              speed={0.7}
              className={cn("size-24 drop-shadow-lg")}
            />
          </Suspense>
          <p className={"font-poppins"}>
            No questions or response found for the selected form version.
          </p>
        </div>
      </div>
    );
  }

  const rowRenderer: ListRowRenderer = ({ index, style }) => {
    const question = sortedQuestions[index];
    return (
      <div key={question.id} style={style} className={cn("pr-8")}>
        <QuestionResponseCard
          locked={true}
          answers={response?.answers as unknown as Answer[]}
          question={question as unknown as TQuestionRelate}
          index={index}
        />
      </div>
    );
  };

  return (
    <div className={cn("flex h-full w-full justify-center")}>
      <div className={cn("w-full")}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              rowCount={formVersion.questions.length}
              rowHeight={({ index }) =>
                estimateRowHeight(
                  formVersion.questions[index] as unknown as TQuestionRelate,
                  formVersion.questions[index].options as unknown as Option[],
                  response.answers as unknown as Answer[],
                )
              }
              rowRenderer={rowRenderer}
              overscanRowCount={10}
              scrollToIndex={0}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        <div className="font-poppins mt-4">Edits/ Discussion go Here</div>
      </div>
    </div>
  );
});

ResponseEditor.displayName = "ResponseEditor";

// TODO find a less hacky way of doing this.
const estimateRowHeight = (
  question: TQuestionRelate,
  options: Option[],
  answers: Answer[],
): number => {
  const answerForThisQuestion = answers.find(
    (a) => a.questionVersionId === question.id,
  );
  // Constants to adjust the height estimation
  const BASE_HEIGHT = 72; // Minimum height for the component
  const QUESTION_TEXT_HEIGHT_FACTOR = 0.1; // Factor based on question text length
  const OPTION_HEIGHT = 53.333; // Height for each answer option
  const FEEDBACK_HEIGHT = 120; // Height of the Textarea

  // Calculate the height based on the question text length
  const questionTextLength = question.text?.length || 0;
  const questionTextHeight =
    BASE_HEIGHT + questionTextLength * QUESTION_TEXT_HEIGHT_FACTOR;

  // Calculate the height based on the number of answer options
  const optionsHeight = options.length * OPTION_HEIGHT;

  const feedbackHeight =
    question.feedback || answerForThisQuestion?.feedback ? FEEDBACK_HEIGHT : 0;

  // Calculate the total estimated height
  const estimatedHeight = questionTextHeight + optionsHeight + feedbackHeight;

  // Add a buffer for additional content or styling
  const buffer = 45;

  return estimatedHeight + buffer;
};
