"use client";
import { useFormContext, Controller } from "react-hook-form";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import { pickBestMilestone } from "@/server/actions/ai/recommend-milestone";
import { LottieHover } from "@/components/ui/lottie-hover";
import CIRCLE_ARROW from "public/icons/circle-arrow.json";
import LOADING from "public/icons/three-dots-navy.json";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers/utils";
import { useState } from "react";
import { LazyMotion, m, domAnimation } from "framer-motion";
import { addTrainingData } from "@/server/actions/ml/add-training-data";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { toast } from "sonner";
import { useFormResultSuspenseQuery } from "@/hooks/queries/use-form-result-suspense-query";
import { useGetSubcompetenciesInEditor } from "@/hooks/queries/use-get-form-subcompetencies";

export function SuggestMilestone({
  selectedQuestionIndex,
}: {
  selectedQuestionIndex: number;
}) {
  const [hovering, setHovering] = useState<boolean>(false);
  const { control, getValues } = useFormContext<TFormSchema>();
  const formId = getValues(`id`);

  const queryClient = useQueryClient();
  const { formResult } = useFormResultSuspenseQuery(formId)

  const { subcompetencies} = useGetSubcompetenciesInEditor()

  const { mutate: suggestMilestone, isPending } = useMutation({
    mutationFn: () =>
      pickBestMilestone({
        formTitle: getValues(`title`),
        formItemId: getValues(`formItems.${selectedQuestionIndex}.id`),
      }),
    onSuccess: (newRecommendation) => {
      queryClient.setQueryData(["form", formId], (oldData: FormResult) => {
        const updatedQuestions = oldData.formItems.map((q) =>
          q.id === getValues(`formItems.${selectedQuestionIndex}.id`)
            ? { ...q, recommendedMilestone: newRecommendation[0] }
            : q,
        );
        return { ...oldData, formItems: updatedQuestions };
      });
    },
  });

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Controller
          name={`formItems.${selectedQuestionIndex}.milestoneIds`}
          control={control}
          render={({ field }) => {
            const recData =
              formResult?.formItems[selectedQuestionIndex]?.recommendedMilestone;
            const recommendedMilestone = subcompetencies
              .flatMap((sc) => sc.milestones)
              .find((m) => m.id === recData?.milestoneId);
            const isAlreadyAccepted = recData
              ? field.value?.includes(recData?.milestoneId)
              : false;

            const handleSuggestClick = () => {
              suggestMilestone();
            };

            const handleAcceptClick = () => {
              if (recData?.milestoneId && !isAlreadyAccepted) {
                field.onChange([...field.value, recData.milestoneId]);
              }
            };

            return (
              <div key={recData?.id || "rec"} >
                <div className="relative flex h-44 pb-2  flex-col justify-center rounded-xl border border-accent-secondary bg-accent-secondary-background p-2 text-center">
                  <p className="text-2xl font-bold tracking-wider text-teal-950">
                    {recommendedMilestone?.name || (
                      <p className="text-xl font-semibold tracking-normal">
                        No Suggestion
                      </p>
                    )}
                  </p>
                  {recData && (
                    <p className="text-xs font-semibold text-teal-800">
                      {Number(recData.score) * 10}% CONFIDENCE
                    </p>
                  )}
                  <p className="text-sm font-light text-teal-950">
                    {recommendedMilestone?.description}
                  </p>
                  {recData && (
                    <FeedbackButtonGroup
                      formId={formId}
                      recommendationId={recData.id}
                      isPositiveClassification={
                        recData.isPositiveClassification
                      }
                    />
                  )}
                <div className="absolute -bottom-3.5 right-20 flex justify-center space-x-1.5">
                  <Button
                    size="xs"
                    variant="accent-secondary-background"
                    onClick={handleSuggestClick}
                    disabled={isPending}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    className={cn(
                      "flex items-center h-7 rounded-lg text-2xs transition-all justify-center space-x-2 border border-accent-secondary px-4 py-2 text-white hover:bg-accent-secondary disabled:opacity-100",
                    )}
                  >
                    {isPending ? (
                      <Lottie animationData={LOADING} loop className="size-8" />
                    ) : (
                      <div className="flex flex-row space-x-2 items-center">
                        <span className="font-bold text-teal-950">
                          {recData ? "Regenerate" : "Suggest"} Milestone
                        </span>
                        <LottieHover
                          isHovering={hovering}
                          src={CIRCLE_ARROW}
                          size="xs"
                        />
                      </div>
                    )}
                  </Button>
                  {recData && (
                    <Button
                      size="xs"
                      variant={isAlreadyAccepted ? "accent-secondary-background" : "accent-secondary" }
                      onClick={handleAcceptClick}
                      className={cn("w-20 font-semibold disabled:opacity-100" ,
                        isAlreadyAccepted ? "select-none" :
                          "border border-teal-950",
                      )}
                      disabled={isAlreadyAccepted}
                    >
                      {isAlreadyAccepted ? "Accepted" : "Accept"}
                    </Button>
                  )}
                </div>
                </div>
                {recData && recommendedMilestone && (
                  <div className="flex flex-col space-y-2">
                    <div>
                      <p className="mt-6 text-lg font-semibold">
                        Why {recommendedMilestone.name} ?
                      </p>
                      <p className="text-sm font-light">
                        {recData.justification}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        />
      </m.div>
    </LazyMotion>
  );
}

function FeedbackButtonGroup({
  formId,
  recommendationId,
  isPositiveClassification,
}: {
  formId: string;
  recommendationId: string;
  isPositiveClassification: boolean | null;
}) {
  const queryClient = useQueryClient();

  const createTrainingData = useMutation({
    mutationFn: addTrainingData,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["form", formId] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<FormResult>([
        "form",
        formId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<FormResult>(["form", formId], (oldData) => {
        if (!oldData) return oldData;

        const updatedQuestions = oldData.formItems.map((question) => ({
          ...question,
          recommendedMilestone:
            question.recommendedMilestone?.id === recommendationId
              ? {
                  ...question.recommendedMilestone,
                  isPositiveClassification: variables.isPositiveClassification,
                }
              : question.recommendedMilestone,
        }));

        return { ...oldData, formItems: updatedQuestions };
      });

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData<FormResult>(
          ["form", formId],
          context.previousData,
        );
      }
      toast.error("Oops! Something went wrong.");
    },
  });

  const isClassified = isPositiveClassification !== null;
  const isPending = createTrainingData.isPending;

  return (
    <div
      className={cn(
        "absolute -bottom-3.5 right-4 flex flex-row items-center justify-center rounded-lg border border-accent-secondary bg-accent-secondary-background",
        (isClassified || isPending) && "select-none",
      )}
    >
      <Button
        variant="hide"
        size="xs"
        className={cn(
          "text-teal-950 disabled:opacity-100",
          (isPositiveClassification === true ||
            (isPending &&
              createTrainingData.variables?.isPositiveClassification ===
                true)) &&
            "text-blue-500",
          !isClassified && !isPending && "hover:text-blue-500",
        )}
        onClick={() =>
          createTrainingData.mutate({
            recommendationId,
            isPositiveClassification: true,
          })
        }
        disabled={isPending}
      >
        <ThumbsUpIcon size={12} />
      </Button>
      <Button
        onClick={() =>
          createTrainingData.mutate({
            recommendationId,
            isPositiveClassification: false,
          })
        }
        variant="hide"
        size="xs"
        className={cn(
          "scale-x-[-1] text-teal-950 disabled:opacity-100",
          (isPositiveClassification === false ||
            (isPending &&
              createTrainingData.variables?.isPositiveClassification ===
                false)) &&
            "text-destructive",
          !isClassified && !isPending && "hover:text-destructive",
        )}
        disabled={isPending}
      >
        <ThumbsDownIcon size={12} />
      </Button>
    </div>
  );
}
