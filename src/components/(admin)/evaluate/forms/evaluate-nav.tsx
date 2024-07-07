"use client";
import { Progress } from "@/components/ui/progress";
import Counter from "@/components/ui/counter";
import { Stopwatch } from "@/components/ui/stopwatch";
import { cn } from "@/lib/helpers/utils";
import { Controller, useFormContext } from "react-hook-form";
import { SectionHeader } from "@/components/ui/section-header";

interface EvaluateNavProps {
  formTitle: string;
  evaluatorName: string;
  evaluateeName: string;
  totalQuestions: number;
  completedQuestions: number;
}

export function EvaluateNav({
  formTitle,
  evaluatorName,
  evaluateeName,
  totalQuestions,
  completedQuestions,
}: EvaluateNavProps) {
  const progressPercentage =
    totalQuestions > 0
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;

  const { control } = useFormContext<any>();

  return (
    <SectionHeader className="flex-row items-center px-4">
      <div className={cn("flex w-full flex-row items-center justify-between")}>
        <div className="flex flex-col items-start justify-center">
          <h3 className="text-xl font-bold text-neutral-700 ">
            {formTitle}
          </h3>
          <div className="flex w-44 flex-row items-center space-x-2 text-sm">
            <Progress
              className="mt-1 h-2 w-full max-w-[200px]"
              value={progressPercentage}
            />

            <Counter
              className="max-w-1 font-light text-xs proportional-nums"
              value={progressPercentage}
              type="percent"
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Controller
            control={control}
            name="duration"
            render={({ field }) => (
              <Stopwatch
                className="text-3xl"
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
        </div>
        <div className="flex flex-col items-end text-sm justify-center">
          <p className="font-medium text-neutral-700">{evaluateeName}</p>
          <p className="text-neutral-400">{evaluatorName}</p>
        </div>
      </div>
    </SectionHeader>
  );
}
