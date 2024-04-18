"use client";
import { ArrowsUpFromLineIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { publishEvaluation } from "../_actions";
import { EvaluationFormData } from "@/db/client-types";
import { toast } from "sonner";

export function PublishButton() {
  const [loading, setLoading] = useState<boolean>(false);
  const methods = useFormContext();

  const handlePublish = () => {
    if (!methods.getValues("published")) {
      setLoading(true);
      publishEvaluation(methods.getValues() as EvaluationFormData)
        .then(() => {
          setLoading(false);
          toast.success("Successfully published evaluation.");
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      toast.error(
        "You cannot publish an evaluation that has already been published."
      );
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"icon"} size={"icon"}>
          <ArrowsUpFromLineIcon size={"1rem"} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={cn("rounded-md")}>
        <AlertDialogHeader>
          <AlertDialogTitle className={cn("text-xl")}>
            Publishing '{methods.getValues("title")}'
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will no longer be able to make changes to this evaluation. Are
            you sure you wish to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handlePublish}>
          {loading ? (
            <Loader2
              strokeWidth={2}
              size="1rem"
              className={cn("animate-spin text-notepad")}
            />
          ) : (
            "Publish"
          )}
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
