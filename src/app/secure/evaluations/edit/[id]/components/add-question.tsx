"use client";
import { PlusCircleIcon } from "lucide-react";
import { createQuestion } from "../actions";
import { cn } from "@/lib/utils";

export default function AddQuestion({
  evaluationId,
}: {
  evaluationId: string;
}) {
  return (
    <div
      className={cn(
        "border text-primary bg-white px-2 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all"
      )}
      onClick={() => createQuestion(evaluationId)}
    >
      <PlusCircleIcon />
    </div>
  );
}
