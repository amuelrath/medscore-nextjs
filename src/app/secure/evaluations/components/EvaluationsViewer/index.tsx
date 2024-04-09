"use client";
import { ClientEvaluation } from "@/db/client-types";
import PageHeader from "@/components/ui/page-header";
import CreateEvaluation from "../EvaluationCard/CreateEvaluation";
import EvaluationCards from "../EvaluationCard";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function EvaluationsViewer({
  evaluations,
}: {
  evaluations: ClientEvaluation[];
}) {
  const [filter, setFilter] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <PageHeader>
        <div className={cn("flex flex-col")}>
          <h2 className={cn("text-2xl font-bold")}>Evaluations</h2>
          <p className={cn("text-xs")}>your drafts will live here</p>
        </div>
        <div className={cn("flex space-x-8")}>
          <Input
            placeholder="Search..."
            value={filter}
            onChange={handleSearch}
            className={cn("w-64 bg-gray-200")}
          />
          <CreateEvaluation />
        </div>
      </PageHeader>
      <EvaluationCards
        key="evaluation-card-list"
        filter={filter}
        evaluations={evaluations}
      />
    </>
  );
}
