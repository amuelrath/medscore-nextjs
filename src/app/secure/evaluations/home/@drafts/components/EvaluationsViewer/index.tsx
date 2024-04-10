"use client";
import { ClientEvaluation } from "@/db/client-types";
import CreateEvaluation from "../../../components/EvaluationCard/CreateEvaluation";
import EvaluationCards from "../../../components/EvaluationCard";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function EvaluationsViewer({
  evaluations,
  published,
}: {
  evaluations: ClientEvaluation[];
  published?: boolean;
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
          placeholder="Search Drafts..."
          value={filter}
          onChange={(e) => handleSearch(e)}
        />
        <CreateEvaluation />
      </div>
      <EvaluationCards
        key="evaluation-card-list"
        filter={filter}
        evaluations={evaluations}
      />
    </>
  );
}
