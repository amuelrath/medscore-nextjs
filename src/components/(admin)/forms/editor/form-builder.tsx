"use client";

import { useCallback, useState, useEffect } from "react";
import { AnimatePresence, m, LazyMotion, domAnimation } from "framer-motion";
import { QuestionCard } from "@/components/(admin)/forms/editor/question-card";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PlusCircleIcon } from "lucide-react";
import { v4 } from "uuid";
import { useScrollToQuestion } from "@/components/(admin)/forms/editor/hooks/use-scroll-to-question";
import dynamic from "next/dynamic";
import Loading from "@/components/ui/loading";

const DynamicMilestoneMenu = dynamic(
  () =>
    import("@/components/(admin)/forms/editor/milestone-menu").then(
      (mod) => mod.MilestoneMenu,
    ),
  { ssr: false, loading: () => <Loading /> },
);

export function FormBuilder() {
  const [selectedQuestionId, setSelectedQuestionId] = useState<
    string | undefined
  >(undefined);
  const { control, getValues, setValue } = useFormContext<TFormSchema>();

  const { containerRef, questionRefs } = useScrollToQuestion({
    selectedQuestionId,
  });

  const {
    fields: questions,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const handleAddQuestion = useCallback(() => {
    addQuestion({
      id: v4(),
      options: [],
      feedback: false,
      text: "",
      position: questions.length + 1,
      milestoneIds: [],
    });
  }, [addQuestion, questions.length]);

  const handleDuplicateQuestion = useCallback(
    (index: number) => {
      const currentQuestions = getValues("questions");
      const questionToDuplicate = currentQuestions[index];
      const newQuestion = {
        ...questionToDuplicate,
        id: v4(),
        position: currentQuestions.length + 1,
        options: questionToDuplicate.options.map((option) => ({
          ...option,
          id: v4(),
        })),
      };
      addQuestion(newQuestion);
    },
    [getValues, addQuestion],
  );

  const handleQuestionClick = useCallback((id: string) => {
    setSelectedQuestionId((prevId) => (prevId === id ? undefined : id));
  }, []);

  const selectedQuestionIndex = questions.findIndex(
    (q) => q.id === selectedQuestionId,
  );

  // Effect to update form context when selected question changes
  useEffect(() => {
    if (selectedQuestionId) {
      const selectedQuestion = questions.find(
        (q) => q.id === selectedQuestionId,
      );
      if (selectedQuestion) {
        setValue(
          `questions.${selectedQuestionIndex}.milestoneIds`,
          getValues(`questions.${selectedQuestionIndex}.milestoneIds`),
        );
      }
    }
  }, [
    selectedQuestionId,
    questions,
    selectedQuestionIndex,
    setValue,
    getValues,
  ]);

  return (
    <main className="flex flex-row px-2 pl-4">
      <LazyMotion features={domAnimation}>
        <DynamicMilestoneMenu
          control={control}
          selectedQuestionIndex={selectedQuestionIndex}
          open={!!selectedQuestionId}
          onClose={() => setSelectedQuestionId(undefined)}
        />
        <div className="flex flex-grow justify-center">
          <div
            ref={containerRef}
            className="no-scrollbar h-[87.3vh] w-full max-w-3xl overflow-y-scroll"
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto pb-52"
            >
              <AnimatePresence>
                {questions.map((q, index) => (
                  <m.div
                    key={q.id}
                    layout
                    // @ts-expect-error WATCH THIS MIGHT CAUSE ISSUES
                    ref={(el) => (questionRefs.current[q.id] = el)}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <QuestionCard
                      index={index}
                      question={q}
                      removeQuestion={removeQuestion}
                      duplicateQuestion={() => handleDuplicateQuestion(index)}
                      control={control}
                      selectQuestion={() => handleQuestionClick(q.id)}
                      isSelected={selectedQuestionId === q.id}
                    />
                  </m.div>
                ))}
              </AnimatePresence>
              <m.div layout className="mt-4 flex justify-center">
                <m.div
                  layoutId="add-question"
                  className="cursor-pointer rounded-full p-1 transition-all hover:bg-primary hover:text-white"
                  onClick={handleAddQuestion}
                >
                  <PlusCircleIcon />
                </m.div>
              </m.div>
            </form>
          </div>
        </div>
      </LazyMotion>
    </main>
  );
}
