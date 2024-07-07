"use client";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/helpers/utils";
import { BentoCard, BentoCardProps } from "@/components/magicui/bento-grid";
import { ClipboardPlusIcon, EyeIcon } from "lucide-react";
import { Doctors } from "@/components/illustrations/doctors";
import { Button } from "@/components/ui/button";
import { Survey } from "@/components/illustrations/survey";
import { StartObservationDialog } from "@/components/(admin)/evaluate/home/dialogs/start-observation-dialog";
import { StartEvaluationDialog } from "@/components/(admin)/evaluate/home/dialogs/start-evaluation-dialog";

export function EvaluateHome() {
  return (
    <main className="flex flex-col space-y-4 h-full" >
      <SectionHeader className="flex-row items-center px-2 pl-4">
        <h3 className={cn("text-2xl font-bold text-neutral-700")}>Evaluate</h3>
      </SectionHeader>
      <div className="grid grid-cols-8 gap-4 h-full px-4 pb-4 ">
        <div
          className={cn("col-span-3 flex w-full flex-col space-y-2")}
        >
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </div>
        <div className="col-span-3 flex flex-col space-y-4 w-full">
          <div className="h-1/4 flex flex-row space-x-4">
            <div className="flex-grow border rounded-xl border-neutral-300" >
              # submitted
            </div>
            <div className="flex-grow border rounded-xl border-neutral-300" >
              # to do
            </div>
          </div>
          <div className="flex-grow border p-2 rounded-xl border-neutral-300">
            requests
          </div>
        </div>

        <div className="col-span-2 flex flex-col space-y-4 w-full">
          <div className="flex-grow border p-2 rounded-xl border-neutral-300">
            recent responses
          </div>
          <div className="flex-grow border p-2 rounded-xl border-neutral-300">
            currently active forms
          </div>
        </div>
      </div>
    </main>
  );
}

const features: BentoCardProps[] = [
  {
    name: "Evaluate Students",
    description: "Assess student performance in a competency-based assessment.",
    Icon: ClipboardPlusIcon,
    background: <Doctors />,
    iconSize: "size-8",
    cta: <StartEvaluationDialog>Begin Assessment</StartEvaluationDialog>,
    className: "w-full h-full"
  },
  {
    name: "Direct Observation",
    description: "Assess student performance in live clinical encounters",
    Icon: EyeIcon,
    background: <Survey />,
    iconSize: "size-8",
    cta: <StartObservationDialog>Start Observation</StartObservationDialog>,
    className: "w-full h-full ",
  },
];
