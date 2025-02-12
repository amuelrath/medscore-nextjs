import { useFormDataFetcher } from '@/hooks/queries/use-form-data-fetcher';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { FormBuilder } from '@/components/(admin)/forms/form-builder';

export default async function FormIdLayout({
  params,
}: {
  editor: ReactNode;
  params: { formId: string };
}) {
  const { form, queryClient } = await useFormDataFetcher(params.formId);

  if (!form)
    throw new Error('Error fetching this form! Please try again momentarily.');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FormBuilder />
    </HydrationBoundary>
  );
}
