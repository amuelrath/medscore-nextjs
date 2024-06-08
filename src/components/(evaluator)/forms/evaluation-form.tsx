"use client";
import { TQuestionRelate, TResponseSchema } from "@/db/types";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { QuestionCard } from "@/components/(evaluator)/forms/question-card";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "@/db/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { useMutation, useQuery } from "@tanstack/react-query";
import { submitResponse } from "@/server/actions/responses/submit-response";

export default function EvaluationForm({ formId }: { formId: string }) {
  const router = useRouter();
  const [evaluatee, setEvaluatee] = useState<User>();

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", formId],
    queryFn: () =>
      getFormById({
        formId: formId,
        userId: process.env.NEXT_PUBLIC_USER_ID as string,
      }),
  });

  const submitResponseMutation = useMutation({
    mutationFn: (data: TResponseSchema) => submitResponse(data),
  });

  const evaluateeFromCache = JSON.parse(
    localStorage.getItem("evaluatee") || "",
  ) as User;

  const methods = useForm<TResponseSchema>({
    defaultValues: {
      formVersionId: form?.id || "",
      creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      evaluateeId: evaluateeFromCache?.id,
    },
  });

  const handleSubmit = (data: TResponseSchema) => {
    submitResponseMutation.mutate(data);
  };

  const handleFormKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const clearEvaluateeFromCache = () => {
    localStorage.removeItem("evaluatee");
  };

  const { handleSubmit: onSubmit, formState } = methods;

  return (
    <FormProvider {...methods}>
      <form className={cn("space-y-4")} onKeyDown={() => handleFormKeyDown}>
        <AnimatePresence>
          {form &&
            form.questions &&
            form.questions
              .filter((q) => q !== null)
              .sort((a, b) => a.position - b.position)
              .map((q, index) => (
                <Controller
                  key={q.id}
                  name={`answers.${index}.questionVersionId`}
                  render={() => (
                    <QuestionCard
                      index={index}
                      question={q as unknown as TQuestionRelate}
                    />
                  )}
                />
              ))}
        </AnimatePresence>
        <Button
          type="submit"
          onClick={() => handleSubmit(methods.getValues())}
          disabled={formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
