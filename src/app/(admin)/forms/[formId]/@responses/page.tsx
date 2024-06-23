import { Responses } from "../../../../../components/(admin)/forms/responses";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllVersions } from "@/server/actions/forms/get-all-versions";
import { getLongitudinalFormScores } from "@/server/actions/views/get-longitudinal-form-scores";

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
    queryFn: () => getLongitudinalFormScores({ formId: params.formId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Responses formId={params.formId} />
    </HydrationBoundary>
  );
}


