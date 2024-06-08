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
import { deleteForm } from "@/server/actions/forms/delete-form";
import { toast } from "sonner";
import {
  FormLiteResult,
} from "@/server/actions/forms/get-all-forms-lite";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export function DeleteFormDialogTrigger({
  form,
  children,
}: {
  form: FormLiteResult;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  const deleteFormMutation = useMutation({
    mutationFn: deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forms", "lite"],
      });
      toast.success(`"${form.title}" deleted successfully`);
    },
  });

  const handleDeleteForm = async () => {
    await deleteFormMutation.mutate({
      formId: form.id,
    });
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
          <AlertDialogAction
            onClick={handleDeleteForm}
            className={cn("w-full bg-destructive text-white")}
          >
            Delete
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
