import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function EvaluateFormPage(props: {
  params: Promise<{ responseId: string }>;
}) {
  const { responseId } = await props.params;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 12,
      },
    },
  });

  // // prefetch the evaluation form
  // await queryClient.prefetchQuery({
  //   queryKey: ["evaluation-form", responseId],
  //   queryFn: () => getEvaluationForm({ responseId }),
  // });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>evaluation form component</div>
    </HydrationBoundary>
  );
}
