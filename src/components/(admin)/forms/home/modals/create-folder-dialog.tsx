'use client';

import { InputDialog } from '@/components/ui/input-dialog';
import { createFolder } from '@/server/actions/forms/create-folder';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderPlusIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ZCreateFolderFormSchema = z.object({
  creatorId: z.string().uuid(),
  title: z.string().min(1, 'Folder name is required'),
});

type TCreateFolderForm = z.infer<typeof ZCreateFolderFormSchema>;

export function CreateFolderDialogTrigger({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate: mutateCreateFolder, isPending } = useMutation({
    mutationFn: createFolder,
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch to get the real data from server
      // queryClient.invalidateQueries({ queryKey: ['forms'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });

      // Reset form to default values for next creation
      form.reset({
        creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!,
        title: 'Untitled Folder',
      });
    },
    onError: (error, variables, context) => {
      // Log error for debugging
      console.error('Failed to create folder:', error);

      // You might want to show a toast notification here
      // toast.error('Failed to create folder. Please try again.');
    },
  });

  const form = useForm<TCreateFolderForm>({
    resolver: zodResolver(ZCreateFolderFormSchema),
    defaultValues: {
      creatorId: process.env.NEXT_PUBLIC_DEV_USER_ID!, // todo fixme remove
      title: 'Untitled Folder',
    },
  });

  const onSubmit = (data: TCreateFolderForm) => {
    mutateCreateFolder(data);
    setOpen(false);
  };

  return (
    <InputDialog
      title="Create Folder"
      form={form}
      name="title"
      placeholder="Title"
      submitLabel={isPending ? 'Creating...' : 'Create'}
      onSubmit={onSubmit}
      open={open}
      setOpen={setOpen}
      Icon={FolderPlusIcon}
      asChild
    >
      {children}
    </InputDialog>
  );
}
