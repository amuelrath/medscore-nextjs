"use client";

import { cn } from "@/lib/utils";
import { ArrowsUpFromLineIcon } from "lucide-react";
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

// TODO evaluation publisher component that allows user to produce a PublishedEvaluation
// TODO put in editor and viewer
// TODO create a published evaluations section that shows history. Is also sortable by acitve. These will have a little pinging...
// ...icon to indicate its link is active.

export default function EvaluationPublisher() {
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
            <p>
              Are you sure you are ready to publish? You will not be able to
              make any more changes, but this draft will still be available.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Confirm</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
