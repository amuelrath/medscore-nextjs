"use client";
import { cn } from "@/lib/utils";
import { SaveAllIcon, Loader2 } from "lucide-react";
import { saveEvaluation } from "../_actions";
import { EvaluationFormData } from "@/db/client-types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UseFormGetValues } from "react-hook-form";
import { toast } from "sonner";

export function SaveButton({
  getValues,
}: {
  getValues: UseFormGetValues<EvaluationFormData>;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      saveEvaluation(getValues()).finally(() => {
        toast.success("Evaluation saved successfully");
        setLoading(false);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      type="submit"
      disabled={loading}
      variant={"icon"}
      size={"icon"}
      onClick={handleSave}
    >
      {loading ? (
        <Loader2
          strokeWidth={2}
          size="1rem"
          className={cn("animate-spin text-notepad")}
        />
      ) : (
        <SaveAllIcon size={"1rem"} />
      )}
    </Button>
  );
}
