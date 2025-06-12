'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { deleteForm } from '@/features/forms-home/actions/forms/delete-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteFormMutation = useMutation({
    mutationFn: deleteForm,
    onMutate: () => {
      setOpen(false); // Explicitly close the dialog
    },
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn('rounded-md')}>
        <DialogTitle className="pointer-events-none flex items-center space-x-2">
          <span className="p-1.5 rounded-full bg-destructive/10">
            <TrashIcon size={16} className="text-destructive/80" />
          </span>
        </DialogTitle>
        <div className="space-y-1">
          <DialogTitle>
            <p>Delete &quot;{title}&quot;?</p>
          </DialogTitle>

        </div>
        <hr />
        <DialogDescription>
          This action cannot be undone. All response data and grades
          associated with this item will be permanently deleted.
        </DialogDescription>
        <hr/>
        <div className="flex flex-row items-center justify-end space-x-2">
          <Button
            onClick={handleDeleteForm}
            variant="destructive"
            className="w-[100px]"
            disabled={deleteFormMutation.isPending}
          >
            {deleteFormMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
