'use client';

import { InputDialog } from '@/components/ui/input-dialog';
import { FormsLiteResult } from '@/features/forms-home/actions/forms/get-all-forms-lite';
import { renameFolder } from '@/features/forms-home/actions/folders/rename-folder';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ZRenameFolderSchema = z.object({
  folderId: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
});

type TRenameFolder = z.infer<typeof ZRenameFolderSchema>;

export function RenameFolderDialogTrigger({
  children,
  folderId,
  currentTitle,
}: {
  children: ReactNode;
  folderId: string;
  currentTitle: string;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate: mutateRenameFolder } = useMutation({
    mutationFn: renameFolder,
    onMutate: async (vars) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['folders'] });

      // Snapshot the previous value
      const previousForms = queryClient.getQueryData(['folders']);

      // Optimistically update the form name in the query cache
      queryClient.setQueryData(['folders'], (oldData: FormsLiteResult) =>
        oldData?.map((f) =>
          f.id === vars.folderId ? { ...f, title: vars.title } : f,
        ),
      );

      // Return context with previous and new values
      return { previousForms, vars };
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
    onError: (error, vars, context) => {
      // Rollback the optimistic update on error
      if (context?.previousForms) {
        queryClient.setQueryData(['forms'], context.previousForms);
      }
    },
  });

  const form = useForm<TRenameFolder>({
    resolver: zodResolver(ZRenameFolderSchema),
    defaultValues: {
      folderId,
      title: currentTitle,
    },
  });

  const onSubmit = (data: TRenameFolder) => {
    mutateRenameFolder(data);
    setOpen(false);
  };

  return (
    <InputDialog
      title="Rename Form"
      form={form}
      name="title"
      placeholder="Title"
      submitLabel="Rename"
      onSubmit={onSubmit}
      open={open}
      setOpen={setOpen}
    >
      {children}
    </InputDialog>
  );
}
