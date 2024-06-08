"use client";
import { cn } from "@/lib/utils";
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
import { FormResult } from "@/server/actions/forms/get-form-by-id";
import { deleteForm } from "@/server/actions/forms/delete-form";
import { toast } from "sonner";
export function DeleteFormDialog({
  form,
  children,
}: {
  form: FormResult;
  children: ReactNode;
}) {
  const handleDeleteForm = async () => {
    await deleteForm(form.id);
    toast.success(`"${form.title}" deleted successfully`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className={cn("rounded-md")}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {`Delete "${form.title}" ?`}

            <AlertDialogDescription>
              This action is irreversible. All data will be lost.
            </AlertDialogDescription>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className={cn("flex flex-col space-y-2")}>
          <form
            className={cn("w-full")}
            onSubmit={(e) => {
              e.preventDefault();
              handleDeleteForm();
            }}
          >
            <AlertDialogAction className={cn("w-full")} type={"submit"}>Delete</AlertDialogAction>
          </form>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
