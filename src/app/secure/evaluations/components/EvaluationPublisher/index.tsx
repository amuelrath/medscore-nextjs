"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { publishEvaluation } from "../../actions";
import { ArrowsUpFromLineIcon, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { redirect } from "next/navigation";

// TODO evaluation publisher component that allows user to produce a PublishedEvaluation
// TODO put in editor and viewer
// TODO create a published evaluations section that shows history. Is also sortable by acitve. These will have a little pinging...
// ...icon to indicate its link is active.

export default function EvaluationPublisher({
  evaluationId,
}: {
  evaluationId: string;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div
          className={cn(
            "items-center p-1.5 hover:text-white hover:bg-black rounded-full transition-all"
          )}
        >
          <ArrowsUpFromLineIcon />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className={cn("rounded-md w-full")}>
        <AlertDialogHeader>
          <AlertDialogTitle>Publish Evaluation</AlertDialogTitle>
          <AlertDialogDescription>
            <p>Are you sure you are ready to publish?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <div
          className={cn(
            "w-full text-sm bg-primary hover:bg-primary/90 rounded-md text-white flex justify-center items-center p-2.5"
          )}
          onClick={() => {
            if (!loading) {
              publishEvaluation(evaluationId);
              setLoading(true);
            }
          }}
        >
          {loading ? (
            <Loader2
              strokeWidth={2}
              size="1rem"
              className={cn("animate-spin text-white")}
            />
          ) : (
            "Confirm"
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
