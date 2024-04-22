"use client";
import { ClientForm } from "@/db/client-types";
import { AnimatePresence } from "framer-motion";
import EvaluationCard from "./EvaluationCard";
export default function EvaluationCards({
  filter,
  data,
}: {
  filter: string;
  data: ClientForm[];
}) {
  return (
    <AnimatePresence>
      {data
        .filter((e) =>
          e.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
        )
        .sort((a, b) => {
          const dateA = new Date(a.lastOpenedAt);
          const dateB = new Date(b.lastOpenedAt);
          return dateB.getTime() - dateA.getTime();
        })
        .map((form, index) => (
          <EvaluationCard key={form.id} form={form} index={index} />
        ))}
    </AnimatePresence>
  );
}
