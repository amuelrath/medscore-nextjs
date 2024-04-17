"use client";
import { ClientEvaluation } from "@/db/client-types";
import { AnimatePresence } from "framer-motion";
import EvaluationCard from "./EvaluationCard";
import { cn } from "@/lib/utils";
// TODO ADD 'last
export default function EvaluationCards({
  filter,
  evaluations,
}: {
  filter: string;
  evaluations: ClientEvaluation[];
}) {
  return (
    <AnimatePresence>
      {evaluations
        .filter((e) =>
          e.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
        )
        .sort((a, b) => {
          const dateA = new Date(a.lastOpenedAt);
          const dateB = new Date(b.lastOpenedAt);
          return dateB.getTime() - dateA.getTime();
        })
        .map((evaluation, index) => (
          <EvaluationCard
            key={evaluation.id}
            evaluation={evaluation}
            index={index}
          />
        ))}
    </AnimatePresence>
  );
}
