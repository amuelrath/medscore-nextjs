"use client";
import { Stopwatch } from "@/components/ui/stopwatch";
import { cn } from "@/lib/helpers/utils";
import { Controller, useFormContext } from "react-hook-form";
import { SectionHeader } from "@/components/ui/section-header";

interface EvaluateNavProps {
  formTitle: string;
  evaluatorName: string;
  evaluateeName: string;
}

export function EvaluateNav({
  formTitle,
  evaluatorName,
  evaluateeName,
}: EvaluateNavProps) {
  const { control } = useFormContext<any>();

  return (
    <SectionHeader className="flex-row items-center px-4">
      <div className={cn("flex w-full flex-row items-center justify-between")}>
        <div className="flex flex-col items-start justify-center">
          <h3 className="pl-1 text-xl font-medium text-neutral-700 ">
            {formTitle}
          </h3>
        </div>
        <div className="flex items-center justify-center">
          <Controller
            control={control}
            name="duration"
            render={({ field }) => (
              <Stopwatch
                className="xs:text-lg md:text-3xl"
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
        </div>
        <div className="flex flex-col items-end justify-center xs:text-2xs sm:text-2xs md:text-sm">
          <p className="font-medium text-neutral-700">{evaluateeName}</p>
          <p className="text-neutral-400">{evaluatorName}</p>
        </div>
      </div>
    </SectionHeader>
  );
}
