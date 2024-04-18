"use client";
import debounce from "debounce";
import useDeepCompareEffect from "use-deep-compare-effect";
import { cn } from "@/lib/utils";
import { SaveAllIcon, Loader2 } from "lucide-react";
import { saveEvaluation } from "../_actions";
import { EvaluationFormData } from "@/db/client-types";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
// TODO bug when deleting a question/option not triggering autosave!

export function SaveButton() {
  const methods = useFormContext();
  const [loading, setLoading] = useState<boolean>(false);
  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = methods.getValues() as EvaluationFormData;
      await saveEvaluation(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSave = useCallback(
    debounce(() => {
      handleSave();
    }, 500),
    []
  );

  const watchedData = useWatch({
    control: methods.control,
    defaultValue: methods.formState.defaultValues,
  });

  useDeepCompareEffect(() => {
    if (methods.formState.isDirty) {
      debouncedSave();
    }
  }, [watchedData]);

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
