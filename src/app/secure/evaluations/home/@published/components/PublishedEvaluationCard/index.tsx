"use client";
import { ClientPublishedEvaluation } from "@/db/client-types";
import { AnimatePresence } from "framer-motion";
import PublishedEvaluationCard from "./PublishedEvaluationCard";
import { cn } from "@/lib/utils";
// TODO ADD 'last
export default function EvaluationCards({
  filter,
  evaluations,
}: {
  filter: string;
  evaluations: ClientPublishedEvaluation[];
}) {
  return (
    <AnimatePresence>
      <div className={cn("w-full space-y-4")}>
        {evaluations
          .filter((e) =>
            e.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((evaluation, index) => (
            <PublishedEvaluationCard
              key={evaluation.id}
              evaluation={evaluation}
              index={index}
            />
          ))}
      </div>
    </AnimatePresence>
  );
}
