import { Responses } from "../../../../../components/(admin)/forms/responses";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllVersions } from "@/server/actions/forms/get-all-versions";
import { getOverallResponsePerformance } from "@/server/actions/views/get-overall-response-performance";

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

  // prefetch form versions and responses
  await queryClient.prefetchQuery({
    queryKey: ["all-versions", params.formId],
    queryFn: () => getAllVersions({ formId: params.formId }),
  });

  // prefetch the form versions
  await queryClient.prefetchQuery({
    queryKey: ["performance", params.formId],
    queryFn: () => getOverallResponsePerformance({ formId: params.formId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Responses formId={params.formId} />
    </HydrationBoundary>
  );
}


