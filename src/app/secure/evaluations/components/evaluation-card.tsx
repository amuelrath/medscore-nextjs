"use client";
import { Card, CardDescription } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import pc from "public/pc-bw.png";
import mk from "public/mk-bw.png";
import sbp from "public/sbp-bw.png";
import ics from "public/ics-bw.png";
import p from "public/p-bw.png";
import pbli from "public/pbli-bw.png";
import { EvaluationMenu } from "./evaluation-card-dropdown";
import { cn } from "@/lib/utils";
import { InferResultType } from "@/db/utils";

type QueryResult = InferResultType<"evaluations", { programs: true }>;

export default function EvaluationCard({
  evaluation,
}: {
  evaluation: QueryResult;
}) {
  return (
    <Card
      className={cn(
        "col-span-1 h-52 hover:shadow-md transition-all flex flex-col justify-between p-2 select-none"
      )}
    >
      <div>
        <h5 className={cn("text-md font-semibold")}>{evaluation.title}</h5>
        <p className={cn("text-sm text-gray-500 italic hover:underline")}>
          {/* todo turn this into a link that allows the user to view that program */}
          {evaluation.programs?.name}
        </p>
        <hr className={cn("mt-2")} />
      </div>
      <CardDescription>
        {evaluation.description || "no description provided"}
      </CardDescription>
      <div>
        <hr className={cn("mb-2")} />
        <div className={cn("flex flex-row justify-between items-center")}>
          <div className={cn("flex flex-row items-center")}>
            <IconTooltip label="Patient Care">
              <Image
                src={pc}
                alt={""}
                className={cn(
                  "w-7 rounded-full  hover:scale-150 hover:bg-white transition-all"
                )}
              />
            </IconTooltip>
            <IconTooltip label="Medical Knowledge">
              <Image
                src={mk}
                alt={""}
                className={cn(
                  "w-7 rounded-full hover:scale-150 hover:bg-white transition-all"
                )}
              />
            </IconTooltip>
            <IconTooltip label="Systems-Based Practice">
              <Image
                src={sbp}
                alt={""}
                className={cn(
                  "w-7 rounded-full hover:scale-150 hover:bg-white transition-all"
                )}
              />
            </IconTooltip>
            <IconTooltip label="Interpersonal Communication Skills">
              <Image
                src={ics}
                alt={""}
                className={cn(
                  "w-7 rounded-full hover:scale-150 hover:bg-white transition-all"
                )}
              />
            </IconTooltip>
            <IconTooltip label="Professionalism">
              <Image
                src={p}
                alt={""}
                className={cn(
                  "w-7 rounded-full hover:scale-150 hover:bg-white transition-all"
                )}
              />
            </IconTooltip>
            <IconTooltip label="Practice-Based Learning and Improvement">
              <Image
                src={pbli}
                alt={""}
                className={cn(
                  "w-7 rounded-full hover:scale-150 hover:bg-white transition-all"
                )}
              />
            </IconTooltip>
          </div>
          <EvaluationMenu evaluationId={evaluation.id} />
        </div>
      </div>
    </Card>
  );
}

function IconTooltip({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="z-20">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
