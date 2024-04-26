"use client";
// TODO: Wire up a server action!
import { cn } from "@/lib/utils";
import { TFormRelate, TFormWithProgram } from "@/db/types";
import React, { ReactNode } from "react";
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

export function DeleteFormDialog({
  form,
  children,
}: {
  form: TFormWithProgram;
  children: ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className={cn("rounded-md")}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete '{form.title}' ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irrevsible. All data will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => null}>Delete</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
