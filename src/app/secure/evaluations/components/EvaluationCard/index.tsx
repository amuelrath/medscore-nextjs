"use client";
import { ClientEvaluation } from "@/db/client-types";
import { AnimatePresence } from "framer-motion";
import EvaluationCard from "./EvaluationCard";
import { cn } from "@/lib/utils";
import { Evaluation } from "@/db/schema";
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
      <div
        className={cn(
          "w-full grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-2 px-2"
        )}
      >
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
      </div>
    </AnimatePresence>
  );
}
