"use client";
import { Card, CardDescription } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { EvaluationMenu } from "./EvaluationCardDropdownMenu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ClientEvaluation, ClientSubcompetency } from "@/db/client-types";
import {
  BrainIcon,
  ShapesIcon,
  SpeechIcon,
  StethoscopeIcon,
  HandshakeIcon,
  CogIcon,
} from "lucide-react";
import { Milestone } from "@/db/schema";
import React from "react";

export default function EvaluationCard({
  evaluation,
  index,
}: {
  evaluation: ClientEvaluation;
  index: number;
}) {
  const subcompetencies: ClientSubcompetency[] | undefined =
    evaluation.programs.specialties?.subcompetencies;

  const getEvaluationCompetencies = () => {
    let result: string[] = [];
    let ids: string[] = [];
    if (!subcompetencies) return [];
    evaluation.questions.map((q) => {
      const milestoneIds = q.milestones.map((m) => m.milestoneId);
      milestoneIds.map((m) => {
        if (!ids?.includes(m)) {
          ids.push(m);
        }
      });
    });

    subcompetencies.map((sc) => {
      sc.milestones.map((m) => {
        if (ids.includes(m.id) && !result.includes(sc.competencies.name)) {
          result.push(sc.competencies.name);
        }
      });
    });
    return result;
  };

  const competencies = getEvaluationCompetencies();

  return (
    <motion.div
      layoutId={`evaluation-card-${evaluation.id}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.05 * (index + 1) }}
    >
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
            <div className={cn("flex flex-row items-center space-x-1")}>
              {competencies?.map((c) => (
                <div
                  key={c}
                  className={cn("rounded-full bg-black text-white p-1")}
                >
                  {icons[c]}
                </div>
              ))}
            </div>
            <EvaluationMenu evaluationId={evaluation.id} />
          </div>
        </div>
      </Card>
    </motion.div>
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

const icons: { [key: string]: React.ReactNode } = {
  ICS: <SpeechIcon className={cn("size-4")} />,
  SBP: <CogIcon className={cn("size-4")} />,
  PC: <StethoscopeIcon className={cn("size-4")} />,
  PBLI: <ShapesIcon className={cn("size-4")} />,
  MK: <BrainIcon className={cn("size-4")} />,
  P: <HandshakeIcon className={cn("size-4")} />,
};
