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
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";
import { FormResult } from "@/server/actions/forms/get-one-form";
// TODO use server action to delete form
export function DeleteFormDialog({
  form,
  children,
}: {
  form: FormResult;
  children: ReactNode;
}) {
  const mutation = trpc.forms.delete.useMutation({
    onSuccess() {
      toast.success(`Deleted "${form.title}"`);
    },
  });
  const handleDeleteForm = async () => {
    mutation.mutate({ formId: form.id });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className={cn("rounded-md")}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {`Delete "${form.title}" ?`}

            <AlertDialogDescription>
              This action is irrevsible. All data will be lost.
            </AlertDialogDescription>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className={cn("flex flex-col space-y-2")}>
          <AlertDialogAction onClick={() => handleDeleteForm()}>
            Delete
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
