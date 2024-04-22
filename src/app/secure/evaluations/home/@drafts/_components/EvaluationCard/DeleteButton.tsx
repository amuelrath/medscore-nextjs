"use client";
import { cn } from "@/lib/utils";
import { ClientForm } from "@/db/client-types";
import { Trash2 } from "lucide-react";
import { softDeleteEvaluation } from "../_actions";
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

export function DeleteButton({ form }: { form: ClientForm }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"sm"}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className={cn("rounded-md")}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete '{form.title}' ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irrevsible. All data will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() =>
            softDeleteEvaluation(form.id).then(() =>
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
