import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

// TODO - ISR
export default async function ResponsesPage({
  params,
}: {
  params: { formId: string };
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      hello world
    </HydrationBoundary>
  );
}


