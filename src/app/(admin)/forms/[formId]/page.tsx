import { useFormDataFetcher } from '@/hooks/queries/use-form-data-fetcher';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { FormBuilder } from '@/components/(admin)/forms/form-builder';

export default async function FormIdLayout(
  props: {
    editor: ReactNode;
    params: Promise<{ formId: string }>;
  }
) {
  const params = await props.params;
  const { form, queryClient } = await useFormDataFetcher(params.formId);

  if (!form)
    throw new Error('Error fetching this form! Please try again momentarily.');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FormBuilder />
    </HydrationBoundary>
  );
}
