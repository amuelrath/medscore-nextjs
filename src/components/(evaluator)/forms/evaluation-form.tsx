"use client";
import { TEvaluationForm, TQuestionRelate, TResponseSchema } from "@/db/types";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { QuestionCard } from "@/components/(evaluator)/forms/question-card";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "@/db/schema";
import { trpc } from "@/app/_trpc/client";
import { useEffect, useRef, useState } from "react";
import { DevTool } from "@hookform/devtools";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EvaluationForm({ form }: { form: TEvaluationForm }) {
  const router = useRouter();
  const [evaluatee, setEvaluatee] = useState<User>();

  const evaluateeFromCache = JSON.parse(
    localStorage.getItem("evaluatee") || "",
  ) as User;

  const methods = useForm<TResponseSchema>({
    defaultValues: {
      formVersionId: form.id,
      creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
      evaluateeId: evaluateeFromCache?.id,
    },
  });

  const submitResponse = trpc.responses.submitResponse.useMutation({
    onSuccess: () => {
      toast.success("Submitted Successfully!");
    },
  });

  const handleSubmit = (data: TResponseSchema) => {
    submitResponse.mutate(data);
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

  useEffect(() => {
    console.log(formState.errors);
  }, [formState.errors]);

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
