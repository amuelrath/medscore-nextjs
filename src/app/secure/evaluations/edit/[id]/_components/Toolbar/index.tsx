"use client";
import { cn } from "@/lib/utils";
import { EvaluationFormData } from "@/db/client-types";
import { UseFormGetValues } from "react-hook-form";
import { PublishButton } from "./PublishButton";
import { SaveButton } from "./SaveButton";
export default function EditorToolbar({
  getValues,
}: {
  getValues: UseFormGetValues<EvaluationFormData>;
  evaluation: EvaluationFormData;
}) {
  return (
    <div className={cn("flex flex-row space-x-2")}>
      <SaveButton getValues={getValues} />
      <PublishButton />
    </div>
  );
}
