"use client";
import { cn } from "@/lib/utils";
import { AnswerResult, QuestionVersionResult } from "@/db/types";
import { QuestionResponseCard } from "@/components/(admin)/forms/responses/question-response-card";
import { Answer, Option } from "@/db/schema";
import { memo, Suspense, useEffect, useMemo, useState } from "react";
import { AutoSizer, List, ListRowRenderer } from "react-virtualized";
import { useSelectedContext } from "@/providers/selected-values-provider";
import { DynamicEyeball } from "@/components/ui/lottie/eyeball";
import { motion, AnimatePresence } from "framer-motion";

export const ResponseEditor = memo(() => {
  const { selectedVersion, selectedResponse } = useSelectedContext();
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});

  const sortedQuestions = useMemo(() => {
    if (selectedVersion?.questions) {
      return [...selectedVersion?.questions].sort(
        (a, b) => a.position - b.position,
      );
    }
    return [];
  }, [selectedVersion?.questions]);

  useEffect(() => {
    const newRowHeights: Record<number, number> = {};

    selectedVersion?.questions.forEach((item, index) => {
      newRowHeights[index] = estimateRowHeight(
        sortedQuestions[index],
        sortedQuestions[index].options as unknown as Option[],
        selectedResponse?.answers as unknown as AnswerResult[],
      );
    });

    setRowHeights(newRowHeights);
  }, [selectedVersion?.questions, selectedResponse?.answers, sortedQuestions]);

  if (!selectedVersion || !selectedResponse) {
    return (
      <div className={cn("flex h-full w-full justify-center")}>
        <div
          className={cn(
            "flex h-full w-full flex-col items-center justify-center",
          )}
        >
          <Suspense fallback={<div className="size-24" />}>
            <DynamicEyeball className="size-24 drop-shadow-xl" />
          </Suspense>
          <p>Select a response to view details.</p>
        </div>
      </div>
    );
  }

  const rowRenderer: ListRowRenderer = ({ index, style }) => {
    const question = sortedQuestions[index];
    return (
      <div
        key={question.id}
        style={style}
        className={cn("overflow-hidden pr-8")}
      >
        <QuestionResponseCard
          locked={true}
          answers={selectedResponse.answers}
          question={question}
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
              key={JSON.stringify(rowHeights)}
              height={height}
              width={width}
              rowCount={selectedVersion.questions.length}
              rowHeight={({ index }) =>
                rowHeights[index] ||
                estimateRowHeight(
                  selectedVersion.questions[index],
                  selectedVersion.questions[index]
                    .options as unknown as Option[],
                  selectedResponse.answers as unknown as Answer[],
                )
              }
              rowRenderer={rowRenderer}
              overscanRowCount={10}
              scrollToIndex={0}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
});

ResponseEditor.displayName = "ResponseEditor";

// TODO find a less hacky way of doing this.
const estimateRowHeight = (
  question: QuestionVersionResult,
  options: Option[],
  answers: AnswerResult[],
): number => {
  const answerForThisQuestion = answers?.find(
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
