"use client";

import { AnimatePresence } from "framer-motion";
import { useFieldArray, useFormContext, FormProvider } from "react-hook-form";
import { FormResult } from "@/db/types";
import { useSubcompetenciesSuspenseQuery } from "@/hooks/queries/useSubcompetenciesSuspenseQuery";
import { saveForm } from "@/server/actions/forms/save-form";
import { Main } from "@/components/ui/main";
import { v4 } from "uuid";
import { RecommendedMilestone } from "@/db/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuestionCard } from "@/components/(admin)/forms/editor/question-card";
import { AddQuestionButton } from "@/components/(admin)/forms/editor/add-question-button";

export function QuestionCardList() {
  const methods = useFormContext<FormResult>();
  const { control, getValues, handleSubmit } = methods;
  const { fields, append } = useFieldArray({
    control,
    name: "questions",
  });
  const form = getValues();
  const { subcompetencies } = useSubcompetenciesSuspenseQuery({
    formId: form.id,
  });

  const onSubmit = async () => {
    try {
      await saveForm(getValues());
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  const handleAddQuestion = () => {
    const newPosition = fields.length + 1;
    append({
      id: v4(),
      text: "",
      feedback: false,
      position: newPosition,
      milestones: [],
      recommendedMilestone: {} as RecommendedMilestone,
      options: [],
      formId: getValues("id") || "",
    });
  };

  return (
    <Main>
      <ScrollArea className="h-[82.2vh]">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-3xl pb-52"
          >
            <AnimatePresence>
              {fields.map((item, index) => (
                <QuestionCard
                  key={`question-${item.id}`}
                  index={index}
                  // @ts-ignore
                  item={form.questions
                    .filter((q) => q !== undefined)
                    .find((q) => q.position === item.position)}
                  subcompetencies={subcompetencies}
                />
              ))}
            </AnimatePresence>
            <AddQuestionButton onClick={handleAddQuestion} />
          </form>
        </FormProvider>
      </ScrollArea>
    </Main>
  );
}
