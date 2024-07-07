import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ResponseSummary } from "@/components/(admin)/forms/responses/response-summary";

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
      <ResponseSummary formId={params.formId} />
    </HydrationBoundary>
  );
}


