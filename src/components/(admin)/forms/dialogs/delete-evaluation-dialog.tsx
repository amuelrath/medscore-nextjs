"use client";
import { cn } from "@/lib/helpers/utils";
import React, { ReactNode } from "react";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { deleteForm } from "@/server/actions/forms/delete-form";
import { toast } from "sonner";
import {
  FormLiteResult,
} from "@/server/actions/forms/get-all-forms-lite";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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
    deleteFormMutation.mutate({
      formId: form.id
    });
    toast.success(`"${form.title}" deleted successfully`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn("rounded-md")}>
        <DialogHeader>
          <DialogTitle>
            {`Delete "${form.title}"`}
          </DialogTitle>
            <DialogDescription>
              This action is irreversible. All data will be lost.
            </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row items-center justify-end space-x-2">
          <Button onClick={handleDeleteForm} variant={"destructive"} className="w-[100px]">
            Delete
          </Button>
          <DialogClose asChild>
            <Button variant={"secondary"}>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
