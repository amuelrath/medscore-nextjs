"use client";
import { ClientForm } from "@/db/client-types";
import EvaluationCards from "../EvaluationCard";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import EvaluationCreator from "../EvaluationCreator";

export default function EvaluationsViewer({ data }: { data: ClientForm[] }) {
  const [filter, setFilter] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <div className={cn("flex flex-row items-center space-x-8 py-2 w-full")}>
        <div className={cn("flex flex-row space-x-2 items-center")}>
          <Input
            className={cn("w-64")}
            placeholder="Search Drafts..."
            value={filter}
            onChange={(e) => handleSearch(e)}
          />
          <EvaluationCreator />
        </div>
      </div>
      <hr className={cn("my-2")} />
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
