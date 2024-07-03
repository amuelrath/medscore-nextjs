"use client";
import { getEvaluationForm } from "@/server/actions/evaluate/get-evaluation-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnswerCard } from "@/components/(admin)/forms/responses/answer-card";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import { submitResponse } from "@/server/actions/responses/submit-response";
import { toast } from "sonner";
import { useEffect } from "react";
import { EvaluateNav } from "@/components/(admin)/evaluate/evaluate-nav";

interface EvaluationFormProps {
  formCodeId: string;
}

export function EvaluationForm({ formCodeId }: EvaluationFormProps) {
  const {
    data: evaluation,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["evaluation-form", formCodeId],
    queryFn: () => getEvaluationForm({ formCodeId }),
  });

  const ZEvaluationFormSchema = z.object({
    answers: z
      .array(
        z.object({
          optionId: z.string().min(1, "An option must be selected"),
          feedback: z.string().optional(),
        }),
      )
      .refine(
        (answers) => {
          if (!evaluation) return false;
          if (answers.length !== evaluation.form?.questions.length)
            return false;
          return answers.every(
            (answer, index) =>
              answer.optionId !== "" &&
              (!evaluation.form?.questions[index].feedback || answer.feedback),
          );
        },
        {
          message:
            "All questions must be answered and feedback provided where required",
        },
      ),
  });
  type TEvaluationForm = z.infer<typeof ZEvaluationFormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TEvaluationForm>({
    resolver: zodResolver(ZEvaluationFormSchema),
    defaultValues: {
      answers:
        evaluation?.form?.questions.map(() => ({
          optionId: "",
          feedback: "",
        })) || [],
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data: TEvaluationForm) =>
      submitResponse({
        formCodeId,
        evaluatorId: "cf8b381f-1956-4c56-acf3-cf7517b20b92",
        evaluateeId: "3abe0f2e-0b2e-4e23-9761-97e4b39897c6", // TODO FIXME
        answers: data.answers,
      }),
    onSuccess: () => {
      toast.success("Response submitted successfully!");
      reset(); // Reset the form after successful submission
    },
    onError: () => {
      toast.error("Oops! Something went wrong.");
    },
  });

  useEffect(() => {
    if (errors.answers) {
      toast.error("Make sure all fields have been filled out.");
    }
  }, [errors]);

  const answers = useWatch({
    control,
    name: "answers",
  });

  const totalQuestions = answers.length;
  const completedQuestions = answers.filter(
    (answer) =>
      answer.optionId &&
      (!evaluation?.form?.questions[answers.indexOf(answer)]?.feedback ||
        answer.feedback),
  ).length;

  const onSubmit = (data: TEvaluationForm) => {
    submitMutation.mutate(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !evaluation) {
    return <div>Error loading evaluation form</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <EvaluateNav
        formTitle={evaluation?.form?.title || ""}
        evaluatorName={"Austin Muelrath"}
        evaluateeName={"Alyssa Lee"}
        totalQuestions={totalQuestions}
        completedQuestions={completedQuestions}
      />
      <div className="flex flex-grow justify-center">
        <div className="no-scrollbar h-[93vh] w-full max-w-3xl overflow-y-scroll">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto space-y-4 pb-52  p-4 "
          >
            {evaluation.form?.questions
              .sort((a, b) => a.position - b.position)
              .map((question, index) => (
                <div key={question.id}>
                  <AnswerCard
                    id={question.id}
                    feedbackRequired={question.feedback}
                    position={question.position}
                    text={question.text}
                    options={question.options}
                    control={control}
                    name={`answers.${index}.optionId`}
                    feedbackName={`answers.${index}.feedback`}
                  />
                  <div className="flex w-full justify-center">
                    {errors.answers?.[index]?.optionId && (
                      <FormErrorMessage
                        message={errors.answers[index].optionId?.message}
                      />
                    )}
                    {errors.answers?.[index]?.feedback && (
                      <FormErrorMessage
                        message={errors.answers[index].feedback?.message}
                      />
                    )}
                  </div>
                </div>
              ))}
            {errors.answers && (
              <div className="col-span-5 col-start-3 mt-4 text-red-500">
                {errors.answers.message}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting || submitMutation.isPending}
              className="col-span-5 col-start-3 mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isSubmitting || submitMutation.isPending
                ? "Submitting..."
                : "Submit Evaluation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
