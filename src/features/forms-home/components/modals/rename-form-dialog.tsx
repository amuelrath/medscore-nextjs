'use client';

import { InputDialog } from '@/components/ui/input-dialog';
import { FormsLiteResult } from '@/actions/forms/get-all-forms-lite';
import { renameForm } from '@/features/forms-home/actions/forms/rename-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ZRenameFormSchema = z.object({
  formId: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
});

type TRenameFormForm = z.infer<typeof ZRenameFormSchema>;

export function RenameFormDialogTrigger({
  children,
  formId,
  currentTitle,
}: {
  children: ReactNode;
  formId: string;
  currentTitle: string;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { mutate: mutateRenameForm } = useMutation({
    mutationFn: renameForm,
    onMutate: async (vars) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['forms'] });

      // Snapshot the previous value
      const previousForms = queryClient.getQueryData(['forms']);

      // Optimistically update the form name in the query cache
      queryClient.setQueryData(['forms'], (oldData: FormsLiteResult) =>
        oldData?.map((f) =>
          f.id === vars.formId ? { ...f, title: vars.title } : f,
        ),
      );

      // Return context with previous and new values
      return { previousForms, vars };
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
    onError: (error, vars, context) => {
      // Rollback the optimistic update on error
      if (context?.previousForms) {
        queryClient.setQueryData(['forms'], context.previousForms);
      }
    },
  });

  const form = useForm<TRenameFormForm>({
    resolver: zodResolver(ZRenameFormSchema),
    defaultValues: {
      formId,
      title: currentTitle,
    },
  });

  const onSubmit = (data: TRenameFormForm) => {
    mutateRenameForm(data);
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
