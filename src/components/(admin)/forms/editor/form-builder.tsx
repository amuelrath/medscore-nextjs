"use client";

import { useCallback, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Main } from "@/components/ui/main";
import { QuestionCard } from "@/components/(admin)/forms/editor/question-card";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PlusCircleIcon } from "lucide-react";
import { v4 } from "uuid";
import { useScrollToQuestion } from "@/components/(admin)/forms/editor/hooks/use-scroll-to-question";
import { InlineMilestoneMultiselect } from "@/components/(admin)/forms/editor/inline-milestone-input";
import LetterPullup from "@/components/ui/letter-pull-up";
import { Button } from "@/components/ui/button";

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
          selectedQuestion.milestoneIds,
        );
      }
    }
  }, [selectedQuestionId, questions, selectedQuestionIndex, setValue]);

  return (
    <Main className="flex flex-row gap-4">
      <motion.div
        className="border-opacity-18 mt-4 h-[95%] rounded-xl bg-card/40 border-white border shadow-lg ring-[2.8px] ring-accent-secondary backdrop-blur backdrop-filter"
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: selectedQuestionId ? "45%" : 0,
          opacity: selectedQuestionId ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        {selectedQuestionId && selectedQuestionIndex !== -1 && (
          <div className="px-4 pb-4 pt-1">
            <div className="flex flex-row w-full items-center justify-between" >
            <LetterPullup delay={0.01} key={selectedQuestionIndex} words={`Question ${selectedQuestionIndex + 1}`}/>
              <Button onClick={() => setSelectedQuestionId(undefined)} className="bg-transparent" variant={"outline"} >Done</Button>
            </div>
            <InlineMilestoneMultiselect
              control={control}
              name={`questions.${selectedQuestionIndex}.milestoneIds`}
              questionId={selectedQuestionId}
            />
          </div>
        )}
      </motion.div>
      <div className="flex flex-grow justify-center">
        <div
          ref={containerRef}
          className="no-scrollbar h-[82.2vh] w-full max-w-3xl overflow-y-auto"
        >
          <form className="mx-auto pb-52">
            <AnimatePresence>
              {questions.map((q, index) => (
                <motion.div
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
                </motion.div>
              ))}
            </AnimatePresence>
            <motion.div layout className="mt-4 flex justify-center">
              <motion.div
                layoutId="add-question"
                className="cursor-pointer rounded-full p-1 transition-all hover:bg-primary hover:text-white"
                onClick={handleAddQuestion}
              >
                <PlusCircleIcon />
              </motion.div>
            </motion.div>
          </form>
        </div>
      </div>
    </Main>
  );
}
