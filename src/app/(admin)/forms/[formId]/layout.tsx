import {
  DirectionAwareContent,
  DirectionAwareTabsProvider,
} from '@/components/ui/direction-aware-tabs';
import { fetchFormData } from '@/fetchers/form-data-fetcher';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ReactNode } from 'react';

export default async function FormIdLayout({
  editor,
  responses,
  params,
}: {
  editor: ReactNode;
  responses: ReactNode;
  params: { formId: string };
}) {
  const { form, queryClient } = await fetchFormData(params.formId);

  const tabs = [
    { id: 0, label: 'Editor', content: editor },
    { id: 1, label: 'Responses', content: responses },
  ];

  if (!form)
    throw new Error('Error fetching this form! Please try again momentarily.');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DirectionAwareTabsProvider tabs={tabs}>
        <div className="flex w-full flex-col">
          <DirectionAwareContent />
        </div>
      </DirectionAwareTabsProvider>
    </HydrationBoundary>
  );
}
