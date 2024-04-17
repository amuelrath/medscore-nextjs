"use client";
import { Card } from "@/components/ui/card";
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

  function formatDate(date: Date): string {
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // Get the difference in seconds

    if (diff < 300) {
      return "Just Now";
    } else if (diff < 86400) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diff < 172800) {
      return "Yesterday";
    } else if (diff < 604800) {
      const days = Math.floor(diff / 86400);
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

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
          "col-span-1 hover:shadow-md transition-all flex flex-col justify-between p-2 select-none"
        )}
      >
        <div className={cn("flex justify-between")}>
          <div>
            <h5 className={cn("text-md font-semibold m-0 p-0")}>
              {evaluation.title}
            </h5>
            <p className={cn("text-sm text-gray-500 italic hover:underline")}>
              {/* todo turn this into a link that allows the user to view that program */}
              {evaluation.programs?.name}
            </p>
          </div>
          <p className={cn("text-xs")}>
            Last Mofified: {formatDate(evaluation.lastOpenedAt)}
          </p>
        </div>
        <div>
          <hr className={cn("mb-2 flex justify between")} />
          <div className={cn("flex flex-row justify-between items-center")}>
            <div className={cn("flex flex-row items-center  space-x-1")}>
              {competencies.length > 0 ? (
                competencies.map((c) => (
                  <div
                    key={c}
                    className={cn("rounded-full bg-black text-white p-1")}
                  >
                    {icons[c]}
                  </div>
                ))
              ) : (
                <p className={cn("text-xs")}>No Competencies Evaluated</p>
              )}
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
