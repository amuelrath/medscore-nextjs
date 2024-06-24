import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getEvaluationForm } from "@/server/actions/evaluate/get-evaluation-form";
import { EvaluationForm } from "@/components/(admin)/evaluate/evaluation-form";

export default async function EvaluateFormPage({
  params,
}: {
  params: { formCodeId: string };
}) {
  const { formCodeId } = params;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 12,
      },
    },
  });

  // prefetch the evaluation form
  await queryClient.prefetchQuery({
    queryKey: ["evaluation-form", formCodeId],
    queryFn: () => getEvaluationForm({ formCodeId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EvaluationForm formCodeId={formCodeId} />
    </HydrationBoundary>
  );
}
