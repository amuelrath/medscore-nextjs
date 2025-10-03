import { FormBuilder } from '@/features/form-builder';
import { getFormById } from '@/actions/forms/get-form-by-id';
import { getSubcompetencies } from '@/actions/forms/get-subcompetencies';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { ReactNode } from 'react';

export default async function FormIdLayout(props: {
  editor: ReactNode;
  params: Promise<{ formId: string }>;
}) {
  // eslint-disable-next-line react/destructuring-assignment
  const params = await props.params;
  const formId = params.formId;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60, // 1 hour
      },
    },
  });

  if (!formId)
    throw new Error('Error fetching this form! Please try again momentarily.');

  const form = await queryClient.fetchQuery({
    queryKey: ['form', formId],
    queryFn: () =>
      getFormById({
        formId,
        userId: process.env.NEXT_PUBLIC_DEV_USER_ID as string,
      }),
  });

  await queryClient.prefetchQuery({
    queryKey: ['subcompetencies', formId],
    queryFn: () => getSubcompetencies({ formId }),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  if (!form)
    throw new Error('Error fetching this form! Please try again momentarily.');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FormBuilder />
    </HydrationBoundary>
  );
}
