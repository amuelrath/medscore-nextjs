"use client";
import Section from "@/components/ui/section";
import { Evaluation } from "@/db/schema";
import PublishedEvaluationCard from "../PublishedEvaluationCard";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { EvaluationWithProgram } from "@/db/client-types";

export default function PublishedEvaluationViewer({
  publishedEvaluations,
}: {
  publishedEvaluations: EvaluationWithProgram[];
}) {
  const [filter, setFilter] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <Section>
      <div className={cn("flex items-center justify-between py-2")}>
        <Input
          className={cn("w-64")}
          placeholder="Search Published..."
          value={filter}
          onChange={(e) => handleSearch(e)}
        />
      </div>
      <div className={cn("grid grid-cols-1 xl:grid-cols-2 gap-4")}>
        {publishedEvaluations
          .filter((pE) =>
            pE.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
          )
          .sort((a, b) => {
            const dateA = new Date(a.lastOpenedAt);
            const dateB = new Date(b.lastOpenedAt);
            return dateB.getTime() - dateA.getTime();
          })
          .map((pE, index) => (
            <PublishedEvaluationCard
              key={pE.id}
              publishedEvaluation={pE}
              index={index}
            />
          ))}
      </div>
    </Section>
  );
}
