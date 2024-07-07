"use client";
import { useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getEvaluationForm } from "@/server/actions/evaluate/get-evaluation-form";
import { submitResponse } from "@/server/actions/responses/submit-response";
import { AnswerCard } from "@/components/(admin)/evaluate/forms/answer-card";
import { FormErrorMessage } from "@/components/ui/form-error-message";
import { EvaluateNav } from "@/components/(admin)/evaluate/forms/evaluate-nav";
import { getFullName } from "@/lib/helpers/getFullName";
import { useRouter } from "next/navigation";

interface EvaluationFormProps {
  responseId: string;
}

export function EvaluationForm({ responseId }: EvaluationFormProps) {
  const { data: evaluation } = useSuspenseQuery({
    queryKey: ["evaluation-form", responseId],
    queryFn: () => getEvaluationForm({ responseId }),
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
          if (answers.length !== evaluation?.form.questions.length)
            return false;
          return answers.every(
            (answer, index) =>
              answer.optionId !== "" &&
              (!evaluation?.form.questions[index].feedback || answer.feedback),
          );
        },
        {
          message:
            "All questions must be answered and feedback provided where required",
        },
      ),
    duration: z.number(),
  });

  type TEvaluationForm = z.infer<typeof ZEvaluationFormSchema>;

  const methods = useForm<TEvaluationForm>({
    resolver: zodResolver(ZEvaluationFormSchema),
    defaultValues: {
      answers:
        evaluation?.form.questions.map(() => ({
          optionId: "",
          feedback: "",
        })) || [],
      duration: 0,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const getEvaluatee = () => {
    if (!evaluation || !evaluation) throw new Error("No form!");
    if (evaluation.form.formCodes[0]) {
      // in the query we only get the form code for this particular response
      return evaluation.form.formCodes[0].usersWithCode.find(
        (u) => u.user.id === evaluation.response.evaluateeId,
      )?.user;
    }
  };

  const router = useRouter();

  const submitMutation = useMutation({
    mutationFn: (data: TEvaluationForm) =>
      submitResponse({
        id: responseId,
        evaluatorId: "cf8b381f-1956-4c56-acf3-cf7517b20b92",
        evaluateeId: getEvaluatee()?.id || "", // TODO FIXME
        answers: data.answers,
        duration: data.duration,
      }),
    onSuccess: () => {
      toast.success("Response submitted successfully!");
      router.push(`/evaluate`);
      reset();
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
      (!evaluation?.form.questions[answers.indexOf(answer)]?.feedback ||
        answer.feedback),
  ).length;

  const onSubmit = (data: TEvaluationForm) => {
    submitMutation.mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="flex w-full flex-col">
        <EvaluateNav
          formTitle={evaluation?.form.title || ""}
          evaluatorName={"Austin Muelrath"}
          evaluateeName={getFullName(getEvaluatee() || {})}
          totalQuestions={totalQuestions}
          completedQuestions={completedQuestions}
        />
        <div className="flex flex-grow justify-center">
          <div className="no-scrollbar h-[93vh] w-full max-w-3xl overflow-y-scroll">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mx-auto space-y-4 p-4 pb-52"
            >
              {evaluation?.form.questions
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
    </FormProvider>
  );
}
