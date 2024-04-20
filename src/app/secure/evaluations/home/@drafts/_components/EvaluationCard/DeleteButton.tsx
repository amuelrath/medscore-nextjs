"use client";
import { cn } from "@/lib/utils";
import { VersionedEvaluation } from "@/db/client-types";
import { Trash2 } from "lucide-react";
import { deleteEvaluation } from "../_actions";
import React from "react";
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

export function DeleteButton({ data }: { data: VersionedEvaluation }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"sm"}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={cn("rounded-md")}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete '{data.title}' ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irrevsible. All data will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() =>
            deleteEvaluation(data.id).then(() =>
              toast.success("Evaluation deleted.")
            )
          }
        >
          Delete
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
