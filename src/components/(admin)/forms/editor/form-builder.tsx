"use client";
import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Main } from "@/components/ui/main";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuestionCard } from "@/components/(admin)/forms/editor/question-card";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PlusCircleIcon } from "lucide-react";
import { v4 } from "uuid";

export function FormBuilder() {
  const { control, getValues } = useFormContext<TFormSchema>()

  const {
    fields: questions,
    append: addQuestion,
    remove: removeQuestion,
    update,
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

  return (
    <Main>
      <ScrollArea className="h-[82.2vh]">
        <form  className="mx-auto max-w-3xl pb-52">
          <AnimatePresence>
            {questions.map((q, index) => (
              <QuestionCard
                key={q.id}
                index={index}
                question={q}
                removeQuestion={removeQuestion}
                duplicateQuestion={() => handleDuplicateQuestion(index)}
                control={control}
              />
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
      </ScrollArea>
    </Main>
  );
}
