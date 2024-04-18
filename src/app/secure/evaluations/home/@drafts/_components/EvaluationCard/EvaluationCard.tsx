"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ClientEvaluation, EvaluationFormData } from "@/db/client-types";
import React from "react";
import { PublishButton } from "./PublishButton";
import { EditButton } from "./EditButton";
import { DeleteButton } from "./DeleteButton";

export default function EvaluationCard({
  evaluation,
  index,
}: {
  evaluation: ClientEvaluation;
  index: number;
}) {
  function formatDate(date: Date): string {
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // Get the difference in seconds

    if (diff < 60) {
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

  function parseTitle(title: string) {
    if (title.length > 43) {
      return title.slice(0, 43) + "...";
    } else {
      return title;
    }
  }

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
          "col-span-1 transition-all flex flex-col justify-between p-2 select-none"
        )}
      >
        <div className={cn("flex justify-between")}>
          <div>
            <h5 className={cn("text-md font-semibold m-0 p-0")}>
              {parseTitle(evaluation.title)}
            </h5>
            <p className={cn("text-sm text-gray-500 italic hover:underline")}>
              {/* todo turn this into a link that allows the user to view that program */}
              {evaluation.programs?.name}
            </p>
          </div>
          <p className={cn("text-xs")}>
            Last Opened: {formatDate(evaluation.lastOpenedAt)}
          </p>
        </div>
        <div>
          <hr className={cn("mb-2")} />
          <div className={cn("flex flex-row justify-end items-center")}>
            <div className={cn("space-x-2 ")}>
              <EditButton evaluationId={evaluation.id} />
              <PublishButton evaluation={evaluation} />
              <DeleteButton evaluation={evaluation} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function morphClientEvaluationToFormData(
  clientEvaluation: ClientEvaluation
): EvaluationFormData {
  const evaluation: EvaluationFormData = {
    id: clientEvaluation.id as string,
    title: clientEvaluation.title as string,
    programId: clientEvaluation.programId as string,
    questions: clientEvaluation.questions.map((question) => ({
      id: question.id as string,
      position: question.position as number,
      text: question.text as string,
      feedback: question.feedback as boolean,
      milestoneIds: question.milestones.map((m) => m.milestoneId) as string[],
      options: question.options.map((option) => ({
        id: option.id as string,
        position: option.position as number,
        text: option.text as string,
        pointValue: Number(option.pointValue),
      })),
    })),
  };

  return evaluation;
}
