"use client";
import { ClientEvaluation } from "@/db/client-types";
import { AnimatePresence } from "framer-motion";
import EvaluationCard from "./EvaluationCard";
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
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
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
