"use client";
import { Trash2 } from "lucide-react";
import { deleteQuestion } from "../actions";
import { cn } from "@/lib/utils";

export default function DeleteQuestion({ questionId }: { questionId: string }) {
  return (
    <div
      className={cn(
        "border text-primary bg-white px-1 py-1 rounded-full hover:bg-primary hover:text-white transition-all"
      )}
      onClick={() => deleteQuestion(questionId)}
    >
      <Trash2 size={"1rem"} />
    </div>
  );
}
