import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getEvaluationForm } from "@/server/actions/evaluate/get-evaluation-form";
import { EvaluationForm } from "@/components/(admin)/evaluate/forms/evaluation-form";

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
  const evaluation = await queryClient.fetchQuery({
    queryKey: ["evaluation-form", formCodeId],
    queryFn: () => getEvaluationForm({ formCodeId }),
  });

  const getEvaluateeId = () => {
    if (!evaluation || !evaluation.form)
      throw new Error("Error fetching form code.");
    if (evaluation.form.formCodes[0].isDirectObservation) {
      return evaluation.form.formCodes[0].usersWithCode[0].user.id;
    }
    return "";
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EvaluationForm formCodeId={formCodeId} evaluateeId={getEvaluateeId()} />
    </HydrationBoundary>
  );
}
