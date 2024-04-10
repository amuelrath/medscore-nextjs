"use client";
import { ClientPublishedEvaluation } from "@/db/client-types";
import PublishedEvaluationCards from "../PublishedEvaluationCard/index";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function PublishedEvaluationsViewer({
  evaluations,
}: {
  evaluations: ClientPublishedEvaluation[];
}) {
  const [filter, setFilter] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <div className={cn("flex items-center justify-between py-2 ")}>
        <Input
          className={cn("w-64")}
          placeholder="Search Published Evaluations..."
          value={filter}
          onChange={(e) => handleSearch(e)}
        />
      </div>
      <PublishedEvaluationCards
        key="evaluation-card-list"
        filter={filter}
        evaluations={evaluations}
      />
    </>
  );
}
