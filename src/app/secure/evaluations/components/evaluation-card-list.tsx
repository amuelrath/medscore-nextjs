"use client";
import { ClientEvaluation } from "@/db/client-types";
import { AnimatePresence } from "framer-motion";
import EvaluationCard from "./evaluation-card";
import { cn } from "@/lib/utils";
import { Evaluation } from "@/db/schema";
export default function EvaluationCards({
  evaluations,
}: {
  evaluations: ClientEvaluation[];
}) {
  return (
    <AnimatePresence>
      <div
        className={cn(
          "w-full grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-2 px-2"
        )}
      >
        {evaluations.map((evaluation, index) => (
          <EvaluationCard
            key={evaluation.id}
            evaluation={evaluation}
            index={index}
          />
        ))}
      </div>
    </AnimatePresence>
  );
}
