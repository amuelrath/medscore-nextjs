"use client";
import { cn } from "@/lib/utils";
import { ClientEvaluation } from "@/db/client-types";
import { ArrowsUpFromLineIcon, Loader2 } from "lucide-react";
import React, { useState } from "react";
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
import { toast } from "sonner";
import { publishEvaluation } from "@/app/secure/evaluations/edit/[id]/_components/_actions";
import { morphClientEvaluationToFormData } from "./EvaluationCard";

// this is essentially a duplicate PublishButton but it gets data differently.
// i feel gross having this here but i don't know how to refactor it in a way that won't take forever
export function PublishButton({
  evaluation,
}: {
  evaluation: ClientEvaluation;
}) {
  const asFormData = morphClientEvaluationToFormData(evaluation);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePublish = () => {
    setLoading(true);
    publishEvaluation(asFormData)
      .then(() => {
        setLoading(false);
        toast.success(`Successfully published '${evaluation.title}'`);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"sm"} variant={"notepad"}>
          <ArrowsUpFromLineIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={cn("rounded-md")}>
        <AlertDialogHeader>
          <AlertDialogTitle className={cn("text-xl")}>
            Publishing '{evaluation.title}'
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
