'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/helpers/utils';
import { deleteForm } from '@/server/actions/forms/delete-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { toast } from 'sonner';

export function DeleteFormDialogTrigger({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  const deleteFormMutation = useMutation({
    mutationFn: deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['forms'],
      });
      toast.success(`"${title}" deleted successfully`);
    },
  });

  const handleDeleteForm = async () => {
    deleteFormMutation.mutate({
      formId: id,
    });
    toast.success(`"${title}" deleted successfully`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn('rounded-md')}>
        <DialogHeader>
          <DialogTitle>{`Delete "${title}"`}</DialogTitle>
          <DialogDescription>
            This action is irreversible. All data will be lost.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row items-center justify-end space-x-2">
          <Button
            onClick={handleDeleteForm}
            variant="destructive"
            className="w-[100px]"
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
