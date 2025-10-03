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
import { deleteFolder } from '@/features/forms-home/actions/folders/delete-folder';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { toast } from 'sonner';

export function DeleteFolderDialogTrigger({
  title,
  folderId,
  children,
}: {
  title: string;
  folderId: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const deleteFolderMutation = useMutation({
    mutationFn: deleteFolder,
    onMutate: () => {
      setOpen(false); // Explicitly close the dialog
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['folders'],
      });

      // Clear the "folder" URL parameter if it matches the deleted folder
      const currentFolderId = searchParams.get('folder');
      if (currentFolderId === folderId) {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('folder');
        router.replace(
          `${window.location.pathname}?${newSearchParams.toString()}`,
        );
      }

      toast.success(`"${title}" deleted successfully`);
    },
  });

  const handleDeleteFolder = async () => {
    deleteFolderMutation.mutate({
      folderId,
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
          This action cannot be undone. All forms in this folder and their
          related response data will be lost forever.
        </DialogDescription>
        <hr />
        <div className="flex flex-row items-center justify-end space-x-2">
          <Button
            onClick={handleDeleteFolder}
            variant="destructive"
            className="w-[100px]"
            disabled={deleteFolderMutation.isPending}
          >
            {deleteFolderMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
