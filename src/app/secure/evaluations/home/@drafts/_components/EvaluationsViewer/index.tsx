"use client";
import { VersionedEvaluation } from "@/db/client-types";
import CreateEvaluation from "../../../_components/EvaluationCard/CreateEvaluation";
import EvaluationCards from "../EvaluationCard";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function EvaluationsViewer({
  data,
}: {
  data: VersionedEvaluation[];
}) {
  const [filter, setFilter] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <div className={cn("flex items-center justify-between py-2")}>
        <Input
          className={cn("w-64")}
          placeholder="Search Drafts..."
          value={filter}
          onChange={(e) => handleSearch(e)}
        />
        <CreateEvaluation />
      </div>
      <div className={cn("grid grid-cols-1 xl:grid-cols-2 gap-4")}>
        <EvaluationCards
          key="evaluation-card-list"
          filter={filter}
          data={data}
        />
      </div>
    </>
  );
}
