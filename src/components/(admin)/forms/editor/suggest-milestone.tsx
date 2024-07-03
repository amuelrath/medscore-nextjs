"use client";
import { useFormContext, Controller } from "react-hook-form";
import { TFormSchema } from "@/components/(admin)/forms/editor/hooks/use-form-builder";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getFormById } from "@/server/actions/forms/get-form-by-id";
import { getSubcompetencies } from "@/server/actions/forms/get-subcompetencies";
import { pickBestMilestone } from "@/server/actions/ai/recommend-milestone";
import { LottieHover } from "@/components/ui/lottie-hover";
import CIRCLE_ARROW from "public/icons/circle-arrow.json";
import LOADING from "public/icons/three-dots-navy.json";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LazyMotion, m, domAnimation } from "framer-motion";

export function SuggestMilestone({
  selectedQuestionIndex,
}: {
  selectedQuestionIndex: number;
}) {
  const [hovering, setHovering] = useState<boolean>(false);
  const { control, getValues } = useFormContext<TFormSchema>();
  const formId = getValues(`id`);
  const queryClient = useQueryClient();

  const { data: formData } = useSuspenseQuery({
    queryKey: ["form", formId],
    queryFn: () =>
      getFormById({ formId, userId: process.env.NEXT_PUBLIC_DEV_USER_ID! }),
  });

  const { data: subcompetencies } = useSuspenseQuery({
    queryKey: ["subcompetencies", formId],
    queryFn: () => getSubcompetencies({ formId }),
  });

  const { mutate: suggestMilestone, isPending } = useMutation({
    mutationFn: () =>
      pickBestMilestone({
        formTitle: getValues(`title`),
        questionId: getValues(`questions.${selectedQuestionIndex}.id`),
      }),
    onSuccess: (newRecommendation) => {
      queryClient.setQueryData(["form", formId], (oldData: any) => {
        const updatedQuestions = oldData.questions.map((q: any) =>
          q.id === getValues(`questions.${selectedQuestionIndex}.id`)
            ? { ...q, recommendedMilestone: newRecommendation[0] }
            : q,
        );
        return { ...oldData, questions: updatedQuestions };
      });
    },
  });

  return (
    <LazyMotion features={domAnimation}>
      <m.div
      initial={{ opacity: 0}}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      >
        <Controller
          name={`questions.${selectedQuestionIndex}.milestoneIds`}
          control={control}
          render={({ field }) => {
            const recData =
              formData?.questions[selectedQuestionIndex]?.recommendedMilestone;
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
              <div className="space-y-2">
                <div className="flex h-32 select-none flex-col justify-center rounded-xl border border-accent-secondary bg-accent-secondary/20 p-2 text-center">
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
                </div>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="hide"
                    onClick={handleSuggestClick}
                    disabled={isPending}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    className={cn(
                      "flex w-full items-center justify-center space-x-2 rounded-md bg-accent/60 px-4 py-2 text-white hover:bg-accent/50 disabled:opacity-100",
                    )}
                  >
                    {isPending ? (
                      <Lottie
                        animationData={LOADING}
                        loop
                        className="size-16"
                      />
                    ) : (
                      <div className="flex flex-row space-x-2">
                        <span className="font-bold text-blue-950">
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
                      variant="accent-secondary"
                      onClick={handleAcceptClick}
                      className={cn(
                        "flex w-full items-center justify-center space-x-2 font-bold transition-all",
                        isAlreadyAccepted &&
                          "select-none bg-gray-400 text-gray-800 opacity-70 hover:bg-gray-400 hover:text-gray-800",
                      )}
                    >
                      {isAlreadyAccepted ? "Accepted" : "Accept"}
                    </Button>
                  )}
                </div>
                {recData && recommendedMilestone && (
                  <div>
                    <div>
                      <p className="mt-8 text-xl font-semibold">
                        Why {recommendedMilestone.name} ?
                      </p>
                    </div>
                    <p className="text-md font-light">
                      {recData.justification}
                    </p>
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
